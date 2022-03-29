const { KeyPair, keyStores, connect } = require('near-api-js');

const keyStore = new keyStores.BrowserLocalStorageKeyStore(localStorage);

const config = {
	keyStore,
	networkId: 'testnet',
	nodeUrl: 'https://rpc.testnet.near.org',
};

export const createFullAccessKey = async () => {
	const keyPair = KeyPair.fromRandom('ed25519');
	const publicKey = keyPair.publicKey.toString();
	const near = await connect(config);
	const account = await near.account('dev-nightlovell.testnet');
	await keyStore.setKey(config.networkId, publicKey, keyPair);
	await account.addKey(publicKey);
};
