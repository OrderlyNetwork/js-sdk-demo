import * as nearAPI from 'near-api-js';
import { getConfig } from './getConfig';

export const InitContract = async () => {
	const nearConfig = getConfig();
	const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore(localStorage);
	const near = await nearAPI.connect({ keyStore, ...nearConfig });
	const walletConnection = new nearAPI.WalletConnection(near, 'orderly-app');

	let currentUser;
	if (walletConnection.getAccountId()) {
		currentUser = {
			accountId: walletConnection.getAccountId(),
			balance: (await walletConnection.account().state()).amount,
		};
	}

	const contract = new nearAPI.Contract(walletConnection.account(), nearConfig.contractName, {
		viewMethods: ['getMessages'],
		changeMethods: ['addMessage', 'user_deposit_native_token', 'user_token_balance', 'new'],
		sender: walletConnection.account(),
	});

	console.log({ contract });

	window.contract = contract;

	return { contract, currentUser, nearConfig, walletConnection, near };
};
