import { Request } from 'restify';
import * as _ from 'lodash';

import { ApiController, Controller, HttpPost, HttpMessage } from '@nmd-timesheet/ts-api-lib';
import { AuthenticationRequest, AuthenticationError, AuthenticationErrorCode } from '@nmd-timesheet/model';

@Controller('token')
export class AuthenticationController extends ApiController {
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

    private authenticatePassword(scope: string, username: string, password: string) {
        if (!_.isString(username) || !_.isString(password)) {
            return this.authenticationError(AuthenticationErrorCode.invalid_request);
        } else {
            return this.ok('Auth response');
        }
    }

    private authenticationError(errorCode: AuthenticationErrorCode): HttpMessage {
        const authError: AuthenticationError = { errorCode: errorCode };
        return this.badRequest(authError);
    }
}
