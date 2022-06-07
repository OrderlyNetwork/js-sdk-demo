import * as nearAPI from 'near-api-js';
import { InitContract } from './initContract';

export const GetFaucet = async () => {
	const contract_name = 'ft-faucet1.test.near';
	const { walletConnection } = await InitContract();

	const contract = new nearAPI.Contract(walletConnection.account(), contract_name, {
		viewMethods: [],
		changeMethods: ['get_tokens'],
	});

	contract.get_tokens({ account_id: walletConnection.getAccountId() });
};
