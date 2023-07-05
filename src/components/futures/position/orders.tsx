import { OrderListview } from '@/components/trade/orders/listview';
import { OrderStatus } from '@/components/trade/orders/tabs';
import OrderlyContext from '@/hooks/orderlyContext';
import { selectLoggedIn } from '@/redux/appSlice';
import { useCancelOrderMutation, useGetOrdersQuery } from '@/redux/ordersApi';
import { selectCurrentTradingPair } from '@/redux/tradingSlice';
import React, { useContext, useEffect, useMemo } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';

export const FuturesOrders = () => {
	const [status, setStatus] = useState(OrderStatus.NEW);
	const [orders, setOrders] = useState<any[]>([]);
	const currentTradingPair = useSelector(selectCurrentTradingPair);
	const { orders$, queryOrders } = useContext(OrderlyContext);
	const [cancelOrder, { isLoading: isCancelOrdering }] =
		useCancelOrderMutation();

	useEffect(() => {
		const subscriber = orders$.subscribe((data) => {
			setOrders(data);
		});

		return () => {
			subscriber.unsubscribe();
		};
	});

	// const orders = useMemo(() => {
	// 	if (!data) return [];

	// 	return data.filter((o) => o.symbol.startsWith('PERP'));
	// }, [data]);

	return (
		<OrderListview
			dataSource={orders}
			isLoading={false}
			status={status}
			// onCancel={onOrderCancel}
		/>
	);
};
