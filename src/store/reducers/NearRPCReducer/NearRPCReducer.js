import { NEAR_TYPE } from 'store/types/storeTypes';

const initialState = {
	isLoading: false,
	walletConnection: null,
	near: null,
	account: null,
	error: null,
};

export const NearRPCReducer = (state = initialState, action = Function) => {
	switch (action.type) {
		case NEAR_TYPE.SET_WALLET_CONNECTION:
			return {
				...state,
				isLoading: false,
				walletConnection: action.payload.walletConnection || null,
				error: null,
			};

		default:
			return state;
	}
};
