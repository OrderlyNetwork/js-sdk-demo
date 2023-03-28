import { RestApiVersion } from '../enums';
import { SDKConfigurationOptions } from '../interfaces/configuration';
import { OrdersType } from './clients/orders.client';
import { PublicType } from './clients/public.client';
import { TradeType } from './clients/trade.client';
import { AccountType } from './clients/user.client';
export declare class RestClient {
    private sdkOptions;
    private apiVersion;
    private publicClient;
    private ordersClient;
    private tradeClient;
    private accountClient;
    constructor(sdkOptions: SDKConfigurationOptions, apiVersion?: RestApiVersion);
    get public(): PublicType;
    get orders(): OrdersType;
    get trade(): TradeType;
    get account(): AccountType;
}
