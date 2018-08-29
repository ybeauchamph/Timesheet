import { Injectable, Inject } from '@nestjs/common';
import { sign } from 'jsonwebtoken';

import { IConfig } from '../config.interface';
import { EmployeeEntity } from '../entity';
import { Token } from '../token';

@Injectable()
export class AuthenticationService {
    constructor(
        @Inject(Token.Config) private readonly config: IConfig
    ) { }

    createToken(employee: EmployeeEntity) {
        return sign(
            { sub: employee.id },
            this.config.token.secretKey,
            {
                algorithm: this.config.token.algorithm,
                expiresIn: this.config.token.tokenExpirationTime
            });
    }
}