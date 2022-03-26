import { AccountBalance } from 'near-api-js/lib/account';
import * as nearAPI from 'near-api-js';
import { InitContract } from 'services/connect-wallet';

const {
	KeyPair,
	keyStores,
	InMemorySigner,
	transactions: { addKey },
	utils: {
		PublicKey,
		format: { parseNearAmount, formatNearAmount },
	},
} = nearAPI;

export const GetAccountBalance = async (): Promise<AccountBalance> => {
	const { nearConfig, walletConnection } = await InitContract();
	const { networkId, nodeUrl, walletUrl } = nearConfig;

	const keyStore = new keyStores.BrowserLocalStorageKeyStore(localStorage);

	const config = {
		keyStore,
		networkId: 'testnet',
		nodeUrl: 'https://rpc.testnet.near.org',
	};

	async function createAccount(creatorAccountId, newAccountId, amount) {
		const near = await nearAPI.connect({ ...config, keyStore });
		const creatorAccount = await near.account(creatorAccountId);
		const keyPair = KeyPair.fromRandom('ed25519');
		const publicKey = keyPair.publicKey.toString();
		await keyStore.setKey('testnet', walletConnection.getAccountId(), keyPair);

		// eslint-disable-next-line no-return-await
		return await creatorAccount.functionCall({
			contractId: 'testnet',
			methodName: 'create_account',
			args: {
				new_account_id: newAccountId,
				new_public_key: publicKey,
			},
			gas: '300000000000000',
			attachedDeposit: parseNearAmount(amount),
		});
	}

	// async function useContractFullAccessKey() {
	// 	// Step 1:  get the keypair from the contract's full access private key
	// 	const keyPair = KeyPair.fromRandom('ed25519');

	// 	// Step 2:  load up an inMemorySigner using the keyPair for the account
	// 	const signer = await InMemorySigner.fromKeyPair(nearConfig.networkId, 'murano.testnet', keyPair);

	// 	// Step 3:  create a connection to the network using the signer's keystore and default config for testnet
	// 	const near = await nearAPI.connect({
	// 		networkId,
	// 		nodeUrl,
	// 		walletUrl,
	// 		deps: { keyStore: signer.keyStore },
	// 	});

	// 	// Step 4:  get the account object of the currentAccount.  At this point, we should have full control over the account.
	// 	const account = new nearAPI.Account(near.connection, walletConnection.getAccountId());

	// 	// initiate the contract so its associated with this current account and exposing all the methods
	// 	const contract = new nearAPI.Contract(account, 'murano.testnet', {
	// 		viewMethods: [''],
	// 		changeMethods: ['user_deposit_native_token'],
	// 	});

	// 	const result = await account.signAndSendTransaction({
	// 		receiverId: 'murano.testnet',
	// 		actions: [nearAPI.transactions.functionCall('user_deposit_native_token', {}, 10000000000000, '0')],
	// 	});

	// 	console.log(result);

	// 	return contract;
	// }

	// const sentDeposit = async () => {
	// 	const contract = await useContractFullAccessKey();
	// 	// contract?.user_deposit_native_token({ user: walletConnection.getAccountId() });
	// };

	if (walletConnection.isSignedIn()) {
		createAccount(walletConnection.getAccountId(), 'awdawda.testnet', '10000000000000000000');
	}
};
