import {
	createAsyncThunk,
	createSelector,
	createSlice,
} from '@reduxjs/toolkit';

import type { RootState } from '@/store/store';
import orderlyService from '@/service/orderlyService';
import { AccountInfo } from '@/types/account';

interface AppState {
	loading: boolean;
	accountId?: string;

	loggedIn: boolean;

	apiBaseUrl: string;
	accountInfo?: AccountInfo;
}

const initialState: AppState = {
	loading: true,
	loggedIn: false,
	apiBaseUrl: 'https://api.orderly.org/v1',
};

const getPossibleTokens = createAsyncThunk(
	'contract/getPossibleTokens',
	async () => {
		const tokens = await orderlyService.assetManager.getPossibleTokens();
		console.log('********', tokens);
		return tokens;
	},
);

const appSlice = createSlice({
	name: 'app',
	initialState,
	reducers: {
		login(state, action) {
			state.accountId = action.payload;
			state.loggedIn = true;
			state.loading = false;
		},
		logout(state) {
			state.accountId = undefined;
			state.loggedIn = false;
		},
		setAccountInfo(state, action) {
			state.accountInfo = action.payload;
			state.accountId = action.payload.account_id;
			state.loggedIn = true;
			state.loading = false;
		},
	},
});

export const { login, logout, setAccountInfo } = appSlice.actions;

export const selectLoggedIn = (state: RootState) => state.app.loggedIn;

export const selectAccountInfo = (state: RootState) => state.app.accountInfo;

export const selectAccountLeverage = createSelector(
	selectAccountInfo,
	(accountInfo) => {
		return accountInfo?.max_leverage;
	},
);

// export const isLogged = useSelector<RootState,boolean>((state) => state.app.loggedIn));

export default appSlice.reducer;
