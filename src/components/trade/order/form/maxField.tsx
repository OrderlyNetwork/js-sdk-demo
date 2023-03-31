import { OrderSide } from '@orderly.network/orderly-sdk/lib/enums';
import React, { FC, useMemo } from 'react';

interface Props {
	side: OrderSide;
	base: any;
	quote: any;
}

const MaxField: FC<Props> = (props) => {
	// const base = useSelector(selectCurrentBaseAssets);
	// const quote = useSelector(selectCurrentQuoteAssets);
	const { base, quote } = props;
	console.log(base, quote);

	const value = useMemo(() => {
		if (props.side === OrderSide.BUY) {
			return `${base?.formatted ?? 0} ${base?.name ?? ''}`;
		}
		return `${quote?.formatted ?? 0} ${quote?.name ?? ''}`;
	}, [base, quote, props.side]);

	return (
		<div className="flex flex-row justify-between px-2">
			<span className="text-xs text-gray-500">{value}</span>
			<a href="" className="text-xs text-gray-500">
				Max
			</a>
		</div>
	);
};

export default MaxField;
