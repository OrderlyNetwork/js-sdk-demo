import React, { useState } from 'react';

import { OrderStatus, PositionTabs } from './tabs';
import { useSelector } from 'react-redux';
import { selectLoggedIn } from '@/redux/appSlice';
import { selectCurrentTradingPair } from '@/redux/tradingSlice';
import { OrderListview } from '@/components/trade/positions/listview';
import { useCancelOrderMutation, useGetOrdersQuery } from '@/redux/ordersApi';
import { Toast } from '@douyinfe/semi-ui';

export const PositionsGroupPanel = () => {
	const [status, setStatus] = useState(OrderStatus.NEW);
	const isLoggedIn = useSelector(selectLoggedIn);
	const currentTradingPair = useSelector(selectCurrentTradingPair);
	const [cancelOrder, { isLoading: isCancelOrdering }] =
		useCancelOrderMutation();

	const { data, isFetching, isLoading } = useGetOrdersQuery(
		{
			// symbol: currentTradingPair?.symbol,
			status: status,
			size: 10,
		},
		{ skip: !isLoggedIn || !currentTradingPair },
	);

	const onOrderCancel = (orderId: string) => {
		if (!currentTradingPair) return;
		cancelOrder({
			order_id: orderId,
			symbol: currentTradingPair?.symbol,
		})
			.then((res) => {
				if (res.error) {
					throw new Error(res.error);
				} else {
					Toast.success({ content: 'Cancel Order Success', theme: 'light' });
				}
			})
			.catch((err) => {
				Toast.error({ content: err.message, theme: 'light' });
			});
	};

	return (
		<>
			<PositionTabs
				status={status}
				onStatusChange={setStatus}
				disabled={!isLoggedIn}
			/>
			<div className={'order-list'}>
				<OrderListview
					dataSource={data ?? []}
					isLoading={isFetching}
					status={status}
					onCancel={onOrderCancel}
				/>
			</div>
		</>
	);
};
