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
exports.generatePostHeadersAndRequestData = exports.generateGetHeaders = void 0;
const order_signature_secp256k1_1 = require("./order.signature.secp256k1");
const generateGetHeaders = (method, urlParam, params, orderlyKeyPrivate, accountId, orderlyKey, includeQuery = false) => __awaiter(void 0, void 0, void 0, function* () {
    const timestamp = new Date().getTime().toString();
    const messageStr = [
        timestamp,
        method.toUpperCase(),
        includeQuery ? urlParam + '?' + new URLSearchParams(params).toString() : urlParam,
        includeQuery ? '' : params && Object.keys(params).length ? JSON.stringify(params) : '',
    ].join('');
    console.log(messageStr);
    const messageBytes = new TextEncoder().encode(messageStr);
    const keyPair = yield (0, order_signature_secp256k1_1.getOrderlyKeyPair)(orderlyKeyPrivate);
    const orderlySign = (0, order_signature_secp256k1_1.signPostRequestByOrderlyKey)(keyPair, messageBytes);
    return {
        'Content-Type': ' application/x-www-form-urlencoded',
        'orderly-account-id': accountId,
        'orderly-key': orderlyKey,
        'orderly-signature': orderlySign,
        'orderly-timestamp': timestamp,
    };
});
exports.generateGetHeaders = generateGetHeaders;
const generatePostHeadersAndRequestData = (method, urlParam, params, orderlyKeyPrivate, accountId, orderlyKey, tradingSecret, tradingPublic, includeQuery = false) => __awaiter(void 0, void 0, void 0, function* () {
    const objectKeys = Object.keys(params);
    if (objectKeys.length == 1 && Array.isArray(params[objectKeys[0]])) {
        const requestDataArray = [];
        for (let i = 0; i < params[objectKeys[0]].length; i++) {
            const dataArray = params[objectKeys[0]];
            const orderMessage = Object.keys(dataArray[i])
                .sort()
                .map(key => `${key}=${dataArray[i][key]}`)
                .join('&');
            const tradingKey = (0, order_signature_secp256k1_1.getTradingKeyPair)(tradingSecret);
            const sign = (0, order_signature_secp256k1_1.signMessageByTradingKey)(tradingKey.keyPair, orderMessage);
            const requestData = Object.assign(Object.assign({}, dataArray[i]), { signature: sign });
            requestDataArray.push(requestData);
        }
        const timestamp = new Date().getTime().toString();
        const messageStr = [
            timestamp,
            method.toUpperCase(),
            urlParam,
            JSON.stringify({ [objectKeys[0]]: requestDataArray }),
        ].join('');
        const messageBytes = new TextEncoder().encode(messageStr);
        const keyPairSign = yield (0, order_signature_secp256k1_1.getOrderlyKeyPair)(orderlyKeyPrivate);
        const orderlySign = (0, order_signature_secp256k1_1.signPostRequestByOrderlyKey)(keyPairSign, messageBytes);
        const headers = {
            'Content-Type': method.toUpperCase() === 'POST' || method.toUpperCase() === 'PUT'
                ? 'application/json'
                : 'application/x-www-form-urlencoded',
            'orderly-timestamp': timestamp,
            'orderly-account-id': accountId,
            'orderly-key': orderlyKey,
            'orderly-trading-key': tradingPublic,
            'orderly-signature': orderlySign,
        };
        return { headers, requestData: requestDataArray };
    }
    else {
        const orderMessage = Object.keys(params)
            .sort()
            .map(key => `${key}=${params[key]}`)
            .join('&');
        const tradingKey = (0, order_signature_secp256k1_1.getTradingKeyPair)(tradingSecret);
        const sign = (0, order_signature_secp256k1_1.signMessageByTradingKey)(tradingKey.keyPair, orderMessage);
        const requestData = Object.assign(Object.assign({}, params), { signature: sign });
        const timestamp = new Date().getTime().toString();
        const messageStr = [
            timestamp,
            method.toUpperCase(),
            includeQuery ? urlParam + '?' + new URLSearchParams(requestData).toString() : urlParam,
            includeQuery ? '' : requestData && Object.keys(requestData).length ? JSON.stringify(requestData) : '',
        ].join('');
        const messageBytes = new TextEncoder().encode(messageStr);
        const keyPairSign = yield (0, order_signature_secp256k1_1.getOrderlyKeyPair)(orderlyKeyPrivate);
        const orderlySign = (0, order_signature_secp256k1_1.signPostRequestByOrderlyKey)(keyPairSign, messageBytes);
        const headers = {
            'Content-Type': method.toUpperCase() === 'POST' || method.toUpperCase() === 'PUT'
                ? 'application/json'
                : 'application/x-www-form-urlencoded',
            'orderly-timestamp': timestamp,
            'orderly-account-id': accountId,
            'orderly-key': orderlyKey,
            'orderly-trading-key': tradingPublic,
            'orderly-signature': orderlySign,
        };
        return { headers, requestData };
    }
});
exports.generatePostHeadersAndRequestData = generatePostHeadersAndRequestData;
