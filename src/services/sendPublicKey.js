// Import services
import { InitContract } from './initContract';

export const sendPublicKey = async () => {
	const { contract } = await InitContract();

	console.log('Start send public key');
	contract.user_announce_key();
};
