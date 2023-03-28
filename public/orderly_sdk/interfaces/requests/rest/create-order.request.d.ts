import { OrderSide, OrderType } from '../../../enums';
import { ValidationResponse } from '../../utils';
/**
 * Create Order request parameters
 *
 * @link https://docs-api.orderly.network/#create-order
 */
export interface CreateOrderRequest {
    symbol: string;
    client_order_id?: string;
    order_type: keyof typeof OrderType;
    /**
     * If order_type is MARKET, then is not required, otherwise this parameter is required.
     */
    order_price?: number;
    /**
     * For MARKET/ASK/BID order, if order_amount is given, it is not required
     */
    order_quantity?: number | string;
    /**
     * For MARKET/ASK/BID order, the order size in terms of quote currency
     */
    order_amount?: number;
    /**
     * The order quantity shown on orderbook. (default: equal to order_quantity)
     */
    visible_quantity?: number;
    side: keyof typeof OrderSide;
}
export declare const validateCreateOrderRequest: (params: CreateOrderRequest) => ValidationResponse;
