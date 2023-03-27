import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import orderlyService from '@/service/orderlyService';

export const ordersApi = createApi({
	baseQuery: fakeBaseQuery(),

	reducerPath: 'orders',
	tagTypes: ['Orders'],
	endpoints: (build) => {
		return {
			getOrders: build.query<any[], any>({
				queryFn: async (args: any, queryApi, extraOptions, baseQuery) => {
					return orderlyService.api.orders
						.getOrders(args)
						.then((res) => {
							return {
								data: res,
							};
						})
						.catch((error) => {
							return {
								error: error,
							};
						});
				},
				providesTags: (result: any) =>
					Array.isArray(result) && result.length
						? [{ type: 'Orders', id: result[0].status }]
						: [{ type: 'Orders', id: 'empty' }],
			}),
			createOrder: build.mutation<any, any>({
				queryFn: async (args: any, queryApi, extraOptions, baseQuery) => {
					return orderlyService.api.orders
						.create(args)
						.then((res) => {
							return {
								data: res,
							};
						})
						.catch((err) => {
							return {
								error: err,
							};
						});
				},
				invalidatesTags: [{ type: 'Orders', id: 'NEW' }],
			}),
			cancelOrder: build.mutation<any, any>({
				queryFn: (args: any, queryApi, extraOptions, baseQuery) => {
					console.log('cancelOrder', args);
					// try {
					return orderlyService.api.orders
						.cancel(args)
						.then((res) => {
							// console.log('(((((((((((((', res);
							return {
								data: res,
							};
						})
						.catch((err) => {
							// console.log('))))))))))))))', err);
							// throw err;
							return {
								error: err,
							};
						});
					// } catch (e) {
					// 	return {
					// 		error: e,
					// 	};
					// }
				},
				invalidatesTags: [{ type: 'Orders', id: 'NEW' }],
			}),
		};
	},
});

export const {
	useGetOrdersQuery,
	useCancelOrderMutation,
	useCreateOrderMutation,
} = ordersApi;
