import { AccountInformation, HoldingInformation, Transaction } from '../../entities';
import { AuthorizedConfigurationOptions } from '../../interfaces/configuration';
import { GetAssetHistoryRequest } from '../../interfaces/requests';
import { GenericClient } from '../../interfaces/utils';
export type AccountType = {
    /**
     * Returns holding summary of the user.
     *
     * @link https://docs-api.orderly.network/#get-current-holding
     */
    getCurrentHolding: (all?: boolean) => Promise<HoldingInformation[]>;
    /**
     * Get account information
     *
     * @link https://docs-api.orderly.network/#get-account-information
     */
    getInformation: () => Promise<AccountInformation>;
    /**
     * Get asset history, includes token deposit/withdraw and collateral deposit/withdraw.
     *
     * @link https://docs-api.orderly.network/#get-asset-history
     */
    getAssetHistory: (params?: GetAssetHistoryRequest) => Promise<Transaction[]>;
};
export declare class AccountClient extends GenericClient {
    private config;
    private accountId;
    private instance;
    constructor(config: AuthorizedConfigurationOptions, accountId: string, debug?: boolean);
    get account(): AccountType;
}
