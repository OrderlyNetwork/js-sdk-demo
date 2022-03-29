import { utils } from 'near-api-js';

// Import services
import { InitContract } from 'services/initContract';

export const GetAccountBalance = async () => {
	const { near, walletConnection } = await InitContract();
	const account = await near.account(walletConnection.getAccountId());
	const balance = await account.getAccountBalance();

	const formatBalance = {
		total: utils.format.formatNearAmount(balance.total),
		available: utils.format.formatNearAmount(balance.available),
	};

	return formatBalance;
};
