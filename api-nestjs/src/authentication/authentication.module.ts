import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { JwtStrategy } from './jwt.strategy';
import { CryptographyModule } from '../cryptography';
import { EmployeeModule } from '../employee';
import { AuthenticationController } from './authentication.controller';

@Module({
    imports: [CryptographyModule, EmployeeModule],
    controllers: [AuthenticationController],
    providers: [AuthenticationService, JwtStrategy],
    exports: [AuthenticationService]
})
export class AuthenticationModule {

}