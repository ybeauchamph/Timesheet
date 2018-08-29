import { Inject, Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { use } from 'passport';
import { Request } from 'express';

import { AuthenticationService } from './authentication.service';
import { IConfig } from '../config.interface';
import { Token } from '../token';

@Injectable()
export class JwtStrategy extends Strategy {
    constructor(
        @Inject(Token.Config) private readonly config: IConfig,
        private readonly authService: AuthenticationService
    ) {
        super(
            {
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                passReqToCallback: true,
                secretOrKey: config.token.secretKey,
                algorithms: [config.token.algorithm]
            },
            (req, payload, done) => this.verify(req, payload, done)
        );
        use(this);
    }

    public verify(req: Request, payload, done: VerifiedCallback) {
        const isValid = true;
        if (!isValid) {
            return done('Unauthorized', false);
        }
        done(null, payload);
    }
}