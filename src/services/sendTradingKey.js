// Import services
import { InitContract } from './initContract';

export const sendTradingKey = async () => {
	const { contract } = await InitContract();

	// FIXME => just for test secretKey;
	const secretKey = 'EREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREQ==';
	localStorage.setItem('tradingKey', secretKey);

	console.log('Start send Trade Key', secretKey);

	contract.user_request_set_trading_key({ key: secretKey });
};
