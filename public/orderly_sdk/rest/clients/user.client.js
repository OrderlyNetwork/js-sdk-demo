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
exports.AccountClient = void 0;
const axios_1 = __importStar(require("axios"));
const utils_1 = require("../../interfaces/utils");
const generateHeaders_1 = require("../utils/generateHeaders");
class AccountClient extends utils_1.GenericClient {
    constructor(config, accountId, debug = false) {
        super('Account REST Client', debug);
        this.config = config;
        this.accountId = accountId;
        this.instance = axios_1.default.create({
            baseURL: `${this.config.apiUrl}/${this.config.apiVersion}`,
        });
    }
    get account() {
        return {
            getCurrentHolding: (all) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const headers = yield (0, generateHeaders_1.generateGetHeaders)('GET', '/v1/client/holding', { all }, this.config.orderlyKeyPrivate, this.accountId, this.config.orderlyKey, true);
                    const { data: response } = yield this.instance.get('client/holding', {
                        params: {
                            all,
                        },
                        headers,
                    });
                    return response.data.holding;
                }
                catch (error) {
                    if (error instanceof axios_1.AxiosError) {
                        const err = error;
                        if (err.response) {
                            const { data } = err.response;
                            this.logger.error(`Get current holding failed: ${data.message}`);
                            throw new Error(JSON.stringify({
                                code: data.code,
                                message: data.message,
                            }));
                        }
                        this.logger.error(err.toJSON(), 'Get current holding failed');
                    }
                    else {
                        this.logger.error(error.message, 'Get current holding failed');
                    }
                    throw error;
                }
            }),
            getInformation: () => __awaiter(this, void 0, void 0, function* () {
                try {
                    const headers = yield (0, generateHeaders_1.generateGetHeaders)('GET', '/v1/client/info', null, this.config.orderlyKeyPrivate, this.accountId, this.config.orderlyKey);
                    const { data: response } = yield this.instance.get('client/info', { headers });
                    return response.data;
                }
                catch (error) {
                    if (error instanceof axios_1.AxiosError) {
                        const err = error;
                        if (err.response) {
                            const { data } = err.response;
                            this.logger.error(`Get account information failed: ${data.message}`);
                            throw new Error(JSON.stringify({
                                code: data.code,
                                message: data.message,
                            }));
                        }
                        this.logger.error(err.toJSON(), 'Get account information failed');
                    }
                    else {
                        this.logger.error(error.message, 'Get account information failed');
                    }
                    throw error;
                }
            }),
            getAssetHistory: (params) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const headers = yield (0, generateHeaders_1.generateGetHeaders)('GET', '/v1/asset/history', params, this.config.orderlyKeyPrivate, this.accountId, this.config.orderlyKey, true);
                    const { data: response } = yield this.instance.get('asset/history', {
                        params,
                        headers,
                    });
                    return response.data.rows;
                }
                catch (error) {
                    if (error instanceof axios_1.AxiosError) {
                        const err = error;
                        if (err.response) {
                            const { data } = err.response;
                            this.logger.error(`Get asset history failed: ${data.message}`);
                            throw new Error(JSON.stringify({
                                code: data.code,
                                message: data.message,
                            }));
                        }
                        this.logger.error(err.toJSON(), 'Get asset history failed');
                    }
                    else {
                        this.logger.error(error.message, 'Get asset history failed');
                    }
                    throw error;
                }
            }),
        };
    }
}
exports.AccountClient = AccountClient;
