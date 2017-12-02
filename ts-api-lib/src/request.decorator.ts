import { paramServiceIdentifierDecorator } from './decorator.factory';

export function Req(): ParameterDecorator {
    return paramServiceIdentifierDecorator("Request");
}
