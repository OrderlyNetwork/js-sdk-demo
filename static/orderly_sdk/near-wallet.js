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
exports.NearWallet = void 0;
const core_1 = require("@near-wallet-selector/core");
const modal_ui_js_1 = require("@near-wallet-selector/modal-ui-js");
const my_near_wallet_1 = require("@near-wallet-selector/my-near-wallet");
const near_wallet_1 = require("@near-wallet-selector/near-wallet");
const sender_1 = require("@near-wallet-selector/sender");
const near_api_js_1 = require("near-api-js");
const constants_1 = require("./constants");
const enviroment_1 = require("./smart-contract/enviroment");
const style_1 = require("./style");
class NearWallet {
    constructor({ contractId, network }) {
        this.createAccessKeyFor = contractId;
        this.network = network;
    }
    get accountId() {
        return this.nearAccountId;
    }
    startUp() {
        return __awaiter(this, void 0, void 0, function* () {
            this.walletSelector = yield (0, core_1.setupWalletSelector)({
                network: this.network,
                modules: [(0, near_wallet_1.setupNearWallet)(), (0, my_near_wallet_1.setupMyNearWallet)(), (0, sender_1.setupSender)()],
            });
            const isSignedIn = this.walletSelector.isSignedIn();
            console.log('isSignedIn', isSignedIn);
            if (isSignedIn) {
                this.wallet = yield this.walletSelector.wallet();
                this.nearAccountId = this.walletSelector.store.getState().accounts[0].accountId;
            }
            else {
                if (document) {
                    const style = document.createElement('style');
                    style.textContent = style_1.modalStyles;
                    document.head.appendChild(style);
                }
                const description = 'Please select a wallet to sign in.';
                const modal = (0, modal_ui_js_1.setupModal)(this.walletSelector, {
                    contractId: this.createAccessKeyFor,
                    description,
                    theme: 'dark',
                });
                modal.show();
            }
            return isSignedIn;
        });
    }
    get isSignedIn() {
        return this.walletSelector.isSignedIn();
    }
    signOut() {
        var _a;
        (_a = this.wallet) === null || _a === void 0 ? void 0 : _a.signOut();
        this.wallet = this.nearAccountId = this.createAccessKeyFor = null;
        window.location.replace(window.location.origin + window.location.pathname);
    }
    viewMethod(contractId, method, args = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const { network } = this.walletSelector.options;
            const provider = new near_api_js_1.providers.JsonRpcProvider({ url: network.nodeUrl });
            const res = yield provider.query({
                request_type: 'call_function',
                account_id: contractId,
                method_name: method,
                args_base64: Buffer.from(JSON.stringify(args)).toString('base64'),
                finality: 'optimistic',
            });
            return res;
        });
    }
    getAccessKeyInfo(accountId, keyPair) {
        return __awaiter(this, void 0, void 0, function* () {
            const provider = new near_api_js_1.providers.JsonRpcProvider({ url: (0, enviroment_1.environment)(this.network).nearWalletConfig.nodeUrl });
            const publicKey = keyPair.getPublicKey();
            return provider.query(`access_key/${accountId}/${publicKey.toString()}`, '');
        });
    }
    callMethod(contractId, method, args = {}, gas = constants_1.THIRTY_TGAS, deposit = constants_1.ONE_YOCTO) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.wallet.signAndSendTransaction({
                signerId: this.nearAccountId,
                receiverId: contractId,
                actions: [
                    {
                        type: 'FunctionCall',
                        params: {
                            methodName: method,
                            args,
                            gas,
                            deposit,
                        },
                    },
                ],
            });
        });
    }
    getWallet() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.wallet;
        });
    }
    getTransactionResult(txhash) {
        return __awaiter(this, void 0, void 0, function* () {
            const { network } = this.walletSelector.options;
            const provider = new near_api_js_1.providers.JsonRpcProvider({ url: network.nodeUrl });
            const transaction = yield provider.txStatus(txhash, 'unnused');
            return near_api_js_1.providers.getTransactionLastResult(transaction);
        });
    }
    getTransactionOutcomes(txhash) {
        return __awaiter(this, void 0, void 0, function* () {
            const { network } = this.walletSelector.options;
            const provider = new near_api_js_1.providers.JsonRpcProvider({ url: network.nodeUrl });
            const transaction = yield provider.txStatus(txhash, 'unnused');
            return transaction.receipts_outcome;
        });
    }
}
exports.NearWallet = NearWallet;
