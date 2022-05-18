// Import services
import { formatUnicode } from 'helper';
import { InitContract } from './initContract';

export const GetWhiteList = async () => {
	const { contract } = await InitContract();

	const res = await contract.get_tokens_allowed();

	const filteredData = formatUnicode({ text: res });

	console.log(filteredData);
};
