import { usePublicWS } from '@/hooks/usePublicWS';
import { selectCurrentTradingPair } from '@/redux/tradingSlice';
import { timeConvertString } from '@/utils/perp';
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { interval } from 'rxjs';

export const PredFundingRate = () => {
	const currentTradingPair = useSelector(selectCurrentTradingPair);
	const [time, setTime] = useState('00:00:00');

	const data = usePublicWS<any>(
		() => ({
			id: 'estfundingrate',
			topic: `${currentTradingPair!.symbol}@estfundingrate`,
			event: 'subscribe',
		}),
		{
			dataFilter: (data) => {
				return data['topic'] === `${currentTradingPair?.symbol}@estfundingrate`;
			},
			dataMap: (data) => {
				return data['data'];
			},
		},
	);

	useEffect(() => {
		if (!data || !data.fundingTs) {
			return;
		}

		const timer = setInterval(() => {
			const diff = new Date(data.fundingTs).getTime() - Date.now();
			const result = timeConvertString(diff);

			if (result.length === 3) {
				setTime(
					`${result[0].toString().padStart(2, '0')}:${result[1]
						.toString()
						.padStart(2, '0')}:${result[2].toString().padStart(2, '0')}`,
				);
			}
		}, 1000);

		return () => {
			clearInterval(timer);
		};
	}, [data, time]);

	// console.log(data);
	const rate = useMemo(() => {
		if (!data) {
			return '0.00%';
		}
		return `${(data.fundingRate * 100).toFixed(4)}%`;
	}, [data]);

	return (
		<div className="flex flex-col">
			<div className="text-xs text-black/75">Pred. Funding Rate</div>
			<div>{`${rate} ${time}`}</div>
		</div>
	);
};
