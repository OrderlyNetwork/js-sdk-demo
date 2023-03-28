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
exports.AuthClient = void 0;
const enums_1 = require("../enums");
const errors_1 = require("../errors");
const index_1 = require("../smart-contract/index");
class AuthClient {
    constructor(options) {
        this.checkEnvironment(options);
        this.smartContractClient = new index_1.SmartContractClient(this.config);
    }
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
    checkEnvironment(config) {
        var _a;
        const networkId = enums_1.NearNetworkId[(_a = config === null || config === void 0 ? void 0 : config.networkId) !== null && _a !== void 0 ? _a : process.env.NETWORK_ID];
        const debugMode = (config === null || config === void 0 ? void 0 : config.debug) === undefined ? true : config === null || config === void 0 ? void 0 : config.debug;
        const contractId = config === null || config === void 0 ? void 0 : config.contractId;
        if (debugMode) {
            console.log('Debug mode enabled. Disable it by passing `debug: false` into constructor.');
        }
        if (!networkId) {
            throw new errors_1.ParameterNotFoundError('Network ID');
        }
        if (!contractId) {
            throw new errors_1.ParameterNotFoundError('Contract ID');
        }
        this.config = {
            networkId,
            contractId,
            debug: debugMode,
        };
    }
    /**
     * Connects AssetManager to the network
     * This function must be called before start working with other AuthClient functions
     */
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.smartContractClient.connect();
        });
    }
    /**
     * Getter for user near account id if user is logged in
     */
    accountId() {
        return this.smartContractClient.accountId();
    }
    restApi() {
        return this.smartContractClient.sdkClient();
    }
    ftClient() {
        return this.smartContractClient.ftClient();
    }
    contractsApi() {
        return this.smartContractClient.contractClient();
    }
    /**
     * Return user authentication state
     */
    isSignedIn() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.smartContractClient.isSignedIn();
        });
    }
    /**
     * Request for NEAR web Wallet login
     * Does not work when secretKey is provided
     */
    // public async requestSignIn() {
    //   return this.smartContractClient.requestSignIn();
    // }
    /**
     * Log out user from NEAR web Wallet
     * Does not work when secretKey is provided
     */
    signOut() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.smartContractClient.signOut();
        });
    }
    getTransactionOutcomes(txhash) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.smartContractClient.getTransactionOutcomes(txhash);
        });
    }
}
exports.AuthClient = AuthClient;
