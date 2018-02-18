import { inject, injectable } from 'inversify';
import { randomBytes } from 'crypto';
import { hash, verify, argon2id } from 'argon2';

import { IConfig, IConfigArgon2id } from '../config.interface';

@injectable()
export class CryptoService {
    constructor(
        @inject('IConfig') private apiConfig: IConfig
    ) { }

    generateRandomString(length: number): string {
        return randomBytes(Math.ceil(length / 2))
            .toString('hex')
            .slice(0, length);
    }

    hashPassword(password: string): Promise<string> {
        switch (this.apiConfig.hashAlgorithm) {
            case 'argon2id':
                const options = this.apiConfig.hashOptions as IConfigArgon2id;
                return hash(password, {
                    type: argon2id,
                    hashLength: 64,
                    timeCost: options.timeCost,
                    memoryCost: options.memoryCost,
                    parallelism: options.parallelism
                });
            default:
                throw new Error('Invalid hash algorithm: ' + this.apiConfig.hashAlgorithm);
        }
    }

    verifyPassword(hash: string, password: string): Promise<boolean> {
        // To support more hash algorithm, need to parse hash to detect used algorithm
        return verify(hash, password)
            .catch(err => false);
    }
}
