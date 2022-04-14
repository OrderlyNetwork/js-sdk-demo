// Import services
import { InitContract } from './initContract';

const EC = require('elliptic').ec;

export const sendTradingKey = async () => {
	const { contract } = await InitContract();

	console.log('Start send trading key');

	// Create keyPair with elliptic
	const ec = new EC('secp256k1');
	const keyPair = ec.genKeyPair();
	const privKey = keyPair.getPrivate();

	// Convert to hex and encode to BASE64
	const normalizeTradingKey = window.btoa(privKey.toString('hex'));

	contract.user_request_set_trading_key({ key: normalizeTradingKey });
};
