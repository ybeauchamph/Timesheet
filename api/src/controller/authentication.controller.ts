import { Request } from 'restify';
import * as _ from 'lodash';

import { Controller, HttpPost, HttpPut, HttpMessage, Req } from 'ts-api-lib';
import { AuthenticationRequest, AuthenticationResponse, AuthenticationError, AuthenticationErrorCode } from '@timesheet/model';

import {
    CryptoService,
    EmployeeService,
    TokenService
} from '../service';

@Controller('token', true)
export class AuthenticationController {
    constructor(
        private cryptoService: CryptoService,
        private employeeService: EmployeeService,
        private tokenService: TokenService
    ) { }

    @HttpPost('')
    authenticate(@Req() req: Request) {
        const authenticationRequest = req.body as AuthenticationRequest;

        if (!authenticationRequest) {
            return this.authenticationError(AuthenticationErrorCode.invalid_request)
        } else {
            switch (authenticationRequest.grant_type) {
                case 'password':
                    return this.authenticatePassword(authenticationRequest.scope, authenticationRequest.username, authenticationRequest.password);
                case 'refresh_token':
                    return HttpMessage.notImplemented();
                default:
                    return this.authenticationError(AuthenticationErrorCode.unsupported_grant_type);
            }
        }
    }

    @HttpPut('~/employee/:id/password', false)
    async changePassword(@Req() req: Request) {
        const emp = await this.employeeService.getById(+req.params['id']);
        if (!emp) {
            return HttpMessage.notFound();
        }
        emp.password = await this.cryptoService.hashPassword(req.body.password);
        if (await this.employeeService.save(emp) === true) {
            return HttpMessage.ok();
        } else {
            return HttpMessage.internalServerError();
        }
    }

    private async authenticatePassword(scope: string, username: string, password: string): Promise<HttpMessage> {
        if (!_.isString(username) || !_.isString(password)) {
            return this.authenticationError(AuthenticationErrorCode.invalid_request);
        } else {
            const employee = await this.employeeService.getByEmail(username);
            if (!employee) {
                return this.authenticationError(AuthenticationErrorCode.invalid_client);
            }

            if (await this.cryptoService.verifyPassword(employee.password, password) === true) {
                const strToken = this.tokenService.createEmployeeToken(employee);
                return HttpMessage.ok(<AuthenticationResponse>{
                    TokenType: 'Bearer',
                    AccessToken: strToken,
                    RefreshToken: null
                });
            } else {
                return this.authenticationError(AuthenticationErrorCode.invalid_client);
            }
        }
    }

    private authenticationError(errorCode: AuthenticationErrorCode): HttpMessage {
        const authError: AuthenticationError = { errorCode: errorCode };
        return HttpMessage.badRequest(authError);
    }
}
