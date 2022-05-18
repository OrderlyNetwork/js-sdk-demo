export const formatAddress = ({ address }: { address: string }) => {
	/* eslint-disable fp/no-let */
	let modified: string = '';

	if (address.length > 9) {
		modified = `${address.substring(0, 5)}...${address.substring(address.length - 4)}`;
	}

	return modified;
};

export const FilterInputForNumber = ({ value }: { value: string }) => {
	const filterRule = /\D/g;
	return value.replace(filterRule, '');
};

export const prettierBalance = ({ str }: { str: string }) => `${Math.trunc(+str * 100) / 100}`;

export const formatUnicode = ({ text }: { text: string }) => {
	return text
		.replace(/([\u0300-\u036f]|[^0-9a-zA-Z\\.\\-])/g, ' ')
		.split(' ')
		.filter((item) => item);
};
