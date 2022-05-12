// Import services
import { InitContract } from './initContract';

export const SetAllowedToken = async () => {
	const { contract } = await InitContract();

	contract.set_token_allowed({ token: 'token.test.near', allowed: true });
};
