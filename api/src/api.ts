// *** Import Reflect Metadata only once ***
import 'reflect-metadata';
import { Container } from 'inversify';

import { Api, ApiConfig, Config } from '@nmd-timesheet/ts-api-lib';

import { IConfig } from './config.interface';

import { TestController } from './controllers/test.controller';

require('source-map-support').install();

(function () {

    const config = new Config<IConfig>('./config.json');
    if (!config.load()) {
        console.error('Failed to load config file: %s', config.configFilePath);
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

    container.bind(Config).toSelf().inSingletonScope();

    new TimesheetApi({
        Name: 'Nomadis Timesheet API',
        Version: '1.0.0',
        Port: config.config.port,
        AllowedOrigins: ['localhost:4200', 'localhost:4201'],
        Controllers: [TestController],
        Container: container
    }).run();
})();
