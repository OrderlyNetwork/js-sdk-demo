import React, { useMemo, useState } from 'react';
import { PositionTabs } from './tabs';
import { PositionListView } from './positionListview';
import { useSelector } from 'react-redux';
import { selectLoggedIn } from '@/redux/appSlice';
import { FuturesTabsStatus } from './tab';
import { FuturesOrders } from './orders';
import { TradeHistoryList } from './tradeHistoryList';

export const PositionGroupPanel = () => {
	const [status, setStatus] = useState<FuturesTabsStatus>(
		FuturesTabsStatus.POSITIONS,
	);
	const isLoading = useSelector(selectLoggedIn);
	const isLoggedIn = useSelector(selectLoggedIn);

	const bodyViwe = useMemo(() => {
		if (!isLoading) return <div />;
		switch (status) {
			case FuturesTabsStatus.POSITIONS:
				return <PositionListView />;
			case FuturesTabsStatus.OPENORDER:
				return <FuturesOrders />;
			case FuturesTabsStatus.TRADINGHISTORY:
				return <TradeHistoryList />;
			default:
				return <div />;
		}
	}, [isLoading, status]);

	return (
		<div>
			<PositionTabs
				status={status}
				onStatusChange={(status) => {
					setStatus(status);
				}}
				disabled={!isLoggedIn}
			/>
			{bodyViwe}
		</div>
	);
};
