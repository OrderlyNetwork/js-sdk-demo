import { NEAR_TYPE } from 'store/types/storeTypes';

export const SetWalletConnections = ({ walletConnection }) => {
	return {
		type: NEAR_TYPE.SET_WALLET_CONNECTION,
		payload: { walletConnection },
	};
};
