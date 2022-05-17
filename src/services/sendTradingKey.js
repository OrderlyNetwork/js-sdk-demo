// Import services
import { InitContract } from './initContract';

const EC = require('elliptic').ec;
const keccak256 = require('keccak256');

export const sendTradingKey = async () => {
	const { contract } = await InitContract();

	console.log('Start send trading key');

	// Create keyPair with elliptic
	const ec = new EC('secp256k1');
	const keyPair = ec.genKeyPair();

	// Get public key from keyPair
	const publicKey = keyPair.getPublic();
	const pubKeyAsHex = publicKey.encode('hex');

	const normalizeTradingKey = window.btoa(keccak256(pubKeyAsHex).toString('hex'));

	console.log({ pubKeyAsHex: normalizeTradingKey });

	// const msg = 'Message for signing';
	// const signature = ec.sign(msg, normalizeTradingKey, 'hex', { canonical: true });
	// call_contract(msgHash, signature, signature.recoveryParam);

	contract.user_request_set_trading_key({ key: normalizeTradingKey });
};
