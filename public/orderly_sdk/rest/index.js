"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestClient = void 0;
const enums_1 = require("../enums");
const orders_client_1 = require("./clients/orders.client");
const public_client_1 = require("./clients/public.client");
const trade_client_1 = require("./clients/trade.client");
const user_client_1 = require("./clients/user.client");
class RestClient {
    constructor(sdkOptions, apiVersion = enums_1.RestApiVersion.v1) {
        this.sdkOptions = sdkOptions;
        this.apiVersion = apiVersion;
        const apiUrl = enums_1.RestAPIUrl[sdkOptions.networkId];
        const keys = {
            orderlyKey: this.sdkOptions.publicKey,
            orderlySecret: this.sdkOptions.secretKey,
            tradingPublic: this.sdkOptions.tradingPublic,
            tradingSecret: this.sdkOptions.tradingSecret,
            orderlyKeyPrivate: this.sdkOptions.orderlyKeyPrivate,
        };
        this.publicClient = new public_client_1.PublicClient({ apiUrl, apiVersion: this.apiVersion }, this.sdkOptions.debug);
        this.ordersClient = new orders_client_1.OrdersClient(Object.assign({ apiUrl,
            apiVersion }, keys), this.sdkOptions.accountId, this.sdkOptions.debug);
        this.tradeClient = new trade_client_1.TradeClient(Object.assign({ apiUrl,
            apiVersion }, keys), this.sdkOptions.accountId, this.sdkOptions.debug);
        this.accountClient = new user_client_1.AccountClient(Object.assign({ apiUrl,
            apiVersion }, keys), this.sdkOptions.accountId, this.sdkOptions.debug);
    }
    get public() {
        return this.publicClient.public;
    }
    get orders() {
        return this.ordersClient.orders;
    }
    get trade() {
        return this.tradeClient.trade;
    }
    get account() {
        return this.accountClient.account;
    }
}
exports.RestClient = RestClient;
