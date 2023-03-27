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
exports.OrdersClient = void 0;
const axios_1 = __importStar(require("axios"));
const requests_1 = require("../../interfaces/requests");
const utils_1 = require("../../interfaces/utils");
const generateHeaders_1 = require("../utils/generateHeaders");
class OrdersClient extends utils_1.GenericClient {
    constructor(config, accountId, debug = false) {
        super('Orders REST Client', debug);
        this.config = config;
        this.accountId = accountId;
        this.instance = axios_1.default.create({
            baseURL: `${this.config.apiUrl}/${this.config.apiVersion}`,
        });
    }
    get orders() {
        return {
            create: (params) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const validateResponse = (0, requests_1.validateCreateOrderRequest)(params);
                    if (!validateResponse.success) {
                        throw new Error(JSON.stringify(validateResponse.errors));
                    }
                    console.log('createOrders', this.accountId);
                    console.log(params, params);
                    const { headers, requestData } = yield (0, generateHeaders_1.generatePostHeadersAndRequestData)('POST', '/v1/order', params, this.config.orderlyKeyPrivate, this.accountId, this.config.orderlyKey, this.config.tradingSecret, this.config.tradingPublic);
                    const { data: response } = yield this.instance.post('/order', requestData, {
                        headers: headers,
                    });
                    return response.data;
                }
                catch (error) {
                    if (error instanceof axios_1.AxiosError) {
                        const err = error;
                        if (err.response) {
                            const { data } = err.response;
                            this.logger.error(`Create order failed: ${data.message}`);
                            throw new Error(JSON.stringify({
                                code: data.code,
                                message: data.message,
                            }));
                        }
                        this.logger.error(err.toJSON(), 'Create order failed');
                    }
                    else {
                        this.logger.error(error.message, 'Create order failed');
                    }
                    throw error;
                }
            }),
            createBatch: (params) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const validationResults = params.orders.reduce((acc, curr, currIdx) => {
                        acc[currIdx] = (0, requests_1.validateCreateOrderRequest)(curr);
                        return acc;
                    }, {});
                    const invalidRows = Object.values(validationResults).filter(value => !value.success);
                    if (Object.entries(invalidRows).length > 0) {
                        throw new Error(JSON.stringify(invalidRows));
                    }
                    const { headers, requestData } = yield (0, generateHeaders_1.generatePostHeadersAndRequestData)('POST', '/v1/batch-order', params, this.config.orderlyKeyPrivate, this.accountId, this.config.orderlyKey, this.config.tradingSecret, this.config.tradingPublic);
                    const { data: response } = yield this.instance.post('batch-order', { orders: requestData }, {
                        headers: headers,
                    });
                    return response.data.rows;
                }
                catch (error) {
                    if (error instanceof axios_1.AxiosError) {
                        const err = error;
                        if (err.response) {
                            const { data } = err.response;
                            this.logger.error(`Batch create order failed: ${data.message}`);
                            throw new Error(JSON.stringify({
                                code: data.code,
                                message: data.message,
                            }));
                        }
                        this.logger.error(err.toJSON(), 'Batch create order failed');
                    }
                    else {
                        this.logger.error(error.message, 'Batch create order failed');
                    }
                    throw error;
                }
            }),
            cancel: (params) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if (!params.order_id && !params.client_order_id) {
                        throw new Error('You need to pass either order_id or client_order_id param');
                    }
                    const url = params.client_order_id ? 'client/order' : 'order';
                    const { headers, requestData } = yield (0, generateHeaders_1.generatePostHeadersAndRequestData)('DELETE', '/v1/order', params, this.config.orderlyKeyPrivate, this.accountId, this.config.orderlyKey, this.config.tradingSecret, this.config.tradingPublic, true);
                    console.log(requestData);
                    const { data: response } = yield this.instance.delete(url, {
                        params: requestData,
                        headers: headers,
                    });
                    return response.data;
                }
                catch (error) {
                    if (error instanceof axios_1.AxiosError) {
                        const err = error;
                        if (err.response) {
                            const { data } = err.response;
                            this.logger.error(`Cancel order failed: ${data.message}`);
                            throw new Error(JSON.stringify({
                                code: data.code,
                                message: data.message,
                            }));
                        }
                        this.logger.error(err.toJSON(), 'Cancel order failed');
                    }
                    else {
                        this.logger.error(error.message, 'Cancel order failed');
                    }
                    throw error;
                }
            }),
            cancelBatch: (params) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { headers, requestData } = yield (0, generateHeaders_1.generatePostHeadersAndRequestData)('DELETE', '/v1/order', params, this.config.orderlyKeyPrivate, this.accountId, this.config.orderlyKey, this.config.tradingSecret, this.config.tradingPublic, true);
                    const { data: response } = yield this.instance.delete('orders', {
                        params: requestData,
                        headers,
                    });
                    return response.data;
                }
                catch (error) {
                    if (error instanceof axios_1.AxiosError) {
                        const err = error;
                        if (err.response) {
                            const { data } = err.response;
                            this.logger.error(`Cancel orders failed: ${data.message}`);
                            throw new Error(JSON.stringify({
                                code: data.code,
                                message: data.message,
                            }));
                        }
                        this.logger.error(err.toJSON(), 'Cancel orders failed');
                    }
                    else {
                        this.logger.error(error.message, 'Cancel orders failed');
                    }
                    throw error;
                }
            }),
            getOrder: (params) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if (!params.order_id && !params.client_order_id) {
                        throw new Error('You need to pass either order_id or client_order_id param');
                    }
                    const url = params.client_order_id ? `client/order/${params.client_order_id}` : `order/${params.order_id}`;
                    const headers = yield (0, generateHeaders_1.generateGetHeaders)('GET', `/v1/order/${params.order_id ? params.order_id : params.client_order_id}`, null, this.config.orderlyKeyPrivate, this.accountId, this.config.orderlyKey);
                    const { data: response } = yield this.instance.get(url, {
                        headers,
                    });
                    return response.data;
                }
                catch (error) {
                    if (error instanceof axios_1.AxiosError) {
                        const err = error;
                        if (err.response) {
                            const { data } = err.response;
                            this.logger.error(`Get order failed: ${data.message}`);
                            throw new Error(JSON.stringify({
                                code: data.code,
                                message: data.message,
                            }));
                        }
                        this.logger.error(err.toJSON(), 'Get order failed');
                    }
                    else {
                        this.logger.error(error.message, 'Get order failed');
                    }
                    throw error;
                }
            }),
            getOrders: (params) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const headers = yield (0, generateHeaders_1.generateGetHeaders)('GET', '/v1/orders', params, this.config.orderlyKeyPrivate, this.accountId, this.config.orderlyKey, true);
                    const { data: response } = yield this.instance.get('/orders', {
                        params,
                        headers: headers,
                    });
                    return response.data.rows;
                }
                catch (error) {
                    if (error instanceof axios_1.AxiosError) {
                        const err = error;
                        if (err.response) {
                            const { data } = err.response;
                            this.logger.error(`Get orders failed: ${data.message}`);
                            throw new Error(JSON.stringify({
                                code: data.code,
                                message: data.message,
                            }));
                        }
                        this.logger.error(err.toJSON(), 'Get orders failed');
                    }
                    else {
                        this.logger.error(error.message, 'Get orders failed');
                    }
                    throw error;
                }
            }),
            getOrderbook: (symbol, maxLevel = 100) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const headers = yield (0, generateHeaders_1.generateGetHeaders)('GET', `/v1/orderbook/${symbol}`, { max_level: maxLevel }, this.config.orderlyKeyPrivate, this.accountId, this.config.orderlyKey, true);
                    const { data: response } = yield this.instance.get(`orderbook/${symbol}`, {
                        params: {
                            max_level: maxLevel,
                        },
                        headers,
                    });
                    return response.data;
                }
                catch (error) {
                    if (error instanceof axios_1.AxiosError) {
                        const err = error;
                        if (err.response) {
                            const { data } = err.response;
                            this.logger.error(`Get orderbook failed: ${data.message}`);
                            throw new Error(JSON.stringify({
                                code: data.code,
                                message: data.message,
                            }));
                        }
                        this.logger.error(err.toJSON(), 'Get orderbook failed');
                    }
                    else {
                        this.logger.error(error.message, 'Get orderbook failed');
                    }
                    throw error;
                }
            }),
        };
    }
}
exports.OrdersClient = OrdersClient;
