import { selectLoggedIn } from '@/redux/appSlice';
import orderlyService from '@/service/orderlyService';
import { OrderStatus } from '@orderly.network/orderly-sdk/lib/enums';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { BehaviorSubject, startWith, switchMap, distinct } from 'rxjs';

export interface OrdersQueryParams {
	symbol?: string;
	side?: string;
	order_type?: string;
	status?: string;
	start_t?: string;
	end_t?: string;
	page?: number;
	size?: number;
}

export const useOrders = () => {
	const [orders, setOrders] = useState<any[]>([]);
	const isLoggedIn = useSelector(selectLoggedIn);

	const order$ = useMemo<BehaviorSubject<any[]>>(
		() => new BehaviorSubject([]),
		[],
	);

	const ordersQueryParams$ = useMemo<BehaviorSubject<OrdersQueryParams>>(
		() =>
			new BehaviorSubject({
				page: 1,
				size: 10,
				status: OrderStatus.NEW,
			}),
		[],
	);

	const query = useCallback((params: any) => {
		ordersQueryParams$.next(params);
	}, []);

	// const order$ = useMemo<BehaviorSubject<any[]>>(() => {
	// 	return ordersQueryParams$.pipe(
	// 		switchMap((params) => {
	// 			console.log('query params=====', params);
	// 			return orderlyService.api.orders.getOrders(params);
	// 		}),
	// 	);
	// }, []);
	useEffect(() => {
		if (!isLoggedIn) return;

		const subscriber = ordersQueryParams$
			.pipe(
				// startWith(),

				switchMap((params) => {
					console.log('query params=====', params);
					return orderlyService.api.orders.getOrders(params);
				}),
			)
			.subscribe(order$);

		return () => {
			subscriber.unsubscribe();
		};
	}, [isLoggedIn]);

	return { order$, query };
};
