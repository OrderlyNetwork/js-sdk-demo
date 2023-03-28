"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetManagerContractMethodsList = void 0;
exports.AssetManagerContractMethodsList = {
    viewMethods: [
        'get_listed_tokens',
        'user_storage_usage',
        'is_token_listed',
        'user_account_exists',
        'storage_balance_of',
        'storage_balance_bounds',
        'is_symbol_listed',
        'get_user_trading_key',
        'is_orderly_key_announced',
        'is_trading_key_set',
        'storage_cost_of_announce_key',
        'get_user_tokens_balances'
    ],
    changeMethods: [
        // Authentication/registration
        'storage_deposit',
        'user_announce_key',
        'user_request_set_trading_key',
        // Deposit
        'user_deposit_native_token',
        // Withdrawal
        'user_request_withdraw',
        'storage_withdraw',
        'storage_unregister',
        // Data access
    ],
};
