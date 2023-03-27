"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetManagerClient = void 0;
const near_api_js_1 = require("near-api-js");
const utils_1 = require("../../../interfaces/utils");
const enviroment_1 = require("../../enviroment");
const asset_manager_methods_1 = require("./asset-manager.methods");
class AssetManagerClient extends utils_1.GenericSmartContractClient {
    constructor(sdkConfiguration, account, contract, wallet) {
        super('AssetManagerClient', `asset-manager.orderly.${sdkConfiguration.networkId}`, asset_manager_methods_1.AssetManagerContractMethodsList, sdkConfiguration, account, contract);
        this.wallet = wallet;
    }
    // Public methods
    /**
     * Function to connect to the contract, authenticate and create credentials file
     *
     * @returns string
     */
    connect() {
        const _super = Object.create(null, {
            _connect: { get: () => super._connect }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super._connect.call(this);
        });
    }
    toStorageResponse(contractResponse) {
        const { total, available } = contractResponse;
        return {
            total: parseFloat(near_api_js_1.utils.format.formatNearAmount(total, 2)),
            available: parseFloat(near_api_js_1.utils.format.formatNearAmount(available, 2)),
        };
    }
    /**
     * Function to deposit NEAR to your account
     *
     */
    depositNEAR(amount) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.wallet.callMethod((0, enviroment_1.environment)(this.networkId).nearWalletConfig.contractName, 'user_deposit_native_token', {}, '30000000000000', near_api_js_1.utils.format.parseNearAmount(amount.toString()));
        });
    }
    getUserTokenBalance(accountId = '') {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getContract().get_user_tokens_balances({ user: accountId ? accountId : this.sdkConfig.accountId });
        });
    }
    /**
     * Function to withdraw tokens from your account
     *
     * @returns string
     */
    withdraw(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.wallet.callMethod((0, enviroment_1.environment)(this.networkId).nearWalletConfig.contractName, 'user_request_withdraw', args, '30000000000000', '1');
        });
    }
    /**
     * Function to check if provided token is allowed for your account
     * on this contract
     *
     * @returns boolean
     */
    isTokenListed(token) {
        return this.getContract().is_token_listed({ token });
    }
    /**
     * Function to check if provided pair is allowed for your account
     * on this contract
     *
     * @returns boolean
     */
    isSymbolPairListed(pair) {
        return this.getContract().is_symbol_listed({ pair_symbol: pair });
    }
    /**
     * Function to get all allowed tokens for your account
     * on this contract
     *
     * @returns boolean
     */
    getPossibleTokens() {
        return this.getContract().get_listed_tokens({
            args: {},
        });
    }
    get storage() {
        return {
            deposit: (amount) => __awaiter(this, void 0, void 0, function* () {
                yield this.wallet.callMethod((0, enviroment_1.environment)(this.networkId).nearWalletConfig.contractName, 'storage_deposit', { account_id: this.sdkConfig.accountId, registration_only: false }, '30000000000000', near_api_js_1.utils.format.parseNearAmount(amount.toString()));
            }),
            withdraw: (amount) => __awaiter(this, void 0, void 0, function* () {
                const args = {};
                if (amount) {
                    args.amount = near_api_js_1.utils.format.parseNearAmount(amount.toString());
                }
                yield this.wallet.callMethod((0, enviroment_1.environment)(this.networkId).nearWalletConfig.contractName, 'storage_deposit', args, '30000000000000', '1');
            }),
            balance: () => __awaiter(this, void 0, void 0, function* () {
                const response = yield this.getContract().storage_balance_of({ account_id: this.sdkConfig.accountId });
                return this.toStorageResponse(response);
            }),
            unregister: () => this.getContract().storage_unregister({ args: {}, amount: '1' }),
        };
    }
}
exports.AssetManagerClient = AssetManagerClient;
