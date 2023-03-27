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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmartContractClient = void 0;
const buffer_1 = require("buffer");
const elliptic_1 = require("elliptic");
const keccak256_1 = __importDefault(require("keccak256"));
const near_api_js_1 = require("near-api-js");
const contract_1 = require("near-api-js/lib/contract");
const utils_1 = require("../interfaces/utils");
const near_wallet_1 = require("../near-wallet");
const rest_1 = require("../rest");
const asset_manager_client_1 = require("./clients/asset-manager/asset-manager.client");
const asset_manager_methods_1 = require("./clients/asset-manager/asset-manager.methods");
const fungible_token_client_1 = require("./clients/fungible-token/fungible-token.client");
const enviroment_1 = require("./enviroment");
class SmartContractClient extends utils_1.GenericClient {
    constructor(config) {
        super('Smart Contract Client', config.debug);
        this.config = config;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (window.Buffer === undefined)
                window.Buffer = buffer_1.Buffer;
            const nearConfig = (0, enviroment_1.environment)(this.config.networkId).nearWalletConfig;
            const nearConnection = yield (0, near_api_js_1.connect)(nearConfig);
            this.wallet = new near_wallet_1.NearWallet({ contractId: this.config.contractId, network: this.config.networkId });
            yield this.wallet.startUp();
            if (this.wallet.isSignedIn) {
                console.log('Start to init Orderly SDK');
                console.log('this.wallet', this.wallet);
                yield nearConnection.account(this.wallet.accountId);
                const accountId = this.wallet.accountId;
                const orderlyKeyPair = yield (0, enviroment_1.environment)(this.config.networkId).nearWalletConfig.keyStore.getKey((0, enviroment_1.environment)(this.config.networkId).nearWalletConfig.networkId, accountId);
                this.account = new near_api_js_1.Account(nearConnection.connection, accountId);
                this.contract = new contract_1.Contract(this.account, (0, enviroment_1.environment)(this.config.networkId).nearWalletConfig.contractName, asset_manager_methods_1.AssetManagerContractMethodsList);
                const userExists = yield this.contract.user_account_exists({ user: accountId });
                this.logger.debug(`userExists: ${userExists}`);
                if (!userExists) {
                    this.logger.debug('User account not exists, creating');
                    this.wallet.callMethod((0, enviroment_1.environment)(this.config.networkId).nearWalletConfig.contractName, 'storage_deposit', { account_id: accountId, registration_only: true }, '30000000000000', near_api_js_1.utils.format.parseNearAmount('2'));
                    this.logger.debug('User account created');
                }
                const isKeyAnnounced = yield this.contract.is_orderly_key_announced({
                    user: accountId,
                    orderly_key: orderlyKeyPair.getPublicKey().toString(),
                });
                if (!isKeyAnnounced) {
                    try {
                        this.logger.debug('Key not announced, doing it');
                        yield this.contract.user_announce_key({});
                        this.logger.debug('Key announced');
                    }
                    catch (e) {
                        console.log('ERROR', e);
                    }
                }
                const tradingKeyIsSet = yield this.contract.is_trading_key_set({
                    user: accountId,
                    orderly_key: orderlyKeyPair.getPublicKey().toString(),
                });
                let tradingKeyPairResponse;
                if (!tradingKeyIsSet) {
                    const getTradingKeyPair = () => {
                        const ec = new elliptic_1.ec('secp256k1');
                        const keyPair = ec.genKeyPair();
                        return {
                            privateKey: keyPair.getPrivate().toString('hex'),
                            publicKey: keyPair.getPublic().encode('hex'),
                            keyPair,
                        };
                    };
                    const tradingKeyPair = getTradingKeyPair();
                    const pubKeyAsHex = tradingKeyPair.publicKey.replace('04', '');
                    const normalizeTradingKey = btoa((0, keccak256_1.default)(pubKeyAsHex).toString('hex'));
                    this.logger.debug('Trading key is generated, setting it', normalizeTradingKey);
                    yield this.contract.user_request_set_trading_key({
                        key: normalizeTradingKey,
                    });
                    const tradingKey = localStorage.setItem('TRADING_KEY', tradingKeyPair.publicKey.replace('04', ''));
                    const tradingKeySecret = localStorage.setItem('TRADING_KEY_SECRET', tradingKeyPair.privateKey);
                    tradingKeyPairResponse = {
                        tradingKey: tradingKey,
                        tradingKeySecret: tradingKeySecret,
                    };
                }
                const sdkOptions = {
                    networkId: this.config.networkId,
                    accountId: accountId,
                    publicKey: orderlyKeyPair.getPublicKey().toString(),
                    // @ts-ignore
                    orderlyKeyPrivate: `ed25519:${orderlyKeyPair.secretKey}`,
                    tradingPublic: (tradingKeyPairResponse === null || tradingKeyPairResponse === void 0 ? void 0 : tradingKeyPairResponse.tradingKey) || localStorage.getItem('TRADING_KEY'),
                    tradingSecret: (tradingKeyPairResponse === null || tradingKeyPairResponse === void 0 ? void 0 : tradingKeyPairResponse.tradingKeySecret) || localStorage.getItem('TRADING_KEY_SECRET'),
                };
                this.sdk = new rest_1.RestClient(sdkOptions);
                this.sc = new asset_manager_client_1.AssetManagerClient(sdkOptions, this.account, this.contract, this.wallet);
                this.ft = new fungible_token_client_1.FungibleTokenClient(this.wallet, accountId, this.config.networkId);
                this.walletRef = this.wallet;
                console.log(this.walletRef);
                yield this.sc.connect();
                console.log('SDK is ready');
            }
        });
    }
    accountId() {
        return this.walletRef.nearAccountId;
    }
    sdkClient() {
        return this.sdk;
    }
    ftClient() {
        return this.ft;
    }
    contractClient() {
        return this.sc;
    }
    isSignedIn() {
        return this.isSigned;
    }
    signOut() {
        this.walletRef.wallet.signOut();
    }
    getTransactionOutcomes(txhash) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.wallet.getTransactionOutcomes(txhash);
        });
    }
}
exports.SmartContractClient = SmartContractClient;
