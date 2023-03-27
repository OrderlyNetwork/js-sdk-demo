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
exports.signPostRequestByOrderlyKey = exports.signMessageByTradingKey = exports.getOrderlyKeyPair = exports.getTradingKeyPair = void 0;
const elliptic_1 = require("elliptic");
const keccak256_1 = __importDefault(require("keccak256"));
const near_api_js_1 = require("near-api-js");
const getTradingKeyPair = tradingKeyPrivateKey => {
    const ec = new elliptic_1.ec('secp256k1');
    const keyPair = ec.keyFromPrivate(tradingKeyPrivateKey);
    return {
        privateKey: keyPair.getPrivate().toString('hex'),
        publicKey: keyPair.getPublic().encode('hex'),
        keyPair,
    };
};
exports.getTradingKeyPair = getTradingKeyPair;
const getOrderlyKeyPair = (orderlyKeyPrivateKey) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('private key', orderlyKeyPrivateKey);
    return near_api_js_1.KeyPair.fromString(orderlyKeyPrivateKey);
});
exports.getOrderlyKeyPair = getOrderlyKeyPair;
function handleZero(str) {
    if (str.length < 64) {
        const zeroArr = new Array(64 - str.length).fill(0);
        return zeroArr.join('') + str;
    }
    return str;
}
const signMessageByTradingKey = (keyPair, params) => {
    const ec = new elliptic_1.ec('secp256k1');
    const msgHash = (0, keccak256_1.default)(params);
    const privateKey = keyPair.getPrivate('hex');
    const signature = ec.sign(msgHash, privateKey, 'hex', { canonical: true });
    const r = signature.r.toJSON();
    const s = signature.s.toJSON();
    const hexSignature = `${handleZero(r)}${handleZero(s)}0${signature.recoveryParam}`;
    return hexSignature;
};
exports.signMessageByTradingKey = signMessageByTradingKey;
const signPostRequestByOrderlyKey = (keyPair, messageString) => {
    const u8 = Buffer.from(messageString);
    const signStr = keyPair.sign(u8);
    return Buffer.from(signStr.signature).toString('base64');
};
exports.signPostRequestByOrderlyKey = signPostRequestByOrderlyKey;
