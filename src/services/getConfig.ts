import { keyStores } from 'near-api-js';

const keyStore = new keyStores.BrowserLocalStorageKeyStore(localStorage);

export const getConfig = () => {
	return {
		networkId: 'testnet',
		nodeUrl: 'https://rpc.testnet.near.org',
		walletUrl: 'https://wallet.testnet.near.org',
		contractName: 'murano.testnet',
		keyStore,
		headers: {},
	};
};
