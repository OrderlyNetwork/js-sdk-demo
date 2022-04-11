import { keyStores } from 'near-api-js';

// Import services
import { InitContract } from './initContract';

export const sendPublicKey = async () => {
	const { contract } = await InitContract();

	console.log('Start send Public Key');
	contract.user_announce_key();
};
