export interface TypeHandler<T extends Object> {
    clone(dataObject: T | undefined): T | undefined;
    set(dataObject: T | undefined, dto: T | any, group?: number): void;
    equals(dataObject1: T | undefined, dataObject2: T | undefined): boolean;
}
