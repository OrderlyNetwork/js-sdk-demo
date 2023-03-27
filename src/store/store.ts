import { configureStore } from '@reduxjs/toolkit';
import appReducer from '../redux/appSlice';
import assetReducer from '../redux/assetSlice';
import orderReducer from '../redux/orderSlice';
import tradingReducer from '../redux/tradingSlice';
import uiReducer from '../redux/uiSlice';
import { ordersApi } from '@/redux/ordersApi';

export const store = configureStore({
	reducer: {
		app: appReducer,
		asset: assetReducer,
		// order: orderReducer,
		trading: tradingReducer,
		ui: uiReducer,
		[ordersApi.reducerPath]: ordersApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(ordersApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
