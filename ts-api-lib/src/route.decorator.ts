import { HttpMethod } from './http-method.enum';
import * as _ from 'lodash';
import { decorate, injectable } from 'inversify';

export interface RouteParams {
    propertyKey: string | symbol;
    method?: HttpMethod;
    route?: string;
    allowAnonymous?: boolean;
}

export function Controller(routePrefix?: string, allowAnonymous?: boolean) {
    return function (target: Object) {
        const proto = (<any>target).prototype;
        Reflect.defineMetadata('routePrefix', '/' + _.trim(routePrefix, '/ '), proto);
        Reflect.defineMetadata('allow-anonymous', allowAnonymous === true, proto);
        decorate(injectable(), target);
    };
}

export function HttpGet(route: string, allowAnonymous?: boolean) {
    return setRouteDecorator(HttpMethod.get, route, allowAnonymous);
}

export function HttpPost(route: string, allowAnonymous?: boolean) {
    return setRouteDecorator(HttpMethod.post, route, allowAnonymous);
}

export function HttpPut(route: string, allowAnonymous?: boolean) {
    return setRouteDecorator(HttpMethod.put, route, allowAnonymous);
}

export function HttpDelete(route: string, allowAnonymous?: boolean) {
    return setRouteDecorator(HttpMethod.delete, route, allowAnonymous);
}

function setRouteDecorator(method: HttpMethod, route: string, allowAnonymous?: boolean): ((target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) => void) {
    route = _.trim(route, '/ ');
    if (_.startsWith(route, '~/') === false) {
        route = '/' + route;
    }

    return function (target: Object, property: string | symbol, descriptor: PropertyDescriptor) {
        let routeParam: RouteParams = Reflect.getMetadata('route', target, property);
        if (!routeParam) {
            routeParam = {
                propertyKey: property
            };
        }
        routeParam.method = method;
        routeParam.route = route;
        routeParam.allowAnonymous = allowAnonymous;
        Reflect.defineMetadata('route', routeParam, target, property);
    }
}

export function getControllerRoutes(target: any): Array<RouteParams> {
    const routePrefix: string = Reflect.getMetadata('routePrefix', target);
    const controllerAllowAnonymous: string = Reflect.getMetadata('allow-anonymous', target);
    const routes = new Array<RouteParams>();
    for (const property of Object.getOwnPropertyNames(target.constructor.prototype)) {
        const route = Reflect.getMetadata('route', target, property);
        if (route && route.method && route.route) {
            if (route.allowAnonymous !== true && route.allowAnonymous !== false) {
                route.allowAnonymous = controllerAllowAnonymous;
            }
            routes.push(route);
        }
    }

    if (routePrefix && routePrefix.length > 0) {
        routes.forEach(routeParams => {
            if (_.startsWith(routeParams.route, '~/') === false) {
                if (routeParams.route !== '/') {
                    routeParams.route = routePrefix + routeParams.route;
                } else {
                    routeParams.route = routePrefix;
                }
            } else {
                routeParams.route = routeParams.route.substring(1);
            }
        });
    }

    return routes.sort((a, b) => a.route.localeCompare(b.route));
}
