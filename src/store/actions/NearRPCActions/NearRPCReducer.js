import { NEAR_TYPE } from 'store/types/storeTypes';

export const SetWalletConnections = ({ walletConnection }) => {
	return {
		type: NEAR_TYPE.SET_WALLET_CONNECTION,
		payload: { walletConnection },
	};
};

export const SetAccountInfo = ({ accountId = '', walletBalance = '' }) => {
	return {
		type: NEAR_TYPE.SET_ACCOUNT_INFO,
		payload: { accountId, walletBalance },
	};
};
