import { Request, Response, Next } from 'restify';
import { injectable } from 'inversify';

import { RequestHandler } from './handler';
import { TokenService, EmployeeToken } from '../services';

@injectable()
export class TokenAuthenticationHandler implements RequestHandler {
    constructor(
        private tokenService: TokenService
    ) { }

    process(req: Request, res: Response, next: Next) {
        let authenticated: boolean = false;

        const token = this.getTokenFromHeader(req);
        let payload: EmployeeToken;

        if (token) {
            payload = this.tokenService.verifyAndDecodeToken(token);
            if (payload && payload.sub) {
                authenticated = true;
            }
        }

        if (authenticated) {
            req['authenticated'] = true;
            req['context'] = {
                employeeId: payload.sub
            };
        }
        next();
    }

    private getTokenFromHeader(req: Request): string | undefined {
        const authHeader = req.headers['authorization'];
        if (authHeader) {
            const parts = authHeader.toString().split(' ');
            if (parts.length === 2 && parts[0] === 'Bearer' && parts[1].length > 0) {
                return parts[1];
            }
        }
        return undefined;
    }
}
