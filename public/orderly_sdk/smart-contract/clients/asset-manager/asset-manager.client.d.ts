import { SDKConfigurationOptions } from '../../../interfaces/configuration';
import { WithdrawParams } from '../../../interfaces/requests';
import { GenericSmartContractClient } from '../../../interfaces/utils';
import { AssetManagerContractMethods } from './asset-manager.methods';
type AssetManagerStorageType = {
    /**
     * Function to deposit NEAR to the account storage
     *
     * Pass amount as NEAR value, it will be converted to yoctoNEAR automatically
     */
    deposit: (amount: number) => Promise<unknown>;
    /**
     * Function to withdraw NEAR from the account storage
     *
     * Pass amount as NEAR value, it will be converted to yoctoNEAR automatically
     * If amount is omitted, contract will refund full `available` balance.
     * If `amount` exceeds available balance, it will throw an error.
     */
    withdraw: (amount: number) => Promise<unknown>;
    /**
     * Function to get account storage balance
     */
    balance: () => Promise<unknown>;
    /**
     * Function to unregister account from the contract
     * and withdraw all deposited fee storage costs
     *
     * Returns `true` if the account was unregistered.
     * Returns `false` if account was not registered before.
     *
     * **This method will be released in next version**
     */
    unregister: (force?: boolean) => Promise<boolean>;
};
export declare class AssetManagerClient extends GenericSmartContractClient<AssetManagerContractMethods> {
    private wallet;
    constructor(sdkConfiguration: SDKConfigurationOptions, account: any, contract: any, wallet: any);
    /**
     * Function to connect to the contract, authenticate and create credentials file
     *
     * @returns string
     */
    connect(): Promise<void>;
    private toStorageResponse;
    /**
     * Function to deposit NEAR to your account
     *
     */
    depositNEAR(amount: string | number): Promise<void | import("@near-wallet-selector/core").FinalExecutionOutcome>;
    getUserTokenBalance(accountId?: string): Promise<unknown>;
    /**
     * Function to withdraw tokens from your account
     *
     * @returns string
     */
    withdraw(args: WithdrawParams): Promise<void | import("@near-wallet-selector/core").FinalExecutionOutcome>;
    /**
     * Function to check if provided token is allowed for your account
     * on this contract
     *
     * @returns boolean
     */
    isTokenListed(token: string): Promise<boolean>;
    /**
     * Function to check if provided pair is allowed for your account
     * on this contract
     *
     * @returns boolean
     */
    isSymbolPairListed(pair: string): Promise<boolean>;
    /**
     * Function to get all allowed tokens for your account
     * on this contract
     *
     * @returns boolean
     */
    getPossibleTokens(): Promise<string[]>;
    get storage(): AssetManagerStorageType;
}
export {};
