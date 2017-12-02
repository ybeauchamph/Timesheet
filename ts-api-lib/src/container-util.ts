import { Container, interfaces } from 'inversify';

export function resolveServiceIdentifiers(container: Container, serviceIdentifiers: Array<interfaces.ServiceIdentifier<any>>): Array<any> {
    const nbIdentifiers = serviceIdentifiers.length;
    const resolved = new Array<any>(nbIdentifiers);
    for (let i = 0; i < nbIdentifiers; i++) {
        const identifier = serviceIdentifiers[i];
        if (!!identifier && container.isBound(identifier)) {
            resolved[i] = container.get(identifier);
        }
    }
    return resolved;
}
