import { SdkConfigurationOptionsClient } from '../interfaces/configuration/sdk-configuration-options.client';
export declare class AuthClient {
    private smartContractClient;
    private config;
    constructor(options?: SdkConfigurationOptionsClient);
    /**
     * There are two possibilities for user authentication in the NEAR
     * First: mostly suitable for back-end usage - provide user accountId and secretKey
     *   (Full access secret key, that can be obtained from NEAR Wallet). In this case user
     *   will be logged in permanently, signOut() will not work. Transactions will be signed dy secretKey,
     *   no need for approvement by wallet. If secretKey not provided - accountId skipped, second case used.
     * Second: authenticate user by web Wallet. For that requestSignIn() should be called. Functions, that
     *   changing contrqct state or user deposit (both storage and Order) will require user approval through
     *   web wallet. In this case web wallet will be opened authomatically, no need for separate call.
     * Get functions, that does not belong to user account are accessible without user authentication.
     */
    private checkEnvironment;
    /**
     * Connects AssetManager to the network
     * This function must be called before start working with other AuthClient functions
     */
    connect(): Promise<void>;
    /**
     * Getter for user near account id if user is logged in
     */
    accountId(): string;
    restApi(): import("..").RestClient;
    ftClient(): import("..").FungibleTokenClient;
    contractsApi(): import("..").AssetManagerClient;
    /**
     * Return user authentication state
     */
    isSignedIn(): Promise<boolean>;
    /**
     * Request for NEAR web Wallet login
     * Does not work when secretKey is provided
     */
    /**
     * Log out user from NEAR web Wallet
     * Does not work when secretKey is provided
     */
    signOut(): Promise<void>;
    getTransactionOutcomes(txhash: string): Promise<import("near-api-js/lib/providers").ExecutionOutcomeWithId[]>;
}
