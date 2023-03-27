import { Order } from '../../entities';
import { AuthorizedConfigurationOptions } from '../../interfaces/configuration';
import { CancelOrderRequest, CancelOrdersRequest, CreateBatchOrderRequest, CreateOrderRequest, GetOrderRequest, GetOrdersRequest } from '../../interfaces/requests';
import { CreateOrderData, OrderbookData } from '../../interfaces/responses';
import { GenericClient } from '../../interfaces/utils';
export type OrdersType = {
    /**
     * Place order maker/taker, the order executed information will be update from websocket stream.
     * Will response immediately with an order created message.
     *
     * @link https://docs-api.orderly.network/#create-order
     */
    create: (params: CreateOrderRequest) => Promise<CreateOrderData>;
    /**
     * Create multiple orders at once
     *
     * @link https://docs-api.orderly.network/#batch-create-order
     */
    createBatch: (params: CreateBatchOrderRequest) => Promise<CreateOrderData[]>;
    /**
     * Cancel order
     *
     * @link https://docs-api.orderly.network/#cancel-order
     * @link https://docs-api.orderly.network/#cancel-order-by-client_order_id
     */
    cancel: (params: CancelOrderRequest) => Promise<{
        status: string;
    }>;
    /**
     * Cancel all orders based on symbol
     *
     * @link https://docs-api.orderly.network/#cancel-orders
     */
    cancelBatch: (params: CancelOrdersRequest) => Promise<{
        status: string;
    }>;
    /**
     * Get order
     *
     * @link https://docs-api.orderly.network/#get-order
     * @link https://docs-api.orderly.network/#get-order-by-client_order_id
     */
    getOrder: (params: GetOrderRequest) => Promise<Order>;
    /**
     * Get orders
     *
     * @link https://docs-api.orderly.network/#get-orders
     */
    getOrders: (params: GetOrdersRequest) => Promise<Order[]>;
    /**
     * Get orderbook
     * Snapshot of current orderbook. Price of asks/bids are in descending order.
     *
     * @link https://docs-api.orderly.network/#orderbook-snapshot
     */
    getOrderbook: (symbol: string, maxLevel?: number) => Promise<OrderbookData>;
};
export declare class OrdersClient extends GenericClient {
    private config;
    private accountId;
    private instance;
    constructor(config: AuthorizedConfigurationOptions, accountId: string, debug?: boolean);
    get orders(): OrdersType;
}
