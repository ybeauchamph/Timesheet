import { inject, injectable } from 'inversify';
import { sign, verify, decode } from 'jws';

import { IConfig } from '../config.interface';
import { EmployeeEntity } from '../entity';

export interface EmployeeToken {
    sub: number;
    exp: number;
    iat: number;
}

@injectable()
export class TokenService {
    constructor(
        @inject('IConfig') private apiConfig: IConfig
    ) { }

    createEmployeeToken(employee: EmployeeEntity): string {
        if (!employee) {
            return undefined;
        }

        const expiration = new Date();
        expiration.setUTCSeconds(expiration.getUTCSeconds() + this.apiConfig.tokenExpirationTime);

        return sign({
            header: { alg: 'HS512' },
            payload: <EmployeeToken>{
                sub: employee.id,
                exp: this.dateToEpoch(expiration),
                iat: this.dateToEpoch(new Date)
            },
            secret: this.apiConfig.tokenSecretKey
        });
    }

    verifyAndDecodeToken(strToken: string): any {
        if (verify(strToken, 'HS512', this.apiConfig.tokenSecretKey)) {
            const strPayload = decode(strToken).payload;
            try {
                const payload = JSON.parse(strPayload) as EmployeeToken;
                const expiration = this.epochToDate(payload.exp);
                if (expiration > new Date()) {
                    return payload;
                }
            } catch (ex) { }
        }
        return undefined;
    }

    private dateToEpoch(date: Date): number {
        return date.getTime() / 1000 | 0;
    }

    private epochToDate(epoch: number): Date {
        return new Date(epoch * 1000);
    }
}
