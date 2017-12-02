import { interfaces } from 'inversify';

export function paramServiceIdentifierDecorator(serviceIdentifier: interfaces.ServiceIdentifier<any>): ParameterDecorator {
    return (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
        const identifiers = Reflect.getMetadata('param-service-identifiers', target, propertyKey) || [];
        // Expand array to fit param index
        while(parameterIndex >= identifiers.length) {
            identifiers.push(null);
        }
        identifiers[parameterIndex] = serviceIdentifier;
        Reflect.defineMetadata('param-service-identifiers', identifiers, target, propertyKey);
    }
}

export function getParamServiceIdentifiers(target: Object, property: string | symbol | ((...args: Array<any>) => any)): Array<interfaces.ServiceIdentifier<any>> {
    const propertyKey = typeof property === 'function' ? property.name : property;
    const types = Reflect.getMetadata('design:paramtypes', target, propertyKey);
    const identifiers = Reflect.getMetadata('param-service-identifiers', target, propertyKey);

    const nbParams = types.length;
    const resolved = new Array<interfaces.ServiceIdentifier<any>>(nbParams);
    for (let i = 0; i < nbParams; i++) {
        if (i < identifiers.length && !!identifiers[i]) {
            resolved[i] = identifiers[i];
        } else if (types[i] !== Object) {
            resolved[i] = types[i];
        }
    }
    return resolved;
}