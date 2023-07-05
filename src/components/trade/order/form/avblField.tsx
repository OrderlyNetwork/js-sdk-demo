import { LeverageButton } from '@/components/futures/leverage';
import { selectAccountLeverage } from '@/redux/appSlice';
import { TradingPairType } from '@/redux/tradingSlice';
import { OrderSide } from '@orderly.network/orderly-sdk/lib/enums';
import React, { FC, useMemo } from 'react';
import { useSelector } from 'react-redux';

interface Props {
	side: OrderSide;
	base: any;
	quote: any;
	tradingPairType: TradingPairType;
}

const AvblField: FC<Props> = (props) => {
	const { base, quote } = props;
	const leverage = useSelector(selectAccountLeverage);

	const value = useMemo(() => {
		// 现货规则
		if (props.tradingPairType === 'SPOT') {
			if (props.side === OrderSide.BUY) {
				return `${base?.formatted ?? 0} ${base?.name ?? ''}`;
			}
			return `${quote?.formatted ?? 0} ${quote?.name ?? ''}`;
		}
		// 期货规则
		return `${(base?.formatted ?? 0) * (leverage ?? 0)} ${base?.name ?? ''}`;
	}, [base, quote, props.side]);

	return (
		<div className="h-6 flex flex-row px-2 mt-3 items-end justify-between">
			<div className="text-xs text-gray-500">{`Available: ${value}`}</div>
			{props.tradingPairType === 'PERP' ? <LeverageButton /> : null}
		</div>
	);
};

export default AvblField;
