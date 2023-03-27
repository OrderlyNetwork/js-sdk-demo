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
exports.GenericSmartContractClient = void 0;
const near_api_js_1 = require("near-api-js");
const near_network_id_enum_1 = require("../../enums/near-network-id.enum");
const generic_client_1 = require("./generic-client");
class GenericSmartContractClient extends generic_client_1.GenericClient {
    constructor(clientName, contractName, contractMethods, sdkConfig, nearAccount, managerContract) {
        super(clientName, sdkConfig.debug);
        this.contractName = contractName;
        this.contractMethods = contractMethods;
        this.sdkConfig = sdkConfig;
        this.nearAccount = nearAccount;
        this.managerContract = managerContract;
        this.networkId = near_network_id_enum_1.NearNetworkId[this.sdkConfig.networkId];
    }
    _connect() {
        return __awaiter(this, void 0, void 0, function* () {
            // await this.createKeyStore();
            this.account = this.nearAccount;
            this.contract = this.managerContract;
        });
    }
    createKeyStore() {
        return __awaiter(this, void 0, void 0, function* () {
            const keyPair = near_api_js_1.KeyPair.fromString(this.sdkConfig.secretKey);
            this.keyStore = new near_api_js_1.keyStores.InMemoryKeyStore();
            console.log('this.keyStore', this.keyStore);
            yield this.keyStore.setKey(this.networkId, this.sdkConfig.accountId, keyPair);
        });
    }
    getContract() {
        return this.contract;
    }
}
exports.GenericSmartContractClient = GenericSmartContractClient;
