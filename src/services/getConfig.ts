import { keyStores } from 'near-api-js';

const keyStore = new keyStores.BrowserLocalStorageKeyStore(localStorage);

export const getConfig = () => {
	return {
		networkId: 'local',
		keyStore,
		nodeUrl: 'http://rpc.orderly-dev.ml',
		walletUrl: 'http://near-wallet.orderly-dev.ml',
		helperUrl: 'http://helper.orderly-dev.ml',
		explorerUrl: 'http://explorer.orderly-dev.ml',
		contractName: process.env.REACT_APP_ORDERLY_CONTRACT_NAME || 'asset-manager.test.near',
		headers: {},
	};
};
