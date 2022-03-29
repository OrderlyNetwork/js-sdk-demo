import * as nearAPI from 'near-api-js';

// Import services
import { InitContract } from './initContract';

export const Withdraw = async ({ withdraw }) => {
	const { contract } = await InitContract();

	contract.user_request_withdraw({ token: 'near', amount: nearAPI.utils.format.parseNearAmount(withdraw) });
};
