import * as nearAPI from 'near-api-js';

import { getConfig } from './getConfig';

export const InitContract = async () => {
	const nearConfig = getConfig();
	const near = await nearAPI.connect(nearConfig);
	const walletConnection = new nearAPI.WalletConnection(near, 'orderly');
	const contract: any = new nearAPI.Contract(walletConnection.account(), nearConfig.contractName, {
		viewMethods: ['user_token_balance', 'user_account_exists', 'ft_token_metadata'],
		changeMethods: [
			'addMessage',
			'user_deposit_native_token',
			'user_request_withdraw',
			'user_announce_key',
			'user_request_set_trading_key',
			'create_user_account',
			'set_token_allowed',
			'get_tokens_allowed',
		],
	});

	return { near, walletConnection, contract };
};
