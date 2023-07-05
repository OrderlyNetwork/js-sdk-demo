import { createSlice } from '@reduxjs/toolkit';

export enum PriceType {
	limit = 'limit',
	market = 'market',
}

export enum OrderType {
	buy = 'buy',
	sell = 'sell',
}

interface OrderState {
	price: number;
	amount: number;
	type: OrderType;
	priceType: PriceType;
}

const initialState = {
	price: 0,
	amount: 0,
	type: OrderType.buy,
	priceType: PriceType.limit,
} as OrderState;

// 下单
const orderCreatorSlice = createSlice({
	name: 'order',
	initialState,
	reducers: {
		setOrderPrice(state, action) {
			state.price = action.payload;
		},
		setOrderAmount(state, action) {
			state.amount = action.payload;
		},
		// set order type
		setOrderType(state, action) {
			state.type = action.payload;
		},
		// set order price type
		setOrderPriceType(state, action) {
			state.priceType = action.payload;
		},
	},
});

export const { setOrderPrice, setOrderAmount, setOrderType } =
	orderCreatorSlice.actions;

export default orderCreatorSlice.reducer;
