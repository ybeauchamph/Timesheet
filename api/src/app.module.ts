import { DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IConfig } from './config.interface';

import { AppController } from './app.controller';

import { AuthenticationModule } from './authentication';
import { EmployeeModule } from './employee';
import { ConfigModule } from './config';
import { CryptographyModule } from './cryptography';

import {
    ClientEntity,
    EmployeeEntity,
    ProductEntity,
    ProjectEntity,
    TaskTypeEntity,
    TimeDataEntity
} from './entity';

export class AppModule {
    static forRoot(config: IConfig): DynamicModule {
        return {
            module: AppModule,
            imports: [
                AuthenticationModule,
                ConfigModule.forRoot(config),
                CryptographyModule,
                EmployeeModule,
                TypeOrmModule.forRoot({
                    entities: [
                        ClientEntity,
                        EmployeeEntity,
                        ProductEntity,
                        ProjectEntity,
                        TaskTypeEntity,
                        TimeDataEntity
                    ],
                    type: config.database.type,
                    host: config.database.host,
                    port: config.database.port,
                    database: config.database.database,
                    username: config.database.username,
                    password: config.database.password,
                    synchronize: true
                })
            ],
            controllers: [
                AppController
            ]
        };
    }
}
