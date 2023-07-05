// create position api use redux-toolkit

import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import orderlyService from '@/service/orderlyService';

// Create the API using createApi
export const positionsApi = createApi({
	reducerPath: 'positions',
	baseQuery: fakeBaseQuery(),
	// tagTypes: ['Positions'],
	endpoints: (builder) => ({
		getPositions: builder.query({
			queryFn: async (args: any, queryApi, extraOptions, baseQuery) => {
				return orderlyService.api.trade
					.getAllPositionInfo()
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
		}),
		getPosition: builder.query({
			queryFn: async (args: any, queryApi, extraOptions, baseQuery) => {
				return orderlyService.api.trade
					.getOnePositionInfo(args)
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
		}),
	}),
});

export const { useGetPositionsQuery, useGetPositionQuery } = positionsApi;
