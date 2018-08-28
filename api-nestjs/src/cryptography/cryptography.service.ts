import { Injectable, Inject } from '@nestjs/common';
import { hash, verify, argon2id } from 'argon2';
import { randomBytes } from 'crypto';

import { IConfig, IConfigArgon2id } from '../config.interface';
import { Token } from '../token';

@Injectable()
export class CryptographyService {
    constructor(
        @Inject(Token.Config) private readonly config: IConfig
    ) { }

    generateRandomString(length: number): string {
        return randomBytes(Math.ceil(length / 2))
            .toString('hex')
            .slice(0, length);
    }

    hashPassword(password: string): Promise<string> {
        switch (this.config.hash.algorithm) {
            case 'argon2id':
                const options = this.config.hash.options as IConfigArgon2id;
                return hash(password, {
                    type: argon2id,
                    hashLength: 64,
                    timeCost: options.timeCost,
                    memoryCost: options.memoryCost,
                    parallelism: options.parallelism
                });
            default:
                throw new Error('Invalid hash algorithm: ' + this.config.hash.algorithm);
        }
    }

    verifyPassword(hash: string, password: string): Promise<boolean> {
        // To support more hash algorithm, need to parse hash to detect used algorithm
        return verify(hash, password)
            .catch(err => false);
    }
}
