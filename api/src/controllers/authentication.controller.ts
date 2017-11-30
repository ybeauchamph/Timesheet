import { Request } from 'restify';
import * as _ from 'lodash';

import { ApiController, Controller, HttpPost, HttpMessage } from '@nmd-timesheet/ts-api-lib';
import { AuthenticationRequest, AuthenticationResponse, AuthenticationError, AuthenticationErrorCode } from '@nmd-timesheet/model';

import {
    CryptoService,
    EmployeeService,
    TokenService
} from '../services';

@Controller('token')
export class AuthenticationController extends ApiController {
    constructor(
        private cryptoService: CryptoService,
        private employeeService: EmployeeService,
        private tokenService: TokenService
    ) {
        super();
    }

    @HttpPost('')
    authenticate(req: Request) {
        const authenticationRequest = req.body as AuthenticationRequest;

        if (!authenticationRequest) {
            return this.authenticationError(AuthenticationErrorCode.invalid_request)
        } else {
            switch (authenticationRequest.grant_type) {
                case 'password':
                    return this.authenticatePassword(authenticationRequest.scope, authenticationRequest.username, authenticationRequest.password);
                case 'refresh_token':
                    return this.notImplemented();
                default:
                    return this.authenticationError(AuthenticationErrorCode.unsupported_grant_type);
            }
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

            if (this.cryptoService.verifyPassword(employee.password, password)) {
                const strToken = this.tokenService.createEmployeeToken(employee);
                return this.ok(<AuthenticationResponse>{
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
        return this.badRequest(authError);
    }
}
