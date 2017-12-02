import { createServer, Server, ServerOptions, plugins, Request, Response, Next, RequestHandler } from 'restify';
import * as corsMiddleware from 'restify-cors-middleware';
import { Container } from 'inversify';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';

import { ApiConfig } from './api-config';
import { HttpMessage } from './http-message';
import { HttpMethod } from './http-method.enum';
import { getControllerRoutes } from './route.decorator';
import { getParamServiceIdentifiers } from './decorator.factory';
import { resolveServiceIdentifiers } from './container-util';
import { Context } from './context';

function handleObservable(observable: Observable<any>, res: Response, next: Next, sendResult: boolean) {
    if (sendResult) {
        observable.subscribe(message => {
            sendResponse(res, message);
        }, error => {
            res.send(500, error);
            next();
        }, () => {
            next();
        });
    } else {
        observable.subscribe(null, () => next(), () => next());
    }
}

function handlePromise(promise: Promise<any>, res: Response, next: Next, sendResult: boolean) {
    if (sendResult) {
        promise.then(message => {
            sendResponse(res, message);
            next();
        }).catch(err => {
            res.send(500, err);
            next();
        });
    } else {
        promise.then(() => next()).catch(() => next());
    }
}

function sendResponse(res: Response, message: any) {
    if (message instanceof HttpMessage) {
        res.send(message.status, message.body);
    } else if (message) {
        res.send(200, message);
    } else {
        res.send(404);
    }
}

export abstract class Api {
    private __apiConfig: ApiConfig;
    private __server: Server;
    private __started: boolean;
    private __container: Container;

    constructor(apiConfig: ApiConfig) {
        this.__apiConfig = apiConfig;
        this.__container = new Container();
    }

    abstract onInit(): void;
    abstract onStarted(): void;
    abstract onDestroy(): void;

    get apiConfig(): ApiConfig { return this.__apiConfig; }
    get server(): Server { return this.__server; }
    get container(): Container { return this.__container; }

    private initServer() {
        const serverOptions: ServerOptions = {
            name: this.apiConfig.Name,
            version: this.apiConfig.Version
        };

        this.__server = createServer(serverOptions);

        const cors = corsMiddleware({
            origins: this.apiConfig.AllowedOrigins,
            allowHeaders: [],
            exposeHeaders: [],
            credentials: true
        });

        this.server.pre(cors.preflight);

        this.server.use(cors.actual);
        this.server.use(plugins.acceptParser(this.server.acceptable));
        this.server.use(plugins.queryParser());
        this.server.use(plugins.bodyParser());
        this.server.use((req: Request, res: Response, next: Next) => {
            const container = new Container();
            container.bind(Container).toConstantValue(container);
            container.bind("Request").toConstantValue(req);
            container.bind('Context').toConstantValue(<Context>{
                authenticated: false,
                userId: undefined
            });
            (<any>req)['req-container'] = container;
            next();
        });

        process.on('SIGINT', () => {
            if (this.__started) {
                this.server.close();
            }
            this.onDestroy();
            process.exit();
        });
    }

    run(): void {
        this.initServer();
        this.onInit();
        this.registerControllersRoutes();

        this.__started = true;
        this.server.listen(this.apiConfig.Port, () => {
            console.log('\r\n%s listening at %s\r\n', this.server.name, this.server.url);
            this.onStarted();
        });
    }

    private registerControllersRoutes() {
        const controllers = this.apiConfig.Controllers;
        const nbControllers = controllers.length;

        console.log('\r\nRegistering routes for %s controllers...', nbControllers);
        console.group();

        for (let i = 0; i < nbControllers; i++) {
            const controllerClass = controllers[i];

            // Register controller in container for DI.
            if (!this.container.isBound(controllerClass)) {
                this.container.bind(controllerClass).toSelf().inSingletonScope();
            }

            let controller: any;
            try {
                controller = this.container.get(controllerClass);
            } catch (ex) {
                console.error(
                    '%s is not a Controller, the Controller decorator must be added OR the class must extends ApiController.',
                    controllerClass.name);
                continue;
            }

            const routes = getControllerRoutes(controller);
            const nbRoutes = routes.length;

            console.log('%s (%s routes)', controllerClass.name, nbRoutes);

            console.group();

            // Register routes
            for (let j = 0; j < nbRoutes; j++) {
                const route = routes[j];
                console.log('%s %s', _.padStart(route.method.toString(), 6), route.route);
                switch (route.method) {
                    case HttpMethod.get:
                        this.server.get(route.route, this.createHandler(controller, route.propertyKey, true));
                        break;
                    case HttpMethod.post:
                        this.server.post(route.route, this.createHandler(controller, route.propertyKey, true));
                        break;
                    case HttpMethod.put:
                        this.server.put(route.route, this.createHandler(controller, route.propertyKey, true));
                        break;
                    case HttpMethod.delete:
                        this.server.del(route.route, this.createHandler(controller, route.propertyKey, true));
                        break;
                    default:
                        console.warn('Unknown route method %s', route.method);
                        break;
                }
            }
            console.groupEnd();
        }
        console.groupEnd();
    }

    createHandler(object: Object, property: string | symbol | RequestHandler, sendResult: boolean) {
        return function (req: Request, res: Response, next: Next) {
            try {
                const params = resolveServiceIdentifiers((<any>req)['req-container'] as Container, getParamServiceIdentifiers(object, property));

                const fn = typeof property === 'function' ? property : (<any>object)[property];
                const result = fn.apply(object, params);
                if (result instanceof Observable) {
                    handleObservable(result, res, next, sendResult);
                } else if (Promise.resolve(result) === result) {
                    handlePromise(result, res, next, sendResult);
                } else {
                    if (sendResult) {
                        sendResponse(res, result);
                    }
                    next();
                }
            } catch (ex) {
                console.error(ex);
                try {
                    res.send(500, ex.toString());
                } catch (ex2) { }
                next(false);
            }
        }
    }
}
