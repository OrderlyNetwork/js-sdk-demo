/* eslint-disable no-plusplus */
/* eslint-disable no-restricted-syntax */
const { InitContract } = require('./initContract');

const MAX_GAS = '300000000000000';
const MAX_PERCENT = 35;

export const calculateGas = async (contractMethod = '', data = {}) => {
	const gasBurnt = [];

	const { contract } = await InitContract();

	const result = await contract.account.functionCall(contract.contractId, contractMethod, data, MAX_GAS);
	gasBurnt.push(result.transaction_outcome.outcome.gas_burnt);

	for (let i = 0; i < result.receipts_outcome.length; i++) {
		gasBurnt.push(result.receipts_outcome[i].outcome.gas_burnt);
	}

	const percentCalc = (gasBurnt.reduce((acc, cur) => acc + cur, 0) / 100) * MAX_PERCENT;

	return gasBurnt.reduce((acc, cur) => acc + cur, 0) + percentCalc;
};
