export interface IConfig {
    port: number;
    debug: boolean;
    logRoutes: boolean;
    hash: IHashConfig;
    token: ITokenConfig;
    database: {
        type: 'mssql',
        host: string;
        port: number;
        database: string;
        username: string;
        password: string;
    }
}

/**
 * Password hashing configuration.
 */
export interface IHashConfig {
    algorithm: 'argon2id';
    options: IConfigArgon2id;
}

/**
 * Argon2 specific options.
 */
export interface IConfigArgon2id {
    timeCost: number;
    memoryCost: number;
    parallelism: number;
}

/**
 * Token configuration section.
 */
export interface ITokenConfig {
    /**
     * Secret key used to sign token.
     */
    secretKey: string;
    /**
     * Token expiration time in seconds.
     */
    tokenExpirationTime: number;
    /**
     *
     */
    algorithm: 'HS256' | 'HS384' | 'HS512' | 'RS256' | 'RS384' | 'RS512' | 'ES256' | 'ES384' | 'ES512' | 'none';
}