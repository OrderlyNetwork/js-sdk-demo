import { ApiService } from '@/service/apiService';
import OrderlyService from '@/service/orderlyService';
import type { RootState } from '@/store/store';
import { getNumberDigits } from '@/utils/decimal';
import {
	createAsyncThunk,
	createSelector,
	createSlice,
} from '@reduxjs/toolkit';
import { OrderBookItem } from '@/components/trade/orderbook/useOrderbook';

export type TradingPairType = 'SPOT' | 'PERP';

export interface TradingPair {
	symbol: string;
	base: string;
	quote: string;
	type: string;
	base_min: number;
	base_mxn: number;
	base_tick: number;
	price_range: number;
}

export interface TokenInfo {
	token: string;
	token_account_id: string;
	decimals: number;
	minimum_increment: number;
	minimum: number;
}

export interface TradingConfigState {
	tradingPairs: TradingPair[];
	currentTradingPair?: TradingPair;
	loading: boolean;
	tokensInfo: Record<string, TokenInfo>;
	// 买一卖一
	orderBooksLatest: OrderBookItem[];
	// 当前交易类型,spot or futures
	tradingType: TradingPairType;
	tickerPrice: number;
}

// fetch trading pairs thunk;
export const fetchTradingPairs = createAsyncThunk(
	'tradingConfig/fetchTradingPairs',
	async () => {
		const res = await OrderlyService.api.public.getAvailableSymbols();
		if (Array.isArray(res) && res.length > 0) {
			return res.map<TradingPair>((item: any) => {
				// item.symbol = item.base + "/" + item.quote;
				const arr = item.symbol.split('_');
				return {
					...item,
					base: arr[2],
					quote: arr[1],
					type: arr[0],
				};
			});
		}

		return [];
	},
);

export const checkSymbolPairListed = createAsyncThunk(
	'tradingConfig/isSymbolPairListed',
	async (tradingPair: string) => {
		const res = await OrderlyService.assetManager.isSymbolPairListed(
			tradingPair,
		);

		return res;
	},
);

export const getTokensInfo = createAsyncThunk(
	'apiService/getTokensInfo',
	async () => {
		const res = await ApiService.getInstance().getTokensInfo();

		const infos: Record<string, TokenInfo> = {};

		if (res && res.success && res.data && Array.isArray(res.data?.rows)) {
			res.data.rows.forEach((item: TokenInfo) => {
				infos[item.token] = {
					...item,
					minimum: getNumberDigits(item.minimum_increment),
				};
			});
		}
		return infos;
	},
);

// export const getMarketTrades

const initialState = {
	tradingPairs: [],
	loading: false,
	tokensInfo: {},
	orderBooksLatest: [],
	tradingType: 'SPOT',
	currentTradingPair: undefined,
	tickerPrice: 0,
} as TradingConfigState;

const setTradingPairToLocalStorage = (tradingPair: string) => {
	if (typeof window !== 'undefined') {
		localStorage.setItem('currentTradingPair', tradingPair);
	}
};

const tradingSlice = createSlice({
	name: 'tradingConfig',
	initialState: initialState,
	reducers: {
		setCurrentTradingPair(state, action) {
			state.currentTradingPair = action.payload;

			setTradingPairToLocalStorage(action.payload.symbol);
		},

		setCurrentTradingPairBySymbol(state, action) {
			const tradingPair = state.tradingPairs.find(
				(item) => item.symbol === action.payload,
			);
			if (tradingPair) {
				state.currentTradingPair = tradingPair;
				setTradingPairToLocalStorage(tradingPair.symbol);
			}
		},

		setOrderBooksLatest(state, action) {
			state.orderBooksLatest = action.payload;
		},
		setTradingType(state, action) {
			state.tradingType = action.payload;
			// reset current trading pair
			if (state.tradingType === 'SPOT') {
				state.currentTradingPair = state.tradingPairs.find(
					(item) => item.type === 'SPOT',
				);
			} else {
				state.currentTradingPair = state.tradingPairs.find(
					(item) => item.type === 'PERP',
				);
			}
		},

		setTickerPrice(state, action) {
			state.tickerPrice = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(fetchTradingPairs.pending, (state, action) => {
			state.loading = true;
		});
		builder.addCase(fetchTradingPairs.fulfilled, (state, action) => {
			//   console.log(action.payload);
			state.tradingPairs = action.payload;
			if (action.payload.length > 0) {
				//check if current trading pair is in the list
				if (typeof window !== 'undefined') {
					const tradingPairKey = localStorage.getItem('currentTradingPair');
					console.log('==========', tradingPairKey);
					if (typeof tradingPairKey === 'string') {
						// 	const tradingPairObj = JSON.parse(tradingPair);
						const currentTradingPair = action.payload.find(
							(item) => item.symbol === tradingPairKey,
						);

						if (currentTradingPair) {
							state.currentTradingPair = currentTradingPair;
							return;
						}
					}
				}
				// 根据当前是Spot或者Futures来设置交易对
				if (state.tradingType === 'SPOT') {
					state.currentTradingPair = action.payload.find(
						(item) => item.type === 'SPOT',
					);
				} else {
					state.currentTradingPair = action.payload.find(
						(item) => item.type === 'PERP',
					);
				}
			}
		});

		builder.addCase(fetchTradingPairs.rejected, (state, action) => {
			state.loading = false;
		});

		builder.addCase(getTokensInfo.fulfilled, (state, action) => {
			state.loading = false;
			state.tokensInfo = action.payload;
		});
	},
});

export const {
	setCurrentTradingPair,
	setOrderBooksLatest,
	setTradingType,
	setCurrentTradingPairBySymbol,
	setTickerPrice,
} = tradingSlice.actions;

export const selectTradingPairs = (state: RootState) =>
	state.trading.tradingPairs;

export const selectTradingType = (state: RootState): TradingPairType =>
	state.trading.tradingType;

export const selectCurrentTradingPair = (state: RootState) =>
	state.trading.currentTradingPair;

export const selectTokensConfig = (state: RootState) =>
	state.trading.tokensInfo;

export const selectOrderBookLatest = (state: RootState) =>
	state.trading.orderBooksLatest;

export const selectTickerPrice = (state: RootState) =>
	state.trading.tickerPrice;

export const selectCurrentTokenConfig = createSelector(
	selectTokensConfig,
	selectCurrentTradingPair,
	(tokensConfig, currentTradingPair) => {
		if (currentTradingPair) {
			return tokensConfig[currentTradingPair.quote];
		}
		return null;
	},
);

export const selectCurrentTradingPairConfig = createSelector(
	selectTradingPairs,
	selectCurrentTradingPair,
	(tradingPairs, currentTradingPair) => {
		return tradingPairs.find(
			(item) => item.symbol === currentTradingPair?.symbol,
		);
	},
);

export const selectTradingPairConfigBySymbol = createSelector(
	[selectTradingPairs, (state: RootState, symbol: string) => symbol],
	(tradingPairs, symbol) => {
		return tradingPairs.find((item) => item.symbol === symbol);
	},
);

// export const selectTradingPairByType = createSelector()

export default tradingSlice.reducer;
