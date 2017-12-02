import { paramServiceIdentifierDecorator } from './decorator.factory';

export function Ctx(): ParameterDecorator {
    return paramServiceIdentifierDecorator("Context");
}
