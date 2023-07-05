import { configureStore } from '@reduxjs/toolkit';
import appReducer from '../redux/appSlice';
import assetReducer from '../redux/assetSlice';
// import orderReducer from '../redux/orderSlice';
import tradingReducer from '../redux/tradingSlice';
import uiReducer from '../redux/uiSlice';
import { ordersApi } from '@/redux/ordersApi';
import { positionsApi } from '@/redux/positionApi';

export const store = configureStore({
	reducer: {
		app: appReducer,
		asset: assetReducer,
		// order: orderReducer,
		trading: tradingReducer,
		ui: uiReducer,
		[ordersApi.reducerPath]: ordersApi.reducer,
		[positionsApi.reducerPath]: positionsApi.reducer,
	},
	preloadedState: {
		// trading: {
		// 	tradingType: 'SPOT',
		// }
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat([
			ordersApi.middleware,
			positionsApi.middleware,
		]),
});

export type RootState = ReturnType<typeof store.getState>;
