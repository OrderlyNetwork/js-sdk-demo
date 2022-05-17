import * as nearAPI from 'near-api-js';
import { keyStores } from 'near-api-js';

const keyStore = new keyStores.BrowserLocalStorageKeyStore(localStorage);

export const getConfig = () => {
	return {
		networkId: 'testnet',
		keyStore,
		nodeUrl: 'https://rpc.orderly-dev.ml',
		walletUrl: 'https://near-wallet.orderly-dev.ml',
		helperUrl: 'https://helper.orderly-dev.ml',
		explorerUrl: 'https://explorer.orderly-dev.ml',
		contractName: 'faucet.test.near',
		headers: {},
	};
};

export const GetFaucet = async () => {
	const contract_name = 'faucet.test.near';
	const nearConfig = getConfig();
	const near = await nearAPI.connect(nearConfig);
	const walletConnection = new nearAPI.WalletConnection(near, 'orderly');

	const contract = new nearAPI.Contract(walletConnection.account(), contract_name, {
		viewMethods: [],
		changeMethods: ['get_tokens'],
	});

	contract.get_tokens({ account_id: walletConnection.getAccountId() });
};
