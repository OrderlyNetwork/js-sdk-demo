export declare const getLogger: (name: string, debugMode?: boolean) => import("pino").Logger<{
    name: string;
    transport: {
        target: string;
    };
    level: string;
}>;
