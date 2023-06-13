import React, { useMemo } from 'react';
import { PriceCell } from './priceCell';
import { usePublicWS } from '@/hooks/usePublicWS';
import { useSelector } from 'react-redux';
import { selectCurrentTradingPair } from '@/redux/tradingSlice';
import { Price } from './price';

export const Prices = () => {
	const currentTradingPair = useSelector(selectCurrentTradingPair);

	const data = usePublicWS<any>(
		() => ({
			id: 'ticker',
			topic: `${currentTradingPair!.symbol}@ticker`,
			event: 'subscribe',
		}),
		{
			dataFilter: (data) => {
				return data['topic'] === `${currentTradingPair?.symbol}@ticker`;
			},
			dataMap: (data) => {
				return data['data'];
			},
		},
	);

	const percent = useMemo(() => {
		if (!data) return '0.00%';
		return `${(((data.close - data.open) / data.open) * 100).toFixed(2)}%`;
	}, [data]);

	return (
		<>
			<Price value={data?.close ?? '--'} />
			<div className="flex flex-row gap-5">
				<PriceCell label="24h Change" value={percent} />
				<PriceCell label="24h High" value={data?.high} />
				<PriceCell label="24h Low" value={data?.low} />
				{/* <PriceCell label="" value="$28,213.32" /> */}
			</div>
		</>
	);
};
