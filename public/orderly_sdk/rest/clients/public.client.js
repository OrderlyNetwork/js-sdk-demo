"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.PublicClient = void 0;
const axios_1 = __importStar(require("axios"));
const utils_1 = require("../../interfaces/utils");
class PublicClient extends utils_1.GenericClient {
    constructor(config, debug = false) {
        super('Public REST Client', debug);
        this.config = config;
        this.instance = axios_1.default.create({
            baseURL: `${this.config.apiUrl}/${this.config.apiVersion}`,
        });
    }
    get public() {
        return {
            getSymbolOrderRules: (symbol) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { data: response } = yield this.instance.get(`public/info/${symbol}`);
                    return response.data;
                }
                catch (error) {
                    if (error instanceof axios_1.AxiosError) {
                        const err = error;
                        if (err.response) {
                            const { data } = err.response;
                            this.logger.error(`Get symbol order rules failed: ${data.message}`);
                            throw new Error(JSON.stringify({
                                code: data.code,
                                message: data.message,
                            }));
                        }
                        this.logger.error(err.toJSON(), 'Get symbol order rules');
                    }
                    else {
                        this.logger.error(error.message, 'Get symbol order rules');
                    }
                    throw error;
                }
            }),
            getAvailableSymbols: () => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { data: response } = yield this.instance.get('public/info');
                    return response.data.rows;
                }
                catch (error) {
                    if (error instanceof axios_1.AxiosError) {
                        const err = error;
                        if (err.response) {
                            const { data } = err.response;
                            this.logger.error(`Get available symbols failed: ${data.message}`);
                            throw new Error(JSON.stringify({
                                code: data.code,
                                message: data.message,
                            }));
                        }
                        this.logger.error(err.toJSON(), 'Get available symbols failed');
                    }
                    else {
                        this.logger.error(error.message, 'Get available symbols failed');
                    }
                    throw error;
                }
            }),
            getFeeInformation: () => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { data: response } = yield this.instance.get('fee/program');
                    return response.data.rows;
                }
                catch (error) {
                    if (error instanceof axios_1.AxiosError) {
                        const err = error;
                        if (err.response) {
                            const { data } = err.response;
                            this.logger.error(`Get fee information failed: ${data.message}`);
                            throw new Error(JSON.stringify({
                                code: data.code,
                                message: data.message,
                            }));
                        }
                        this.logger.error(err.toJSON(), 'Get fee information failed');
                    }
                    else {
                        this.logger.error(error.message, 'Get fee information failed');
                    }
                    throw error;
                }
            }),
            getMarketTrades: (symbol, limit = 10) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { data: response } = yield this.instance.get('public/market_trades', {
                        params: {
                            symbol,
                            limit,
                        },
                    });
                    return response.data.rows;
                }
                catch (error) {
                    if (error instanceof axios_1.AxiosError) {
                        const err = error;
                        if (err.response) {
                            const { data } = err.response;
                            this.logger.error(`Get trades failed: ${data.message}`);
                            throw new Error(JSON.stringify({
                                code: data.code,
                                message: data.message,
                            }));
                        }
                        this.logger.error(err.toJSON(), 'Get trades failed');
                    }
                    else {
                        this.logger.error(error.message, 'Get trades failed');
                    }
                    throw error;
                }
            }),
        };
    }
}
exports.PublicClient = PublicClient;
