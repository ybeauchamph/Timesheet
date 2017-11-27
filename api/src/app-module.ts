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

export interface IAppModule {
    Entities: Array<any>;
    Controllers: Array<any>;
    Services: Array<any>;
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
    Controllers: [
        AuthenticationController
    ],
    Services: [
        CryptoService,
        EmployeeService,
        TokenService
    ]
};