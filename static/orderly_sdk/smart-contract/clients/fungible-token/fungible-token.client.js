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
exports.FungibleTokenClient = void 0;
const enviroment_1 = require("../../enviroment");
class FungibleTokenClient {
    constructor(wallet, accountId, networkId) {
        this.wallet = wallet;
        this.accountId = accountId;
        this.networkId = networkId;
    }
    getTokens(ftTokenContract) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.wallet.callMethod(ftTokenContract, 'get_tokens', { account_id: this.accountId }, '300000000000000', '1');
        });
    }
    deposit(amount, ftTokenContract) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = {
                receiver_id: (0, enviroment_1.environment)(this.networkId).nearWalletConfig.contractName,
                amount: String(amount),
                msg: '',
            };
            return yield this.wallet.callMethod(ftTokenContract, 'ft_transfer_call', args, '300000000000000', '1');
        });
    }
}
exports.FungibleTokenClient = FungibleTokenClient;
