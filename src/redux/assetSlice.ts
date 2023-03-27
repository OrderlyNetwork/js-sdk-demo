import orderlyService from '@/service/orderlyService';
import {
	createAsyncThunk,
	createSelector,
	createSlice,
} from '@reduxjs/toolkit';
import { selectCurrentTradingPair } from '@/redux/tradingSlice';

export interface AssetState {
	total: number;
	available: number;
	tokens: Token[];
	balances: Record<string, { balance: number }>;
	loading: boolean;
}

export interface TokenBalance {
	token: string;
	balance: number;
}

export interface Token {
	name: string;
	icon: string;
	address: string;
}

export const getPossibleTokens = createAsyncThunk(
	'contract/getPossibleTokens',
	async () => {
		const tokens = await orderlyService.assetManager.getPossibleTokens();

		if (!Array.isArray(tokens)) return [];
		return tokens.map((item: string) => {
			const arr = item.split('.');
			return {
				name: arr[0].toLocaleUpperCase(),
				icon: '',
				address: item,
			};
		});
	},
);

export const getUserTokensBalance = createAsyncThunk(
	'contract/getUserTokensBalance',
	async () => {
		const res = await orderlyService.assetManager.getUserTokenBalance();
		if (!Array.isArray(res)) return [];

		const balance: Record<string, number> = {};

		for (const item of res) {
			balance[item[0]] = item[1];
		}

		return balance;
	},
);

const initialState = {
	total: 0,
	available: 0,
	tokens: [],
	balances: {},
	loading: false,
} as AssetState;

const assetSlice = createSlice({
	name: 'asset',
	initialState,
	reducers: {
		setAsset(state, action) {
			state.total = action.payload.total;
			state.available = action.payload.available;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(getPossibleTokens.fulfilled, (state, action) => {
			state.tokens = [
				{ name: 'NEAR', icon: '', address: 'near' },
				...action.payload,
			];
		});

		builder.addCase(getUserTokensBalance.pending, (state, action) => {
			state.loading = true;
		});

		builder.addCase(getUserTokensBalance.fulfilled, (state, action) => {
			state.balances = action.payload as any;
			state.loading = false;
		});

		builder.addCase(getUserTokensBalance.rejected, (state, action) => {
			state.loading = false;
		});
	},
});

export const selectTokens = (state: any): Token[] => state.asset.tokens;

export const selectBalances = (state: any) => state.asset.balances;

// merge tokens and balances
export const selectAssets = createSelector(
	selectTokens,
	selectBalances,
	(tokens, balances) => {
		return tokens.map((item: Token) => {
			const balance = balances[item.address];
			return {
				...item,
				balance: balance || { balance: 0 },
			};
		});
	},
);

// 当前交易对的Base资产
export const selectCurrentBaseAssets = createSelector(
	selectCurrentTradingPair,
	selectAssets,
	(currentTradingPair, balances) => {
		if (!currentTradingPair) return null;
		return balances.find((item) => item.name === currentTradingPair.base);
	},
);
// 当前交易对的Quote资产
export const selectCurrentQuoteAssets = createSelector(
	selectCurrentTradingPair,
	selectAssets,
	(currentTradingPair, balances) => {
		if (!currentTradingPair) return null;
		return balances.find((item) => item.name === currentTradingPair.quote);
	},
);

export const { setAsset } = assetSlice.actions;

export default assetSlice.reducer;
