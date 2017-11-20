import { injectable } from 'inversify';
import * as crypto from 'crypto';

@injectable()
export class AuthenticationService {
    generateRandomString(length: number): string {
        return crypto.randomBytes(Math.ceil(length / 2))
            .toString('hex')
            .slice(0, length);
    }

    hash(value: string, salt: string): string {
        const algorithm = 'sha512';
        return crypto
            .createHmac(algorithm, salt)
            .update(value)
            .digest('hex');
    };
}
