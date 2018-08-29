import { BadRequestException, Body, Controller, NotImplementedException, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationErrorCode, AuthenticationRequest, AuthenticationResponse } from '@timesheet/model';
import { isString } from 'lodash';
import { EmployeeService } from '../employee';
import { CryptographyService } from '../cryptography';

@Controller('auth')
export class AuthenticationController {
    constructor(
        private readonly authService: AuthenticationService,
        private readonly employeeService: EmployeeService,
        private readonly cryptographyService: CryptographyService
    ) { }

    @Post('')
    public authenticate(@Body() authRequest: AuthenticationRequest): Promise<AuthenticationResponse> {
        if (!authRequest) {
            return this.authenticationError(AuthenticationErrorCode.invalid_request);
        } else {
            switch (authRequest.grant_type) {
                case 'password':
                    return this.authenticatePassword(authRequest.scope, authRequest.username, authRequest.password);
                case 'refresh_token':
                    throw new NotImplementedException();
                default:
                    return this.authenticationError(AuthenticationErrorCode.unsupported_grant_type);
            }
        }
    }

    private async authenticatePassword(scope: string, username: string, password: string): Promise<AuthenticationResponse> {
        if (!isString(username) || !isString(password)) {
            return this.authenticationError(AuthenticationErrorCode.invalid_request);
        } else {
            const employee = await this.employeeService.getByEmail(username);
            if (!employee) {
                return this.authenticationError(AuthenticationErrorCode.invalid_client);
            }

            if (await this.cryptographyService.verifyPassword(employee.password, password) === true) {
                const strToken = this.authService.createToken(employee);
                return <AuthenticationResponse>{
                    TokenType: 'Bearer',
                    AccessToken: strToken,
                    RefreshToken: ''
                };
            } else {
                return this.authenticationError(AuthenticationErrorCode.invalid_client);
            }
        }
    }

    private authenticationError(errorCode: AuthenticationErrorCode): never {
        throw new BadRequestException({ errorCode: errorCode });
    }
}