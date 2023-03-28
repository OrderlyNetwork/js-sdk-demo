import { keyStores } from 'near-api-js';
import { NearNetworkId } from '../enums';
export declare const environment: (networkId: keyof typeof NearNetworkId) => {
    nearWalletConfig: {
        keyStore: keyStores.BrowserLocalStorageKeyStore;
        contractName: string;
        methodNames: string[];
        networkId: string;
        nodeUrl: string;
        walletUrl: string;
        helperUrl: string;
        explorerUrl: string;
        appWallet: string[];
        headers: {};
        connectCallback: {
            success: string;
            failure: string;
        };
    };
    config: {
        apiUrl: string;
        privateWsUrl: string;
        publicWsUrl: string;
        publicWebsocketKey: string;
    };
};
