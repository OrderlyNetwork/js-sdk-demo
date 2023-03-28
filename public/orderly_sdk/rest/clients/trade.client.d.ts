import { Kline, OrderTrade } from '../../entities';
import { AuthorizedConfigurationOptions } from '../../interfaces/configuration';
import { GetKlineRequest, GetTradesRequest } from '../../interfaces/requests';
import { GenericClient } from '../../interfaces/utils';
export type TradeType = {
    /**
     * The latest klines of the trading pairs.
     *
     * @link https://docs-api.orderly.network/#kline
     */
    getKline: (params: GetKlineRequest) => Promise<Kline[]>;
    /**
     * Get specific order trades by order_id.
     *
     * @link https://docs-api.orderly.network/#get-all-trades-of-specific-order
     */
    getOrderTrades: (orderId: number) => Promise<OrderTrade[]>;
    /**
     * Return client’s trades history in a range of time.
     *
     * @link https://docs-api.orderly.network/#get-trades
     */
    getTrades: (params: GetTradesRequest) => Promise<OrderTrade[]>;
    /**
     * Get specific transaction detail by trade id.
     *
     * @link https://docs-api.orderly.network/#get-trade
     */
    getTrade: (tradeId: number) => Promise<OrderTrade>;
};
export declare class TradeClient extends GenericClient {
    private config;
    private accountId;
    private instance;
    constructor(config: AuthorizedConfigurationOptions, accountId: string, debug?: boolean);
    get trade(): TradeType;
}
