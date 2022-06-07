import { keyStores } from 'near-api-js';

const keyStore = new keyStores.BrowserLocalStorageKeyStore(localStorage);

export const getConfig = () => {
	// return {
	// 	networkId: 'local',
	// 	keyStore,
	// 	nodeUrl: 'https://qa-near-rpc.orderly.network',
	// 	walletUrl: 'https://qa-near-wallet.orderly.network',
	// 	helperUrl: 'https://qa-near-helper.orderly.network',
	// 	explorerUrl: 'https://qa-near-explorer.orderly.network',
	// 	contractName: process.env.REACT_APP_ORDERLY_CONTRACT_NAME || 'asset-manager.test.near',
	// 	headers: {},
	// };
	return {
		networkId: 'local',
		keyStore,
		nodeUrl: 'https://rpc.orderly-dev.ml',
		walletUrl: 'https://near-wallet.orderly-dev.ml',
		helperUrl: 'https://helper.orderly-dev.ml',
		explorerUrl: 'https://explorer.orderly-dev.ml',
		contractName: process.env.REACT_APP_ORDERLY_CONTRACT_NAME || 'asset-manager.test.near',
		headers: {},
	};
};
