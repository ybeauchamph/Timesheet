// *** Import Reflect Metadata only once ***
import 'reflect-metadata';
import { Container } from 'inversify';
import { Connection, EntityManager, createConnection } from 'typeorm';

import { Api, ApiConfig, Config } from '@nmd-timesheet/ts-api-lib';

import { IConfig } from './config.interface';

import { AuthenticationController } from './controllers/authentication.controller';
import { TestController }           from './controllers/test.controller';

import {
    ClientEntity,
    EmployeeEntity,
    ProductEntity,
    ProjectEntity,
    TaskTypeEntity,
    TimeDataEntity
} from './entity';

require('source-map-support').install();

(async function () {
    const config = new Config<IConfig>('./config.json');
    if (!config.load()) {
        console.error('Failed to load config file: %s', config.configFilePath);
        return;
    }

    let dbConnection: Connection;
    try {
        dbConnection = await createConnection({
            type: 'mssql',
            host: 'localhost',
            port: 4694,
            username: 'admin',
            database: 'NomadisTimesheet',
            entities: [
                ClientEntity,
                EmployeeEntity,
                ProductEntity,
                ProjectEntity,
                TaskTypeEntity,
                TimeDataEntity
            ]
        });
    } catch (ex) {
        console.error('Failed to create connection to database %s at %s:%s\r\n', 'NomadisTimesheet', 'localhost', 4694, ex);
        return;
    }

    class TimesheetApi extends Api {
        constructor(apiConfig: ApiConfig) {
            super(apiConfig);
        }

        onInit(): void {

        }

        onStarted(): void {

        }

        onDestroy(): void {

        }
    }

    const container = new Container();

    container.bind(Connection).toConstantValue(dbConnection);
    container.bind(EntityManager).toConstantValue(dbConnection.manager);
    container.bind(Config).toSelf().inSingletonScope();

    new TimesheetApi({
        Name: 'Nomadis Timesheet API',
        Version: '1.0.0',
        Port: config.config.port,
        AllowedOrigins: ['localhost:4200', 'localhost:4201'],
        Controllers: [
            AuthenticationController,
            TestController
        ],
        Container: container
    }).run();
})();
