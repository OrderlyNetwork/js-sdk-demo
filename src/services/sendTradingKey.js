import { KeyPair } from 'near-api-js';

// Import services
import { InitContract } from './initContract';

export const sendTradingKey = async () => {
	const { contract } = await InitContract();

	const { secretKey } = KeyPair.fromRandom('ed25519');
	localStorage.setItem('tradingKey', secretKey);

	console.log('Start send Trade Key', secretKey);

	contract.user_request_set_trading_key({ key: secretKey });
};
