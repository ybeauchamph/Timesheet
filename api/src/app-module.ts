import { Constructor } from '@nmd-timesheet/common';

import {
    ClientEntity,
    EmployeeEntity,
    ProductEntity,
    ProjectEntity,
    TaskTypeEntity,
    TimeDataEntity
} from './entity';

import {
    AuthenticationController
} from './controllers';

import {
    CryptoService,
    EmployeeService,
    TokenService
} from './services';

import {
    RequestHandler,
    TokenAuthenticationHandler
} from './handler';

export interface IAppModule {
    Entities: Array<Constructor<any>>;
    Handlers: Array<Constructor<RequestHandler>>;
    Controllers: Array<Constructor<any>>;
    Services: Array<Constructor<any>>;
}

export const AppModule: IAppModule = {
    Entities: [
        ClientEntity,
        EmployeeEntity,
        ProductEntity,
        ProjectEntity,
        TaskTypeEntity,
        TimeDataEntity
    ],
    Handlers: [
        TokenAuthenticationHandler
    ],
    Controllers: [
        AuthenticationController
    ],
    Services: [
        CryptoService,
        EmployeeService,
        TokenService
    ]
};