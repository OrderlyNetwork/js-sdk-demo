import { utils } from 'near-api-js';

// Import services
import { InitContract } from 'services/initContract';

export const GetAccountBalance = async () => {
	const { near, walletConnection, contract } = await InitContract();
	const account = await near.account(walletConnection.getAccountId());
	const balance = await account.getAccountBalance();

	const contractBalance = await contract.user_token_balance({ user: walletConnection.getAccountId(), token: 'near' });

	const formatBalance = {
		total: utils.format.formatNearAmount(contractBalance),
		available: utils.format.formatNearAmount(balance.available),
	};

	return formatBalance;
};
