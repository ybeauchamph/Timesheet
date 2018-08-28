import { DynamicModule, Global, Module } from '@nestjs/common';
import { ValueProvider } from '@nestjs/common/interfaces';

import { Token } from '../token';
import { IConfig } from '../config.interface';

@Global()
@Module({})
export class ConfigModule {
    static forRoot(config: IConfig): DynamicModule {
        const configProvider: ValueProvider = {
            provide: Token.Config,
            useValue: config,
        };

        return {
            module: ConfigModule,
            providers: [configProvider],
            exports: [configProvider],
        };
    }
}