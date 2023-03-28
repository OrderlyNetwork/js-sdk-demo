import { Wallet } from '@near-wallet-selector/core';
import { providers } from 'near-api-js';
export declare class NearWallet {
    private walletSelector;
    wallet: Wallet;
    nearAccountId: string;
    private createAccessKeyFor;
    private readonly network;
    constructor({ contractId, network }: {
        contractId: any;
        network: any;
    });
    get accountId(): string;
    startUp(): Promise<boolean>;
    get isSignedIn(): boolean;
    signOut(): void;
    viewMethod(contractId: string, method: string, args?: object): Promise<import("near-api-js/lib/providers/provider").QueryResponseKind>;
    getAccessKeyInfo(accountId: string, keyPair: any): Promise<any>;
    callMethod(contractId: string, method: string, args?: object, gas?: string, deposit?: string): Promise<void | providers.FinalExecutionOutcome>;
    getWallet(): Promise<Wallet>;
    getTransactionResult(txhash: string | Uint8Array): Promise<any>;
    getTransactionOutcomes(txhash: string | Uint8Array): Promise<providers.ExecutionOutcomeWithId[]>;
}
