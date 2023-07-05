import React, { FC, useContext, useEffect, useState } from 'react';
import { FuturesTabsStatus, Tab } from './tab';
import { usePositionObservable } from './usePositionObservable';
import { PositionContext } from './positionContext';
import { Checkbox } from '@douyinfe/semi-ui';
import {
	futuresHideOtherPairsSelector,
	toggleFuturesHideOtherPairs,
} from '@/redux/uiSlice';
import { useDispatch, useSelector } from 'react-redux';
import OrderlyContext from '@/hooks/orderlyContext';

interface Props {
	status: FuturesTabsStatus;
	onStatusChange: (status: FuturesTabsStatus) => void;
	disabled?: boolean;
}

export const PositionTabs: FC<Props> = (props) => {
	// const positions = usePositionObservable();
	const hideOtherSymbols = useSelector(futuresHideOtherPairsSelector);
	const dispath = useDispatch();
	const [positionCount, setPositionCount] = useState(0);
	const { positionSubject } = useContext(PositionContext);
	const { orders$ } = useContext(OrderlyContext);
	const [openOrderCount, setOrderCount] = useState(0);

	useEffect(() => {
		const subscriber = positionSubject.subscribe((data) => {
			setPositionCount(data.length);
		});

		return () => {
			subscriber.unsubscribe();
		};
	}, []);

	useEffect(() => {
		const subscriber = orders$.subscribe((data) => {
			setOrderCount(data.length);
		});

		return () => {
			subscriber.unsubscribe();
		};
	});

	return (
		<div className="flex flex-row gap-3 px-4 border-b border-t border-solid text-sm items-center">
			<div className="flex-1 flex flex-row gap-3 ">
				<Tab
					label={`Positions (${positionCount})`}
					value={FuturesTabsStatus.POSITIONS}
					onClick={props.onStatusChange}
					active={props.status === FuturesTabsStatus.POSITIONS}
					disabled={props.disabled}
				/>
				<Tab
					label={`Open Orders (${openOrderCount})`}
					value={FuturesTabsStatus.OPENORDER}
					onClick={props.onStatusChange}
					active={props.status === FuturesTabsStatus.OPENORDER}
					disabled={props.disabled}
				/>
				<Tab
					label="Trading History"
					value={FuturesTabsStatus.TRADINGHISTORY}
					onClick={props.onStatusChange}
					active={props.status === FuturesTabsStatus.TRADINGHISTORY}
					disabled={props.disabled}
				/>
			</div>
			<div>
				<Checkbox
					checked={hideOtherSymbols}
					onChange={() => {
						dispath(toggleFuturesHideOtherPairs());
					}}
				>
					Hide Other Symbols
				</Checkbox>
			</div>
		</div>
	);
};
