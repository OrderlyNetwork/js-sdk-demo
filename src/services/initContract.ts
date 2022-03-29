import * as nearAPI from 'near-api-js';

import { getConfig } from './getConfig';

export const InitContract = async () => {
	const nearConfig = getConfig();
	const near = await nearAPI.connect(nearConfig);
	const walletConnection = new nearAPI.WalletConnection(near, 'orderly');
	const contract = new nearAPI.Contract(walletConnection.account(), nearConfig.contractName, {
		viewMethods: ['user_token_balance'],
		changeMethods: ['addMessage', 'user_deposit_native_token', 'user_request_withdraw'],
	});

	return { near, walletConnection, contract };
};