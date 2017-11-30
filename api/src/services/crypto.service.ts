import { injectable } from 'inversify';
import { randomBytes } from 'crypto';
import { hash, verify, argon2id } from 'argon2';

@injectable()
export class CryptoService {
    generateRandomString(length: number): string {
        return randomBytes(Math.ceil(length / 2))
            .toString('hex')
            .slice(0, length);
    }

    hashPassword(password: string): Promise<string> {
        return hash(password, {
            type: argon2id
        });
    }

    verifyPassword(hash: string, password: string): Promise<boolean> {
        return verify(hash, password);
    }
}
