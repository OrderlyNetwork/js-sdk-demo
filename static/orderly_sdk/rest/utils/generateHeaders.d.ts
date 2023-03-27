export declare const generateGetHeaders: (method: any, urlParam: any, params: any, orderlyKeyPrivate: any, accountId: any, orderlyKey: any, includeQuery?: boolean) => Promise<{
    'Content-Type': string;
    'orderly-account-id': any;
    'orderly-key': any;
    'orderly-signature': string;
    'orderly-timestamp': string;
}>;
export declare const generatePostHeadersAndRequestData: (method: any, urlParam: any, params: any, orderlyKeyPrivate: any, accountId: any, orderlyKey: any, tradingSecret: any, tradingPublic: any, includeQuery?: boolean) => Promise<{
    headers: {
        'Content-Type': string;
        'orderly-timestamp': string;
        'orderly-account-id': any;
        'orderly-key': any;
        'orderly-trading-key': any;
        'orderly-signature': string;
    };
    requestData: any;
}>;
