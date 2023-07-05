import { useCurrentPositionBySymbol } from '@/hooks/useCurrentPositionBySymbol';

import { selectTickerPrice } from '@/redux/tradingSlice';
import React, { FC, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { OrderSide, OrderType } from '@orderly.network/orderly-sdk/lib/enums';
import Decimal from 'decimal.js-light';
import { selectAccountLeverage } from '@/redux/appSlice';

interface Props {
	available: string;
	side: OrderSide;
	price: number;
	quantity: number;
	type: OrderType;
}

export const CostAndMax: FC<Props> = (props) => {
	const tickPrice = useSelector(selectTickerPrice);
	const leverage = useSelector(selectAccountLeverage);

	// const position = useCurrentPositionBySymbol();
	const max = useMemo(() => {
		return '0.00';
	}, [props.available, props.price]);

	const cost = useMemo(() => {
		if (!props.quantity || !tickPrice) return '0.00';
		if (props.type === OrderType.MARKET) {
			const d = new Decimal(props.quantity);
			return d
				.mul(tickPrice)
				.div(leverage ?? 1)
				.toFixed(2);
		}
		return '0.00';
	}, [props.quantity, props.price]);

	// console.log('max=======', position, tickPrice);

	return (
		<>
			<div className="flex flex-row mt-3 text-xs gap-2">
				<span className="text-gray-600">Cost</span>
				<span>{`${cost}USDC`}</span>
			</div>
			<div className="flex flex-row mt-1 text-xs gap-2">
				<span className="text-gray-600">Max</span>
				<span>{`${max}USDC`}</span>
			</div>
		</>
	);
};
