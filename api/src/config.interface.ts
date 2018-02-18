export interface IConfigArgon2id {
    timeCost: number;
    memoryCost: number;
    parallelism: number;
}

export interface IConfig {
    port: number;
    debug: boolean;
    logRoutes: boolean;
    hashAlgorithm: 'argon2id';
    hashOptions: IConfigArgon2id,
    tokenSecretKey: string;
    tokenExpirationTime: number;
    database: {
        host: string;
        port: number;
        database: string;
        username: string;
        password: string;
    }
}
