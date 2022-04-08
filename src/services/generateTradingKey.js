// Import services
import { InitContract } from './initContract';

export const SendKey = async () => {
	const { contract } = await InitContract();

	contract.user_announce_key();
};
