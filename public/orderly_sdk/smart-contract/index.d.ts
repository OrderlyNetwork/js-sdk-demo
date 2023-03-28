import { SdkConfigurationOptionsClient } from '../interfaces/configuration/sdk-configuration-options.client';
import { GenericClient } from '../interfaces/utils';
import { NearWallet } from '../near-wallet';
import { RestClient } from '../rest';
import { AssetManagerClient } from './clients/asset-manager/asset-manager.client';
import { FungibleTokenClient } from './clients/fungible-token/fungible-token.client';
export declare class SmartContractClient extends GenericClient {
    private config;
    private wallet;
    walletRef: NearWallet;
    private isSigned;
    private contract;
    private account;
    sdk: RestClient;
    sc: AssetManagerClient;
    ft: FungibleTokenClient;
    constructor(config: SdkConfigurationOptionsClient);
    connect(): Promise<void>;
    accountId(): string;
    sdkClient(): RestClient;
    ftClient(): FungibleTokenClient;
    contractClient(): AssetManagerClient;
    isSignedIn(): boolean;
    signOut(): void;
    getTransactionOutcomes(txhash: string): Promise<import("near-api-js/lib/providers").ExecutionOutcomeWithId[]>;
}
