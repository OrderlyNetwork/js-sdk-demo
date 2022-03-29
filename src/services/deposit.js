import * as nearAPI from 'near-api-js';

// Import services
import { InitContract } from './initContract';

export const Deposit = async ({ deposit }) => {
	const { contract } = await InitContract();

	contract.user_deposit_native_token({}, 30000000000000, nearAPI.utils.format.parseNearAmount(deposit));
};
