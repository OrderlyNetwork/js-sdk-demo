import * as nearAPI from 'near-api-js';
import { calculateGas } from './estimateTransactionFee';

// Import services
import { InitContract } from './initContract';

export const Deposit = async ({ deposit }) => {
	const { contract } = await InitContract();

	const gasEstimation = await calculateGas('user_deposit_native_token', {});

	// eslint-disable-next-line no-unused-expressions
	gasEstimation && contract.user_deposit_native_token({}, gasEstimation, nearAPI.utils.format.parseNearAmount(deposit));
};
