import { inject, injectable } from 'inversify';
import { sign } from 'jws';

import { IConfig } from '../config.interface';
import { EmployeeEntity } from '../entity';

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
            payload: {
                sub: employee.id,
                exp: this.dateToEpoch(expiration),
                iat: this.dateToEpoch(new Date)
            },
            secret: this.apiConfig.tokenSecretKey
        });
    }

    private dateToEpoch(date: Date): number {
        return date.getTime() / 1000 | 0;
    }

    private epochToDate(epoch: number): Date {
        return new Date(epoch * 1000);
    }
}
