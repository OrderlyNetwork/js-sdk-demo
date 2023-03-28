import { FeeInformation, SymbolOrderRules, TradeInformation } from '../../entities';
import { RestConfigurationOptions } from '../../interfaces/configuration';
import { GenericClient } from '../../interfaces/utils';
export type PublicType = {
    /**
     * This endpoint provides all the values for the rules that an order need to fulfil in order for it to be placed successfully.
     *
     * @link https://docs-api.orderly.network/#exchange-information
     */
    getSymbolOrderRules: (symbol: string) => Promise<SymbolOrderRules | undefined>;
    /**
     * Get available symbols that Orderly Network supports, and also send order rules for each symbol.
     *
     * @link https://docs-api.orderly.network/#available-symbols-public
     */
    getAvailableSymbols: () => Promise<SymbolOrderRules[] | undefined>;
    /**
     * Get the latest Orderly Network fee structure.
     *
     * @link https://docs-api.orderly.network/#fee-information-public
     */
    getFeeInformation: () => Promise<FeeInformation[] | undefined>;
    /**
     * Get latest market trades.
     *
     * @link https://docs-api.orderly.network/#market-trades-public
     */
    getMarketTrades: (symbol: string, limit?: number) => Promise<TradeInformation[] | undefined>;
};
export declare class PublicClient extends GenericClient {
    private config;
    private instance;
    constructor(config: RestConfigurationOptions, debug?: boolean);
    get public(): PublicType;
}
