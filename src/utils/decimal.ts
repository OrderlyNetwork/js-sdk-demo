import Decimal from 'decimal.js-light';

export const getNumberDigits = (num: number) => {
	// get the number decimal digits
	const str = new Decimal(num).toFixed();

	const index = str.indexOf('.');
	if (index === -1) return 0;
	return str.length - index - 1;
};

export function priceToFixed(props: {
	value: number;
	decimal?: number;
	dp?: number;
}) {
	try {
		if (Number.isNaN(props.value * 0)) {
			return props.value;
		}

		if (props.value === 0) {
			return '0';
		}
		let d = new Decimal(props.value);
		//   let v:Decimal;
		if (typeof props.decimal !== 'undefined') {
			d = d.div(Math.pow(10, props.decimal));
		}

		if (typeof props.dp === 'undefined') {
			d.toFixed();
		}
		return d.toFixed(props.dp, 1);
	} catch (e) {
		console.log('errr:::', props.value, props.decimal, props.dp, e);
	}
}
