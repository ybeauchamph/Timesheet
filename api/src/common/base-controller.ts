import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';

export class BaseController {
    badRequest(response?: any, error?: string): never {
        throw new BadRequestException(response, error);
    }

    notFound(response?: any, error?: string): never {
        throw new NotFoundException(response, error);
    }

    unauthorized(response?: any, error?: string): never {
        throw new UnauthorizedException(response, error);
    }

    toResult<T>(object: T): T | never {
        if (!object) {
            return this.notFound(object);
        } else {
            return object;
        }
    }
}