import { Module } from '@nestjs/common';
import { CryptographyService } from './cryptography.service';

@Module({
    imports: [],
    providers: [
        CryptographyService
    ],
    exports: [
        CryptographyService
    ]
})
export class CryptographyModule {

}