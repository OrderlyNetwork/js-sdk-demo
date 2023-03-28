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
const rest_1 = require("../rest");
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    const sdkOptions = {
        networkId: 'testnet',
        accountId: "bf6eb263984c964a0cda3e9a35aa486268eea085d9b90fe792c8f9ad7e129a2c",
        publicKey: "ed25519:HV9PiTjDqBJxH3wEkn16xJoMUKomXRehpczcEUwZ93Uw",
        orderlyKeyPrivate: "ed25519:5hu2yhvaiKoGGRMeoJRNYYVMSiZQtTjBYgVE1Lobb9s2CtcJps4zwoKncQwx8KRmY2b3SY4KGp7rWPz364qU1zXV",
        tradingPublic: "0410ba26c994a842953656a9436f064dd5db3b5e1806de09489f976a08a2265b3c348fed607296b8aa2bcc040ae0142273db414e7f2bced88c4eaf8faaa89de82f",
        tradingSecret: "39a144ac07aaf6b951afcc5d2036fcdba5521679367554797fe918671c4d78d9",
    };
    // const assetManager = new AssetManagerClient(sdkOptions);
    // await assetManager.connect();
    const request = {
        symbol: 'SPOT_NEAR_USDC',
        order_type: 'LIMIT',
        side: 'BUY',
        order_price: 1.25,
        order_quantity: 2.00000000
    };
    // const requestGetorders: GetOrdersRequest = {
    //   symbol: 'SPOT_NEAR_USDC',
    // };
    const rest = new rest_1.RestClient(sdkOptions);
    // const availableSembols = await rest.public.getAvailableSymbols()
    // console.log(availableSembols)
    // const symbolOrderRules = await rest.public.getSymbolOrderRules(availableSembols[1].symbol)
    // console.log(symbolOrderRules)
    // const feeInformation = await rest.public.getFeeInformation()
    // console.log(feeInformation)
    // const marketTrades = await rest.public.getMarketTrades(availableSembols[1].symbol)
    // console.log(marketTrades)
    let createOrderRes = yield rest.orders.create(request);
    console.log(createOrderRes);
    // const createOrderBatchData: CreateOrderRequest[] = [
    //   {
    //     symbol: 'SPOT_NEAR_USDC',
    //     order_type: 'LIMIT',
    //     side: 'BUY',
    //     order_price: 1.11,
    //     order_quantity: 2.00000000
    //   },
    //   {
    //     symbol: 'SPOT_NEAR_USDC',
    //     order_type: 'LIMIT',
    //     side: 'BUY',
    //     order_price: 1.12,
    //     order_quantity: 2.00000000
    //   }
    // ]
    // const createOrderBatch = await rest.orders.createBatch({orders: createOrderBatchData})
    // console.log(createOrderBatch)
    // const cancleOrderData = {
    //   symbol: createOrderBatchData[0].symbol,
    //   order_id: createOrderBatch[0].order_id,
    // }
    // const cancleOrder = await rest.orders.cancel(cancleOrderData)
    // console.log(cancleOrder)
    // const getOrderBody = {
    //   order_id: createOrderBatch[0].order_id,
    // }
    // const getOrder = await rest.orders.getOrder(getOrderBody);
    // console.log(getOrder)
    // const getOrderbook = await rest.orders.getOrderbook('SPOT_NEAR_USDC', 10)
    // console.log(getOrderbook)
    // const getKlineData: GetKlineRequest = {
    //   symbol: 'SPOT_NEAR_USDC',
    //   type: '1h',
    //   limit: 100
    // }
    // const getKline = await rest.trade.getKline(getKlineData)
    // console.log(getKline)
    // const getOrders = await rest.orders.getOrders({});
    // const getOrderTrades = await rest.trade.getOrderTrades(getOrders[0].order_id)
    // console.log(getOrderTrades)
    // const getTradesData: GetTradesRequest = {
    //   symbol: 'SPOT_NEAR_USDC'
    // }
    // const getTrades = await rest.trade.getTrades(getTradesData)
    // console.log(getTrades)
    // const tradeId = 414229
    // const getTrade = await rest.trade.getTrade(tradeId);
    // console.log(getTrade)
    // const getHoldings = await rest.account.getCurrentHolding(true)
    // console.log(getHoldings)
    // const getInformation = await rest.account.getInformation()
    // console.log(getInformation)
    // const getAssetHistoryData: GetAssetHistoryRequest = {
    //   side: 'DEPOSIT'
    // }
    // const getAssetHistory = await rest.account.getAssetHistory(getAssetHistoryData)
    // console.log(getAssetHistory)
    // const usdcClient = new FungibleTokenClient('usdc.orderly.testnet', sdkOptions);
    // await usdcClient.connect();
    //a Succeeded
    //console.log(await usdcClient.const assetManager = new AssetManagerClient(sdkOptions);
    // await assetManager.connect();deposit({ amount: '1000000', receiver_id: 'asset-manager.orderly.testnet', msg: 'Test deposit' }));
    //b видає помилку на метод withdraw
    //console.log(await assetManager.withdraw({ token: 'usdc.orderly.testnet', amount: '1'}));
    //c Succeeded
    // console.log(assetManager.isTokenListed('usdc.orderly.testnet'));
    //d що потрібно прописувати в pair?
    //console.log(assetManager.isSymbolPairListed('usdc.orderly.testnet'));
    //e уточнити, як працює цейф метод і для чого він. Зараз викликає метод get_user_trading_key
    //  console.log(await assetManager.getPossibleTokens());
});
run();
// import {RestClient} from 'orderly-sdk/src/rest';
// import { OrdersClient } from 'orderly-sdk/src/rest/clients/orders.client';
// import { AuthorizedConfigurationOptions } from 'orderly-sdk/src/interfaces/configuration';
// import {RestAPIUrl, RestApiVersion} from 'orderly-sdk/src/enums';
// import {CreateOrderRequest} from '../sdk/src/interfaces/requests';
// import {GenericSmartContractClient} from '../sdk/src/interfaces/utils';
// import { SDKConfigurationOptions } from 'orderly-sdk/lib/interfaces/configuration';
//
// const run = async () => {
//
//   const sdkOptions: SDKConfigurationOptions = {
//     networkId: 'testnet',
//     accountId: 'ychuikov',
//     publicKey: 'ed25519:GRcfivK7V7S4qAeg9wCy5y9MD4yYNEWr5BmNEYNoo26Z',
//     secretKey: 'ed25519:66N7Y4UV33rZmHT6g3CAenRRw9THhEXP4okJXrox2LjeP8beRG58N4VnwbNuftuu6gYhdiXtaT7DfSLoXGWv49cZ',
//   }
//
//   const restClient = new RestClient(sdkOptions);
//
//   const sdkOptionsAuth: AuthorizedConfigurationOptions = {
//     orderlyKey: 'ed25519:GRcfivK7V7S4qAeg9wCy5y9MD4yYNEWr5BmNEYNoo26Z',
//     orderlySecret: 'ed25519:66N7Y4UV33rZmHT6g3CAenRRw9THhEXP4okJXrox2LjeP8beRG58N4VnwbNuftuu6gYhdiXtaT7DfSLoXGWv49cZ',
//     apiUrl: RestAPIUrl.testnet,
//     apiVersion: RestApiVersion.v1,
//   }
//
//   const request: CreateOrderRequest = {
//     symbol: 'SPOT_NEAR_USDC',
//     order_type: 'LIMIT',
//     visible_quantity: 11,
//     side: 'BUY',
//     order_price: 33
//   }
//   await restClient.orders.create(request);
//
//   const ordersClient = new OrdersClient(sdkOptionsAuth, sdkOptions.accountId, false);
//   // Test Create order endpoint
//   await ordersClient.orders.create(request);
//
//   // const usdcClient = new FungibleTokenClient('usdc.orderly.testnet', sdkOptions);
//   // await usdcClient.connect();
//
//
//
//   //a Succeeded
//   //console.log(await usdcClient.deposit({ amount: '1000000', receiver_id: 'asset-manager.orderly.testnet', msg: 'Test deposit' }));
//
//  //b видає помилку на метод withdraw
//  //console.log(await assetManager.withdraw({ token: 'usdc.orderly.testnet', amount: '1'}));
//
//  //c Succeeded
// // console.log(assetManager.isTokenListed('usdc.orderly.testnet'));
//
//  //d що потрібно прописувати в pair?
//  //console.log(assetManager.isSymbolPairListed('usdc.orderly.testnet'));
//
//  //e уточнити, як працює цейф метод і для чого він. Зараз викликає метод get_user_trading_key
// // console.log(assetManager.getPossibleTokens);
//
// }
//
// run();
//
//
//
// import {AssetManagerClient, RestClient,configuration} from 'orderly-sdk';
// import { OrdersClient } from 'orderly-sdk/src/rest/clients/orders.client';
// import { AuthorizedConfigurationOptions } from 'orderly-sdk/src/interfaces/configuration';
// import {RestAPIUrl, RestApiVersion} from 'orderly-sdk/src/enums';
// import {CreateOrderRequest} from '../sdk/src/interfaces/requests';
//
//
// const run = async () => {
//   const sdkOptionsAuth: configuration.AuthorizedConfigurationOptions = {
//     orderlyKey: 'ed25519:GRcfivK7V7S4qAeg9wCy5y9MD4yYNEWr5BmNEYNoo26Z',
//     orderlySecret: 'ed25519:66N7Y4UV33rZmHT6g3CAenRRw9THhEXP4okJXrox2LjeP8beRG58N4VnwbNuftuu6gYhdiXtaT7DfSLoXGWv49cZ',
//     apiUrl: RestAPIUrl.testnet,
//     apiVersion: RestApiVersion.v1
//   }
//
//   const sdkOptions: configuration.SDKConfigurationOptions = {
//     networkId: 'testnet',
//     accountId: 'ychuikov.testnet',
//     publicKey: 'ed25519:GRcfivK7V7S4qAeg9wCy5y9MD4yYNEWr5BmNEYNoo26Z',
//     secretKey: 'ed25519:66N7Y4UV33rZmHT6g3CAenRRw9THhEXP4okJXrox2LjeP8beRG58N4VnwbNuftuu6gYhdiXtaT7DfSLoXGWv49cZ',
//   }
//
//   const request: CreateOrderRequest = {
//     symbol: 'SPOT_NEAR_USDC',
//     order_type: 'LIMIT',
//     visible_quantity: 11,
//     side: 'BUY',
//     order_price: 22,
//     order_amount: 33
//   }
//
//   // const orderly = new Orderly({
//   //   networkId: 'testnet',
//   //   accountId: 'orderlytester.testnet',
//   //   publicKey: 'ed25519:6Kc4GFquT6zEgUpik5TcWsLqCprGzvfNXJe1PXtb8LX4',
//   //   secretKey: 'ed25519:27SsW8gtnRRe8gLVvao7cBCqMf14ysQVsNZxpvqcnNYVzTwoYz2HiXSxkbb9znTTDXLxwB1x5mBDM3xHVmdDi1wp',
//   // });
//   //
//   // await orderly.connect();
//
//   const assetManager = new AssetManagerClient(sdkOptions);
//   await assetManager.connect();
//
//   // await orderly.connect();
//   const rest = new RestClient(sdkOptions);
//   await rest.orders.create(request);
//   // const ordersClient = new OrdersClient(sdkOptionsAuth, sdkOptions.accountId, true);
//   //Test Create order endpoint
//   // await ordersClient.orders.create(request);
//   console.log(" const rest = new RestClient(sdkOptions);\n")
//   // const usdcClient = new FungibleTokenClient('usdc.orderly.testnet', sdkOptions);
//   // await usdcClient.connect();
//
//
//
//   //a Succeeded
//   //console.log(await usdcClient.deposit({ amount: '1000000', receiver_id: 'asset-manager.orderly.testnet', msg: 'Test deposit' }));
//
//   //b видає помилку на метод withdraw
//   //console.log(await assetManager.withdraw({ token: 'usdc.orderly.testnet', amount: '1'}));
//
//   //c Succeeded
// // console.log(assetManager.isTokenListed('usdc.orderly.testnet'));
//
//   //d що потрібно прописувати в pair?
//   //console.log(assetManager.isSymbolPairListed('usdc.orderly.testnet'));
//
//   //e уточнити, як працює цейф метод і для чого він. Зараз викликає метод get_user_trading_key
// // console.log(assetManager.getPossibleTokens);
//
// }
//
// run();
