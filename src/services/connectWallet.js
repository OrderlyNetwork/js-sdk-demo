// Import services
import { InitContract } from 'services/initContract';

// Import config
import { getConfig } from './getConfig';

export const ConnectToWallet = async () => {
	const { contractName } = getConfig();
	const { walletConnection } = await InitContract();

	walletConnection?.requestSignIn(contractName, 'orderly', '', '');
};
