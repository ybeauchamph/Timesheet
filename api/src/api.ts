// *** Import Reflect Metadata only once ***
import 'reflect-metadata';
import { Connection, EntityManager, createConnection } from 'typeorm';
import { decorate, injectable } from 'inversify';

import { Api, ApiConfig, Config } from '@nmd-timesheet/ts-api-lib';

import { IConfig } from './config.interface';
import { AppModule } from './app-module';
import { RequestHandler, TokenAuthenticationHandler } from './handler';

require('source-map-support').install();

class TimesheetApi extends Api {
    constructor(
        apiConfig: ApiConfig,
        private config: Config<IConfig>,
        private dbConnection: Connection
    ) {
        super(apiConfig);
    }

    onInit(): void {
        this.container.bind(Connection).toConstantValue(this.dbConnection);
        this.container.bind(EntityManager).toConstantValue(this.dbConnection.manager);
        this.container.bind('IConfig').toConstantValue(this.config.config);

        for (const service of AppModule.Services) {
            this.container.bind(service).toSelf().inSingletonScope();
        }

        for (const handler of AppModule.Handlers) {
            if (!this.container.isBound(handler)) {
                this.container.bind(handler).toSelf().inSingletonScope();
            }
        }

        for (const handler of AppModule.Handlers) {
            const handlerInstance = this.container.get<RequestHandler>(handler);
            this.server.use(handlerInstance.process.bind(handlerInstance));
        }
    }

    onStarted(): void {

    }

    onDestroy(): void {
        this.dbConnection.close();
        console.log('Closing API');
    }
}

(async function () {
    const config = new Config<IConfig>('./config.json');
    if (!config.load()) {
        console.error('Failed to load config file: %s', config.configFilePath);
        return;
    }

    const dbConfig = config.config.database;
    let dbConnection: Connection;
    try {
        dbConnection = await createConnection({
            type: 'mssql',
            host: dbConfig.host,
            port: dbConfig.port,
            username: dbConfig.username,
            password: dbConfig.password,
            database: dbConfig.database,
            synchronize: config.config.debug === true,
            entities: AppModule.Entities
        });
    } catch (ex) {
        console.error('Failed to create connection to database %s at %s:%s\r\n', dbConfig.database, dbConfig.host, dbConfig.port, ex);
        return;
    }

    new TimesheetApi({
        Name: 'Timesheet API',
        Version: '1.0.0',
        Port: config.config.port,
        AllowedOrigins: ['localhost:4200', `localhost:${config.config.port}`],
        Controllers: AppModule.Controllers,
    }, config, dbConnection).run();
})().catch(ex => {
    console.error('API CRASHED\r\n--------------------------------------------------\r\n', ex);
});
