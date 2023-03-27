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

export interface TradingPair {
	symbol: string;
	base: string;
	quote: string;
	type: string;
	base_min: number;
	base_mxn: number;
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
} as TradingConfigState;

const tradingSlice = createSlice({
	name: 'tradingConfig',
	initialState: initialState,
	reducers: {
		setCurrentTradingPair(state, action) {
			state.currentTradingPair = action.payload;
		},

		setOrderBooksLatest(state, action) {
			state.orderBooksLatest = action.payload;
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
				const near = action.payload.find((item) => item.quote === 'NEAR');
				if (near) {
					state.currentTradingPair = near;
				} else {
					state.currentTradingPair = action.payload[0];
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

export const { setCurrentTradingPair, setOrderBooksLatest } =
	tradingSlice.actions;

export const selectTradingPairs = (state: RootState) =>
	state.trading.tradingPairs;

export const selectCurrentTradingPair = (state: RootState) =>
	state.trading.currentTradingPair;

export const selectTokensConfig = (state: RootState) =>
	state.trading.tokensInfo;

export const selectOrderBookLatest = (state: RootState) =>
	state.trading.orderBooksLatest;

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

export default tradingSlice.reducer;
