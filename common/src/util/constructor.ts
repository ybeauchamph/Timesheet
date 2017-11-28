export interface EmptyConstructor<T> {
    new(): T;
}

export interface Constructor<T> {
    new(...args: Array<any>): T;
}
