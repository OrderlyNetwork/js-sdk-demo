// Import services
import { InitContract } from './initContract';

export const GetWhiteList = async () => {
	const { contract } = await InitContract();

	const data = await contract.get_tokens_allowed({});

	console.log('data', data);
};
