'use strict';

var reactApp = require('@orderly.network/react-app');
var trading = require('@orderly.network/trading');
var React2 = require('react');
var hooks = require('@orderly.network/hooks');
var utils = require('@orderly.network/utils');
var i18n = require('@orderly.network/i18n');
var markets = require('@orderly.network/markets');
var ui = require('@orderly.network/ui');
var jsxRuntime = require('react/jsx-runtime');
var types = require('@orderly.network/types');
var uiConnector = require('@orderly.network/ui-connector');
var uiOrderEntry = require('@orderly.network/ui-order-entry');
var uiOrders = require('@orderly.network/ui-orders');
var uiPositions = require('@orderly.network/ui-positions');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React2__default = /*#__PURE__*/_interopDefault(React2);

var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/version.ts
if (typeof window !== "undefined") {
  window.__ORDERLY_VERSION__ = window.__ORDERLY_VERSION__ || {};
  window.__ORDERLY_VERSION__["@orderly.network/prediction"] = "3.2.1";
}
var version_default = "3.2.1";
function planPredictionExecution(policy, side, price, quantity, levels) {
  return { filled: 0, cancelled: 0, pending: quantity, price };
}

// src/prediction/prediction.script.tsx
var PREDICTION_PROTOTYPE_AUTH_STORAGE_KEY = "orderly-prediction-prototype-auth-state";
var PREDICTION_PROTOTYPE_REGION_STORAGE_KEY = "orderly-prediction-prototype-region-state";
var ROUND_SECONDS = 5 * 60;
var CHART_WINDOW_MS = 65 * 1e3;
var INITIAL_BALANCE = 1e3;
var INITIAL_BTC_PRICE = 64280.4;
var INITIAL_ROUND = 1787541e3;
var clamp = (value, min, max) => Math.min(Math.max(value, min), max);
var createInitialHistory = (price) => {
  const now = Date.now();
  return Array.from({ length: 48 }, (_, index) => ({
    price: price + Math.sin(index / 4) * 42 + Math.cos(index / 7) * 19 + (index - 24) * 0.8,
    timestamp: now - (47 - index) * 1e3
  }));
};
var createBook = (midPrice) => {
  const asks = [];
  const bids = [];
  for (let index = 0; index < 7; index += 1) {
    const step = (index + 1) * 0.01;
    asks.push({
      price: clamp(midPrice + step, 1e-4, 0.9999),
      quantity: 180 + index * 73 + index * 37 % 90
    });
    bids.push({
      price: clamp(midPrice - step, 1e-4, 0.9999),
      quantity: 210 + index * 61 + index * 29 % 110
    });
  }
  return { asks: asks.reverse(), bids };
};
var estimateMarketSlippage = (side, quantity, orderBook) => {
  if (!Number.isFinite(quantity) || quantity <= 0) return null;
  const levels = (side === "buy" ? orderBook.asks : orderBook.bids).filter((level) => level.quantity > 0).sort((a, b) => side === "buy" ? a.price - b.price : b.price - a.price);
  const bestPrice = levels[0]?.price;
  if (!bestPrice) return null;
  let remaining = new utils.Decimal(quantity);
  let notional = new utils.Decimal(0);
  for (const level of levels) {
    const fill = remaining.lte(level.quantity) ? remaining : new utils.Decimal(level.quantity);
    notional = notional.add(fill.mul(level.price));
    remaining = remaining.sub(fill);
    if (remaining.lte(0)) break;
  }
  const filled = new utils.Decimal(quantity).sub(remaining);
  if (filled.lte(0)) return null;
  return notional.div(filled).sub(bestPrice).abs().div(bestPrice).toNumber();
};
var usePredictionScript = (regionRestricted = false, active = true) => {
  const [prototypeAuthState, setPrototypeAuthState] = hooks.useLocalStorage(
    PREDICTION_PROTOTYPE_AUTH_STORAGE_KEY,
    "real"
  );
  const [prototypeRegionState, setPrototypeRegionState] = hooks.useLocalStorage(
    PREDICTION_PROTOTYPE_REGION_STORAGE_KEY,
    "real"
  );
  const [round, setRound] = React2.useState(INITIAL_ROUND);
  const isRegionRestricted = regionRestricted || prototypeRegionState === "restricted";
  const [selectedRound, setSelectedRound] = React2.useState(INITIAL_ROUND);
  const roundView = selectedRound < round ? "past" : selectedRound > round ? "future" : "live";
  const [countdown, setCountdown] = React2.useState(ROUND_SECONDS - 43);
  const [roundPhase, setRoundPhase] = React2.useState("trading");
  const [openingPrice, setOpeningPrice] = React2.useState(INITIAL_BTC_PRICE);
  const [currentPrice, setCurrentPrice] = React2.useState(INITIAL_BTC_PRICE + 76.2);
  const [priceHistory, setPriceHistory] = React2.useState(
    () => createInitialHistory(INITIAL_BTC_PRICE)
  );
  const [selectedOutcome, setSelectedOutcome] = React2.useState("up");
  const [orderSide, setOrderSide] = React2.useState("buy");
  const [orderType, setOrderType] = React2.useState("market");
  const orderPolicy = "gtc";
  const [amountUnit, setAmountUnit] = React2.useState("quote");
  const [amount, setAmount] = React2.useState("100");
  const [selectedPercentage, setSelectedPercentage] = React2.useState(
    null
  );
  const [limitPrice, setLimitPrice] = React2.useState("0.5000");
  const [slippage, setSlippage] = hooks.useLocalStorage(
    "orderly-prediction-slippage",
    "1"
  );
  const [balance, setBalance] = React2.useState(INITIAL_BALANCE);
  const [positions, setPositions] = React2.useState([
    { outcome: "up", quantity: 24, averagePrice: 0.4625 },
    { outcome: "down", quantity: 8, averagePrice: 0.4175 }
  ]);
  const [openOrders, setOpenOrders] = React2.useState([
    {
      id: -1,
      outcome: "up",
      side: "buy",
      type: "limit",
      price: 0.48,
      quantity: 12,
      round: INITIAL_ROUND,
      timestamp: Date.now() - 2 * 60 * 1e3
    },
    {
      id: -2,
      outcome: "down",
      side: "sell",
      type: "limit",
      price: 0.44,
      quantity: 5,
      round: INITIAL_ROUND,
      timestamp: Date.now() - 4 * 60 * 1e3
    }
  ]);
  const [history, setHistory] = React2.useState(() => [
    {
      id: -3,
      outcome: "up",
      side: "buy",
      type: "market",
      price: 0.455,
      quantity: 20,
      round: INITIAL_ROUND - ROUND_SECONDS,
      status: "filled",
      timestamp: Date.now() - 8 * 60 * 1e3
    },
    {
      id: -4,
      outcome: "down",
      side: "buy",
      type: "limit",
      price: 0.42,
      quantity: 10,
      round: INITIAL_ROUND - ROUND_SECONDS,
      status: "cancelled",
      timestamp: Date.now() - 14 * 60 * 1e3
    }
  ]);
  const [settlements, setSettlements] = React2.useState(() => [
    {
      id: -5,
      round: INITIAL_ROUND - ROUND_SECONDS,
      outcome: "up",
      quantity: 18,
      averagePrice: 0.46,
      settlementPrice: 1,
      payout: 18,
      pnl: 9.72,
      result: "up",
      settledAt: Date.now() - 22 * 60 * 1e3
    }
  ]);
  const [mockPerpPositions, setMockPerpPositions] = React2.useState([
    {
      symbol: "PERP_ETH_USDC",
      side: "long",
      quantity: 0.35,
      averagePrice: 2462.8,
      markPrice: 2504.11,
      pnl: 14.46,
      leverage: 10,
      liquidationPrice: 2216.52,
      margin: 86.2
    },
    {
      symbol: "PERP_BTC_USDC",
      side: "short",
      quantity: 0.012,
      averagePrice: 64520.4,
      markPrice: 64358.02,
      pnl: 1.95,
      leverage: 20,
      liquidationPrice: 67746.42,
      margin: 38.71
    }
  ]);
  const mockTransactions = [
    {
      id: -6,
      timestamp: Date.now() - 35 * 60 * 1e3,
      type: "deposit",
      asset: "USDC",
      amount: 500,
      status: "completed"
    },
    {
      id: -7,
      timestamp: Date.now() - 22 * 60 * 1e3,
      type: "settlement",
      asset: "USDC",
      amount: 28.25,
      status: "completed"
    }
  ];
  const [activeTab, setActiveTab] = React2.useState("predictions");
  const [notification, setNotification] = React2.useState();
  const notificationIdRef = React2.useRef(0);
  const tickRef = React2.useRef(0);
  const nextIdRef = React2.useRef(1);
  const currentPriceRef = React2.useRef(currentPrice);
  currentPriceRef.current = currentPrice;
  const notify = React2.useCallback(
    (message, tone = "success") => {
      notificationIdRef.current += 1;
      setNotification({ id: notificationIdRef.current, message, tone });
    },
    []
  );
  const clearNotification = React2.useCallback(() => setNotification(void 0), []);
  const closeMockPerpPosition = React2.useCallback(
    (symbol) => {
      setMockPerpPositions(
        (previous) => previous.filter((position) => position.symbol !== symbol)
      );
      notify("prediction.message.positionClosed");
    },
    [notify]
  );
  const reverseMockPerpPosition = React2.useCallback(
    (symbol) => {
      setMockPerpPositions(
        (previous) => previous.map(
          (position) => position.symbol === symbol ? {
            ...position,
            side: position.side === "long" ? "short" : "long",
            pnl: -position.pnl
          } : position
        )
      );
      notify("prediction.message.positionReversed");
    },
    [notify]
  );
  const triggerMockAssetAction = React2.useCallback(
    (action) => {
      notify(
        `prediction.message.asset${action === "convert" ? "Convert" : "Transfer"}`
      );
    },
    [notify]
  );
  const upChance = React2.useMemo(() => {
    const relativeMove = (currentPrice - openingPrice) / openingPrice;
    const timePressure = 1 + (1 - countdown / ROUND_SECONDS) * 0.35;
    return clamp(50 + relativeMove * 4e3 * timePressure, 8, 92);
  }, [countdown, currentPrice, openingPrice]);
  const outcomePrices = React2.useMemo(
    () => ({
      up: upChance / 100,
      down: 1 - upChance / 100
    }),
    [upChance]
  );
  const selectedMarketPrice = outcomePrices[selectedOutcome];
  const selectedPrice = orderType === "limit" ? Number(limitPrice) || 0 : selectedMarketPrice;
  const selectedPosition = positions.find(
    (position) => position.outcome === selectedOutcome
  );
  const numericAmount = Number(amount) || 0;
  const orderQuantity = React2.useMemo(() => {
    if (amountUnit === "outcome") return numericAmount;
    if (selectedPrice <= 0) return 0;
    return new utils.Decimal(numericAmount).div(selectedPrice).toNumber();
  }, [amountUnit, numericAmount, selectedPrice]);
  const orderNotional = React2.useMemo(
    () => new utils.Decimal(orderQuantity).mul(selectedPrice).toNumber(),
    [orderQuantity, selectedPrice]
  );
  const estimatedContracts = orderQuantity;
  const estimatedPayout = estimatedContracts;
  const estimatedProfit = orderSide === "buy" ? new utils.Decimal(estimatedPayout).sub(orderNotional).toNumber() : 0;
  const odds = selectedPrice > 0 ? new utils.Decimal(1).div(selectedPrice).toNumber() : 0;
  const availableQuantity = (outcome, excludeId) => Math.max(
    0,
    new utils.Decimal(positions.find((p) => p.outcome === outcome)?.quantity ?? 0).sub(
      openOrders.filter(
        (o) => o.side === "sell" && o.outcome === outcome && o.id !== excludeId
      ).reduce((sum, o) => sum.add(o.quantity), new utils.Decimal(0))
    ).toNumber()
  );
  const selectedTokenBalance = availableQuantity(selectedOutcome);
  const maxQuoteAmount = orderSide === "buy" ? balance : new utils.Decimal(selectedTokenBalance).mul(selectedPrice).toNumber();
  const maxOutcomeAmount = orderSide === "buy" ? selectedPrice > 0 ? new utils.Decimal(balance).div(selectedPrice).toNumber() : 0 : selectedTokenBalance;
  const maxAmount = amountUnit === "quote" ? maxQuoteAmount : maxOutcomeAmount;
  const orderPercentage = maxAmount > 0 ? clamp(numericAmount / maxAmount * 100, 0, 100) : 0;
  const orderBook = React2.useMemo(
    () => createBook(selectedMarketPrice),
    [selectedMarketPrice]
  );
  const estimateOrderSlippage = React2.useCallback(
    (side, quantity, outcome = selectedOutcome) => estimateMarketSlippage(
      side,
      quantity,
      createBook(outcomePrices[outcome])
    ),
    [outcomePrices, selectedOutcome]
  );
  const estimatedSlippage = React2.useMemo(
    () => estimateOrderSlippage(orderSide, orderQuantity),
    [estimateOrderSlippage, orderQuantity, orderSide]
  );
  const isSlippageExceeded = orderType === "market" && estimatedSlippage !== null && estimatedSlippage > new utils.Decimal(slippage || 0).div(100).toNumber();
  const isRoundTradable = selectedRound >= round && (roundPhase === "trading" || roundPhase === "closingSoon");
  const canPlaceOrder = React2.useMemo(() => {
    if (!isRoundTradable || isRegionRestricted) return false;
    if (isSlippageExceeded) return false;
    if (numericAmount <= 0 || selectedPrice <= 0 || selectedPrice >= 1) {
      return false;
    }
    if (orderSide === "buy") return orderNotional <= balance;
    return orderQuantity <= selectedTokenBalance;
  }, [
    balance,
    isRegionRestricted,
    isRoundTradable,
    isSlippageExceeded,
    numericAmount,
    orderNotional,
    orderQuantity,
    orderSide,
    selectedPrice,
    selectedTokenBalance
  ]);
  React2.useEffect(() => {
    if (!active) return;
    const timer = window.setInterval(() => {
      tickRef.current += 1;
      const tick = tickRef.current;
      const delta = Math.sin(tick / 12) * 0.35 + Math.cos(tick / 23) * 0.18;
      const timestamp = Date.now();
      if (roundPhase === "trading" || roundPhase === "closingSoon" || roundPhase === "closed") {
        const next = currentPriceRef.current + delta;
        currentPriceRef.current = next;
        setCurrentPrice(next);
        setPriceHistory((points) => [
          ...points.filter(
            (point) => point.timestamp >= timestamp - CHART_WINDOW_MS
          ),
          { price: next, timestamp }
        ]);
      }
      if (roundPhase === "trading" || roundPhase === "closingSoon") {
        setCountdown((previous) => Math.max(previous - 1, 0));
      }
    }, 1e3);
    return () => window.clearInterval(timer);
  }, [active, roundPhase]);
  React2.useEffect(() => {
    if (roundPhase !== "trading" && roundPhase !== "closingSoon") return;
    if (countdown <= 0) {
      if (selectedRound > round) {
        setRound((previousRound) => previousRound + ROUND_SECONDS);
        setCountdown(ROUND_SECONDS);
        return;
      }
      setRoundPhase("closed");
      return;
    }
    if (countdown <= 30 && roundPhase === "trading" && selectedRound === round) {
      setRoundPhase("closingSoon");
    }
  }, [countdown, roundPhase, selectedRound, round]);
  const selectRoundPhase = React2.useCallback(
    (phase) => {
      setRoundPhase(phase);
      setNotification(void 0);
      if (phase === "trading") setCountdown(180);
      if (phase === "closingSoon") setCountdown(20);
      if (phase === "closed" || phase === "resolving") setCountdown(0);
      if (phase === "resolvedUp" || phase === "resolvedDown") {
        const nextPrice = phase === "resolvedUp" ? openingPrice + 48 : openingPrice - 48;
        setCurrentPrice(nextPrice);
        setPriceHistory((points) => [
          ...points,
          { price: nextPrice, timestamp: Date.now() }
        ]);
      }
    },
    [openingPrice]
  );
  const goToLiveRound = React2.useCallback(() => {
    setOpeningPrice(currentPrice);
    setRound((previous) => previous + ROUND_SECONDS);
    setSelectedRound(round + ROUND_SECONDS);
    setCountdown(ROUND_SECONDS);
    setRoundPhase("trading");
    setPriceHistory(createInitialHistory(currentPrice));
    setNotification(void 0);
  }, [currentPrice, round]);
  const selectMarketRound = (nextRound) => {
    setSelectedRound(nextRound);
    setRoundPhase(nextRound < round ? "resolvedUp" : "trading");
    setNotification(void 0);
    setCountdown(ROUND_SECONDS - 43);
  };
  const setRoundView = (view) => {
    selectMarketRound(
      round + (view === "past" ? -ROUND_SECONDS : view === "future" ? ROUND_SECONDS : 0)
    );
  };
  const selectOutcome = React2.useCallback(
    (outcome) => {
      setSelectedOutcome(outcome);
      setLimitPrice(outcomePrices[outcome].toFixed(4));
    },
    [outcomePrices]
  );
  const selectOrderType = React2.useCallback(
    (type) => {
      setOrderType(type);
      if (type === "limit") {
        setAmountUnit("outcome");
        setLimitPrice(outcomePrices[selectedOutcome].toFixed(4));
      }
    },
    [outcomePrices, selectedOutcome]
  );
  const selectAmountUnit = React2.useCallback(
    (unit) => {
      if (unit === amountUnit) return;
      const value = Number(amount) || 0;
      const converted = unit === "outcome" ? selectedPrice > 0 ? new utils.Decimal(value).div(selectedPrice).toNumber() : 0 : new utils.Decimal(value).mul(selectedPrice).toNumber();
      setAmountUnit(unit);
      setAmount(value > 0 ? converted.toFixed(unit === "quote" ? 2 : 4) : "");
    },
    [amount, amountUnit, selectedPrice]
  );
  const settleRound = React2.useCallback(() => {
    const winningOutcome = currentPrice >= openingPrice ? "up" : "down";
    const payout = positions.filter((position) => position.outcome === winningOutcome).reduce((total, position) => total.add(position.quantity), new utils.Decimal(0)).toNumber();
    setBalance((previous) => new utils.Decimal(previous).add(payout).toNumber());
    setSettlements((previous) => [
      ...positions.map((position) => {
        const settlementPrice = position.outcome === winningOutcome ? 1 : 0;
        const payout2 = new utils.Decimal(position.quantity).mul(settlementPrice).toNumber();
        return {
          id: nextIdRef.current++,
          round,
          outcome: position.outcome,
          quantity: position.quantity,
          averagePrice: position.averagePrice,
          settlementPrice,
          payout: payout2,
          pnl: new utils.Decimal(settlementPrice).sub(position.averagePrice).mul(position.quantity).toNumber(),
          settledAt: Date.now(),
          result: winningOutcome
        };
      }),
      ...previous
    ]);
    setPositions([]);
    setOpenOrders((orders) => {
      if (orders.length > 0) {
        setHistory((previous) => [
          ...orders.map((order) => ({
            ...order,
            status: "cancelled",
            timestamp: Date.now()
          })),
          ...previous
        ]);
      }
      return [];
    });
    setOpeningPrice(currentPrice);
    setRound((previous) => previous + ROUND_SECONDS);
    setSelectedRound(round + ROUND_SECONDS);
    setCountdown(ROUND_SECONDS);
    setRoundPhase("trading");
    setActiveTab("predictionHistory");
    notify("prediction.message.settled");
  }, [currentPrice, notify, openingPrice, positions, round]);
  const sellPosition = (outcome, quantity, type, limit) => {
    const price = type === "market" ? outcomePrices[outcome] : limit;
    const estimatedSellSlippage = type === "market" ? estimateOrderSlippage("sell", quantity, outcome) : null;
    const maxSlippage = new utils.Decimal(slippage || 0).div(100).toNumber();
    const position = positions.find((p) => p.outcome === outcome);
    const slippageExceeded = estimatedSellSlippage !== null && estimatedSellSlippage > maxSlippage;
    if (!isRoundTradable || isRegionRestricted || !position || !Number.isFinite(quantity) || quantity <= 0 || quantity > availableQuantity(outcome) || !Number.isFinite(price) || price <= 0 || price >= 1 || slippageExceeded) {
      notify(
        slippageExceeded ? "prediction.message.slippageExceeded" : !position || quantity <= 0 || quantity > availableQuantity(outcome) ? "prediction.message.insufficientContracts" : "prediction.message.sellFailed",
        "danger"
      );
      return false;
    }
    const order = {
      id: nextIdRef.current++,
      outcome,
      side: "sell",
      type,
      price,
      quantity,
      round: selectedRound,
      timestamp: Date.now()
    };
    if (type === "limit") {
      setOpenOrders((previous) => [order, ...previous]);
      setActiveTab("openOrders");
      notify("prediction.message.orderPlaced");
    } else {
      const payout = new utils.Decimal(quantity).mul(price).toNumber();
      setBalance((previous) => new utils.Decimal(previous).add(payout).toNumber());
      setPositions(
        (previous) => previous.map(
          (p) => p.outcome === outcome ? {
            ...p,
            quantity: new utils.Decimal(p.quantity).sub(quantity).toNumber()
          } : p
        ).filter((p) => p.quantity > 0)
      );
      setHistory((previous) => [{ ...order, status: "filled" }, ...previous]);
      setSettlements((previous) => [
        {
          id: nextIdRef.current++,
          round: selectedRound,
          outcome,
          quantity,
          averagePrice: position.averagePrice,
          settlementPrice: price,
          payout,
          pnl: new utils.Decimal(price).sub(position.averagePrice).mul(quantity).toNumber(),
          settledAt: Date.now(),
          result: "closed"
        },
        ...previous
      ]);
      notify("prediction.message.orderFilled");
    }
    return true;
  };
  const editPendingOrder = (id, price, quantity) => {
    const order = openOrders.find((o) => o.id === id);
    if (!order || !isRoundTradable || isRegionRestricted || !Number.isFinite(price) || !Number.isFinite(quantity) || price <= 0 || price >= 1 || quantity <= 0)
      return false;
    if (order.side === "sell" && quantity > availableQuantity(order.outcome, id))
      return false;
    if (order.side === "buy" && new utils.Decimal(price).mul(quantity).gt(balance))
      return false;
    setOpenOrders(
      (previous) => previous.map((o) => o.id === id ? { ...o, price, quantity } : o)
    );
    notify("prediction.message.orderUpdated");
    return true;
  };
  const placeOrder = React2.useCallback(() => {
    setNotification(void 0);
    if (!canPlaceOrder) {
      notify(
        orderSide === "buy" ? "prediction.message.insufficientBalance" : "prediction.message.insufficientContracts",
        "danger"
      );
      return;
    }
    const policy = orderType === "limit" ? orderPolicy : "gtc";
    const execution = orderType === "limit" ? planPredictionExecution(
      policy,
      orderSide,
      selectedPrice,
      orderQuantity,
      orderSide === "buy" ? orderBook.asks : orderBook.bids
    ) : {
      filled: orderQuantity,
      cancelled: 0,
      pending: 0,
      price: selectedPrice
    };
    const price = execution.price;
    const quantity = execution.filled;
    const order = {
      id: nextIdRef.current++,
      outcome: selectedOutcome,
      side: orderSide,
      type: orderType,
      price: selectedPrice,
      quantity: orderQuantity,
      policy,
      round: selectedRound,
      timestamp: Date.now()
    };
    if (execution.pending > 0) {
      setOpenOrders((previous) => [order, ...previous]);
      setActiveTab("openOrders");
      notify("prediction.message.orderPlaced");
      return;
    }
    if (execution.cancelled > 0) {
      setHistory((previous) => [
        {
          ...order,
          id: nextIdRef.current++,
          quantity: execution.cancelled,
          status: "cancelled"
        },
        ...previous
      ]);
    }
    if (quantity === 0) {
      setActiveTab("orderHistory");
      notify("prediction.message.orderCanceled");
      return;
    }
    if (orderSide === "buy") {
      setBalance(
        (previous) => new utils.Decimal(previous).sub(new utils.Decimal(quantity).mul(price)).toNumber()
      );
      setPositions((previous) => {
        const existing = previous.find(
          (position) => position.outcome === selectedOutcome
        );
        if (!existing) {
          return [
            ...previous,
            { outcome: selectedOutcome, quantity, averagePrice: price }
          ];
        }
        const nextQuantity = new utils.Decimal(existing.quantity).add(quantity).toNumber();
        const nextAverage = new utils.Decimal(existing.quantity).mul(existing.averagePrice).add(new utils.Decimal(quantity).mul(price)).div(nextQuantity).toNumber();
        return previous.map(
          (position) => position.outcome === selectedOutcome ? {
            ...position,
            quantity: nextQuantity,
            averagePrice: nextAverage
          } : position
        );
      });
    } else {
      const proceeds = new utils.Decimal(quantity).mul(price).toNumber();
      setBalance((previous) => new utils.Decimal(previous).add(proceeds).toNumber());
      setPositions(
        (previous) => previous.map(
          (position) => position.outcome === selectedOutcome ? {
            ...position,
            quantity: new utils.Decimal(position.quantity).sub(quantity).toNumber()
          } : position
        ).filter((position) => position.quantity > 0)
      );
      const averagePrice = selectedPosition?.averagePrice ?? 0;
      setSettlements((previous) => [
        {
          id: nextIdRef.current++,
          round: selectedRound,
          outcome: selectedOutcome,
          quantity,
          averagePrice,
          settlementPrice: price,
          payout: proceeds,
          pnl: new utils.Decimal(price).sub(averagePrice).mul(quantity).toNumber(),
          settledAt: Date.now(),
          result: "closed"
        },
        ...previous
      ]);
    }
    setHistory((previous) => [
      { ...order, price, quantity, status: "filled", timestamp: Date.now() },
      ...previous
    ]);
    setSelectedPercentage(null);
    setAmount("");
    setActiveTab("predictions");
    notify("prediction.message.orderFilled");
  }, [
    canPlaceOrder,
    orderBook,
    selectedPosition,
    notify,
    orderNotional,
    orderQuantity,
    orderSide,
    orderType,
    round,
    selectedRound,
    selectedOutcome,
    selectedPrice
  ]);
  const cancelOrder = React2.useCallback(
    (id) => {
      if (isRegionRestricted) return;
      const order = openOrders.find((item) => item.id === id);
      if (!order) return;
      setHistory((historyItems) => [
        { ...order, status: "cancelled" },
        ...historyItems
      ]);
      setOpenOrders((previous) => previous.filter((item) => item.id !== id));
      notify("prediction.message.orderCanceled");
    },
    [notify, openOrders, isRegionRestricted]
  );
  const cancelAllOrders = React2.useCallback(() => {
    if (isRegionRestricted) return;
    if (openOrders.length === 0) return;
    setOpenOrders((orders) => {
      if (orders.length > 0) {
        setHistory((historyItems) => [
          ...orders.map((order) => ({
            ...order,
            status: "cancelled"
          })),
          ...historyItems
        ]);
      }
      return [];
    });
    notify("prediction.message.ordersCanceled");
  }, [notify, openOrders.length, isRegionRestricted]);
  const setOrderPercentage = React2.useCallback(
    (percentage) => {
      const nextPercentage = clamp(percentage, 0, 100);
      setSelectedPercentage(nextPercentage);
      const nextAmount = new utils.Decimal(maxAmount).mul(nextPercentage).div(100).toDecimalPlaces(amountUnit === "quote" ? 2 : 4, utils.Decimal.ROUND_DOWN);
      setAmount(
        nextAmount.gt(0) ? nextAmount.toFixed(amountUnit === "quote" ? 2 : 4) : ""
      );
    },
    [amountUnit, maxAmount]
  );
  React2.useEffect(() => {
    if (selectedPercentage !== null) {
      setOrderPercentage(selectedPercentage);
    }
  }, [selectedPercentage, setOrderPercentage]);
  const setManualAmount = React2.useCallback((value) => {
    setSelectedPercentage(null);
    setAmount(value);
  }, []);
  const setMaxAmount = React2.useCallback(() => {
    setOrderPercentage(100);
  }, [setOrderPercentage]);
  return {
    round,
    countdown,
    roundPhase,
    selectedRound,
    selectMarketRound,
    roundView,
    setRoundView,
    setRoundPhase: selectRoundPhase,
    goToLiveRound,
    isRoundTradable,
    openingPrice,
    currentPrice,
    priceHistory,
    upChance,
    outcomePrices,
    selectedOutcome,
    setSelectedOutcome: selectOutcome,
    orderSide,
    setOrderSide,
    orderType,
    setOrderType: selectOrderType,
    amountUnit,
    setAmountUnit: selectAmountUnit,
    amount,
    setAmount: setManualAmount,
    limitPrice,
    setLimitPrice,
    balance,
    positions,
    openOrders,
    history,
    settlements,
    mockPerpPositions,
    closeMockPerpPosition,
    reverseMockPerpPosition,
    triggerMockAssetAction,
    mockTransactions,
    prototypeAuthState,
    setPrototypeAuthState,
    prototypeRegionState,
    isRegionRestricted,
    setPrototypeRegionState,
    activeTab,
    setActiveTab,
    orderBook,
    estimateOrderSlippage,
    slippage,
    setSlippage,
    estimatedSlippage,
    isSlippageExceeded,
    selectedPrice,
    selectedPosition,
    estimatedContracts,
    estimatedPayout,
    estimatedProfit,
    odds,
    orderQuantity,
    orderNotional,
    maxAmount,
    maxQuoteAmount,
    maxOutcomeAmount,
    orderPercentage: selectedPercentage ?? orderPercentage,
    canPlaceOrder,
    notification,
    clearNotification,
    placeOrder,
    availableQuantity,
    sellPosition,
    editPendingOrder,
    cancelOrder,
    cancelAllOrders,
    setMaxAmount,
    setOrderPercentage,
    settleRound
  };
};
var CANDLE_INTERVAL_MS = 6e4;
var CANDLE_COUNT = 81;
var CANDLE_WINDOW_MS = 80 * 6e4;
var CANDLE_TICK_INTERVAL_MS = 7 * 6e4;
var ROUND_INTERVAL_SECONDS = 300;
var getHistoricalRoundOutcome = (round) => Math.abs(Math.floor(round / ROUND_INTERVAL_SECONDS)) % 2 === 0 ? "up" : "down";
var createMockCandleHistory = (anchorPrice, endTimestamp = Date.now(), count = CANDLE_COUNT) => {
  const end = Math.floor(endTimestamp / CANDLE_INTERVAL_MS) * CANDLE_INTERVAL_MS;
  let previousClose = anchorPrice - 36;
  const candles = Array.from({ length: count }, (_, index) => {
    const timestamp = end - (count - 1 - index) * CANDLE_INTERVAL_MS;
    const open = previousClose;
    const move = Math.sin(index / 3.4) * 10 + Math.cos(index / 7.2) * 7 + Math.sin(index / 1.8) * 3;
    const close = open + move;
    const wick = 5 + Math.abs(Math.cos(index / 2.6)) * 9;
    previousClose = close;
    return {
      timestamp,
      open,
      high: Math.max(open, close) + wick,
      low: Math.min(open, close) - wick * 0.82,
      close
    };
  });
  const offset = anchorPrice - (candles.at(-1)?.close ?? anchorPrice);
  return candles.map((candle) => ({
    ...candle,
    open: candle.open + offset,
    high: candle.high + offset,
    low: candle.low + offset,
    close: candle.close + offset
  }));
};
var rollLiveCandles = (candles, price) => {
  const lastCandle = candles.at(-1);
  if (!lastCandle) return createMockCandleHistory(price);
  const currentMinute = Math.floor(Date.now() / CANDLE_INTERVAL_MS) * CANDLE_INTERVAL_MS;
  if (currentMinute > lastCandle.timestamp) {
    return [
      ...candles.slice(-80),
      {
        timestamp: currentMinute,
        open: lastCandle.close,
        high: Math.max(lastCandle.close, price),
        low: Math.min(lastCandle.close, price),
        close: price
      }
    ];
  }
  const high = Math.max(lastCandle.high, price);
  const low = Math.min(lastCandle.low, price);
  if (high === lastCandle.high && low === lastCandle.low && price === lastCandle.close) {
    return candles;
  }
  return [...candles.slice(0, -1), { ...lastCandle, high, low, close: price }];
};
var usePredictionCandles = (currentPrice, resetKey) => {
  const [liveCandles, setLiveCandles] = React2.useState(
    () => createMockCandleHistory(currentPrice)
  );
  React2.useEffect(() => {
    setLiveCandles(createMockCandleHistory(currentPrice));
  }, [resetKey]);
  const currentPriceRef = React2.useRef(currentPrice);
  currentPriceRef.current = currentPrice;
  React2.useEffect(() => {
    setLiveCandles((candles) => rollLiveCandles(candles, currentPrice));
  }, [currentPrice]);
  React2.useEffect(() => {
    const timer = window.setInterval(() => {
      setLiveCandles(
        (candles) => rollLiveCandles(candles, currentPriceRef.current)
      );
    }, 1e3);
    return () => window.clearInterval(timer);
  }, []);
  return liveCandles;
};
function toIntlLocale(locale) {
  const code = locale || i18n.i18n.language || void 0;
  if (!code) return void 0;
  if (code === "zh") return "zh-CN";
  if (code === "tc") return "zh-TW";
  return code;
}
function createUsdFormatter(locale) {
  return new Intl.NumberFormat(toIntlLocale(locale), {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
function createContractFormatter(locale) {
  return new Intl.NumberFormat(toIntlLocale(locale), {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4
  });
}
function formatUsd(value, locale) {
  return createUsdFormatter(locale).format(value);
}
function formatContracts(value, locale) {
  return createContractFormatter(locale).format(value);
}
var formatCountdown = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
};
var formatPercent = (value) => `${value.toFixed(1)}%`;
var formatContractPrice = (value) => value.toFixed(2);
function getLocalTimeZoneOffsetLabel(locale, date = /* @__PURE__ */ new Date()) {
  const parts = new Intl.DateTimeFormat(toIntlLocale(locale), {
    timeZoneName: "shortOffset"
  }).formatToParts(date);
  const name = parts.find((part) => part.type === "timeZoneName")?.value ?? "";
  return name.replace(/^GMT/, "UTC") || "Local";
}
function formatRoundWindow(round, locale) {
  const intlLocale = toIntlLocale(locale);
  const start = new Date(round * 1e3);
  const end = new Date(start.getTime() + 5 * 60 * 1e3);
  const startText = new Intl.DateTimeFormat(intlLocale, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(start);
  const endParts = new Intl.DateTimeFormat(intlLocale, {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "shortOffset"
  }).formatToParts(end);
  const endTime = endParts.filter((part) => part.type !== "timeZoneName").map((part) => part.value).join("").trim();
  const offset = endParts.find((part) => part.type === "timeZoneName")?.value.replace(/^GMT/, "UTC") ?? "";
  return offset ? `${startText} \u2013 ${endTime} (${offset})` : `${startText} \u2013 ${endTime}`;
}
function formatRoundBadge(round, locale) {
  const intlLocale = toIntlLocale(locale);
  const end = new Date((round + 5 * 60) * 1e3);
  const dateText = new Intl.DateTimeFormat(intlLocale, {
    month: "2-digit",
    day: "2-digit"
  }).format(end);
  const timeText = new Intl.DateTimeFormat(intlLocale, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23"
  }).format(end);
  return `${dateText} ${timeText}`;
}
function formatTableTime(timestamp, locale) {
  return new Intl.DateTimeFormat(toIntlLocale(locale), {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(new Date(timestamp));
}
function createPredictionChartFormatters(locale) {
  const intlLocale = toIntlLocale(locale);
  return {
    roundLabelFormatter: new Intl.DateTimeFormat(intlLocale, {
      month: "short",
      day: "numeric"
    }),
    roundTimeFormatter: new Intl.DateTimeFormat(intlLocale, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }),
    chartTimeFormatter: new Intl.DateTimeFormat(intlLocale, {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit"
    }),
    chartHoverPriceFormatter: new Intl.NumberFormat(intlLocale, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 2
    }),
    chartHoverTimeFormatter: new Intl.DateTimeFormat(intlLocale, {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    }),
    /** Local timezone — not a fixed Asia/Taipei offset. */
    resolutionLocalFormatter: new Intl.DateTimeFormat(intlLocale, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }),
    resolutionUtcFormatter: new Intl.DateTimeFormat(intlLocale, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "UTC"
    }),
    localOffsetLabel: getLocalTimeZoneOffsetLabel(locale)
  };
}
function usePredictionFormatters() {
  const localeCode = i18n.useLocaleCode();
  return React2.useMemo(() => {
    const locale = String(localeCode);
    return {
      locale,
      formatUsd: (value) => formatUsd(value, locale),
      formatContracts: (value) => formatContracts(value, locale),
      formatRoundWindow: (round) => formatRoundWindow(round, locale),
      formatRoundBadge: (round) => formatRoundBadge(round, locale),
      formatTableTime: (timestamp) => formatTableTime(timestamp, locale),
      formatPercent,
      chart: createPredictionChartFormatters(locale)
    };
  }, [localeCode]);
}
var formatRoundTooltipCountdown = (seconds) => {
  const safeSeconds = Math.max(Math.floor(seconds), 0);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor(safeSeconds % 3600 / 60);
  const remainingSeconds = safeSeconds % 60;
  return [hours, minutes, remainingSeconds].map((value) => String(value).padStart(2, "0")).join(":");
};
var LiveIndicator = () => /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "oui-prediction-liveIndicator oui-relative oui-inline-flex oui-size-3 oui-flex-none oui-items-center oui-justify-center", children: [
  /* @__PURE__ */ jsxRuntime.jsx("span", { className: "oui-liveIndicator-pulse oui-absolute oui-inset-0 oui-animate-ping oui-rounded-full oui-bg-danger oui-opacity-75" }),
  /* @__PURE__ */ jsxRuntime.jsx("span", { className: "oui-liveIndicator-dot oui-relative oui-size-1.5 oui-rounded-full oui-bg-danger" })
] });
var CountdownDisplay = ({ seconds, label, mutedIcon = false }) => {
  const [minutes, remainingSeconds] = formatCountdown(seconds).split(":");
  return /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "oui-flex oui-items-center oui-gap-2 oui-whitespace-nowrap", children: [
    mutedIcon ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "oui-prediction-countdown-dot oui-size-2 oui-flex-none oui-rounded-full oui-bg-base-contrast-36" }) : /* @__PURE__ */ jsxRuntime.jsx(LiveIndicator, {}),
    /* @__PURE__ */ jsxRuntime.jsx("span", { className: "oui-prediction-countdown-label oui-hidden oui-text-sm oui-font-medium oui-text-base-contrast-54 xl:oui-inline", children: label }),
    /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "oui-flex oui-items-center oui-gap-1 oui-text-xl oui-font-semibold oui-tabular-nums oui-text-base-contrast", children: [
      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "oui-min-w-10 oui-rounded-md oui-bg-base-7 oui-px-2 oui-py-1 oui-text-center", children: minutes }),
      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "oui-text-base-contrast-54", children: ":" }),
      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "oui-min-w-10 oui-rounded-md oui-bg-base-7 oui-px-2 oui-py-1 oui-text-center", children: remainingSeconds })
    ] })
  ] });
};
var formatRoundLabel = (round, todayLabel, liveRound, chart) => {
  const resolutionTime = new Date((round + 5 * 60) * 1e3);
  const today = new Date((liveRound + 5 * 60) * 1e3);
  const isToday = resolutionTime.getFullYear() === today.getFullYear() && resolutionTime.getMonth() === today.getMonth() && resolutionTime.getDate() === today.getDate();
  return `${chart.roundTimeFormatter.format(resolutionTime)} ${isToday ? todayLabel : chart.roundLabelFormatter.format(resolutionTime)}`;
};
var formatRoundTime = (round, chart) => chart.roundTimeFormatter.format(new Date((round + 5 * 60) * 1e3));
var RoundNavigator = ({
  round,
  countdown,
  roundPhase,
  selectedRound,
  onRoundChange,
  chartMode,
  onChartModeChange
}) => {
  const { t } = i18n.useTranslation();
  const { chart } = usePredictionFormatters();
  const [menu, setMenu] = React2.useState(null);
  const pastMenuRef = React2.useRef(null);
  const recentRounds = [round - 1500, round - 1200, round - 900, round - 600];
  const visibleRounds = selectedRound === round ? [round - 300, round, round + 300] : [selectedRound, selectedRound + 300, selectedRound + 600];
  const menuRounds = React2.useMemo(() => {
    if (menu === "past") {
      return Array.from(
        { length: 287 },
        (_, index) => round - (288 - index) * 300
      );
    }
    return Array.from({ length: 8 }, (_, index) => round + (index + 2) * 300);
  }, [menu, round]);
  React2.useEffect(() => {
    if (menu !== "past") return;
    const pastMenu = pastMenuRef.current;
    if (pastMenu) pastMenu.scrollTop = pastMenu.scrollHeight;
  }, [menu]);
  const status = (itemRound) => {
    if (itemRound < round) return "ended";
    if (itemRound === round) {
      return selectedRound === round && (roundPhase === "resolvedUp" || roundPhase === "resolvedDown" || roundPhase === "void") ? "ended" : "live";
    }
    return "upcoming";
  };
  const result = (itemRound) => {
    if (itemRound === selectedRound && roundPhase === "resolvedUp") return "up";
    if (itemRound === selectedRound && roundPhase === "resolvedDown")
      return "down";
    return getHistoricalRoundOutcome(itemRound);
  };
  const renderRoundTooltip = (itemRound) => {
    const itemStatus = status(itemRound);
    const itemResult = result(itemRound);
    const upcomingCountdown = countdown + Math.max(itemRound - round - 300, 0);
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "oui-w-64 oui-p-2", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "oui-flex oui-items-center oui-justify-between oui-text-sm oui-font-semibold oui-text-base-contrast", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "oui-flex oui-items-center oui-gap-2", children: [
          itemStatus === "live" && /* @__PURE__ */ jsxRuntime.jsx(LiveIndicator, {}),
          t(`prediction.rounds.${itemStatus}`)
        ] }),
        itemStatus === "ended" ? /* @__PURE__ */ jsxRuntime.jsxs(
          "span",
          {
            className: ui.cn(
              "oui-flex oui-items-center oui-gap-1",
              itemResult === "up" ? "oui-text-trade-profit" : "oui-text-trade-loss"
            ),
            children: [
              /* @__PURE__ */ jsxRuntime.jsx(
                "span",
                {
                  className: ui.cn(
                    "oui-flex oui-size-5 oui-items-center oui-justify-center oui-rounded-full",
                    itemResult === "up" ? "oui-bg-trade-profit/15" : "oui-bg-trade-loss/15"
                  ),
                  children: itemResult === "up" ? /* @__PURE__ */ jsxRuntime.jsx(ui.CaretUpIcon, { size: 12, color: "inherit", opacity: 1 }) : /* @__PURE__ */ jsxRuntime.jsx(ui.CaretDownIcon, { size: 12, color: "inherit", opacity: 1 })
                }
              ),
              t(`prediction.${itemResult}`)
            ]
          }
        ) : /* @__PURE__ */ jsxRuntime.jsx("span", { className: "oui-tabular-nums", children: formatRoundTooltipCountdown(
          itemStatus === "live" ? countdown : upcomingCountdown
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "oui-mt-4 oui-text-xs oui-text-base-contrast-54", children: t("prediction.rounds.resolutionTime") }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "oui-mt-2 oui-grid oui-grid-cols-[56px_1fr] oui-gap-y-2 oui-text-xs", children: [
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "oui-text-base-contrast-54", children: chart.localOffsetLabel }),
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "oui-text-end oui-text-base-contrast", children: chart.resolutionLocalFormatter.format(
          new Date((itemRound + 300) * 1e3)
        ) }),
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "oui-text-base-contrast-54", children: "UTC" }),
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "oui-text-end oui-text-base-contrast", children: chart.resolutionUtcFormatter.format(
          new Date((itemRound + 300) * 1e3)
        ) })
      ] })
    ] });
  };
  const renderMenuRounds = () => menuRounds.map((itemRound) => {
    const itemStatus = status(itemRound);
    const itemResult = result(itemRound);
    return /* @__PURE__ */ jsxRuntime.jsx(
      ui.Tooltip,
      {
        content: renderRoundTooltip(itemRound),
        side: "right",
        sideOffset: 8,
        className: "oui-rounded-xl oui-bg-base-5 oui-p-2 oui-shadow-xl",
        arrow: { className: "oui-fill-base-5" },
        children: /* @__PURE__ */ jsxRuntime.jsxs(
          "button",
          {
            type: "button",
            onClick: () => {
              onRoundChange(itemRound);
              setMenu(null);
            },
            className: ui.cn(
              "oui-flex oui-w-full oui-items-center oui-gap-2 oui-rounded-lg oui-px-3 oui-py-2.5 oui-text-start oui-text-xs hover:oui-bg-base-6 hover:oui-text-base-contrast",
              selectedRound === itemRound ? "oui-bg-base-6 oui-text-base-contrast" : "oui-text-base-contrast-54"
            ),
            children: [
              itemStatus === "ended" ? /* @__PURE__ */ jsxRuntime.jsx(
                "span",
                {
                  className: ui.cn(
                    "oui-flex oui-h-5 oui-w-5 oui-items-center oui-justify-center oui-rounded-full oui-text-3xs",
                    itemResult === "up" ? "oui-bg-trade-profit/15 oui-text-trade-profit" : "oui-bg-trade-loss/15 oui-text-trade-loss"
                  ),
                  children: itemResult === "up" ? /* @__PURE__ */ jsxRuntime.jsx(ui.CaretUpIcon, { size: 12, color: "inherit", opacity: 1 }) : /* @__PURE__ */ jsxRuntime.jsx(ui.CaretDownIcon, { size: 12, color: "inherit", opacity: 1 })
                }
              ) : /* @__PURE__ */ jsxRuntime.jsx("span", { className: "oui-h-1.5 oui-w-1.5 oui-rounded-full oui-bg-base-contrast-36" }),
              formatRoundLabel(
                itemRound,
                t("prediction.rounds.today"),
                round,
                chart
              )
            ]
          }
        )
      },
      itemRound
    );
  });
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "oui-absolute oui-inset-x-0 oui-bottom-0 oui-z-20 oui-flex oui-h-14 oui-items-center oui-gap-2 oui-border-t oui-border-line-6 oui-bg-base-9 oui-px-3", children: [
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "oui-relative oui-flex oui-min-w-0 oui-flex-1 oui-items-center oui-justify-start oui-gap-2 oui-overflow-x-auto", children: [
      /* @__PURE__ */ jsxRuntime.jsxs(
        ui.PopoverRoot,
        {
          open: menu === "past",
          onOpenChange: (open) => setMenu(open ? "past" : null),
          children: [
            /* @__PURE__ */ jsxRuntime.jsx(ui.PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntime.jsxs(
              "button",
              {
                type: "button",
                className: "oui-flex oui-shrink-0 oui-items-center oui-gap-3 oui-rounded-full oui-bg-base-7 oui-px-3 oui-py-2 oui-text-xs oui-text-base-contrast-54 hover:oui-text-base-contrast",
                children: [
                  /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "oui-flex oui-items-center oui-gap-1", children: [
                    t("prediction.rounds.past"),
                    menu === "past" ? /* @__PURE__ */ jsxRuntime.jsx(ui.CaretUpIcon, { size: 14, color: "inherit" }) : /* @__PURE__ */ jsxRuntime.jsx(ui.CaretDownIcon, { size: 14, color: "inherit" })
                  ] }),
                  /* @__PURE__ */ jsxRuntime.jsx("span", { className: "oui-hidden oui-h-5 oui-w-px oui-bg-line-12 xl:oui-block" }),
                  /* @__PURE__ */ jsxRuntime.jsx("span", { className: "oui-hidden oui-items-center oui-gap-1.5 xl:oui-flex", children: recentRounds.map((itemRound) => {
                    const itemResult = result(itemRound);
                    return /* @__PURE__ */ jsxRuntime.jsx(
                      ui.Tooltip,
                      {
                        content: renderRoundTooltip(itemRound),
                        side: "top",
                        sideOffset: 8,
                        className: "oui-rounded-xl oui-bg-base-5 oui-p-2 oui-shadow-xl",
                        arrow: { className: "oui-fill-base-5" },
                        children: /* @__PURE__ */ jsxRuntime.jsx(
                          "span",
                          {
                            className: ui.cn(
                              "oui-flex oui-h-5 oui-w-5 oui-items-center oui-justify-center oui-rounded-full oui-text-[8px]",
                              itemResult === "up" ? "oui-bg-trade-profit/15 oui-text-trade-profit" : "oui-bg-trade-loss/15 oui-text-trade-loss"
                            ),
                            children: itemResult === "up" ? /* @__PURE__ */ jsxRuntime.jsx(ui.CaretUpIcon, { size: 12, color: "inherit", opacity: 1 }) : /* @__PURE__ */ jsxRuntime.jsx(
                              ui.CaretDownIcon,
                              {
                                size: 12,
                                color: "inherit",
                                opacity: 1
                              }
                            )
                          }
                        )
                      },
                      itemRound
                    );
                  }) })
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntime.jsx(
              ui.PopoverContent,
              {
                ref: pastMenuRef,
                align: "start",
                side: "top",
                sideOffset: 8,
                className: "oui-max-h-72 oui-w-56 oui-overflow-y-auto oui-rounded-xl oui-bg-base-5 oui-p-2 oui-shadow-xl",
                children: renderMenuRounds()
              }
            )
          ]
        }
      ),
      visibleRounds.map((itemRound) => {
        const itemStatus = status(itemRound);
        return /* @__PURE__ */ jsxRuntime.jsx(
          "div",
          {
            className: ui.cn(
              "oui-relative",
              itemStatus !== "live" && "oui-hidden xl:oui-block"
            ),
            children: /* @__PURE__ */ jsxRuntime.jsx(
              ui.Tooltip,
              {
                content: renderRoundTooltip(itemRound),
                side: "top",
                sideOffset: 8,
                className: "oui-rounded-xl oui-bg-base-5 oui-p-2 oui-shadow-xl",
                arrow: { className: "oui-fill-base-5" },
                children: /* @__PURE__ */ jsxRuntime.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      onRoundChange(itemRound);
                      setMenu(null);
                    },
                    className: ui.cn(
                      "oui-prediction-roundNavigator-round-btn oui-relative oui-isolate oui-flex oui-shrink-0 oui-items-center oui-gap-2 oui-rounded-full oui-border oui-px-4 oui-py-2 oui-text-xs oui-transition-colors",
                      selectedRound === itemRound ? "oui-border-transparent oui-bg-base-5 oui-text-base-contrast" : "oui-border-transparent oui-bg-base-7 oui-text-base-contrast-36 hover:oui-bg-base-5"
                    ),
                    children: [
                      itemStatus === "live" && /* @__PURE__ */ jsxRuntime.jsx(LiveIndicator, {}),
                      formatRoundTime(itemRound, chart)
                    ]
                  }
                )
              }
            )
          },
          itemRound
        );
      }),
      /* @__PURE__ */ jsxRuntime.jsxs(
        ui.PopoverRoot,
        {
          open: menu === "more",
          onOpenChange: (open) => setMenu(open ? "more" : null),
          children: [
            /* @__PURE__ */ jsxRuntime.jsx(ui.PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntime.jsx(
              "button",
              {
                type: "button",
                className: "oui-shrink-0 oui-rounded-full oui-bg-base-7 oui-px-4 oui-py-2 oui-text-xs oui-text-base-contrast-54 hover:oui-text-base-contrast",
                children: /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "oui-flex oui-items-center oui-gap-1", children: [
                  t("prediction.rounds.more"),
                  menu === "more" ? /* @__PURE__ */ jsxRuntime.jsx(ui.CaretUpIcon, { size: 14, color: "inherit" }) : /* @__PURE__ */ jsxRuntime.jsx(ui.CaretDownIcon, { size: 14, color: "inherit" })
                ] })
              }
            ) }),
            /* @__PURE__ */ jsxRuntime.jsx(
              ui.PopoverContent,
              {
                align: "end",
                side: "top",
                sideOffset: 8,
                className: "oui-max-h-72 oui-w-56 oui-overflow-y-auto oui-rounded-xl oui-bg-base-5 oui-p-2 oui-shadow-xl",
                children: renderMenuRounds()
              }
            )
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "oui-flex oui-items-center oui-gap-1 oui-rounded-lg oui-bg-base-10 oui-p-1", children: [
      /* @__PURE__ */ jsxRuntime.jsx(
        "button",
        {
          type: "button",
          "aria-label": t("prediction.chart.priceMode"),
          "aria-pressed": chartMode === "price",
          onClick: () => onChartModeChange("price"),
          className: ui.cn(
            "oui-flex oui-h-8 oui-w-8 oui-items-center oui-justify-center oui-rounded-md",
            chartMode === "price" ? "oui-bg-base-5 oui-text-primary" : "oui-text-base-contrast-36 hover:oui-text-base-contrast-80"
          ),
          children: /* @__PURE__ */ jsxRuntime.jsx(ui.AssetIcon, {})
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsx(
        "button",
        {
          type: "button",
          "aria-label": t("prediction.chart.chartMode"),
          "aria-pressed": chartMode === "candles",
          onClick: () => onChartModeChange("candles"),
          className: ui.cn(
            "oui-flex oui-h-8 oui-w-8 oui-items-center oui-justify-center oui-rounded-md",
            chartMode === "candles" ? "oui-bg-base-5 oui-text-primary" : "oui-text-base-contrast-36 hover:oui-text-base-contrast-80"
          ),
          children: /* @__PURE__ */ jsxRuntime.jsx(ui.BarChartIcon, {})
        }
      )
    ] })
  ] });
};
var PriceChart = ({
  selectedRound,
  onSelectRound,
  points,
  openingPrice,
  currentPrice,
  round,
  countdown,
  roundPhase,
  onGoToLiveMarket
}) => {
  const { t } = i18n.useTranslation();
  const { chart: intl, formatUsd: formatUsd2, locale } = usePredictionFormatters();
  const [chartMode, setChartMode] = React2.useState("price");
  const liveCandles = usePredictionCandles(currentPrice, round);
  const [frozenChart, setFrozenChart] = React2.useState(null);
  const [hoveredPoint, setHoveredPoint] = React2.useState(null);
  const width = 720;
  const height = 230;
  const plotWidth = 650;
  const plotHeight = height;
  const windowDuration = 60 * 60 * 1e3;
  const candleScaleRef = React2.useRef(null);
  React2.useEffect(() => {
    setFrozenChart(null);
    setHoveredPoint(null);
  }, [round]);
  const selectRound = onSelectRound;
  React2.useEffect(() => {
    if (selectedRound < round) {
      const endTimestamp = (selectedRound + 300) * 1e3;
      const historicalCandles = createMockCandleHistory(
        currentPrice,
        endTimestamp
      );
      setFrozenChart({
        points: historicalCandles.map((candle) => ({
          timestamp: candle.timestamp,
          price: candle.close
        })),
        candles: historicalCandles,
        openingPrice,
        currentPrice
      });
    } else {
      setFrozenChart(null);
    }
  }, [selectedRound, round]);
  const isPastRound = selectedRound < round;
  const isFutureRound = selectedRound > round;
  const liveTimestamp = (round + 300 - countdown) * 1e3;
  const alignedLiveCandles = React2.useMemo(() => {
    const offset = Math.round(
      (liveTimestamp - (points.at(-1)?.timestamp ?? liveTimestamp)) / CANDLE_INTERVAL_MS
    ) * CANDLE_INTERVAL_MS;
    return liveCandles.map((candle) => ({
      ...candle,
      timestamp: candle.timestamp + offset
    }));
  }, [liveCandles, points, liveTimestamp]);
  const chartPoints = React2.useMemo(() => {
    if (isPastRound) return frozenChart?.points ?? [];
    const offset = liveTimestamp - (points.at(-1)?.timestamp ?? liveTimestamp);
    const alignedPoints = points.map((point) => ({
      ...point,
      timestamp: point.timestamp + offset
    }));
    return [
      ...alignedLiveCandles.filter(
        (candle) => candle.timestamp < (alignedPoints[0]?.timestamp ?? liveTimestamp)
      ).map((candle) => ({
        timestamp: candle.timestamp,
        price: candle.close
      })),
      ...alignedPoints
    ];
  }, [isPastRound, frozenChart, points, liveTimestamp, alignedLiveCandles]);
  const chartCandles = isPastRound ? frozenChart?.candles ?? [] : alignedLiveCandles;
  const chartOpeningPrice = isPastRound && frozenChart ? frozenChart.openingPrice : openingPrice;
  const chartCurrentPrice = isPastRound && frozenChart ? frozenChart.currentPrice : currentPrice;
  const futureCountdown = countdown + Math.max(selectedRound - round - 300, 0);
  const chart = React2.useMemo(() => {
    const isCandleMode = chartMode === "candles";
    const roundEnd = (selectedRound + 300) * 1e3;
    const candleAnchor = chartCandles.at(-1)?.timestamp ?? (isPastRound ? roundEnd : liveTimestamp);
    const windowEnd = isCandleMode ? candleAnchor + CANDLE_INTERVAL_MS : isPastRound ? roundEnd : liveTimestamp;
    const windowStart = windowEnd - (isCandleMode ? CANDLE_WINDOW_MS : isPastRound ? windowDuration : 6e4);
    const tickInterval = isCandleMode ? CANDLE_TICK_INTERVAL_MS : isPastRound ? 3e5 : 1e4;
    const firstTick = isCandleMode ? candleAnchor - Math.floor((candleAnchor - windowStart) / tickInterval) * tickInterval : Math.ceil(windowStart / tickInterval) * tickInterval;
    const lastTick = isCandleMode ? candleAnchor : windowEnd;
    const tickTimestamps = Array.from(
      { length: Math.floor((lastTick - firstTick) / tickInterval) + 1 },
      (_, index) => firstTick + index * tickInterval
    );
    const visibleCandles = isCandleMode ? chartCandles.filter(
      (candle) => candle.timestamp >= windowStart && candle.timestamp <= windowEnd
    ) : [];
    const visiblePoints = isCandleMode ? [] : chartPoints.filter(
      (point) => point.timestamp >= windowStart && point.timestamp <= windowEnd
    );
    const firstVisiblePoint = visiblePoints[0];
    const previousPoint = [...chartPoints].reverse().find((point) => point.timestamp < windowStart);
    if (firstVisiblePoint && previousPoint && firstVisiblePoint.timestamp > windowStart) {
      const boundaryPrice = new utils.Decimal(firstVisiblePoint.price).sub(previousPoint.price).mul(windowStart - previousPoint.timestamp).div(firstVisiblePoint.timestamp - previousPoint.timestamp).add(previousPoint.price).toNumber();
      visiblePoints.unshift({ timestamp: windowStart, price: boundaryPrice });
    }
    const activeWindowDuration = Math.max(windowEnd - windowStart, 1);
    const values = [
      ...visiblePoints.map((point) => point.price),
      ...visibleCandles.flatMap((candle) => [candle.high, candle.low]),
      ...isFutureRound ? [] : [chartOpeningPrice],
      chartCurrentPrice
    ];
    const rawMinimum = Math.min(...values);
    const rawMaximum = Math.max(...values);
    const padding = Math.max(
      (rawMaximum - rawMinimum) * 0.15,
      Math.abs(chartCurrentPrice) * 1e-4,
      1e-6
    );
    const roughStep = (rawMaximum - rawMinimum + padding * 2) / 5;
    const magnitude = 10 ** Math.floor(Math.log10(roughStep));
    const step = ([1, 2, 5, 10].find((value) => value * magnitude >= roughStep) ?? 10) * magnitude;
    const nextScale = {
      round: selectedRound,
      minimum: Math.floor((rawMinimum - padding) / step) * step,
      maximum: Math.ceil((rawMaximum + padding) / step) * step,
      step
    };
    const cachedScale = candleScaleRef.current;
    const keepCandleScale = isCandleMode && cachedScale?.round === selectedRound && rawMinimum >= cachedScale.minimum && rawMaximum <= cachedScale.maximum;
    const scale = keepCandleScale ? cachedScale : nextScale;
    if (isCandleMode && !keepCandleScale) candleScaleRef.current = scale;
    const { minimum, maximum } = scale;
    const range = maximum - minimum;
    const getY = (price) => plotHeight - (price - minimum) / range * plotHeight;
    const getX = (timestamp) => (timestamp - windowStart) / activeWindowDuration * plotWidth;
    const line = visiblePoints.map((point, index) => {
      const x = getX(point.timestamp);
      const y = getY(point.price);
      if (index === 0) return `M ${x},${y}`;
      const previous = visiblePoints[index - 1];
      const previousX = getX(previous.timestamp);
      const previousY = getY(previous.price);
      const middleX = (previousX + x) / 2;
      return `C ${middleX},${previousY} ${middleX},${y} ${x},${y}`;
    }).join(" ");
    const firstPoint = visiblePoints.at(0);
    const lastPoint = visiblePoints.at(-1);
    const candleWidth = Math.max(
      Math.min(plotWidth / Math.max(visibleCandles.length, 1) * 0.62, 8),
      2
    );
    const renderedCandles = visibleCandles.map((candle) => ({
      ...candle,
      x: getX(candle.timestamp),
      openY: getY(candle.open),
      highY: getY(candle.high),
      lowY: getY(candle.low),
      closeY: getY(candle.close),
      up: candle.close >= candle.open
    }));
    return {
      line,
      area: line ? `${line} L ${lastPoint ? getX(lastPoint.timestamp) : 0},${plotHeight} L ${firstPoint ? getX(firstPoint.timestamp) : 0},${plotHeight} Z` : "",
      openingY: getY(chartOpeningPrice),
      currentY: getY(chartCurrentPrice),
      openingRatio: getY(chartOpeningPrice) / plotHeight,
      endpointXRatio: (lastPoint ? getX(lastPoint.timestamp) : 0) / width,
      endpointYRatio: (lastPoint ? getY(lastPoint.price) : getY(chartCurrentPrice)) / height,
      candles: renderedCandles,
      candleWidth,
      hoverPoints: isCandleMode ? visibleCandles.map((candle) => ({
        price: candle.close,
        timestamp: candle.timestamp,
        xRatio: getX(candle.timestamp) / plotWidth,
        yRatio: getY(candle.close) / height
      })) : visiblePoints.map((point) => ({
        ...point,
        xRatio: getX(point.timestamp) / plotWidth,
        yRatio: getY(point.price) / height
      })),
      yTicks: Array.from(
        { length: Math.round(range / scale.step) + 1 },
        (_, index) => {
          const value = maximum - index * scale.step;
          return { ratio: (maximum - value) / range, value };
        }
      ),
      yDecimals: Math.max(0, -Math.floor(Math.log10(scale.step))),
      xTicks: tickTimestamps.map((timestamp) => ({
        timestamp,
        ratio: getX(timestamp) / plotWidth,
        // Below xl only every other tick fits.
        compact: isCandleMode ? (candleAnchor - timestamp) % (tickInterval * 2) === 0 : !isPastRound || timestamp % 6e5 === 0
      })).filter(
        ({ ratio }) => isCandleMode ? ratio >= 0.02 && ratio <= 1 : ratio >= 0.04 && ratio <= 0.96
      )
    };
  }, [
    chartCandles,
    chartCurrentPrice,
    chartMode,
    chartOpeningPrice,
    chartPoints,
    isFutureRound,
    selectedRound,
    isPastRound,
    liveTimestamp
  ]);
  const isUp = chartCurrentPrice >= chartOpeningPrice;
  const liveTargetDirection = selectedRound !== round || chartCurrentPrice === chartOpeningPrice ? null : chartCurrentPrice > chartOpeningPrice ? "down" : "up";
  const handleChartPointerMove = (event) => {
    if (chart.hoverPoints.length === 0) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const pointerRatio = Math.min(
      Math.max((event.clientX - bounds.left) / bounds.width, 0),
      1
    );
    const nearestPoint = chart.hoverPoints.reduce(
      (nearest, point) => Math.abs(point.xRatio - pointerRatio) < Math.abs(nearest.xRatio - pointerRatio) ? point : nearest
    );
    setHoveredPoint(nearestPoint);
  };
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "oui-relative oui-h-[360px] oui-overflow-hidden oui-rounded-xl oui-bg-base-9 oui-p-4 xl:oui-h-[calc(100vh-330px)] xl:oui-min-h-[480px] xl:oui-max-h-[640px]", children: [
    /* @__PURE__ */ jsxRuntime.jsx("style", { children: `
        @keyframes oui-prediction-target-pulse {
          0%, 100% { opacity: 0.36; }
          50% { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .oui-prediction-target-direction-muted {
            animation: none !important;
            opacity: 1;
          }
        }
      ` }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "oui-relative oui-z-10 oui-flex oui-items-center oui-gap-4 xl:oui-gap-8", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "oui-flex-none", children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          ui.Tooltip,
          {
            content: t("prediction.chart.priceToBeatHint"),
            className: "oui-max-w-[330px] oui-bg-base-6",
            arrow: { className: "oui-fill-base-6" },
            delayDuration: 300,
            children: /* @__PURE__ */ jsxRuntime.jsx("span", { className: "oui-cursor-pointer oui-border-b oui-border-dashed oui-border-line-12 oui-text-xs oui-text-base-contrast-54", children: t("prediction.chart.priceToBeat") })
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "oui-mt-1 oui-text-xl oui-font-semibold oui-tabular-nums oui-text-base-contrast-54", children: isFutureRound ? "--" : `$${formatUsd2(chartOpeningPrice)}` })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "oui-min-w-0", children: [
        isPastRound ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "oui-text-xs oui-text-base-contrast-54", children: t("prediction.finalPrice") }) : /* @__PURE__ */ jsxRuntime.jsx(
          ui.Tooltip,
          {
            content: t("prediction.chart.currentPriceHint"),
            className: "oui-max-w-[330px] oui-bg-base-6",
            arrow: { className: "oui-fill-base-6" },
            delayDuration: 300,
            children: /* @__PURE__ */ jsxRuntime.jsx("span", { className: "oui-cursor-pointer oui-border-b oui-border-dashed oui-border-line-12 oui-text-xs oui-text-base-contrast-54", children: t("prediction.currentPrice") })
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "oui-mt-1 oui-flex oui-items-center oui-gap-2 oui-whitespace-nowrap", children: [
          /* @__PURE__ */ jsxRuntime.jsxs(
            "span",
            {
              className: ui.cn(
                "oui-text-xl oui-font-semibold oui-tabular-nums",
                isPastRound ? "oui-text-base-contrast" : "oui-text-primary"
              ),
              children: [
                "$",
                formatUsd2(chartCurrentPrice)
              ]
            }
          ),
          !isFutureRound && /* @__PURE__ */ jsxRuntime.jsxs(
            "span",
            {
              className: ui.cn(
                "oui-text-xs oui-tabular-nums",
                isUp ? "oui-text-trade-profit" : "oui-text-trade-loss"
              ),
              children: [
                isUp ? /* @__PURE__ */ jsxRuntime.jsx(
                  ui.CaretUpIcon,
                  {
                    className: "oui-inline-block",
                    size: 14,
                    color: "inherit"
                  }
                ) : /* @__PURE__ */ jsxRuntime.jsx(
                  ui.CaretDownIcon,
                  {
                    className: "oui-inline-block",
                    size: 14,
                    color: "inherit"
                  }
                ),
                " ",
                "$",
                formatUsd2(Math.abs(chartCurrentPrice - chartOpeningPrice)),
                " (",
                chartOpeningPrice > 0 ? `${isUp ? "+" : ""}${new utils.Decimal(chartCurrentPrice).sub(chartOpeningPrice).div(chartOpeningPrice).mul(100).toFixed(2)}%` : "--",
                ")"
              ]
            }
          )
        ] })
      ] }),
      selectedRound === round && (roundPhase === "trading" || roundPhase === "closingSoon") ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: "oui-ms-auto oui-flex-none", children: /* @__PURE__ */ jsxRuntime.jsx(
        CountdownDisplay,
        {
          seconds: countdown,
          label: t("prediction.rounds.endsIn")
        }
      ) }) : selectedRound === round ? /* @__PURE__ */ jsxRuntime.jsxs(
        "button",
        {
          type: "button",
          onClick: onGoToLiveMarket,
          className: "oui-ms-auto oui-flex oui-flex-none oui-items-center oui-gap-2 oui-rounded-full oui-bg-base-7 oui-px-3 oui-py-2 oui-text-xs oui-text-base-contrast-80 hover:oui-bg-base-6 hover:oui-text-base-contrast",
          children: [
            /* @__PURE__ */ jsxRuntime.jsx(LiveIndicator, {}),
            t("prediction.rounds.goToLiveMarket"),
            /* @__PURE__ */ jsxRuntime.jsx(ui.ChevronRightIcon, { size: 14, color: "inherit" })
          ]
        }
      ) : isFutureRound ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: "oui-ms-auto oui-flex-none", children: /* @__PURE__ */ jsxRuntime.jsx(
        CountdownDisplay,
        {
          seconds: futureCountdown,
          label: t("prediction.rounds.startsIn"),
          mutedIcon: true
        }
      ) }) : /* @__PURE__ */ jsxRuntime.jsxs(
        "button",
        {
          type: "button",
          onClick: () => selectRound(round),
          className: "oui-ms-auto oui-flex oui-flex-none oui-items-center oui-gap-2 oui-rounded-full oui-bg-base-7 oui-px-3 oui-py-2 oui-text-xs oui-text-base-contrast-80 hover:oui-bg-base-6 hover:oui-text-base-contrast",
          children: [
            /* @__PURE__ */ jsxRuntime.jsx(LiveIndicator, {}),
            t("prediction.rounds.goToLiveMarket"),
            /* @__PURE__ */ jsxRuntime.jsx(ui.ChevronRightIcon, { size: 14, color: "inherit" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs(
      "svg",
      {
        className: ui.cn(
          "oui-absolute oui-inset-x-4 oui-top-20 oui-h-[calc(100%-168px)] oui-w-[calc(100%-2rem)]",
          isPastRound ? "oui-text-base-contrast-54" : "oui-text-primary"
        ),
        viewBox: `0 0 ${width} ${height}`,
        preserveAspectRatio: "none",
        role: "img",
        "aria-label": t("prediction.chart.ariaLabel"),
        children: [
          chart.yTicks.map(({ ratio }) => /* @__PURE__ */ jsxRuntime.jsx(
            "line",
            {
              x1: "0",
              x2: plotWidth,
              y1: height * ratio,
              y2: height * ratio,
              className: "oui-text-line-6",
              stroke: "currentColor",
              strokeWidth: "1",
              vectorEffect: "non-scaling-stroke"
            },
            ratio
          )),
          !isFutureRound && /* @__PURE__ */ jsxRuntime.jsx(
            "line",
            {
              x1: "0",
              x2: width,
              y1: chart.openingY,
              y2: chart.openingY,
              className: "oui-text-base-contrast-36",
              stroke: "currentColor",
              strokeDasharray: "5 5",
              strokeWidth: "1",
              vectorEffect: "non-scaling-stroke"
            }
          ),
          !isFutureRound && /* @__PURE__ */ jsxRuntime.jsx(
            "line",
            {
              x1: "0",
              x2: width,
              y1: chart.currentY,
              y2: chart.currentY,
              stroke: "currentColor",
              strokeDasharray: "5 5",
              strokeOpacity: "0.65",
              strokeWidth: "1",
              vectorEffect: "non-scaling-stroke"
            }
          ),
          chartMode === "price" ? /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
            /* @__PURE__ */ jsxRuntime.jsx("path", { d: chart.area, fill: "currentColor", fillOpacity: "0.08" }),
            /* @__PURE__ */ jsxRuntime.jsx(
              "path",
              {
                d: chart.line,
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                vectorEffect: "non-scaling-stroke"
              }
            )
          ] }) : chart.candles.map((candle) => {
            const bodyY = Math.min(candle.openY, candle.closeY);
            const bodyHeight = Math.max(
              Math.abs(candle.closeY - candle.openY),
              1.5
            );
            return /* @__PURE__ */ jsxRuntime.jsxs(
              "g",
              {
                className: candle.up ? "oui-text-trade-profit" : "oui-text-trade-loss",
                children: [
                  /* @__PURE__ */ jsxRuntime.jsx(
                    "line",
                    {
                      x1: candle.x,
                      x2: candle.x,
                      y1: candle.highY,
                      y2: candle.lowY,
                      stroke: "currentColor",
                      strokeWidth: "1",
                      vectorEffect: "non-scaling-stroke"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntime.jsx(
                    "rect",
                    {
                      x: candle.x - chart.candleWidth / 2,
                      y: bodyY,
                      width: chart.candleWidth,
                      height: bodyHeight,
                      fill: "currentColor"
                    }
                  )
                ]
              },
              candle.timestamp
            );
          })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(
      "div",
      {
        className: "oui-absolute oui-start-4 oui-top-20 oui-z-20 oui-h-[calc(100%-168px)] oui-cursor-crosshair",
        style: { width: `calc((100% - 32px) * ${plotWidth / width})` },
        onPointerMove: handleChartPointerMove,
        onPointerLeave: () => setHoveredPoint(null),
        children: hoveredPoint && /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
          /* @__PURE__ */ jsxRuntime.jsx(
            "span",
            {
              className: "oui-pointer-events-none oui-absolute oui-inset-y-0 oui-border-s oui-border-dashed oui-border-base-contrast-54",
              style: { left: `${hoveredPoint.xRatio * 100}%` }
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsx(
            "span",
            {
              className: "oui-pointer-events-none oui-absolute oui-size-2 -oui-translate-x-1/2 -oui-translate-y-1/2 oui-rounded-full oui-bg-base-contrast oui-shadow-[0_0_0_4px_rgb(var(--oui-color-base-foreground)/0.18)]",
              style: {
                left: `${hoveredPoint.xRatio * 100}%`,
                top: `${hoveredPoint.yRatio * 100}%`
              }
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsxs(
            "div",
            {
              className: "oui-pointer-events-none oui-absolute oui-top-3 oui-min-w-40 oui-rounded-lg oui-border oui-border-line-12 oui-bg-base-5 oui-px-4 oui-py-3 oui-shadow-xl",
              style: {
                left: `${hoveredPoint.xRatio * 100}%`,
                transform: hoveredPoint.xRatio > 0.72 ? "translateX(calc(-100% - 12px))" : "translateX(12px)"
              },
              children: [
                /* @__PURE__ */ jsxRuntime.jsx("div", { className: "oui-whitespace-nowrap oui-text-sm oui-font-normal oui-tabular-nums oui-text-base-contrast-54", children: intl.chartHoverTimeFormatter.format(
                  new Date(hoveredPoint.timestamp)
                ) }),
                /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "oui-mt-2 oui-whitespace-nowrap oui-text-base oui-font-semibold oui-tabular-nums oui-text-base-contrast", children: [
                  "$",
                  intl.chartHoverPriceFormatter.format(hoveredPoint.price)
                ] })
              ]
            }
          )
        ] })
      }
    ),
    chartMode === "price" && chartPoints.length > 0 && /* @__PURE__ */ jsxRuntime.jsx(
      "span",
      {
        className: ui.cn(
          "oui-pointer-events-none oui-absolute oui-z-10 oui-h-3 oui-w-3 -oui-translate-x-1/2 -oui-translate-y-1/2 oui-rounded-full",
          isPastRound ? "oui-bg-base-contrast oui-shadow-[0_0_0_6px_rgb(var(--oui-color-base-foreground)/0.24)]" : "oui-bg-primary oui-shadow-[0_0_0_6px_rgb(var(--oui-color-primary)/0.24)]"
        ),
        style: {
          left: `calc(16px + (100% - 32px) * ${chart.endpointXRatio})`,
          top: `calc(80px + (100% - 168px) * ${chart.endpointYRatio})`
        }
      }
    ),
    chart.yTicks.map(({ ratio, value }) => /* @__PURE__ */ jsxRuntime.jsxs(
      "span",
      {
        className: "oui-pointer-events-none oui-absolute oui-end-4 oui-z-10 -oui-translate-y-1/2 oui-text-xs oui-tabular-nums oui-text-base-contrast-36",
        style: {
          top: `calc(80px + (100% - 168px) * ${ratio})`
        },
        children: [
          "$",
          value.toLocaleString(toIntlLocale(locale), {
            minimumFractionDigits: chart.yDecimals,
            maximumFractionDigits: chart.yDecimals
          })
        ]
      },
      ratio
    )),
    !isFutureRound && /* @__PURE__ */ jsxRuntime.jsxs(
      "div",
      {
        className: "oui-pointer-events-none oui-absolute oui-end-3 oui-z-10 oui-flex -oui-translate-y-1/2 oui-items-center oui-rounded-e-md oui-bg-base-3 oui-px-3 oui-py-1 oui-text-xs oui-text-base-contrast",
        style: {
          top: `calc(80px + (100% - 168px) * ${chart.openingRatio})`
        },
        children: [
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "oui-absolute -oui-start-2 oui-top-1/2 -oui-translate-y-1/2 oui-border-y-[12px] oui-border-e-[10px] oui-border-y-transparent oui-border-e-base-3" }),
          t("prediction.chart.target"),
          liveTargetDirection && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "oui-prediction-target-direction oui-ms-1 oui-inline-flex oui-h-5 oui-w-5 oui-flex-col oui-items-center oui-justify-center", children: liveTargetDirection === "down" ? /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              ui.ChevronDownIcon,
              {
                className: "oui-prediction-target-direction-muted -oui-mb-1",
                size: 14,
                color: "inherit",
                style: {
                  animation: "oui-prediction-target-pulse 1.2s ease-in-out infinite"
                }
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx(
              ui.ChevronDownIcon,
              {
                className: "-oui-mt-1",
                size: 14,
                color: "inherit"
              }
            )
          ] }) : /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              ui.ChevronUpIcon,
              {
                className: "-oui-mb-1",
                size: 14,
                color: "inherit"
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx(
              ui.ChevronUpIcon,
              {
                className: "oui-prediction-target-direction-muted -oui-mt-1",
                size: 14,
                color: "inherit",
                style: {
                  animation: "oui-prediction-target-pulse 1.2s ease-in-out infinite"
                }
              }
            )
          ] }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(
      "div",
      {
        className: "oui-pointer-events-none oui-absolute oui-bottom-14 oui-start-4 oui-z-10 oui-h-8 oui-text-xs oui-tabular-nums oui-text-base-contrast-36",
        style: { width: `calc((100% - 32px) * ${plotWidth / width})` },
        children: chart.xTicks.map(({ timestamp, ratio, compact }) => /* @__PURE__ */ jsxRuntime.jsx(
          "span",
          {
            className: ui.cn(
              "oui-absolute oui-top-2 -oui-translate-x-1/2 oui-whitespace-nowrap",
              !compact && "oui-hidden xl:oui-block"
            ),
            style: { left: `${ratio * 100}%` },
            children: (isPastRound || chartMode === "candles" ? intl.roundTimeFormatter : intl.chartTimeFormatter).format(new Date(timestamp))
          },
          timestamp
        ))
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(
      RoundNavigator,
      {
        round,
        countdown,
        roundPhase,
        selectedRound,
        onRoundChange: selectRound,
        chartMode,
        onChartModeChange: (mode) => {
          setChartMode(mode);
          setHoveredPoint(null);
        }
      }
    )
  ] });
};
var predictionDateRange = (days) => {
  const from = /* @__PURE__ */ new Date();
  from.setDate(from.getDate() - days + 1);
  from.setHours(0, 0, 0, 0);
  const to = /* @__PURE__ */ new Date();
  to.setHours(23, 59, 59, 999);
  return { from, to };
};
var usePredictionFilters = (withDate = false) => {
  const [side, setSide] = React2.useState("all");
  const [outcome, setOutcome] = React2.useState("all");
  const [status, setStatus] = React2.useState("all");
  const [days, setDays] = React2.useState(90);
  const [dateRange, setDateRange] = React2.useState(
    () => predictionDateRange(90)
  );
  const updateDays = (value) => {
    setDays(value);
    setDateRange(predictionDateRange(value));
  };
  const onFilter = ({ name, value }) => {
    if (name === "side") setSide(value);
    if (name === "outcome") setOutcome(value);
    if (name === "status") setStatus(value);
    if (name === "dateRange") {
      const from = value?.from ? new Date(value.from) : void 0;
      const to = value?.to ? new Date(value.to) : void 0;
      from?.setHours(0, 0, 0, 0);
      to?.setHours(23, 59, 59, 999);
      setDateRange({ from, to });
      setDays(null);
    }
  };
  const matches = (record) => (side === "all" || record.side === side) && (outcome === "all" || record.outcome === outcome) && (status === "all" || record.status === status) && (!withDate || record.timestamp !== void 0 && (!dateRange.from || record.timestamp >= dateRange.from.getTime()) && (!dateRange.to || record.timestamp <= dateRange.to.getTime()));
  return {
    side,
    outcome,
    status,
    days,
    dateRange,
    updateDays,
    onFilter,
    matches
  };
};
var PREDICTION_MARKET_ID = "PREDICTION_BTC_UP_DOWN_5M";
var PREDICTION_MARKET_VOLUME = 6117054;
var PREDICTION_FAVORITES_STORAGE_KEY = "orderly_prediction_favorites";
var usePredictionFavorites = () => {
  const [favoriteMarketIds, setFavoriteMarketIds] = hooks.useLocalStorage(
    PREDICTION_FAVORITES_STORAGE_KEY,
    []
  );
  const isFavorite = favoriteMarketIds.includes(PREDICTION_MARKET_ID);
  const toggleFavorite = () => {
    setFavoriteMarketIds(
      isFavorite ? favoriteMarketIds.filter((id) => id !== PREDICTION_MARKET_ID) : [...favoriteMarketIds, PREDICTION_MARKET_ID]
    );
  };
  return { isFavorite, toggleFavorite };
};
var buildMockPortfolioAssets = (balance, btcPrice) => {
  const btcQuantity = 0.0184;
  const btcValue = new utils.Decimal(btcQuantity).mul(btcPrice).toNumber();
  return [
    {
      asset: "USDC",
      quantity: balance,
      indexPrice: 1,
      assetValue: balance,
      collateralRatio: 1,
      collateralContribution: balance
    },
    {
      asset: "BTC",
      quantity: btcQuantity,
      indexPrice: btcPrice,
      assetValue: btcValue,
      collateralRatio: 0.95,
      collateralContribution: new utils.Decimal(btcValue).mul(0.95).toNumber()
    }
  ];
};
var PredictionOrderBook = ({
  orderBook,
  selectedOutcome,
  selectedPrice,
  setLimitPrice,
  setOrderType,
  isRoundTradable,
  roundPhase
}) => {
  const { t } = i18n.useTranslation();
  const selectPrice = (price) => {
    setOrderType("limit");
    setLimitPrice(price.toFixed(2));
  };
  const asks = React2.useMemo(
    () => orderBook.asks.map((level, index, levels) => {
      const accumulatedLevels = levels.slice(index);
      const accumulated = accumulatedLevels.reduce((total, item) => total.add(item.quantity), new utils.Decimal(0)).toNumber();
      const accumulatedAmount = accumulatedLevels.reduce(
        (total, item) => total.add(new utils.Decimal(item.quantity).mul(item.price)),
        new utils.Decimal(0)
      ).toNumber();
      return [level.price, level.quantity, accumulated, accumulatedAmount];
    }),
    [orderBook.asks]
  );
  const bids = React2.useMemo(
    () => orderBook.bids.map((level, index, levels) => {
      const accumulatedLevels = levels.slice(0, index + 1);
      const accumulated = accumulatedLevels.reduce((total, item) => total.add(item.quantity), new utils.Decimal(0)).toNumber();
      const accumulatedAmount = accumulatedLevels.reduce(
        (total, item) => total.add(new utils.Decimal(item.quantity).mul(item.price)),
        new utils.Decimal(0)
      ).toNumber();
      return [level.price, level.quantity, accumulated, accumulatedAmount];
    }),
    [orderBook.bids]
  );
  const isPastRound = roundPhase === "closed" || roundPhase === "resolving" || roundPhase === "resolvedUp" || roundPhase === "resolvedDown" || roundPhase === "void";
  const emptyLevels = React2.useMemo(
    () => Array.from({ length: 7 }, () => [
      Number.NaN,
      Number.NaN,
      Number.NaN,
      Number.NaN
    ]),
    []
  );
  const displayedAsks = isPastRound ? emptyLevels : asks;
  const displayedBids = isPastRound ? emptyLevels : bids;
  const displayedPrice = isPastRound ? Number.NaN : selectedPrice;
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "section",
    {
      className: ui.cn(
        "oui-prediction-orderBook oui-flex oui-h-full oui-min-h-[300px] oui-flex-col oui-overflow-hidden oui-rounded-xl oui-bg-base-9 [&_.oui-orderBook-asks]:oui-h-full [&_.oui-orderBook-asks]:oui-justify-end [&_.oui-orderBook-markPrice]:oui-hidden xl:oui-min-h-[420px]",
        !isRoundTradable && "oui-pointer-events-none"
      ),
      children: [
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "oui-flex oui-items-center oui-px-3 oui-pt-3", children: /* @__PURE__ */ jsxRuntime.jsx("span", { className: "oui-text-sm oui-font-semibold oui-text-base-contrast", children: t("prediction.orderBook") }) }),
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "oui-min-h-0 oui-flex-1 oui-pb-3", children: /* @__PURE__ */ jsxRuntime.jsx(
          trading.OrderBook,
          {
            level: 7,
            asks: displayedAsks,
            bids: displayedBids,
            markPrice: displayedPrice,
            lastPrice: isPastRound ? [Number.NaN, Number.NaN] : [Math.max(selectedPrice - 0.01, 0), selectedPrice],
            depths: ["0.01"],
            selDepth: "0.01",
            symbol: `PREDICTION_BTC_${selectedOutcome.toUpperCase()}`,
            base: selectedOutcome.toUpperCase(),
            quote: "USDC",
            isLoading: false,
            onItemClick: (item) => selectPrice(item[0]),
            cellHeight: 20,
            onDepthChange: () => void 0,
            pendingOrders: [],
            symbolInfo: {
              base_dp: 2,
              quote_dp: 2,
              base_tick: 0.01,
              base: selectedOutcome.toUpperCase(),
              quote: "USDC"
            },
            isMobile: false,
            showBuySellRatio: false,
            setShowBuySellRatio: () => void 0,
            buySellRatio: null,
            showBuySellRatioSettings: false
          }
        ) })
      ]
    }
  );
};
var RoundOrderStatusCard = ({ round, roundPhase, restricted }) => {
  const { t } = i18n.useTranslation();
  const { formatRoundWindow: formatRoundWindow2 } = usePredictionFormatters();
  const isResolving = roundPhase === "closed" || roundPhase === "resolving";
  const resolvedOutcome = roundPhase === "resolvedUp" ? "up" : roundPhase === "resolvedDown" ? "down" : null;
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "section",
    {
      className: ui.cn(
        "oui-flex oui-h-full oui-min-h-[360px] oui-flex-col oui-items-center oui-justify-center oui-rounded-xl oui-bg-base-9 oui-p-6 oui-text-center md:oui-h-auto",
        restricted && "oui-flex-1 xl:oui-flex-none"
      ),
      children: [
        restricted && /* @__PURE__ */ jsxRuntime.jsxs("div", { role: "status", children: [
          /* @__PURE__ */ jsxRuntime.jsx("h2", { className: "oui-text-lg oui-font-semibold oui-text-base-contrast", children: t("prediction.region.restrictedTitle") }),
          /* @__PURE__ */ jsxRuntime.jsx("p", { className: "oui-mt-4 oui-max-w-72 oui-text-sm oui-font-normal oui-text-base-contrast-54", children: t("prediction.region.restrictedDescription") })
        ] }),
        !restricted && isResolving && /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
          /* @__PURE__ */ jsxRuntime.jsx(ui.Spinner, { size: "lg", color: "primary" }),
          /* @__PURE__ */ jsxRuntime.jsx("h2", { className: "oui-mt-6 oui-text-lg oui-font-semibold oui-text-base-contrast", children: t("prediction.resolution.determiningWinner") }),
          /* @__PURE__ */ jsxRuntime.jsxs("p", { className: "oui-mt-4 oui-text-sm oui-font-normal oui-text-base-contrast-54", children: [
            t("prediction.btcUpDown"),
            " \xB7 ",
            formatRoundWindow2(round)
          ] }),
          /* @__PURE__ */ jsxRuntime.jsx("p", { className: "oui-mt-5 oui-max-w-72 oui-text-sm oui-font-normal oui-text-base-contrast-54", children: t("prediction.resolution.pendingDescription") })
        ] }),
        !restricted && resolvedOutcome && /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
          /* @__PURE__ */ jsxRuntime.jsx(
            "div",
            {
              className: ui.cn(
                "oui-flex oui-size-16 oui-items-center oui-justify-center oui-rounded-full",
                resolvedOutcome === "up" ? "oui-bg-trade-profit/15 oui-text-trade-profit" : "oui-bg-trade-loss/15 oui-text-trade-loss"
              ),
              children: resolvedOutcome === "up" ? /* @__PURE__ */ jsxRuntime.jsx(ui.CaretUpIcon, { size: 32, color: "inherit", opacity: 1 }) : /* @__PURE__ */ jsxRuntime.jsx(ui.CaretDownIcon, { size: 32, color: "inherit", opacity: 1 })
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsx(
            "h2",
            {
              className: ui.cn(
                "oui-mt-5 oui-text-lg oui-font-semibold",
                resolvedOutcome === "up" ? "oui-text-trade-profit" : "oui-text-trade-loss"
              ),
              children: t("prediction.resolution.outcome", {
                outcome: t(`prediction.${resolvedOutcome}`)
              })
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsxs("p", { className: "oui-mt-4 oui-text-sm oui-font-normal oui-text-base-contrast-54", children: [
            t("prediction.btcUpDown"),
            " \xB7 ",
            formatRoundWindow2(round)
          ] })
        ] }),
        !restricted && roundPhase === "void" && /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "oui-flex oui-size-16 oui-items-center oui-justify-center oui-rounded-full oui-bg-base-6 oui-text-2xl oui-text-base-contrast-54", children: "\u2014" }),
          /* @__PURE__ */ jsxRuntime.jsx("h2", { className: "oui-mt-5 oui-text-lg oui-font-semibold oui-text-base-contrast", children: t("prediction.resolution.voided") }),
          /* @__PURE__ */ jsxRuntime.jsxs("p", { className: "oui-mt-4 oui-text-sm oui-font-normal oui-text-base-contrast-54", children: [
            t("prediction.btcUpDown"),
            " \xB7 ",
            formatRoundWindow2(round)
          ] }),
          /* @__PURE__ */ jsxRuntime.jsx("p", { className: "oui-mt-5 oui-max-w-72 oui-text-sm oui-font-normal oui-text-base-contrast-54", children: t("prediction.resolution.voidDescription") })
        ] })
      ]
    }
  );
};
var PredictionOrderInput = ({ id, label, value, suffix, onChange, readOnly, dp = 4, position }) => /* @__PURE__ */ jsxRuntime.jsx(
  ui.Input,
  {
    id,
    name: id,
    fullWidth: true,
    size: "lg",
    autoComplete: "off",
    inputMode: "decimal",
    placeholder: "0",
    value,
    readOnly,
    formatters: [
      ui.inputFormatter.dpFormatter(dp),
      ui.inputFormatter.numberFormatter,
      ui.inputFormatter.currencyFormatter,
      ui.inputFormatter.decimalPointFormatter
    ],
    prefix: /* @__PURE__ */ jsxRuntime.jsx(
      "label",
      {
        htmlFor: id,
        className: "oui-absolute oui-start-2 oui-top-[7px] oui-text-2xs oui-text-base-contrast-36",
        children: label
      }
    ),
    suffix: typeof suffix === "string" ? suffix : /* @__PURE__ */ jsxRuntime.jsx("div", { className: "oui-absolute oui-end-0 oui-top-0 oui-flex oui-h-full oui-flex-col oui-items-end oui-justify-end oui-px-2 oui-py-2 oui-text-2xs oui-text-base-contrast-36", children: suffix }),
    classNames: {
      root: ui.cn(
        "oui-relative oui-h-[54px] oui-border oui-border-solid oui-border-line oui-px-2 oui-py-1 focus-within:oui-border-transparent",
        position === "single" && "oui-rounded-xl",
        position === "top" && "oui-rounded-t-xl oui-rounded-b",
        position === "middle" && "oui-rounded",
        position === "bottom" && "oui-rounded-t oui-rounded-b-xl"
      ),
      input: "oui-mb-1 oui-mt-5 oui-h-5",
      suffix: "oui-absolute oui-end-0 oui-top-0 oui-items-end oui-justify-end oui-py-2 oui-text-2xs oui-text-base-contrast-36"
    },
    onValueChange: onChange
  }
);
var InfoRow = ({ label, value, hint, valueClassName, dashed }) => /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "oui-flex oui-items-center oui-justify-between oui-gap-4", children: [
  /* @__PURE__ */ jsxRuntime.jsx(
    ui.Tooltip,
    {
      open: hint ? void 0 : false,
      content: hint,
      className: "oui-max-w-[330px] oui-bg-base-6",
      arrow: { className: "oui-fill-base-6" },
      delayDuration: 300,
      children: /* @__PURE__ */ jsxRuntime.jsx(
        "span",
        {
          className: ui.cn(
            "oui-text-base-contrast-54",
            hint && "oui-cursor-pointer",
            dashed && "oui-border-b oui-border-dashed oui-border-line-12 oui-leading-4"
          ),
          children: label
        }
      )
    }
  ),
  /* @__PURE__ */ jsxRuntime.jsx(
    "span",
    {
      className: ui.cn(
        "oui-text-end oui-font-medium oui-text-base-contrast",
        valueClassName
      ),
      children: value
    }
  )
] });
var TradePanel = (state) => {
  const { t } = i18n.useTranslation();
  const { formatUsd: formatUsd2, formatContracts: formatContracts2 } = usePredictionFormatters();
  const orderEntryAccountReady = state.orderEntryAccountReady ?? true;
  const { isMobile } = ui.useScreen();
  const orderEntryFunded = state.orderEntryFunded ?? true;
  const outcomeLabel = t(`prediction.${state.selectedOutcome}`);
  const inputUnit = state.amountUnit === "quote" ? "USDC" : outcomeLabel;
  const buttonLabel = `${t(`common.${state.orderSide}`)} ${t(`prediction.${state.selectedOutcome}`)}`;
  const availableValue = !orderEntryFunded ? `0 ${state.orderSide === "buy" ? "USDC" : outcomeLabel}` : state.orderSide === "buy" ? `${formatUsd2(state.balance)} USDC` : `${formatContracts2(state.availableQuantity(state.selectedOutcome))} ${outcomeLabel}`;
  const amountUnitOptions = [
    { label: "USDC", value: "quote" },
    { label: outcomeLabel, value: "outcome" }
  ];
  const maxDisplayValue = orderEntryFunded ? `${state.amountUnit === "quote" ? formatUsd2(state.maxAmount) : formatContracts2(state.maxAmount)} ${inputUnit}` : `0 ${inputUnit}`;
  const canAdjustAmount = orderEntryAccountReady && orderEntryFunded && state.maxAmount > 0 && state.selectedPrice > 0 && state.selectedPrice < 1 && state.isRoundTradable && !state.isRegionRestricted;
  const sliderColor = canAdjustAmount ? state.orderSide === "buy" ? "buy" : "sell" : void 0;
  return /* @__PURE__ */ jsxRuntime.jsx("aside", { className: "oui-overflow-hidden oui-rounded-xl oui-bg-base-9", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "oui-prediction-orderEntry-form oui-min-w-0 oui-p-3 oui-text-base-contrast-54", children: [
    isMobile ? /* @__PURE__ */ jsxRuntime.jsx(
      ui.Select.options,
      {
        size: "md",
        value: state.orderType,
        options: ["limit", "market"].map((type) => ({
          value: type,
          label: t(`common.${type}`)
        })),
        disabled: !orderEntryAccountReady,
        onValueChange: (type) => state.setOrderType(type),
        classNames: {
          trigger: "oui-w-full oui-h-8 oui-rounded-md oui-border-line-12 oui-bg-base-8"
        }
      }
    ) : /* @__PURE__ */ jsxRuntime.jsx("div", { className: "oui-flex oui-w-full oui-gap-1", children: ["limit", "market"].map((type) => /* @__PURE__ */ jsxRuntime.jsx(
      "button",
      {
        type: "button",
        disabled: !orderEntryAccountReady,
        "aria-pressed": state.orderType === type,
        onClick: () => state.setOrderType(type),
        className: ui.cn(
          "oui-flex oui-h-8 oui-flex-1 oui-items-center oui-justify-center oui-gap-x-1 oui-rounded oui-px-3 oui-py-0.5 oui-text-xs oui-font-semibold disabled:oui-cursor-not-allowed",
          state.orderType === type ? "oui-bg-base-5 oui-text-base-contrast" : "oui-bg-base-7 oui-text-base-contrast-36"
        ),
        children: /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: "xs", children: t(`common.${type}`) })
      },
      type
    )) }),
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "oui-mt-2 oui-grid oui-w-full oui-flex-1 oui-grid-cols-2 oui-gap-x-2 xl:oui-mt-3 xl:oui-flex xl:oui-gap-x-[6px]", children: ["buy", "sell"].map((side) => /* @__PURE__ */ jsxRuntime.jsx(
      ui.Button,
      {
        type: "button",
        size: "md",
        fullWidth: true,
        "aria-pressed": state.orderSide === side,
        onClick: () => state.setOrderSide(side),
        className: ui.cn(
          side === "buy" ? state.orderSide === side && orderEntryAccountReady ? "oui-bg-success-darken hover:oui-bg-success-darken/80 active:oui-bg-success-darken/80" : "oui-bg-base-7 oui-text-base-contrast-36 hover:oui-bg-base-6 active:oui-bg-base-6" : state.orderSide === side && orderEntryAccountReady ? "oui-bg-danger-darken hover:oui-bg-danger-darken/80 active:oui-bg-danger-darken/80" : "oui-bg-base-7 oui-text-base-contrast-36 hover:oui-bg-base-6 active:oui-bg-base-6"
        ),
        children: t(`common.${side}`)
      },
      side
    )) }),
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "oui-mt-2 oui-grid oui-grid-cols-2 oui-overflow-hidden oui-rounded-lg oui-bg-base-10 oui-p-0.5 xl:oui-mt-3", children: ["up", "down"].map((outcome) => {
      const isActive = state.selectedOutcome === outcome;
      return /* @__PURE__ */ jsxRuntime.jsxs(
        "button",
        {
          type: "button",
          onClick: () => state.setSelectedOutcome(outcome),
          className: ui.cn(
            "oui-flex oui-h-12 oui-flex-col oui-items-center oui-justify-center oui-rounded-md oui-text-xs oui-font-semibold oui-leading-tight oui-transition-colors",
            outcome === "up" ? isActive ? "oui-bg-trade-profit/15 oui-text-trade-profit" : "oui-text-base-contrast-54 hover:oui-bg-trade-profit/10" : isActive ? "oui-bg-trade-loss/15 oui-text-trade-loss" : "oui-text-base-contrast-54 hover:oui-bg-trade-loss/10"
          ),
          children: [
            /* @__PURE__ */ jsxRuntime.jsx("span", { children: t(`prediction.${outcome}`) }),
            /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "oui-mt-0.5 oui-tabular-nums", children: [
              "$",
              formatContractPrice(state.outcomePrices[outcome])
            ] })
          ]
        },
        outcome
      );
    }) }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "oui-mt-2 oui-flex oui-items-center oui-justify-between oui-text-2xs xl:oui-mt-3", children: [
      /* @__PURE__ */ jsxRuntime.jsx(
        ui.Tips,
        {
          title: t("common.tips"),
          content: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "oui-text-pretty oui-text-2xs oui-leading-normal oui-text-base-contrast-80", children: t(
            state.orderSide === "buy" ? "prediction.available.buyHint" : "prediction.available.sellHint"
          ) }),
          trigger: /* @__PURE__ */ jsxRuntime.jsx(
            ui.Text,
            {
              size: "2xs",
              className: "oui-cursor-pointer oui-border-b oui-border-dashed oui-border-line-12 oui-text-base-contrast-54",
              children: t("common.available")
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "oui-flex oui-items-center oui-gap-1", children: [
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "oui-text-base-contrast-80", children: availableValue }),
        state.orderSide === "buy" && /* @__PURE__ */ jsxRuntime.jsx(
          ui.Button,
          {
            type: "button",
            variant: "text",
            size: "xs",
            color: "secondary",
            "aria-label": t("common.deposit"),
            className: "oui-p-0 hover:oui-text-base-contrast-80",
            disabled: state.isRegionRestricted,
            onClick: () => ui.modal.show(
              isMobile ? "DepositAndWithdrawWithSheetId" : "DepositAndWithdrawWithDialogId",
              { activeTab: "deposit" }
            ),
            children: /* @__PURE__ */ jsxRuntime.jsx(ui.AddCircleIcon, { opacity: 1 })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "oui-mt-2 oui-space-y-1 xl:oui-mt-3", children: [
      state.orderType === "limit" && /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          PredictionOrderInput,
          {
            id: "prediction-limit-price",
            label: t("common.price"),
            value: state.limitPrice,
            suffix: "USDC",
            onChange: state.setLimitPrice,
            position: "top"
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx(
          PredictionOrderInput,
          {
            id: "prediction-order-amount",
            label: t("common.amount"),
            value: state.amount,
            suffix: outcomeLabel,
            onChange: state.setAmount,
            position: "middle"
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx(
          PredictionOrderInput,
          {
            id: "prediction-total-value",
            label: t("common.totalValue"),
            value: state.orderQuantity > 0 ? formatUsd2(state.orderNotional) : "",
            suffix: "USDC",
            readOnly: true,
            position: "bottom"
          }
        )
      ] }),
      state.orderType === "market" && /* @__PURE__ */ jsxRuntime.jsx(
        PredictionOrderInput,
        {
          id: "prediction-order-amount",
          label: t("common.amount"),
          value: state.amount,
          suffix: /* @__PURE__ */ jsxRuntime.jsx(
            ui.Select.options,
            {
              size: "xs",
              showCaret: true,
              value: state.amountUnit,
              options: amountUnitOptions,
              valueFormatter: (value) => amountUnitOptions.find((option) => option.value === value)?.label,
              classNames: {
                trigger: "oui-w-auto oui-border-none oui-bg-transparent oui-p-0 oui-shadow-none oui-text-base-contrast"
              },
              contentProps: { className: "oui-min-w-[112px]" },
              onValueChange: state.setAmountUnit
            }
          ),
          onChange: state.setAmount,
          dp: state.amountUnit === "quote" ? 2 : 4,
          position: "single"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "oui-mt-2 xl:oui-mt-3", children: [
      /* @__PURE__ */ jsxRuntime.jsx(
        ui.Slider,
        {
          value: [canAdjustAmount ? state.orderPercentage : 0],
          min: 0,
          max: 100,
          step: 1,
          markCount: 4,
          showTip: true,
          color: sliderColor,
          disabled: !canAdjustAmount,
          tipFormatter: (value) => `${Math.round(value)}%`,
          onValueChange: (value) => state.setOrderPercentage(value[0])
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "oui-flex oui-items-center oui-justify-between oui-pt-1 xl:oui-pt-2", children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          ui.Text.numeral,
          {
            size: "2xs",
            color: sliderColor,
            dp: 2,
            padding: false,
            suffix: "%",
            children: canAdjustAmount ? state.orderPercentage : 0
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsxs(
          "button",
          {
            type: "button",
            disabled: !canAdjustAmount,
            onClick: () => state.setOrderPercentage(100),
            className: "oui-flex oui-items-center oui-gap-1 oui-text-2xs oui-text-base-contrast-54 disabled:oui-cursor-not-allowed",
            children: [
              t(
                state.orderSide === "buy" ? "orderEntry.maxBuy" : "orderEntry.maxSell"
              ),
              /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: "2xs", color: sliderColor, children: maxDisplayValue })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "oui-mt-4 oui-space-y-2 oui-text-xs", children: [
      /* @__PURE__ */ jsxRuntime.jsx(
        InfoRow,
        {
          label: t("prediction.odds"),
          hint: t("prediction.oddsHint"),
          value: `${state.odds.toFixed(2)}x`,
          dashed: true
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsx(
        InfoRow,
        {
          label: t("prediction.toWin"),
          hint: t("prediction.toWinHint"),
          value: state.orderQuantity > 0 ? `${formatUsd2(state.estimatedPayout)} USDC` : "-- USDC",
          dashed: true
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx(
      ui.Button,
      {
        className: ui.cn(
          "oui-mt-4",
          !orderEntryFunded ? "oui-bg-base-5 oui-text-base-contrast-36" : state.orderSide === "buy" ? "oui-bg-success-darken hover:oui-bg-success-darken/80 active:oui-bg-success-darken/80" : "oui-bg-danger-darken hover:oui-bg-danger-darken/80 active:oui-bg-danger-darken/80"
        ),
        fullWidth: true,
        size: "md",
        disabled: !orderEntryFunded || !state.canPlaceOrder,
        onClick: state.placeOrder,
        children: buttonLabel
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "oui-mt-2 oui-text-center oui-text-2xs oui-font-normal oui-text-base-contrast-54", children: [
      t("prediction.tradingAgreement"),
      " ",
      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "oui-border-b oui-border-line-36 oui-text-base-contrast-54", children: t("prediction.termOfUse") })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "oui-mt-4 oui-space-y-2 oui-text-xs", children: [
      state.orderType === "market" && /* @__PURE__ */ jsxRuntime.jsx(
        uiOrderEntry.SlippageUI,
        {
          slippage: state.slippage,
          setSlippage: state.setSlippage,
          estSlippage: state.estimatedSlippage
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsx(
        InfoRow,
        {
          label: t("common.fees"),
          value: `${t("dmm.taker")}: --% / ${t("dmm.maker")}: 0%`
        }
      )
    ] })
  ] }) });
};
var PredictionPrototypeAuthContext = React2__default.default.createContext("real");
var PrototypeAuthPrompt = ({ state, disabled = false }) => {
  const { t } = i18n.useTranslation();
  const content = {
    disconnected: {
      label: t("connector.connectWallet"),
      description: t("connector.trade.connectWallet.tooltip")
    },
    connected: {
      label: t("connector.createAccount"),
      description: t("connector.trade.createAccount.tooltip")
    },
    accountReady: {
      label: t("common.deposit"),
      description: t("trading.asset.startTrading.description")
    }
  }[state];
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "oui-flex oui-h-full oui-min-h-36 oui-flex-col oui-items-center oui-justify-center oui-p-6 oui-text-center", children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      ui.Button,
      {
        size: "md",
        color: "primary",
        variant: disabled ? void 0 : "gradient",
        disabled,
        children: content.label
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: "2xs", intensity: 36, className: "oui-mt-4 oui-max-w-sm", children: content.description })
  ] });
};
var OutcomeBadge = ({
  outcome
}) => {
  const { t } = i18n.useTranslation();
  return /* @__PURE__ */ jsxRuntime.jsx(
    ui.Badge,
    {
      className: "oui-prediction-outcomeBadge oui-uppercase",
      color: outcome === "up" ? "buy" : "sell",
      size: "xs",
      children: t(`prediction.${outcome}`)
    }
  );
};
var TableNumber = ({ value, dp = 4, prefix, suffix }) => /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "oui-prediction-dataTable-number oui-whitespace-nowrap oui-tabular-nums", children: [
  prefix,
  /* @__PURE__ */ jsxRuntime.jsx(ui.Text.numeral, { dp, padding: false, children: value }),
  suffix && ` ${suffix}`
] });
var PredictionDataPanel = ({
  state,
  tabs = [
    "predictions",
    "openOrders",
    "filled",
    "predictionHistory",
    "orderHistory",
    "assets"
  ],
  className,
  embedded = false
}) => {
  const { t } = i18n.useTranslation();
  const [positionProduct, setPositionProduct] = React2.useState("prediction");
  const showPrototypeData = state.prototypeAuthState === "real" || state.prototypeAuthState === "funded";
  const tabCount = {
    openOrders: showPrototypeData ? state.openOrders.length : 0,
    predictions: showPrototypeData ? state.positions.length : 0
  };
  const tabContent = {
    openOrders: /* @__PURE__ */ jsxRuntime.jsx(SharedProductOrdersPanel, { state, mode: "pending" }),
    predictions: /* @__PURE__ */ jsxRuntime.jsx(
      SharedProductDataPanel,
      {
        state,
        type: "positions",
        initialProduct: "prediction",
        onProductChange: setPositionProduct
      }
    ),
    filled: /* @__PURE__ */ jsxRuntime.jsx(SharedProductOrdersPanel, { state, mode: "filled" }),
    predictionHistory: /* @__PURE__ */ jsxRuntime.jsx(
      SharedProductDataPanel,
      {
        state,
        type: "positionHistory",
        initialProduct: "prediction"
      }
    ),
    assets: /* @__PURE__ */ jsxRuntime.jsx(AssetsTable, { state }),
    orderHistory: /* @__PURE__ */ jsxRuntime.jsx(SharedProductOrdersPanel, { state, mode: "history" })
  };
  return /* @__PURE__ */ jsxRuntime.jsx(PredictionPrototypeAuthContext.Provider, { value: state.prototypeAuthState, children: /* @__PURE__ */ jsxRuntime.jsxs(
    ui.Box,
    {
      intensity: 900,
      r: embedded ? void 0 : "2xl",
      p: embedded ? 0 : 2,
      className: ui.cn(
        "oui-prediction-dataPanel-container oui-h-full oui-overflow-hidden",
        "oui-relative",
        className
      ),
      children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          ui.Tabs,
          {
            className: "oui-prediction-dataPanel-tabs oui-h-full",
            value: state.activeTab,
            onValueChange: (value) => state.setActiveTab(value),
            variant: embedded ? void 0 : "contained",
            size: embedded ? void 0 : "lg",
            classNames: {
              tabsList: embedded ? "!oui-border-none oui-pb-1" : void 0,
              trigger: "oui-group oui-dataPanel-tab-btn",
              tabsContent: embedded ? "oui-h-[calc(100%_-_28px)] oui-min-h-36 oui-overflow-x-auto" : "oui-h-[calc(100%_-_32px)] oui-min-h-36 oui-overflow-x-auto"
            },
            children: tabs.map((tab) => /* @__PURE__ */ jsxRuntime.jsx(
              ui.TabPanel,
              {
                value: tab,
                title: /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
                  t(`prediction.tab.${tab}`),
                  (tabCount[tab] ?? 0) > 0 && ` (${tabCount[tab]})`
                ] }),
                children: tabContent[tab]
              },
              tab
            ))
          }
        ),
        state.activeTab === "predictions" && positionProduct === "perps" && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "oui-absolute oui-end-2 oui-top-2 oui-z-10", children: /* @__PURE__ */ jsxRuntime.jsx(trading.PerpsPositionsSettings, {}) })
      ]
    }
  ) });
};
var SharedProductDataPanel = ({
  state,
  type,
  initialProduct,
  perpsSymbol,
  beforeProductSelector,
  perpsPositionsContent,
  perpsPositionHistoryContent,
  onProductChange
}) => {
  const { t } = i18n.useTranslation();
  const [product, setProduct] = React2.useState(initialProduct);
  const [perpsPositions] = hooks.usePositionStream();
  const perpsPositionCount = reactApp.useDataTap(perpsPositions.rows?.length) ?? 0;
  const predictionPositionCount = state.positions.length;
  const content = product === "prediction" ? type === "positions" ? /* @__PURE__ */ jsxRuntime.jsx(HoldingsTable, { state }) : /* @__PURE__ */ jsxRuntime.jsx(PredictionHistoryTable, { state }) : type === "positions" ? perpsPositionsContent ?? /* @__PURE__ */ jsxRuntime.jsx(trading.PerpsPositionsPanel, { symbol: perpsSymbol }) : perpsPositionHistoryContent ?? /* @__PURE__ */ jsxRuntime.jsx(uiPositions.PositionHistoryWidget, {});
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "oui-flex oui-h-full oui-min-h-0 oui-flex-col", children: [
    beforeProductSelector,
    /* @__PURE__ */ jsxRuntime.jsx(
      "div",
      {
        role: "tablist",
        "aria-label": t("common.positions"),
        className: "oui-mt-2 oui-inline-flex oui-w-fit oui-gap-x-[6px]",
        children: ["perps", "prediction"].map((item) => {
          const active = product === item;
          return /* @__PURE__ */ jsxRuntime.jsxs(
            "button",
            {
              type: "button",
              role: "tab",
              "aria-selected": active,
              onClick: () => {
                setProduct(item);
                onProductChange?.(item);
              },
              "data-state": active ? "active" : "inactive",
              className: ui.cn(
                "oui-group !oui-rounded-md oui-inline-flex oui-h-7 oui-items-center oui-justify-center oui-gap-x-1 oui-bg-base-7 oui-px-3 oui-text-2xs oui-font-medium oui-text-base-contrast-36 oui-transition-all hover:oui-bg-base-5 hover:oui-text-base-contrast-54 data-[state=active]:oui-bg-base-5 data-[state=active]:oui-text-base-contrast"
              ),
              children: [
                item === "perps" ? t("common.perps") : t("prediction.title"),
                " (",
                item === "perps" ? perpsPositionCount : predictionPositionCount,
                ")"
              ]
            },
            item
          );
        })
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "oui-min-h-0 oui-flex-1 oui-overflow-hidden", children: content })
  ] });
};
var tableColumn = (title, width, options) => ({ title, width, ...options });
var PredictionDataTable = ({ columns, rows, minWidth = 720, toolbar }) => {
  const prototypeAuthState = React2__default.default.useContext(PredictionPrototypeAuthContext);
  const { pagination, setPage } = ui.usePagination({ pageSize: 8 });
  const dataColumns = React2.useMemo(
    () => columns.map((column, index) => ({
      title: column.title,
      plantTextTitle: typeof column.title === "string" ? column.title : void 0,
      dataIndex: `cell_${index}`,
      width: column.width,
      align: column.align ?? "left",
      fixed: column.fixed,
      type: column.type,
      onSort: column.sortable,
      render: (_value, record) => record.cells[index],
      renderPlantText: (_value, record) => String(record.sortValues?.[index] ?? "")
    })),
    [columns]
  );
  const dataSource = React2.useMemo(
    () => rows.map(
      (row) => row.cells.reduce(
        (record, cell, index) => {
          record[`cell_${index}`] = row.sortValues?.[index] ?? cell;
          return record;
        },
        { ...row }
      )
    ),
    [rows]
  );
  React2.useEffect(() => {
    setPage(1);
  }, [dataSource.length, setPage]);
  const tablePagination = dataSource.length > 8 ? {
    ...pagination,
    pageSize: 8,
    count: dataSource.length
  } : void 0;
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      className: "oui-prediction-dataTable-container oui-h-full",
      style: { minWidth },
      children: [
        toolbar,
        prototypeAuthState === "real" ? /* @__PURE__ */ jsxRuntime.jsx(
          uiConnector.AuthGuardDataTable,
          {
            className: "oui-prediction-dataTable",
            columns: dataColumns,
            dataSource,
            bordered: true,
            ignoreLoadingCheck: true,
            classNames: {
              header: "oui-h-[38px]",
              root: ui.cn(
                "oui-items-start",
                toolbar && "!oui-h-[calc(100%_-_49px)]"
              )
            },
            onRow: () => ({
              className: "oui-h-12 oui-text-base-contrast-80"
            }),
            generatedRowKey: (record) => record.id,
            pagination: tablePagination,
            features: [ui.TableFeatures.DownloadFeature]
          }
        ) : /* @__PURE__ */ jsxRuntime.jsx(
          ui.DataTable,
          {
            className: "oui-prediction-dataTable",
            columns: dataColumns,
            dataSource: prototypeAuthState === "funded" ? dataSource : [],
            bordered: true,
            ignoreLoadingCheck: true,
            emptyView: prototypeAuthState === "funded" ? void 0 : /* @__PURE__ */ jsxRuntime.jsx(PrototypeAuthPrompt, { state: prototypeAuthState }),
            classNames: {
              header: "oui-h-[38px]",
              root: ui.cn(
                "oui-items-start",
                toolbar && "!oui-h-[calc(100%_-_49px)]"
              )
            },
            onRow: () => ({
              className: "oui-h-12 oui-text-base-contrast-80"
            }),
            generatedRowKey: (record) => record.id,
            pagination: tablePagination,
            features: [ui.TableFeatures.DownloadFeature]
          }
        )
      ]
    }
  );
};
var RoundSymbol = ({
  round,
  outcome
}) => {
  const { t } = i18n.useTranslation();
  const { formatRoundBadge: formatRoundBadge2 } = usePredictionFormatters();
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "oui-flex oui-items-center oui-gap-2 oui-py-1 oui-whitespace-nowrap", children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      "span",
      {
        "aria-hidden": "true",
        className: ui.cn(
          "oui-h-[42px] oui-w-1 oui-shrink-0 oui-rounded-[1px]",
          outcome === "up" ? "oui-bg-trade-profit" : "oui-bg-trade-loss"
        )
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", { children: t("prediction.btcUpDown") }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "oui-mt-1 oui-text-base-contrast-54 oui-tabular-nums", children: formatRoundBadge2(round) })
    ] })
  ] });
};
var PredictionOrderSymbol = ({
  order
}) => {
  const { t } = i18n.useTranslation();
  const { formatRoundBadge: formatRoundBadge2 } = usePredictionFormatters();
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "oui-flex oui-items-center oui-gap-2 oui-py-1", children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      "span",
      {
        "aria-label": t(`common.${order.side}`),
        title: t(`common.${order.side}`),
        className: ui.cn(
          "oui-h-[34px] oui-w-1 oui-shrink-0 oui-rounded-[1px]",
          order.side === "buy" ? "oui-bg-trade-profit" : "oui-bg-trade-loss"
        )
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "oui-min-w-0 oui-text-base-contrast", children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "oui-whitespace-nowrap", children: t("prediction.btcUpDown") }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "oui-mt-1 oui-flex oui-items-center oui-gap-1 oui-whitespace-nowrap", children: [
        /* @__PURE__ */ jsxRuntime.jsx(ui.Badge, { color: "neutral", size: "xs", children: t(`common.${order.type}`) }),
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "oui-whitespace-nowrap oui-text-base-contrast-54 oui-tabular-nums", children: formatRoundBadge2(order.round) })
      ] })
    ] })
  ] });
};
var SellPosition = ({
  state,
  outcome
}) => {
  const { t } = i18n.useTranslation();
  const [open, setOpen] = React2.useState(false);
  const [quantity, setQuantity] = React2.useState("");
  const [price, setPrice] = React2.useState("");
  const [type, setType] = React2.useState("market");
  const available = state.availableQuantity(outcome);
  const estimatedSlippage = React2.useMemo(
    () => state.estimateOrderSlippage("sell", Number(quantity), outcome),
    [outcome, quantity, state]
  );
  const isSlippageExceeded = type === "market" && estimatedSlippage !== null && estimatedSlippage > new utils.Decimal(state.slippage || 0).div(100).toNumber();
  const percentage = available > 0 ? Math.max(
    0,
    Math.min(
      100,
      new utils.Decimal(Number(quantity) || 0).div(available).mul(100).toNumber()
    )
  ) : 0;
  const selectPercentage = (value) => setQuantity(
    value === 100 ? String(available) : new utils.Decimal(available).mul(value).div(100).toFixed(4, utils.Decimal.ROUND_DOWN)
  );
  const tradable = state.isRoundTradable && !state.isRegionRestricted;
  const valid = tradable && Number(quantity) > 0 && Number(quantity) <= available && !isSlippageExceeded && (type === "market" || Number(price) > 0 && Number(price) < 1);
  return /* @__PURE__ */ jsxRuntime.jsxs(
    ui.PopoverRoot,
    {
      open,
      onOpenChange: (value) => {
        setOpen(value);
        if (value) {
          setQuantity(String(available));
          setPrice(state.outcomePrices[outcome].toFixed(4));
        }
      },
      children: [
        /* @__PURE__ */ jsxRuntime.jsx(ui.PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntime.jsx(
          ui.Button,
          {
            size: "sm",
            variant: "outlined",
            color: "secondary",
            disabled: !tradable || available <= 0,
            children: t("common.sell")
          }
        ) }),
        /* @__PURE__ */ jsxRuntime.jsx(
          ui.PopoverContent,
          {
            side: "top",
            align: "end",
            className: "oui-w-[360px] oui-max-w-[calc(100vw-32px)] oui-p-5",
            onOpenAutoFocus: (event) => event.preventDefault(),
            children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "oui-flex oui-flex-col oui-gap-2", children: [
              /* @__PURE__ */ jsxRuntime.jsx("div", { children: /* @__PURE__ */ jsxRuntime.jsx(OutcomeBadge, { outcome }) }),
              /* @__PURE__ */ jsxRuntime.jsx("div", { className: "oui-mb-1 oui-flex oui-w-full oui-items-center oui-gap-2", children: /* @__PURE__ */ jsxRuntime.jsx(
                ui.Input.tooltip,
                {
                  prefix: t("common.quantity"),
                  align: "right",
                  size: "md",
                  fullWidth: true,
                  autoComplete: "off",
                  formatters: [
                    ui.inputFormatter.numberFormatter,
                    ui.inputFormatter.dpFormatter(4)
                  ],
                  triggerClassName: "oui-min-w-0 oui-flex-1",
                  classNames: {
                    prefix: "oui-text-base-contrast-54",
                    root: "oui-w-full oui-outline-line-12"
                  },
                  value: quantity,
                  onValueChange: setQuantity
                }
              ) }),
              /* @__PURE__ */ jsxRuntime.jsx("div", { className: "oui-flex oui-w-full oui-gap-2", children: [25, 50, 75, 100].map((value) => /* @__PURE__ */ jsxRuntime.jsxs(
                ui.Button,
                {
                  variant: "outlined",
                  size: "xs",
                  color: "secondary",
                  className: ui.cn(
                    "oui-w-1/4",
                    percentage === value && "oui-border-primary oui-text-primary"
                  ),
                  onClick: () => selectPercentage(value),
                  children: [
                    value,
                    "%"
                  ]
                },
                value
              )) }),
              /* @__PURE__ */ jsxRuntime.jsx(
                ui.Slider,
                {
                  showTip: true,
                  markCount: 4,
                  min: 0,
                  max: 100,
                  color: "primary",
                  value: [percentage],
                  onValueChange: ([value]) => selectPercentage(value)
                }
              ),
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "oui-flex oui-w-full oui-items-center oui-justify-between", children: [
                /* @__PURE__ */ jsxRuntime.jsxs(ui.Text, { size: "2xs", color: "primary", children: [
                  new utils.Decimal(percentage).toDecimalPlaces(2).toNumber(),
                  "%"
                ] }),
                /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "oui-flex oui-items-center oui-gap-1", children: [
                  /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: "2xs", intensity: 54, children: t("common.available") }),
                  /* @__PURE__ */ jsxRuntime.jsx(ui.Text.numeral, { intensity: 54, size: "2xs", dp: 4, padding: false, children: available })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntime.jsx(ui.Divider, { my: 2, intensity: 8, className: "oui-w-full" }),
              /* @__PURE__ */ jsxRuntime.jsx(
                ui.Input.tooltip,
                {
                  size: "md",
                  fullWidth: true,
                  autoComplete: "off",
                  triggerClassName: "oui-w-full",
                  formatters: [
                    ui.inputFormatter.numberFormatter,
                    ui.inputFormatter.dpFormatter(4)
                  ],
                  value: type === "market" ? "" : price,
                  onValueChange: setPrice,
                  disabled: type === "market",
                  placeholder: type === "market" ? "--" : "",
                  classNames: {
                    suffix: "oui-text-base-contrast-54",
                    root: "oui-w-full oui-outline-line-12 focus-within:oui-outline-line-12"
                  },
                  suffix: /* @__PURE__ */ jsxRuntime.jsx(
                    ui.Select.options,
                    {
                      variant: "text",
                      size: "md",
                      classNames: {
                        trigger: "oui-w-[--radix-select-content-available-width]"
                      },
                      contentProps: {
                        align: "end",
                        className: "oui-border oui-border-line-6"
                      },
                      value: type,
                      options: [
                        { label: t("common.limit"), value: "limit" },
                        { label: t("common.market"), value: "market" }
                      ],
                      onValueChange: (value) => setType(value)
                    }
                  )
                }
              ),
              type === "market" && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "oui-mt-2", children: /* @__PURE__ */ jsxRuntime.jsx(
                uiOrderEntry.SlippageUI,
                {
                  slippage: state.slippage,
                  setSlippage: state.setSlippage,
                  estSlippage: estimatedSlippage
                }
              ) }),
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "oui-mt-3 oui-flex oui-w-full oui-gap-2 oui-pb-1", children: [
                /* @__PURE__ */ jsxRuntime.jsx(
                  ui.Button,
                  {
                    size: "md",
                    fullWidth: true,
                    color: "secondary",
                    onClick: () => setOpen(false),
                    children: t("common.cancel")
                  }
                ),
                /* @__PURE__ */ jsxRuntime.jsx(
                  ui.Button,
                  {
                    size: "md",
                    fullWidth: true,
                    disabled: !valid,
                    onClick: () => {
                      if (state.sellPosition(
                        outcome,
                        Number(quantity),
                        type,
                        Number(price)
                      ))
                        setOpen(false);
                    },
                    children: t("common.confirm")
                  }
                )
              ] })
            ] })
          }
        )
      ]
    }
  );
};
var PredictionFilters = ({
  filters,
  mode,
  trailing,
  leadingItems = [],
  onLeadingFilter
}) => {
  const { t } = i18n.useTranslation();
  const items = [];
  if (mode !== "holdings" && mode !== "settlements")
    items.push({
      type: "select",
      name: "side",
      value: filters.side,
      options: [
        { label: t("common.side.all"), value: "all" },
        { label: t("common.buy"), value: "buy" },
        { label: t("common.sell"), value: "sell" }
      ]
    });
  items.push({
    type: "select",
    name: "outcome",
    value: filters.outcome,
    options: [
      { label: t("prediction.filter.allOutcomes"), value: "all" },
      { label: t("prediction.up"), value: "up" },
      { label: t("prediction.down"), value: "down" }
    ]
  });
  if (mode === "history") {
    items.push({
      type: "select",
      name: "status",
      value: filters.status,
      options: [
        { label: t("common.status.all"), value: "all" },
        { label: t("orders.status.pending"), value: "pending" },
        { label: t("prediction.status.filled"), value: "filled" },
        { label: t("prediction.status.cancelled"), value: "cancelled" }
      ]
    });
  }
  if (mode === "history" || mode === "settlements") {
    items.push({
      type: "range",
      name: "dateRange",
      value: { from: filters.dateRange.from, to: filters.dateRange.to },
      fromDate: predictionDateRange(90).from,
      toDate: predictionDateRange(1).to
    });
  }
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "oui-flex oui-flex-wrap oui-items-center oui-gap-3 oui-px-2", children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      ui.DataFilter,
      {
        className: "oui-w-auto oui-flex-wrap oui-gap-y-3",
        items: [...leadingItems, ...items],
        onFilter: (filter) => {
          if (leadingItems.some((item) => item.name === filter.name)) {
            onLeadingFilter?.(filter);
            return;
          }
          filters.onFilter(filter);
        }
      }
    ),
    mode === "settlements" && [1, 7, 30, 90].map((days) => /* @__PURE__ */ jsxRuntime.jsxs(
      "button",
      {
        type: "button",
        "aria-pressed": filters.days === days,
        onClick: () => filters.updateDays(days),
        className: "oui-relative oui-rounded oui-px-2 oui-py-[2px] oui-text-sm",
        children: [
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "oui-pointer-events-none oui-absolute oui-inset-0 oui-rounded oui-opacity-[.12] oui-gradient-primary" }),
          /* @__PURE__ */ jsxRuntime.jsxs(
            ui.Text.gradient,
            {
              color: filters.days === days ? "brand" : void 0,
              className: filters.days !== days ? "oui-text-base-contrast-54" : void 0,
              children: [
                days,
                "D"
              ]
            }
          )
        ]
      },
      days
    )),
    trailing && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "oui-ml-auto", children: trailing })
  ] });
};
var HoldingsTable = ({
  state,
  leadingFilterItems,
  onLeadingFilter
}) => {
  const { t } = i18n.useTranslation();
  const filters = usePredictionFilters();
  return /* @__PURE__ */ jsxRuntime.jsx(
    PredictionDataTable,
    {
      minWidth: 1320,
      toolbar: /* @__PURE__ */ jsxRuntime.jsx(
        PredictionFilters,
        {
          filters,
          mode: "holdings",
          leadingItems: leadingFilterItems,
          onLeadingFilter
        }
      ),
      columns: [
        tableColumn(t("common.symbol"), 250, { fixed: "start" }),
        tableColumn(t("prediction.outcome"), 100),
        tableColumn(t("prediction.size"), 110, { sortable: true }),
        tableColumn(t("common.available"), 110, { sortable: true }),
        tableColumn(t("prediction.entryPrice"), 130, { sortable: true }),
        tableColumn(t("prediction.lastPrice"), 130, { sortable: true }),
        tableColumn(t("common.unrealizedPnl"), 170, { sortable: true }),
        tableColumn(t("prediction.countdownStatus"), 150),
        tableColumn("", 100, { fixed: "end", align: "right", type: "action" })
      ],
      rows: state.positions.filter(filters.matches).map((position) => ({
        id: position.outcome,
        sortValues: [
          void 0,
          void 0,
          position.quantity,
          state.availableQuantity(position.outcome),
          position.averagePrice,
          state.outcomePrices[position.outcome],
          new utils.Decimal(state.outcomePrices[position.outcome]).sub(position.averagePrice).mul(position.quantity).toNumber()
        ],
        cells: [
          /* @__PURE__ */ jsxRuntime.jsx(RoundSymbol, { round: state.round, outcome: position.outcome }),
          /* @__PURE__ */ jsxRuntime.jsx(OutcomeBadge, { outcome: position.outcome }),
          /* @__PURE__ */ jsxRuntime.jsx(TableNumber, { value: position.quantity }),
          /* @__PURE__ */ jsxRuntime.jsx(TableNumber, { value: state.availableQuantity(position.outcome) }),
          /* @__PURE__ */ jsxRuntime.jsx(TableNumber, { value: position.averagePrice }),
          /* @__PURE__ */ jsxRuntime.jsx(TableNumber, { value: state.outcomePrices[position.outcome] }),
          /* @__PURE__ */ jsxRuntime.jsx(ui.Text.pnl, { dp: 2, coloring: true, children: new utils.Decimal(state.outcomePrices[position.outcome]).sub(position.averagePrice).mul(position.quantity).toNumber() }),
          state.isRoundTradable ? formatCountdown(state.countdown) : t(`prediction.playground.phase.${state.roundPhase}`),
          /* @__PURE__ */ jsxRuntime.jsx(SellPosition, { state, outcome: position.outcome })
        ]
      }))
    }
  );
};
var PendingValue = ({
  state,
  order,
  field
}) => {
  const { t } = i18n.useTranslation();
  const [open, setOpen] = React2.useState(false);
  const [value, setValue] = React2.useState(String(order[field]));
  const [error, setError] = React2.useState(false);
  return /* @__PURE__ */ jsxRuntime.jsxs(
    ui.PopoverRoot,
    {
      open,
      onOpenChange: (next) => {
        setOpen(next);
        setValue(String(order[field]));
        setError(false);
      },
      children: [
        /* @__PURE__ */ jsxRuntime.jsx(ui.PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntime.jsxs(
          ui.Button,
          {
            variant: "text",
            color: "secondary",
            size: "xs",
            disabled: !state.isRoundTradable || state.isRegionRestricted,
            children: [
              field === "quantity" ? "0 / " : "",
              /* @__PURE__ */ jsxRuntime.jsx(TableNumber, { value: order[field] })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntime.jsxs(ui.PopoverContent, { side: "top", align: "end", className: "oui-w-64 oui-p-4", children: [
          /* @__PURE__ */ jsxRuntime.jsx(ui.Input, { value, onValueChange: setValue }),
          error && /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { color: "danger", children: t("prediction.invalidOrder") }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "oui-mt-3 oui-flex oui-justify-end oui-gap-2", children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              ui.Button,
              {
                size: "sm",
                variant: "outlined",
                color: "secondary",
                onClick: () => setOpen(false),
                children: t("common.cancel")
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx(
              ui.Button,
              {
                size: "sm",
                onClick: () => {
                  if (state.editPendingOrder(
                    order.id,
                    field === "price" ? Number(value) : order.price,
                    field === "quantity" ? Number(value) : order.quantity
                  ))
                    setOpen(false);
                  else setError(true);
                },
                children: t("common.confirm")
              }
            )
          ] })
        ] })
      ]
    }
  );
};
var PredictionOrderCell = ({
  state,
  order,
  field
}) => {
  const { t } = i18n.useTranslation();
  const { formatTableTime: formatTableTime2 } = usePredictionFormatters();
  const pending = !order.status;
  const filled = order.status === "filled";
  switch (field) {
    case "symbol":
      return /* @__PURE__ */ jsxRuntime.jsx(PredictionOrderSymbol, { order });
    case "side":
      return /* @__PURE__ */ jsxRuntime.jsx(OutcomeBadge, { outcome: order.outcome });
    case "fill_quantity":
      return pending ? /* @__PURE__ */ jsxRuntime.jsx(PendingValue, { state, order, field: "quantity" }) : /* @__PURE__ */ jsxRuntime.jsxs("span", { children: [
        /* @__PURE__ */ jsxRuntime.jsx(TableNumber, { value: filled ? order.quantity : 0 }),
        " /",
        " ",
        /* @__PURE__ */ jsxRuntime.jsx(TableNumber, { value: order.quantity })
      ] });
    case "quantity":
      return /* @__PURE__ */ jsxRuntime.jsx(TableNumber, { value: order.quantity });
    case "price":
      return pending ? /* @__PURE__ */ jsxRuntime.jsx(PendingValue, { state, order, field: "price" }) : order.type === "market" ? t("common.market") : /* @__PURE__ */ jsxRuntime.jsx(TableNumber, { value: order.price });
    case "average_executed_price":
      return filled ? /* @__PURE__ */ jsxRuntime.jsx(TableNumber, { value: order.price }) : "--";
    case "executed":
    case "notional":
      return /* @__PURE__ */ jsxRuntime.jsx(
        TableNumber,
        {
          value: new utils.Decimal(pending || filled ? order.quantity : 0).mul(order.price).toNumber(),
          dp: 2,
          suffix: "USDC"
        }
      );
    case "status":
      return t(
        pending ? "orders.status.pending" : filled ? "prediction.status.filled" : "prediction.status.cancelled"
      );
    case "created_time":
      return formatTableTime2(order.timestamp);
    case "action":
      return pending ? /* @__PURE__ */ jsxRuntime.jsx(
        ui.Button,
        {
          size: "sm",
          variant: "outlined",
          color: "secondary",
          disabled: state.isRegionRestricted,
          onClick: () => state.cancelOrder(order.id),
          children: t("common.cancel")
        }
      ) : null;
    default:
      return "--";
  }
};
var PredictionOrdersTable = ({
  state,
  mode,
  status,
  leadingFilterItems,
  onLeadingFilter
}) => {
  const { t } = i18n.useTranslation();
  const pending = mode === "pending";
  const filters = usePredictionFilters(mode === "history");
  const orderColumns = uiOrders.useOrderColumn({
    _type: pending ? uiOrders.TabType.pending : mode === "filled" ? uiOrders.TabType.filled : uiOrders.TabType.all,
    includePrediction: true
  });
  const records = pending ? state.openOrders : mode === "filled" ? state.history.filter((order) => order.status === "filled") : [...state.openOrders, ...state.history];
  return /* @__PURE__ */ jsxRuntime.jsx(
    PredictionDataTable,
    {
      minWidth: orderColumns.reduce(
        (width, column) => width + Number(column.width ?? 130),
        0
      ),
      columns: orderColumns.map(
        (column) => tableColumn(column.title, Number(column.width ?? 130), {
          fixed: column.fixed === "left" ? "start" : column.fixed === "right" ? "end" : column.fixed,
          align: column.align,
          type: column.type === "action" ? "action" : "data"
        })
      ),
      toolbar: /* @__PURE__ */ jsxRuntime.jsx(
        PredictionFilters,
        {
          filters,
          mode,
          leadingItems: leadingFilterItems,
          onLeadingFilter,
          trailing: pending ? /* @__PURE__ */ jsxRuntime.jsx(
            ui.Button,
            {
              size: "xs",
              variant: "outlined",
              color: "secondary",
              disabled: !state.openOrders.length || state.isRegionRestricted,
              onClick: state.cancelAllOrders,
              children: t("orders.cancelAll")
            }
          ) : void 0
        }
      ),
      rows: records.filter(
        (order) => !status || status === "cancelled" && "status" in order && order.status === "cancelled"
      ).filter(
        (order) => filters.matches({
          ...order,
          status: "status" in order ? String(order.status) : "pending"
        })
      ).map((order) => ({
        id: String(order.id),
        cells: orderColumns.map((column) => /* @__PURE__ */ jsxRuntime.jsx(
          PredictionOrderCell,
          {
            state,
            order,
            field: String(column.dataIndex)
          },
          String(column.dataIndex)
        ))
      }))
    }
  );
};
var AllProductOrdersTable = ({
  state,
  mode,
  includePrediction,
  productFilterItems,
  onProductFilter
}) => {
  const pending = mode === "pending";
  const type = pending ? uiOrders.TabType.pending : mode === "filled" ? uiOrders.TabType.filled : uiOrders.TabType.orderHistory;
  const orderListState = uiOrders.useOrderListScript({
    type,
    ordersStatus: pending ? types.OrderStatus.INCOMPLETE : mode === "filled" ? types.OrderStatus.FILLED : void 0
  });
  const predictionOrders = pending ? state.openOrders : mode === "filled" ? state.history.filter((order) => order.status === "filled") : [...state.openOrders, ...state.history];
  return /* @__PURE__ */ jsxRuntime.jsx(
    uiOrders.DesktopOrderList,
    {
      ...orderListState,
      additionalFilterItems: productFilterItems,
      onAdditionalFilter: onProductFilter,
      supplementalRows: includePrediction ? predictionOrders.map((order) => ({
        id: `prediction-${order.id}`,
        timestamp: order.timestamp,
        renderCell: (field) => /* @__PURE__ */ jsxRuntime.jsx(
          PredictionOrderCell,
          {
            state,
            order,
            field
          }
        )
      })) : void 0
    }
  );
};
var SharedProductOrdersPanel = ({ state, mode }) => {
  const { t } = i18n.useTranslation();
  const [instrument, setInstrument] = React2.useState("all");
  const productFilterItems = [
    {
      type: "select",
      name: "instrument",
      value: instrument,
      options: [
        { label: t("prediction.filter.allInstruments"), value: "all" },
        { label: t("common.perps"), value: "perps" },
        { label: t("prediction.title"), value: "prediction" }
      ]
    }
  ];
  const onProductFilter = ({ value }) => {
    if (value === "all" || value === "perps" || value === "prediction") {
      setInstrument(value);
    }
  };
  if (instrument === "prediction") {
    return /* @__PURE__ */ jsxRuntime.jsx(
      PredictionOrdersTable,
      {
        state,
        mode,
        leadingFilterItems: productFilterItems,
        onLeadingFilter: onProductFilter
      }
    );
  }
  if (instrument === "perps") {
    return /* @__PURE__ */ jsxRuntime.jsx(
      AllProductOrdersTable,
      {
        state,
        mode,
        includePrediction: false,
        productFilterItems,
        onProductFilter
      }
    );
  }
  return /* @__PURE__ */ jsxRuntime.jsx(
    AllProductOrdersTable,
    {
      state,
      mode,
      includePrediction: true,
      productFilterItems,
      onProductFilter
    }
  );
};
var PredictionHistoryTable = ({
  state,
  leadingFilterItems,
  onLeadingFilter
}) => {
  const { t } = i18n.useTranslation();
  const { formatTableTime: formatTableTime2 } = usePredictionFormatters();
  const filters = usePredictionFilters(true);
  return /* @__PURE__ */ jsxRuntime.jsx(
    PredictionDataTable,
    {
      minWidth: 1400,
      toolbar: /* @__PURE__ */ jsxRuntime.jsx(
        PredictionFilters,
        {
          filters,
          mode: "settlements",
          leadingItems: leadingFilterItems,
          onLeadingFilter
        }
      ),
      columns: [
        tableColumn(t("common.symbol"), 250, { fixed: "start" }),
        tableColumn(t("prediction.outcome"), 100),
        tableColumn(t("prediction.closedQuantity"), 130),
        tableColumn(t("prediction.avgEntryPrice"), 140),
        tableColumn(t("prediction.exitSettlementPrice"), 170),
        tableColumn(t("prediction.result"), 130),
        tableColumn(t("positions.history.column.netPnl"), 140, {
          sortable: true
        }),
        tableColumn(t("prediction.closedSettledTime"), 180, { sortable: true })
      ],
      rows: state.settlements.filter(
        (record) => filters.matches({
          outcome: record.outcome,
          status: record.result === "closed" ? "closed" : "settled",
          timestamp: record.settledAt
        })
      ).map((record) => ({
        id: String(record.id),
        sortValues: [
          void 0,
          void 0,
          void 0,
          void 0,
          void 0,
          void 0,
          record.pnl,
          record.settledAt
        ],
        cells: [
          /* @__PURE__ */ jsxRuntime.jsx(RoundSymbol, { round: record.round, outcome: record.outcome }),
          /* @__PURE__ */ jsxRuntime.jsx(OutcomeBadge, { outcome: record.outcome }),
          /* @__PURE__ */ jsxRuntime.jsx(TableNumber, { value: record.quantity }),
          /* @__PURE__ */ jsxRuntime.jsx(TableNumber, { value: record.averagePrice }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntime.jsx(TableNumber, { value: record.settlementPrice }),
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "oui-text-base-contrast-54", children: t(
              record.result === "closed" ? "prediction.exitPrice" : "prediction.settlementPrice"
            ) })
          ] }),
          record.result === "closed" ? t("prediction.closed") : /* @__PURE__ */ jsxRuntime.jsx(OutcomeBadge, { outcome: record.result ?? record.outcome }),
          /* @__PURE__ */ jsxRuntime.jsx(ui.Text.pnl, { dp: 2, coloring: true, children: record.pnl }),
          formatTableTime2(record.settledAt)
        ]
      }))
    }
  );
};
var AssetsTable = ({ state }) => {
  const { t } = i18n.useTranslation();
  const assets = buildMockPortfolioAssets(state.balance, state.currentPrice);
  return /* @__PURE__ */ jsxRuntime.jsx(
    PredictionDataTable,
    {
      minWidth: 1130,
      columns: [
        tableColumn(t("portfolio.overview.column.token"), 150, {
          fixed: "start",
          sortable: true
        }),
        tableColumn(t("portfolio.overview.column.qty"), 140, {
          sortable: true
        }),
        tableColumn(t("portfolio.overview.column.indexPrice"), 140, {
          sortable: true
        }),
        tableColumn(t("portfolio.overview.column.assetValue"), 140, {
          sortable: true
        }),
        tableColumn(t("portfolio.overview.column.collateralRatio"), 140, {
          sortable: true
        }),
        tableColumn(t("transfer.deposit.collateralContribution"), 140, {
          sortable: true
        }),
        tableColumn("", 180, {
          align: "right",
          fixed: "end",
          type: "action"
        })
      ],
      rows: assets.map((item) => ({
        id: item.asset,
        sortValues: [
          item.asset,
          item.quantity,
          item.indexPrice,
          item.assetValue,
          item.collateralRatio,
          item.collateralContribution,
          void 0
        ],
        cells: [
          /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "oui-flex oui-items-center oui-gap-2 oui-text-base-contrast", children: [
            /* @__PURE__ */ jsxRuntime.jsx(ui.TokenIcon, { name: item.asset, size: "sm" }),
            item.asset
          ] }),
          /* @__PURE__ */ jsxRuntime.jsx(TableNumber, { value: item.quantity }),
          /* @__PURE__ */ jsxRuntime.jsx(TableNumber, { value: item.indexPrice, dp: 6, prefix: "$" }),
          /* @__PURE__ */ jsxRuntime.jsx(TableNumber, { value: item.assetValue, dp: 6, prefix: "$" }),
          /* @__PURE__ */ jsxRuntime.jsx(
            TableNumber,
            {
              value: new utils.Decimal(item.collateralRatio).mul(100).toNumber(),
              dp: 2,
              suffix: "%"
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsx(TableNumber, { value: item.collateralContribution, dp: 6, prefix: "$" }),
          /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "oui-flex oui-items-center oui-justify-end oui-gap-3", children: [
            item.asset !== "USDC" && /* @__PURE__ */ jsxRuntime.jsx(
              ui.Button,
              {
                size: "sm",
                variant: "outlined",
                color: "secondary",
                onClick: () => state.triggerMockAssetAction("convert"),
                children: t("transfer.convert")
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx(
              ui.Button,
              {
                size: "sm",
                variant: "outlined",
                color: "secondary",
                onClick: () => state.triggerMockAssetAction("transfer"),
                children: t("common.transfer")
              }
            )
          ] })
        ]
      }))
    }
  );
};
var predictionMarketTab = {
  id: "prediction",
  name: "Prediction",
  match: () => false
};
var predictionMarketTabs = [
  markets.builtInTabs.favorites,
  markets.builtInTabs.all,
  markets.builtInTabs.crypto,
  predictionMarketTab,
  markets.builtInTabs.rwa,
  markets.builtInTabs.community,
  markets.builtInTabs.newListing,
  markets.builtInTabs.recent,
  markets.builtInTabs.preTge
];
var PredictionMarketPanel = ({ className, ...props }) => {
  const { t } = i18n.useTranslation();
  const { locale } = usePredictionFormatters();
  const { searchValue } = markets.useMarketsContext();
  const searchableText = `${t("prediction.btcUpDown")} BTC UP DOWN 5M`;
  const matchesSearch = !searchValue || searchableText.toLowerCase().includes(searchValue.trim().toLowerCase());
  const columns = React2.useMemo(
    () => [
      {
        title: t("common.symbol"),
        dataIndex: "symbol",
        width: 190,
        onSort: true,
        render: () => /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "oui-flex oui-min-w-0 oui-items-center oui-gap-2", children: [
          props.showFavoriteControl !== false && /* @__PURE__ */ jsxRuntime.jsx(
            "button",
            {
              type: "button",
              "aria-label": t("markets.favorites"),
              onClick: (event) => {
                event.stopPropagation();
                props.onToggleFavorite();
              },
              className: "oui-prediction-market-favorite-btn oui-me-1 oui-flex oui-size-3 oui-flex-none oui-cursor-pointer oui-items-center oui-justify-center",
              children: props.isFavorite ? /* @__PURE__ */ jsxRuntime.jsx(markets.FavoritesIcon2, { className: "oui-size-3" }) : /* @__PURE__ */ jsxRuntime.jsx(markets.UnFavoritesIcon2, { className: "oui-size-3" })
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsx(ui.TokenIcon, { name: "BTC", className: "oui-size-[18px]" }),
          /* @__PURE__ */ jsxRuntime.jsx(
            ui.Text,
            {
              size: "2xs",
              className: "oui-whitespace-nowrap oui-text-base-contrast",
              children: t("prediction.btcUpDown")
            }
          )
        ] })
      },
      {
        title: t("markets.column.last"),
        dataIndex: "lastPrice",
        width: 100,
        align: "right",
        onSort: true,
        render: (value) => /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: "2xs", children: formatContractPrice(value) })
      },
      {
        title: t("prediction.chance"),
        dataIndex: "chance",
        width: 80,
        align: "right",
        onSort: true,
        render: (value) => /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: "2xs", children: formatPercent(value) })
      },
      {
        title: t("prediction.volumeShort"),
        dataIndex: "volume",
        width: 80,
        align: "right",
        onSort: true,
        render: (value) => /* @__PURE__ */ jsxRuntime.jsxs(ui.Text, { size: "2xs", children: [
          "$",
          value.toLocaleString(toIntlLocale(locale))
        ] })
      },
      {
        title: t("common.time"),
        dataIndex: "time",
        width: 80,
        align: "right",
        onSort: true,
        render: (value) => /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: "2xs", children: value })
      }
    ],
    [locale, props.isFavorite, props.onToggleFavorite, props.round, t]
  );
  const dataSource = matchesSearch ? [
    {
      symbol: PREDICTION_MARKET_ID,
      chance: props.upChance,
      lastPrice: props.outcomePrices.up,
      volume: PREDICTION_MARKET_VOLUME,
      time: props.isRoundTradable ? formatCountdown(props.countdown) : "00:00"
    }
  ] : [];
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      className: ui.cn(
        "oui-relative oui-z-[3] oui-overflow-hidden oui-bg-base-8 oui-px-1 oui-pb-2",
        className
      ),
      children: /* @__PURE__ */ jsxRuntime.jsx(
        ui.DataTable,
        {
          columns,
          dataSource,
          generatedRowKey: (record) => record.symbol,
          classNames: {
            root: "!oui-h-auto !oui-bg-base-8",
            scroll: "!oui-h-auto !oui-min-h-0",
            header: "oui-h-9"
          },
          onRow: () => ({
            className: "oui-prediction-market-row !oui-h-[34px]",
            onClick: props.onSelect
          })
        }
      )
    }
  );
};
var PredictionPlayground = ({
  roundPhase,
  setRoundPhase,
  roundView,
  setRoundView,
  prototypeAuthState,
  setPrototypeAuthState,
  prototypeRegionState,
  setPrototypeRegionState
}) => {
  const { t } = i18n.useTranslation();
  const [open, setOpen] = React2.useState(false);
  const phases = roundView === "past" ? ["resolving", "resolvedUp", "resolvedDown"] : ["trading"];
  const authStates = [
    "disconnected",
    "connected",
    "accountReady",
    "funded"
  ];
  const regionStates = [
    "allowed",
    "restricted"
  ];
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "oui-fixed oui-bottom-4 oui-end-4 oui-z-50", children: [
    open && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "oui-absolute oui-bottom-14 oui-end-0 oui-max-h-[calc(100vh-88px)] oui-w-64 oui-overflow-y-auto oui-rounded-xl oui-border oui-border-line-12 oui-bg-base-5 oui-p-2 oui-shadow-xl", children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "oui-px-2 oui-py-1.5 oui-text-xs oui-font-semibold oui-text-base-contrast", children: t("prediction.playground") }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "oui-mb-1 oui-mt-1 oui-px-2 oui-text-3xs oui-font-semibold oui-uppercase oui-text-base-contrast-36", children: t("prediction.playground.roundView") }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "oui-space-y-1", children: ["past", "live", "future"].map((view) => /* @__PURE__ */ jsxRuntime.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setRoundView(view),
          className: ui.cn(
            "oui-flex oui-w-full oui-items-center oui-justify-between oui-rounded-lg oui-px-2 oui-py-2 oui-text-start oui-text-xs oui-transition-colors",
            roundView === view ? "oui-bg-base-6 oui-text-base-contrast" : "oui-text-base-contrast-54 hover:oui-bg-base-6 hover:oui-text-base-contrast-80"
          ),
          children: [
            t(`prediction.playground.view.${view}`),
            roundView === view && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "oui-size-1.5 oui-rounded-full oui-bg-primary" })
          ]
        },
        view
      )) }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "oui-mb-1 oui-mt-3 oui-border-t oui-border-line-12 oui-px-2 oui-pt-3 oui-text-3xs oui-font-semibold oui-uppercase oui-text-base-contrast-36", children: t("prediction.playground.round") }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "oui-space-y-1", children: phases.map((phase) => /* @__PURE__ */ jsxRuntime.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setRoundPhase(phase),
          className: ui.cn(
            "oui-flex oui-w-full oui-items-center oui-justify-between oui-rounded-lg oui-px-2 oui-py-2 oui-text-start oui-text-xs oui-transition-colors",
            roundPhase === phase ? "oui-bg-base-6 oui-text-base-contrast" : "oui-text-base-contrast-54 hover:oui-bg-base-6 hover:oui-text-base-contrast-80"
          ),
          children: [
            t(`prediction.playground.phase.${phase}`),
            roundPhase === phase && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "oui-size-1.5 oui-rounded-full oui-bg-primary" })
          ]
        },
        phase
      )) }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "oui-mb-1 oui-mt-3 oui-border-t oui-border-line-12 oui-px-2 oui-pt-3 oui-text-3xs oui-font-semibold oui-uppercase oui-text-base-contrast-36", children: t("prediction.playground.auth") }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "oui-space-y-1", children: authStates.map((authState) => /* @__PURE__ */ jsxRuntime.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setPrototypeAuthState(authState),
          className: ui.cn(
            "oui-flex oui-w-full oui-items-center oui-justify-between oui-rounded-lg oui-px-2 oui-py-2 oui-text-start oui-text-xs oui-transition-colors",
            prototypeAuthState === authState ? "oui-bg-base-6 oui-text-base-contrast" : "oui-text-base-contrast-54 hover:oui-bg-base-6 hover:oui-text-base-contrast-80"
          ),
          children: [
            t(`prediction.playground.auth.${authState}`),
            prototypeAuthState === authState && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "oui-size-1.5 oui-rounded-full oui-bg-primary" })
          ]
        },
        authState
      )) }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "oui-mb-1 oui-mt-3 oui-border-t oui-border-line-12 oui-px-2 oui-pt-3 oui-text-3xs oui-font-semibold oui-uppercase oui-text-base-contrast-36", children: t("prediction.playground.region") }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "oui-space-y-1", children: regionStates.map((regionState) => /* @__PURE__ */ jsxRuntime.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setPrototypeRegionState(regionState),
          className: ui.cn(
            "oui-flex oui-w-full oui-items-center oui-justify-between oui-rounded-lg oui-px-2 oui-py-2 oui-text-start oui-text-xs oui-transition-colors",
            prototypeRegionState === regionState ? "oui-bg-base-6 oui-text-base-contrast" : "oui-text-base-contrast-54 hover:oui-bg-base-6 hover:oui-text-base-contrast-80"
          ),
          children: [
            t(`prediction.playground.region.${regionState}`),
            prototypeRegionState === regionState && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "oui-size-1.5 oui-rounded-full oui-bg-primary" })
          ]
        },
        regionState
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx(
      ui.Button,
      {
        size: "md",
        color: "primary",
        className: "oui-shadow-xl",
        onClick: () => setOpen((visible) => !visible),
        children: t("prediction.playground")
      }
    )
  ] });
};
var MobileMarketPanel = (state) => {
  const { t } = i18n.useTranslation();
  const [tab, setTab] = React2.useState("chart");
  const [contentVisible, setContentVisible] = React2.useState(true);
  return /* @__PURE__ */ jsxRuntime.jsxs(
    ui.Tabs,
    {
      value: tab,
      onValueChange: (value) => setTab(value),
      variant: "contained",
      size: "lg",
      contentVisible,
      className: "oui-prediction-mobileMarket-tabs oui-overflow-hidden oui-rounded-xl oui-bg-base-9",
      classNames: {
        tabsList: "oui-p-2",
        tabsContent: "oui-min-h-[360px]"
      },
      trailing: /* @__PURE__ */ jsxRuntime.jsx(
        "button",
        {
          type: "button",
          "aria-expanded": contentVisible,
          className: "oui-px-5 oui-text-base-contrast-54 hover:oui-text-base-contrast-80",
          onClick: () => setContentVisible((visible) => !visible),
          children: /* @__PURE__ */ jsxRuntime.jsx(
            ui.ChevronUpIcon,
            {
              className: ui.cn(
                "oui-transition-transform",
                !contentVisible && "oui-rotate-180"
              ),
              size: 14,
              color: "inherit"
            }
          )
        }
      ),
      children: [
        /* @__PURE__ */ jsxRuntime.jsx(ui.TabPanel, { title: t("trading.tabs.chart"), value: "chart", children: /* @__PURE__ */ jsxRuntime.jsx(
          PriceChart,
          {
            selectedRound: state.selectedRound,
            onSelectRound: state.selectMarketRound,
            points: state.priceHistory,
            openingPrice: state.openingPrice,
            currentPrice: state.currentPrice,
            round: state.round,
            countdown: state.countdown,
            roundPhase: state.roundPhase,
            onGoToLiveMarket: state.goToLiveRound
          }
        ) }),
        /* @__PURE__ */ jsxRuntime.jsx(ui.TabPanel, { title: t("trading.tabs.data"), value: "data", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "oui-h-[360px] oui-space-y-2 oui-rounded-b-xl oui-bg-base-9 oui-px-4 oui-pb-4", children: [
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "oui-flex oui-w-full oui-items-center oui-justify-between oui-text-xs", children: [
            /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { intensity: 36, children: t("prediction.chart.btcPrice") }),
            /* @__PURE__ */ jsxRuntime.jsx(ui.Text.numeral, { dp: 2, intensity: 80, children: state.currentPrice })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "oui-flex oui-w-full oui-items-center oui-justify-between oui-text-xs", children: [
            /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { intensity: 36, children: t("prediction.chance") }),
            /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { intensity: 98, children: formatPercent(state.upChance) })
          ] })
        ] }) })
      ]
    }
  );
};
var Prediction = (state) => {
  const { t } = i18n.useTranslation();
  const { formatRoundWindow: formatRoundWindow2 } = usePredictionFormatters();
  const isDesktopLayout = ui.useMediaQuery("(min-width: 1280px)");
  React2.useEffect(() => {
    if (!state.notification) return;
    const message = String(
      t(state.notification.message)
    );
    if (state.notification.tone === "danger") {
      ui.toast.error(message);
    } else {
      ui.toast.success(message);
    }
    state.clearNotification();
  }, [state.notification, t]);
  const { isFavorite: isPredictionFavorite, toggleFavorite } = usePredictionFavorites();
  const predictionMarketRowProps = {
    countdown: state.countdown,
    isRoundTradable: state.isRoundTradable,
    outcomePrices: state.outcomePrices,
    round: state.round,
    upChance: state.upChance,
    isFavorite: isPredictionFavorite,
    onToggleFavorite: toggleFavorite,
    onSelect: () => void 0
  };
  const handleDropdownSymbolChange = () => void 0;
  const hasPrototypeAuthOverride = state.prototypeAuthState !== "real";
  const effectiveAccountReady = state.orderEntryRestricted ? false : hasPrototypeAuthOverride ? state.prototypeAuthState === "accountReady" || state.prototypeAuthState === "funded" : state.orderEntryAccountReady ?? true;
  const effectiveAccountFunded = state.orderEntryRestricted ? false : hasPrototypeAuthOverride ? state.prototypeAuthState === "funded" : state.orderEntryFunded ?? true;
  const accountPanel = hasPrototypeAuthOverride ? state.prototypeAuthState === "funded" ? null : state.prototypeAuthState === "real" ? null : /* @__PURE__ */ jsxRuntime.jsx(PrototypeAuthPrompt, { state: state.prototypeAuthState }) : state.accountPanel;
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "main",
    {
      id: "oui-prediction-page",
      className: "oui-min-h-[calc(100vh-64px)] oui-bg-base-10 oui-p-3 oui-font-semibold lg:oui-p-4",
      children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "oui-grid oui-gap-3 md:oui-grid-cols-2 md:oui-items-stretch xl:oui-min-h-[calc(100vh-96px)] xl:oui-grid-cols-[minmax(0,1fr)_280px_360px] xl:oui-grid-rows-[auto_auto_minmax(350px,1fr)]", children: [
          /* @__PURE__ */ jsxRuntime.jsxs("header", { className: "oui-flex oui-flex-col oui-gap-4 oui-rounded-2xl oui-bg-base-9 oui-p-4 md:oui-col-span-2 md:oui-col-start-1 md:oui-row-start-1 xl:oui-col-span-1 xl:oui-col-start-1 xl:oui-row-start-1 2xl:oui-flex-row 2xl:oui-items-center", children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              markets.DropDownMarketsWidget,
              {
                symbol: "PERP_BTC_USDC",
                tabs: predictionMarketTabs,
                contentClassName: "oui-h-[560px] oui-w-[920px] oui-max-w-[calc(100vw-24px)]",
                onSymbolChange: handleDropdownSymbolChange,
                renderTabContent: (_, key, hide) => key === "prediction" ? /* @__PURE__ */ jsxRuntime.jsx(
                  PredictionMarketPanel,
                  {
                    ...predictionMarketRowProps,
                    onSelect: hide
                  }
                ) : void 0,
                renderTabAfterContent: (_, key, hide) => key === "favorites" && isPredictionFavorite ? /* @__PURE__ */ jsxRuntime.jsx(
                  PredictionMarketPanel,
                  {
                    ...predictionMarketRowProps,
                    className: "oui-flex-none oui-border-t oui-border-line-12 oui-pt-2",
                    showFavoriteControl: false,
                    onSelect: hide
                  }
                ) : null,
                children: /* @__PURE__ */ jsxRuntime.jsxs(
                  "button",
                  {
                    type: "button",
                    className: "oui-flex oui-min-w-0 oui-items-center oui-gap-3 oui-text-start 2xl:oui-w-[340px] 2xl:oui-shrink-0",
                    children: [
                      /* @__PURE__ */ jsxRuntime.jsx(ui.TokenIcon, { name: "BTC", size: "lg" }),
                      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "oui-min-w-0 oui-flex-1", children: [
                        /* @__PURE__ */ jsxRuntime.jsxs("h1", { className: "oui-flex oui-items-center oui-gap-1 oui-truncate oui-text-base oui-font-semibold oui-text-base-contrast", children: [
                          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "oui-truncate", children: t("prediction.btcUpDown") }),
                          /* @__PURE__ */ jsxRuntime.jsx(markets.TriangleDownIcon, { className: "oui-flex-none oui-text-base-contrast-54" })
                        ] }),
                        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "oui-mt-0.5 oui-truncate oui-text-xs oui-font-normal oui-text-base-contrast-54", children: formatRoundWindow2(state.round) })
                      ] })
                    ]
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "oui-hidden oui-h-12 oui-w-px oui-flex-shrink-0 oui-bg-line-12 2xl:oui-block" }),
            /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "oui-hidden oui-min-w-0 oui-flex-1 oui-grid-cols-2 oui-items-center oui-gap-x-6 oui-gap-y-3 sm:oui-grid-cols-3 xl:oui-grid 2xl:oui-flex 2xl:oui-flex-wrap 2xl:oui-gap-x-8", children: [
              /* @__PURE__ */ jsxRuntime.jsx(
                markets.DataItem,
                {
                  label: t("prediction.chart.btcPrice"),
                  value: /* @__PURE__ */ jsxRuntime.jsx(ui.Text.numeral, { dp: 2, children: state.currentPrice })
                }
              ),
              /* @__PURE__ */ jsxRuntime.jsx(
                markets.DataItem,
                {
                  label: t("prediction.chance"),
                  value: /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { intensity: 98, children: formatPercent(state.upChance) })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "oui-min-w-0 md:oui-col-span-2 md:oui-col-start-1 md:oui-row-start-2 xl:oui-col-span-1 xl:oui-col-start-1 xl:oui-row-start-2", children: isDesktopLayout ? /* @__PURE__ */ jsxRuntime.jsx(
            PriceChart,
            {
              selectedRound: state.selectedRound,
              onSelectRound: state.selectMarketRound,
              points: state.priceHistory,
              openingPrice: state.openingPrice,
              currentPrice: state.currentPrice,
              round: state.round,
              countdown: state.countdown,
              roundPhase: state.roundPhase,
              onGoToLiveMarket: state.goToLiveRound
            }
          ) : /* @__PURE__ */ jsxRuntime.jsx(MobileMarketPanel, { ...state }) }),
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "oui-min-w-0 md:oui-col-start-1 md:oui-row-start-3 xl:oui-col-start-2 xl:oui-row-span-2 xl:oui-row-start-1", children: /* @__PURE__ */ jsxRuntime.jsx(
            PredictionOrderBook,
            {
              orderBook: state.orderBook,
              selectedOutcome: state.selectedOutcome,
              selectedPrice: state.selectedPrice,
              setLimitPrice: state.setLimitPrice,
              setOrderType: state.setOrderType,
              isRoundTradable: state.isRoundTradable,
              roundPhase: state.roundPhase
            }
          ) }),
          /* @__PURE__ */ jsxRuntime.jsxs(
            "div",
            {
              className: ui.cn(
                "oui-space-y-3 md:oui-col-start-2 md:oui-row-start-3 xl:oui-col-start-3 xl:oui-row-span-3 xl:oui-row-start-1",
                (state.isRegionRestricted || state.orderEntryRestricted) && "oui-flex oui-flex-col oui-self-stretch xl:oui-block"
              ),
              children: [
                accountPanel && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "oui-rounded-2xl oui-border oui-border-line-12 oui-bg-base-9 oui-p-3", children: accountPanel }),
                state.isRegionRestricted || state.orderEntryRestricted ? /* @__PURE__ */ jsxRuntime.jsx(
                  RoundOrderStatusCard,
                  {
                    round: state.selectedRound,
                    roundPhase: state.roundPhase,
                    restricted: true
                  }
                ) : state.isRoundTradable ? /* @__PURE__ */ jsxRuntime.jsx(
                  TradePanel,
                  {
                    ...state,
                    orderEntryAccountReady: effectiveAccountReady,
                    orderEntryFunded: effectiveAccountFunded
                  }
                ) : /* @__PURE__ */ jsxRuntime.jsx(
                  RoundOrderStatusCard,
                  {
                    round: state.round,
                    roundPhase: state.roundPhase
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "oui-min-w-0 md:oui-col-span-2 md:oui-col-start-1 md:oui-row-start-4 xl:oui-row-start-3", children: /* @__PURE__ */ jsxRuntime.jsx(PredictionDataPanel, { state }) })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx(
          PredictionPlayground,
          {
            roundView: state.roundView,
            setRoundView: state.setRoundView,
            roundPhase: state.roundPhase,
            setRoundPhase: state.setRoundPhase,
            prototypeAuthState: state.prototypeAuthState,
            setPrototypeAuthState: state.setPrototypeAuthState,
            prototypeRegionState: state.prototypeRegionState,
            setPrototypeRegionState: state.setPrototypeRegionState
          }
        )
      ]
    }
  );
};
var PredictionContext = React2.createContext(null);
var useSharedPredictionState = (active = true) => {
  const context = React2.useContext(PredictionContext);
  const { retain, release } = context ?? {};
  React2.useEffect(() => {
    if (!retain || !release || !active) return;
    retain();
    return () => release();
  }, [retain, release, active]);
  return context?.state ?? null;
};
var PredictionProvider = ({
  children
}) => {
  const { disabledConnect } = reactApp.useAppContext();
  const [activeConsumers, setActiveConsumers] = React2.useState(0);
  const retain = React2.useCallback(
    () => setActiveConsumers((count) => count + 1),
    []
  );
  const release = React2.useCallback(
    () => setActiveConsumers((count) => Math.max(0, count - 1)),
    []
  );
  const state = usePredictionScript(disabledConnect, activeConsumers > 0);
  const value = React2.useMemo(
    () => ({ state, retain, release }),
    [state, retain, release]
  );
  return /* @__PURE__ */ jsxRuntime.jsx(PredictionContext.Provider, { value, children });
};
var PredictionWidget = () => {
  const state = useSharedPredictionState();
  return state ? /* @__PURE__ */ jsxRuntime.jsx(PredictionWithState, { state }) : /* @__PURE__ */ jsxRuntime.jsx(StandalonePrediction, {});
};
var StandalonePrediction = () => {
  const { disabledConnect } = reactApp.useAppContext();
  const state = usePredictionScript(disabledConnect);
  return /* @__PURE__ */ jsxRuntime.jsx(PredictionWithState, { state });
};
var PredictionWithState = ({ state }) => {
  const canTrade = reactApp.useCanTrade();
  const isFirstTimeDeposit = trading.useFirstTimeDeposit();
  const isRegionRestricted = state.isRegionRestricted;
  return /* @__PURE__ */ jsxRuntime.jsx(
    Prediction,
    {
      ...state,
      accountPanel: /* @__PURE__ */ jsxRuntime.jsx(trading.AssetViewWidget, { isFirstTimeDeposit }),
      orderEntryAccountReady: canTrade,
      orderEntryFunded: canTrade && !isFirstTimeDeposit,
      orderEntryRestricted: isRegionRestricted
    }
  );
};
var PredictionPage = () => {
  return /* @__PURE__ */ jsxRuntime.jsx(PredictionWidget, {});
};

// src/portfolio/index.ts
var portfolio_exports = {};
__export(portfolio_exports, {
  PredictionPortfolio: () => PredictionPortfolio,
  PredictionPortfolioWidget: () => PredictionPortfolioWidget,
  usePredictionPortfolioScript: () => usePredictionPortfolioScript
});

// src/portfolio/predictionPortfolio.script.ts
var usePredictionPortfolioScript = usePredictionScript;
var portfolioPredictionTabs = [
  "predictions",
  "predictionHistory"
];
var PredictionPortfolio = (state) => {
  const { t } = i18n.useTranslation();
  const [activeTab, setActiveTab] = React2__default.default.useState("predictions");
  return /* @__PURE__ */ jsxRuntime.jsxs(
    ui.Flex,
    {
      className: "oui-prediction-portfolio",
      direction: "column",
      itemAlign: "start",
      gap: 4,
      width: "100%",
      height: "100%",
      children: [
        /* @__PURE__ */ jsxRuntime.jsx(ui.Flex, { children: /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: "lg", children: t("prediction.tab.predictions") }) }),
        /* @__PURE__ */ jsxRuntime.jsx(ui.Divider, { className: "oui-w-full" }),
        /* @__PURE__ */ jsxRuntime.jsx(ui.Box, { width: "100%", className: "oui-h-[calc(100%_-_59px)]", children: /* @__PURE__ */ jsxRuntime.jsx(
          PredictionDataPanel,
          {
            state: { ...state, activeTab, setActiveTab },
            tabs: portfolioPredictionTabs,
            embedded: true,
            className: "oui-prediction-portfolio-dataPanel"
          }
        ) }),
        /* @__PURE__ */ jsxRuntime.jsx(
          PredictionPlayground,
          {
            roundView: state.roundView,
            setRoundView: state.setRoundView,
            roundPhase: state.roundPhase,
            setRoundPhase: state.setRoundPhase,
            prototypeAuthState: state.prototypeAuthState,
            setPrototypeAuthState: state.setPrototypeAuthState,
            prototypeRegionState: state.prototypeRegionState,
            setPrototypeRegionState: state.setPrototypeRegionState
          }
        )
      ]
    }
  );
};
var PredictionPortfolioWidget = () => {
  const state = useSharedPredictionState();
  return state ? /* @__PURE__ */ jsxRuntime.jsx(PredictionPortfolio, { ...state }) : /* @__PURE__ */ jsxRuntime.jsx(StandalonePortfolio, {});
};
var StandalonePortfolio = () => {
  const { disabledConnect } = reactApp.useAppContext();
  const state = usePredictionPortfolioScript(disabledConnect);
  return /* @__PURE__ */ jsxRuntime.jsx(PredictionPortfolio, { ...state });
};

exports.PredictionOrderCell = PredictionOrderCell;
exports.PredictionOrdersTable = PredictionOrdersTable;
exports.PredictionPage = PredictionPage;
exports.PredictionPlayground = PredictionPlayground;
exports.PredictionPortfolioModule = portfolio_exports;
exports.PredictionProvider = PredictionProvider;
exports.PredictionWidget = PredictionWidget;
exports.SharedProductDataPanel = SharedProductDataPanel;
exports.SharedProductOrdersPanel = SharedProductOrdersPanel;
exports.useSharedPredictionState = useSharedPredictionState;
exports.version = version_default;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map