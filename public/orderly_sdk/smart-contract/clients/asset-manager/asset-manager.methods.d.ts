import { EmptyRequest, StorageDepositRequest, StorageUnregisterRequest, StorageWithdrawRequest, UserKeyRequest, WithdrawRequest } from '../../../interfaces/requests';
import { StorageContractResponse } from '../../../interfaces/responses';
import { CallMethodSignature } from '../../../interfaces/utils';
export declare const AssetManagerContractMethodsList: {
    viewMethods: string[];
    changeMethods: string[];
};
export interface AssetManagerContractMethods {
    storage_deposit: (params: StorageDepositRequest) => Promise<StorageContractResponse>;
    user_announce_key: (params: EmptyRequest) => Promise<void>;
    user_request_set_trading_key: (params: CallMethodSignature<{
        key: string;
    }>) => Promise<void>;
    user_deposit_native_token: (params: EmptyRequest) => Promise<void>;
    user_request_withdraw: (params: WithdrawRequest) => Promise<void>;
    storage_withdraw: (params: StorageWithdrawRequest) => Promise<StorageContractResponse>;
    storage_unregister: (params: StorageUnregisterRequest) => Promise<boolean>;
    is_token_listed: ({ token }: {
        token: any;
    }) => Promise<boolean>;
    get_listed_tokens: (params: EmptyRequest) => Promise<string[]>;
    user_account_exists: (params: CallMethodSignature<{
        user: string;
    }>) => Promise<boolean>;
    storage_balance_of: ({ account_id }: {
        account_id: any;
    }) => Promise<StorageContractResponse>;
    storage_balance_bounds: (params: CallMethodSignature<{
        account_id: string;
    }>) => Promise<unknown>;
    is_symbol_listed: ({ pair_symbol }: {
        pair_symbol: any;
    }) => Promise<boolean>;
    get_user_trading_key: (params: UserKeyRequest) => Promise<string>;
    is_orderly_key_announced: (params: UserKeyRequest) => Promise<boolean>;
    is_trading_key_set: (params: UserKeyRequest) => Promise<boolean>;
    user_storage_usage: (params: CallMethodSignature<{
        user: string;
    }>) => Promise<unknown>;
    storage_cost_of_announce_key: (params: EmptyRequest) => Promise<unknown>;
    get_user_tokens_balances: ({ user }: {
        user: any;
    }) => Promise<unknown>;
}
