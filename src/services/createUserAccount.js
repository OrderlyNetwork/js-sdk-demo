// Import services
import { InitContract } from './initContract';

export const createUserAccount = async () => {
	const { contract } = await InitContract();

	console.log('Start Create user on Contract');
	contract.create_user_account();
};
