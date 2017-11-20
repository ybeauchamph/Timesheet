import * as fs from 'fs';

export class Config<T> {
    private _config: T;
    private _configFilePath: string;

    constructor(configFilePath: string) {
        this._configFilePath = configFilePath;
    }

    get config(): T { return this._config; }
    get configFilePath(): string { return this._configFilePath; }

    load(): boolean {
        try {
            const configBuffer = fs.readFileSync(this.configFilePath, 'utf8');
            this._config = JSON.parse(configBuffer.toString());
            return true;
        } catch (error) {
            console.error('Config load error', error);
            return false;
        }
    }

    reload(): boolean {
        return this.load();
    }
}
