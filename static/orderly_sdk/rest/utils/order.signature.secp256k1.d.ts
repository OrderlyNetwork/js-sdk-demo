import { KeyPair } from 'near-api-js';
export type OrderlySignatureGenerator = {
    /**
     * Place order maker/taker, the order executed information will be update from websocket stream.
     * Will response immediately with an order created message.
     *
     * @link https://docs-api.orderly.network/#create-order
     */
    signMessageByTradingKey: (keyPair: KeyPair, params: string) => string;
    signPostRequestByOrderlyKey: (keyPair: KeyPair, params: string) => string;
};
export declare const getTradingKeyPair: (tradingKeyPrivateKey: any) => {
    privateKey: any;
    publicKey: any;
    keyPair: any;
};
export declare const getOrderlyKeyPair: (orderlyKeyPrivateKey: any) => Promise<KeyPair>;
export declare const signMessageByTradingKey: (keyPair: any, params: any) => string;
export declare const signPostRequestByOrderlyKey: (keyPair: any, messageString: Uint8Array) => string;
