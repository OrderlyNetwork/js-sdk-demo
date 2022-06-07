/* eslint-disable array-callback-return */
import { utils } from 'near-api-js';

// Import services
import { InitContract } from './initContract';

export const GetWhiteList = async () => {
	const { contract, walletConnection } = await InitContract();
	const usersTokensList = [];

	console.log('start user_tokens_balances_json');

	const users_tokens = await contract.user_tokens_balances_json();

	const filterData = users_tokens.filter((item) => item[0][0] === walletConnection.getAccountId());

	filterData.map((el, index) => {
		usersTokensList.push({
			token_name: el[0][1],
			balance: el[1].balance.toLocaleString('fullwide', { useGrouping: false }),
			id: index,
		});
	});

	return usersTokensList;
};
