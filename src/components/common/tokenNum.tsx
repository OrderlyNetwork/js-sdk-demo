import React, { FC, useMemo } from 'react';
import Decimal from 'decimal.js-light';
import { priceToFixed } from '@/utils/decimal';

interface Props {
	value: number;
	decimal?: number;
	dp?: number;
	currency?: string;
}

export const TokenNum: FC<Props> = (props) => {
	const t = useMemo(() => {
		return priceToFixed(props);
	}, [props.value, props.decimal]);

	return (
		<>
			<span>{t}</span>{' '}
			{typeof props.currency !== 'undefined' ? (
				<span>{props.currency}</span>
			) : null}
		</>
	);
};
