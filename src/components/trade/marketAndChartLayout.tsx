import React, { FC } from 'react';
import MarketPrice from './market';
import { TradingViewPanel } from './tradingview';
import { TradingPairType } from '@/redux/tradingSlice';

interface Props {}

export const MarketAndChartLayout: FC<Props> = (props) => {
	return (
		<div className="h-full grid grid-rows-[_60px_1fr]">
			<div className="">
				<MarketPrice />
			</div>
			<div>
				<TradingViewPanel />
			</div>
		</div>
	);
};
