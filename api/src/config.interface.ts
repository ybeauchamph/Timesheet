export interface IConfig {
    port: number;
    debug: boolean;
    logRoutes: boolean;
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
