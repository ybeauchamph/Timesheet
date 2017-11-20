import { Container } from 'inversify';

export interface ApiConfig {
    Name: string;
    Version: string;
    AllowedOrigins: Array<string>;
    Port: number;
    Controllers: Array<{ new(...args: Array<any>): Object; }>;
    Container: Container;
}
