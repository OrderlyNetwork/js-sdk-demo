import * as React from 'react';
import React__default from 'react';
import * as react_jsx_runtime from 'react/jsx-runtime';
import { DataFilterItem } from '@orderly.network/ui';

declare global {
    interface Window {
        __ORDERLY_VERSION__?: {
            [key: string]: string;
        };
    }
}
declare const _default: "3.2.1";

declare const PredictionPage: React__default.FC;

declare const PredictionWidget: React__default.FC;

type PredictionOrderPolicy = "gtc" | "postOnly" | "ioc" | "fok";

type PredictionOutcome = "up" | "down";
type PredictionOrderSide = "buy" | "sell";
type PredictionOrderType = "market" | "limit";
type PredictionAmountUnit = "quote" | "outcome";
type PredictionRoundPhase = "trading" | "closingSoon" | "closed" | "resolving" | "resolvedUp" | "resolvedDown" | "void";
type PredictionDataTab = "openOrders" | "predictions" | "assets" | "orderHistory" | "filled" | "predictionHistory";
type PredictionPrototypeAuthState = "real" | "disconnected" | "connected" | "accountReady" | "funded";
type PredictionPrototypeRegionState = "real" | "allowed" | "restricted";
type PredictionNotification = {
    id: number;
    message: string;
    tone: "success" | "danger";
};
type PredictionPosition = {
    outcome: PredictionOutcome;
    quantity: number;
    averagePrice: number;
};
type PredictionOpenOrder = {
    policy?: PredictionOrderPolicy;
    id: number;
    outcome: PredictionOutcome;
    side: PredictionOrderSide;
    type: PredictionOrderType;
    price: number;
    quantity: number;
    round: number;
    timestamp: number;
};
type PredictionTrade = PredictionOpenOrder & {
    status: "filled" | "cancelled";
};
type PredictionSettlement = {
    id: number;
    round: number;
    outcome: PredictionOutcome;
    quantity: number;
    averagePrice: number;
    settlementPrice: number;
    result?: PredictionOutcome | "closed";
    payout: number;
    pnl: number;
    settledAt: number;
};
type PredictionMockPerpPosition = {
    symbol: string;
    side: "long" | "short";
    quantity: number;
    averagePrice: number;
    markPrice: number;
    pnl: number;
    leverage: number;
    liquidationPrice: number;
    margin: number;
};
type PredictionMockTransaction = {
    id: number;
    timestamp: number;
    type: "deposit" | "withdraw" | "settlement";
    asset: string;
    amount: number;
    status: "completed" | "pending";
};
type PredictionChartPoint = {
    price: number;
    timestamp: number;
};
type PredictionOrderBookLevel = {
    price: number;
    quantity: number;
};
declare const usePredictionScript: (regionRestricted?: boolean, active?: boolean) => {
    round: number;
    countdown: number;
    roundPhase: PredictionRoundPhase;
    selectedRound: number;
    selectMarketRound: (nextRound: number) => void;
    roundView: string;
    setRoundView: (view: "past" | "live" | "future") => void;
    setRoundPhase: (phase: PredictionRoundPhase) => void;
    goToLiveRound: () => void;
    isRoundTradable: boolean;
    openingPrice: number;
    currentPrice: number;
    priceHistory: PredictionChartPoint[];
    upChance: number;
    outcomePrices: {
        up: number;
        down: number;
    };
    selectedOutcome: PredictionOutcome;
    setSelectedOutcome: (outcome: PredictionOutcome) => void;
    orderSide: PredictionOrderSide;
    setOrderSide: React.Dispatch<React.SetStateAction<PredictionOrderSide>>;
    orderType: PredictionOrderType;
    setOrderType: (type: PredictionOrderType) => void;
    amountUnit: PredictionAmountUnit;
    setAmountUnit: (unit: PredictionAmountUnit) => void;
    amount: string;
    setAmount: (value: string) => void;
    limitPrice: string;
    setLimitPrice: React.Dispatch<React.SetStateAction<string>>;
    balance: number;
    positions: PredictionPosition[];
    openOrders: PredictionOpenOrder[];
    history: PredictionTrade[];
    settlements: PredictionSettlement[];
    mockPerpPositions: PredictionMockPerpPosition[];
    closeMockPerpPosition: (symbol: string) => void;
    reverseMockPerpPosition: (symbol: string) => void;
    triggerMockAssetAction: (action: "convert" | "transfer") => void;
    mockTransactions: PredictionMockTransaction[];
    prototypeAuthState: any;
    setPrototypeAuthState: (value: PredictionPrototypeAuthState) => void;
    prototypeRegionState: any;
    isRegionRestricted: boolean;
    setPrototypeRegionState: (value: PredictionPrototypeRegionState) => void;
    activeTab: PredictionDataTab;
    setActiveTab: React.Dispatch<React.SetStateAction<PredictionDataTab>>;
    orderBook: {
        asks: PredictionOrderBookLevel[];
        bids: PredictionOrderBookLevel[];
    };
    estimateOrderSlippage: (side: PredictionOrderSide, quantity: number, outcome?: PredictionOutcome) => number | null;
    slippage: any;
    setSlippage: (value: string) => void;
    estimatedSlippage: number | null;
    isSlippageExceeded: boolean;
    selectedPrice: number;
    selectedPosition: PredictionPosition | undefined;
    estimatedContracts: number;
    estimatedPayout: number;
    estimatedProfit: number;
    odds: number;
    orderQuantity: number;
    orderNotional: number;
    maxAmount: number;
    maxQuoteAmount: number;
    maxOutcomeAmount: number;
    orderPercentage: number;
    canPlaceOrder: boolean;
    notification: PredictionNotification | undefined;
    clearNotification: () => void;
    placeOrder: () => void;
    availableQuantity: (outcome: PredictionOutcome, excludeId?: number) => number;
    sellPosition: (outcome: PredictionOutcome, quantity: number, type: PredictionOrderType, limit: number) => boolean;
    editPendingOrder: (id: number, price: number, quantity: number) => boolean;
    cancelOrder: (id: number) => void;
    cancelAllOrders: () => void;
    setMaxAmount: () => void;
    setOrderPercentage: (percentage: number) => void;
    settleRound: () => void;
};
type PredictionState = ReturnType<typeof usePredictionScript>;

declare const useSharedPredictionState: (active?: boolean) => {
    round: number;
    countdown: number;
    roundPhase: PredictionRoundPhase;
    selectedRound: number;
    selectMarketRound: (nextRound: number) => void;
    roundView: string;
    setRoundView: (view: "past" | "live" | "future") => void;
    setRoundPhase: (phase: PredictionRoundPhase) => void;
    goToLiveRound: () => void;
    isRoundTradable: boolean;
    openingPrice: number;
    currentPrice: number;
    priceHistory: PredictionChartPoint[];
    upChance: number;
    outcomePrices: {
        up: number;
        down: number;
    };
    selectedOutcome: PredictionOutcome;
    setSelectedOutcome: (outcome: PredictionOutcome) => void;
    orderSide: PredictionOrderSide;
    setOrderSide: React__default.Dispatch<React__default.SetStateAction<PredictionOrderSide>>;
    orderType: PredictionOrderType;
    setOrderType: (type: PredictionOrderType) => void;
    amountUnit: PredictionAmountUnit;
    setAmountUnit: (unit: PredictionAmountUnit) => void;
    amount: string;
    setAmount: (value: string) => void;
    limitPrice: string;
    setLimitPrice: React__default.Dispatch<React__default.SetStateAction<string>>;
    balance: number;
    positions: PredictionPosition[];
    openOrders: PredictionOpenOrder[];
    history: PredictionTrade[];
    settlements: PredictionSettlement[];
    mockPerpPositions: PredictionMockPerpPosition[];
    closeMockPerpPosition: (symbol: string) => void;
    reverseMockPerpPosition: (symbol: string) => void;
    triggerMockAssetAction: (action: "convert" | "transfer") => void;
    mockTransactions: PredictionMockTransaction[];
    prototypeAuthState: any;
    setPrototypeAuthState: (value: PredictionPrototypeAuthState) => void;
    prototypeRegionState: any;
    isRegionRestricted: boolean;
    setPrototypeRegionState: (value: PredictionPrototypeRegionState) => void;
    activeTab: PredictionDataTab;
    setActiveTab: React__default.Dispatch<React__default.SetStateAction<PredictionDataTab>>;
    orderBook: {
        asks: PredictionOrderBookLevel[];
        bids: PredictionOrderBookLevel[];
    };
    estimateOrderSlippage: (side: PredictionOrderSide, quantity: number, outcome?: PredictionOutcome) => number | null;
    slippage: any;
    setSlippage: (value: string) => void;
    estimatedSlippage: number | null;
    isSlippageExceeded: boolean;
    selectedPrice: number;
    selectedPosition: PredictionPosition | undefined;
    estimatedContracts: number;
    estimatedPayout: number;
    estimatedProfit: number;
    odds: number;
    orderQuantity: number;
    orderNotional: number;
    maxAmount: number;
    maxQuoteAmount: number;
    maxOutcomeAmount: number;
    orderPercentage: number;
    canPlaceOrder: boolean;
    notification: PredictionNotification | undefined;
    clearNotification: () => void;
    placeOrder: () => void;
    availableQuantity: (outcome: PredictionOutcome, excludeId?: number) => number;
    sellPosition: (outcome: PredictionOutcome, quantity: number, type: PredictionOrderType, limit: number) => boolean;
    editPendingOrder: (id: number, price: number, quantity: number) => boolean;
    cancelOrder: (id: number) => void;
    cancelAllOrders: () => void;
    setMaxAmount: () => void;
    setOrderPercentage: (percentage: number) => void;
    settleRound: () => void;
} | null;
/** Keeps prototype orders and positions alive across trading and portfolio routes. */
declare const PredictionProvider: React__default.FC<React__default.PropsWithChildren>;

type ProductDataType = "positions" | "positionHistory";
type ProductType = "perps" | "prediction";
type SharedProductDataPanelProps = {
    state: PredictionState;
    type: ProductDataType;
    /** The product shown when this panel first opens on a page. */
    initialProduct: ProductType;
    perpsSymbol?: string;
    /** Content rendered before the Perps / Prediction control, such as account filters. */
    beforeProductSelector?: React__default.ReactNode;
    perpsPositionsContent?: React__default.ReactNode;
    perpsPositionHistoryContent?: React__default.ReactNode;
    onProductChange?: (product: ProductType) => void;
};
/**
 * Lets either trading surface inspect Perps and Prediction data without
 * combining their different columns or filters into one table.
 */
declare const SharedProductDataPanel: React__default.FC<SharedProductDataPanelProps>;
declare const PredictionOrderCell: ({ state, order, field, }: {
    state: PredictionState;
    order: PredictionState["openOrders"][number] & {
        status?: "filled" | "cancelled";
    };
    field: string;
}) => string | react_jsx_runtime.JSX.Element | null;
declare const PredictionOrdersTable: ({ state, mode, status, leadingFilterItems, onLeadingFilter, }: {
    state: PredictionState;
    mode: "pending" | "filled" | "history";
    status?: "cancelled" | "unsupported";
    leadingFilterItems?: DataFilterItem[];
    onLeadingFilter?: (filter: {
        name: string;
        value: unknown;
    }) => void;
}) => react_jsx_runtime.JSX.Element;
type ProductOrderMode = "pending" | "filled" | "history";
declare const SharedProductOrdersPanel: React__default.FC<{
    state: PredictionState;
    mode: ProductOrderMode;
}>;

declare const PredictionPlayground: React__default.FC<Pick<PredictionState, "roundPhase" | "setRoundPhase" | "roundView" | "setRoundView" | "prototypeAuthState" | "setPrototypeAuthState" | "prototypeRegionState" | "setPrototypeRegionState">>;

/**
 * Portfolio and trading-page prediction tables intentionally share one state
 * source so their records, statuses, and actions cannot drift apart.
 */
declare const usePredictionPortfolioScript: (regionRestricted?: boolean, active?: boolean) => {
    round: number;
    countdown: number;
    roundPhase: PredictionRoundPhase;
    selectedRound: number;
    selectMarketRound: (nextRound: number) => void;
    roundView: string;
    setRoundView: (view: "past" | "live" | "future") => void;
    setRoundPhase: (phase: PredictionRoundPhase) => void;
    goToLiveRound: () => void;
    isRoundTradable: boolean;
    openingPrice: number;
    currentPrice: number;
    priceHistory: PredictionChartPoint[];
    upChance: number;
    outcomePrices: {
        up: number;
        down: number;
    };
    selectedOutcome: PredictionOutcome;
    setSelectedOutcome: (outcome: PredictionOutcome) => void;
    orderSide: PredictionOrderSide;
    setOrderSide: React.Dispatch<React.SetStateAction<PredictionOrderSide>>;
    orderType: PredictionOrderType;
    setOrderType: (type: PredictionOrderType) => void;
    amountUnit: PredictionAmountUnit;
    setAmountUnit: (unit: PredictionAmountUnit) => void;
    amount: string;
    setAmount: (value: string) => void;
    limitPrice: string;
    setLimitPrice: React.Dispatch<React.SetStateAction<string>>;
    balance: number;
    positions: PredictionPosition[];
    openOrders: PredictionOpenOrder[];
    history: PredictionTrade[];
    settlements: PredictionSettlement[];
    mockPerpPositions: PredictionMockPerpPosition[];
    closeMockPerpPosition: (symbol: string) => void;
    reverseMockPerpPosition: (symbol: string) => void;
    triggerMockAssetAction: (action: "convert" | "transfer") => void;
    mockTransactions: PredictionMockTransaction[];
    prototypeAuthState: any;
    setPrototypeAuthState: (value: PredictionPrototypeAuthState) => void;
    prototypeRegionState: any;
    isRegionRestricted: boolean;
    setPrototypeRegionState: (value: PredictionPrototypeRegionState) => void;
    activeTab: PredictionDataTab;
    setActiveTab: React.Dispatch<React.SetStateAction<PredictionDataTab>>;
    orderBook: {
        asks: PredictionOrderBookLevel[];
        bids: PredictionOrderBookLevel[];
    };
    estimateOrderSlippage: (side: PredictionOrderSide, quantity: number, outcome?: PredictionOutcome) => number | null;
    slippage: any;
    setSlippage: (value: string) => void;
    estimatedSlippage: number | null;
    isSlippageExceeded: boolean;
    selectedPrice: number;
    selectedPosition: PredictionPosition | undefined;
    estimatedContracts: number;
    estimatedPayout: number;
    estimatedProfit: number;
    odds: number;
    orderQuantity: number;
    orderNotional: number;
    maxAmount: number;
    maxQuoteAmount: number;
    maxOutcomeAmount: number;
    orderPercentage: number;
    canPlaceOrder: boolean;
    notification: PredictionNotification | undefined;
    clearNotification: () => void;
    placeOrder: () => void;
    availableQuantity: (outcome: PredictionOutcome, excludeId?: number) => number;
    sellPosition: (outcome: PredictionOutcome, quantity: number, type: PredictionOrderType, limit: number) => boolean;
    editPendingOrder: (id: number, price: number, quantity: number) => boolean;
    cancelOrder: (id: number) => void;
    cancelAllOrders: () => void;
    setMaxAmount: () => void;
    setOrderPercentage: (percentage: number) => void;
    settleRound: () => void;
};
type PredictionPortfolioState = ReturnType<typeof usePredictionPortfolioScript>;

declare const PredictionPortfolio: React__default.FC<PredictionPortfolioState>;

declare const PredictionPortfolioWidget: React__default.FC;

declare const index_PredictionPortfolio: typeof PredictionPortfolio;
type index_PredictionPortfolioState = PredictionPortfolioState;
declare const index_PredictionPortfolioWidget: typeof PredictionPortfolioWidget;
declare const index_usePredictionPortfolioScript: typeof usePredictionPortfolioScript;
declare namespace index {
  export { index_PredictionPortfolio as PredictionPortfolio, type index_PredictionPortfolioState as PredictionPortfolioState, index_PredictionPortfolioWidget as PredictionPortfolioWidget, index_usePredictionPortfolioScript as usePredictionPortfolioScript };
}

export { PredictionOrderCell, type PredictionOrderSide, type PredictionOrderType, PredictionOrdersTable, type PredictionOutcome, PredictionPage, PredictionPlayground, index as PredictionPortfolioModule, type PredictionPrototypeAuthState, type PredictionPrototypeRegionState, PredictionProvider, PredictionWidget, SharedProductDataPanel, SharedProductOrdersPanel, useSharedPredictionState, _default as version };
