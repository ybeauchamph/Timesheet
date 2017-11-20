import { HttpMethod } from './http-method.enum';
import * as _ from 'lodash';
import { decorate, injectable } from 'inversify';

export interface RouteParams {
    method?: HttpMethod;
    route?: string;
    propertyKey: string | symbol;
}

export function Controller(routePrefix?: string) {
    return function (target: Object) {
        Reflect.defineMetadata('routePrefix', '/' + _.trim(routePrefix, '/ '), (target as any).prototype);
        decorate(injectable(), target);
    };
}

export function HttpGet(route: string) {
    return setRouteDecorator(HttpMethod.get, route);
}

export function HttpPost(route: string) {
    return setRouteDecorator(HttpMethod.post, route);
}

export function HttpPut(route: string) {
    return setRouteDecorator(HttpMethod.put, route);
}

export function HttpDelete(route: string) {
    return setRouteDecorator(HttpMethod.delete, route);
}

function setRouteDecorator(method: HttpMethod, route: string): ((target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) => void) {
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
        Reflect.defineMetadata('route', routeParam, target, property);
    }
}

export function getControllerRoutes(target: any): Array<RouteParams> {
    const routePrefix: string = Reflect.getMetadata('routePrefix', target);
    const routes = new Array<RouteParams>();
    for (const property of Object.getOwnPropertyNames(target.constructor.prototype)) {
        const route = Reflect.getMetadata('route', target, property);
        if (route && route.method && route.route) {
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
