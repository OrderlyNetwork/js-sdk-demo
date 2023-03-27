import { OrderSide } from 'orderly-sdk/lib/enums';
import React, { FC, useMemo } from 'react';

interface Props {
	side: OrderSide;
	base: any;
	quote: any;
}

const AvblField: FC<Props> = (props) => {
	const { base, quote } = props;
	console.log(base, quote);

	const value = useMemo(() => {
		if (props.side === OrderSide.BUY) {
			return `${base?.formatted ?? 0} ${base?.name ?? ''}`;
		}
		return `${quote?.formatted ?? 0} ${quote?.name ?? ''}`;
	}, [base, quote, props.side]);

	return (
		<div className="flex flex-row px-2 mt-3">
			<span className="text-xs text-gray-500">{`Available: ${value}`}</span>
		</div>
	);
};

export default AvblField;
