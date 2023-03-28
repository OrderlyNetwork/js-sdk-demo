import { BaseLogger } from 'pino';
export declare class GenericClient {
    protected logger: BaseLogger;
    constructor(name: string, debug: boolean);
}
