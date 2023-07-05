import { PositionContext } from '@/components/futures/position/positionContext';
import { selectCurrentTradingPair } from '@/redux/tradingSlice';
import { PositionWithTableCell } from '@/types/prep';
import { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { distinctUntilKeyChanged, filter, map } from 'rxjs';

export const useCurrentPositionBySymbol = () => {
	const { positionSubject } = useContext(PositionContext);
	const currentTradingPair = useSelector(selectCurrentTradingPair);
	const [position, setPosition] = useState<PositionWithTableCell | undefined>(
		undefined,
	);

	useEffect(() => {
		const subscription = positionSubject
			.pipe(
				map(
					(positions) =>
						positions.filter(
							(item) => item.symbol === currentTradingPair?.symbol,
						)[0],
				),
				filter((position) => position !== undefined),
				distinctUntilKeyChanged('position_qty'),
			)
			.subscribe((position) => {
				// console.log(position);
				setPosition(position);
			});
		return () => {
			subscription.unsubscribe();
		};
	}, [currentTradingPair]);

	return position;
};
