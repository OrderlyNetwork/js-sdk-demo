import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { RootState } from '@/store/store';
import orderlyService from '@/service/orderlyService';

interface AppState {
	loading: boolean;
	accountId?: string;

	loggedIn: boolean;

	apiBaseUrl: string;
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
	},
});

export const { login, logout } = appSlice.actions;

export const selectLoggedIn = (state: RootState) => state.app.loggedIn;

// export const isLogged = useSelector<RootState,boolean>((state) => state.app.loggedIn));

export default appSlice.reducer;
