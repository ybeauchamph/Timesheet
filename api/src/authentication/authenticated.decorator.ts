import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export function Authenticated(): ClassDecorator {
    return function(target: object) {
        UseGuards(AuthGuard('jwt'))(target);
    };
}