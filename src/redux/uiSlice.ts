import type { RootState } from '@/store/store';
import { createSlice } from '@reduxjs/toolkit';

export interface UiState {
	showSidePanel: boolean;
	futuresHideOtherPairs: boolean;
}

const initialState = {
	showSidePanel: false,
	futuresHideOtherPairs: false,
};

const uiSlice = createSlice({
	name: 'ui',
	initialState,
	reducers: {
		openSidePanel(state) {
			state.showSidePanel = true;
		},
		closeSidePanel(state) {
			state.showSidePanel = false;
		},
		toggleFuturesHideOtherPairs(state) {
			state.futuresHideOtherPairs = !state.futuresHideOtherPairs;
		},
	},
});

export const { openSidePanel, closeSidePanel, toggleFuturesHideOtherPairs } =
	uiSlice.actions;

export const futuresHideOtherPairsSelector = (state: RootState) =>
	state.ui.futuresHideOtherPairs;

export default uiSlice.reducer;
