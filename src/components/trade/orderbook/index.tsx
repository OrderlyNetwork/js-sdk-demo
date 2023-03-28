import {
	selectCurrentTokenConfig,
	selectCurrentTradingPair,
	selectTokensConfig,
	setOrderBooksLatest,
} from '@/redux/tradingSlice';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { OrderBookHeader } from './header';
import { OrderBookItem } from './orderbook';
import { Ticker } from './ticker';
import { Spin } from '@douyinfe/semi-ui';

import { useOrderbook } from './useOrderbook';

export const OrderBook = () => {
	const { bids, asks, isLoading } = useOrderbook();

	// broadcast: the order-book data is updated
	useEffect(() => {
		if (bids.length === 0 || asks.length === 0) return;
		// dispatch(setOrderBooksLatest([bids[0], asks[asks.length - 1]]));
	}, [bids, asks]);

	return (
		<div>
			<div className="px-3 py-2 border-b border-solid flex flex-row justify-between items-center text-sm">
				<div>Order book</div>
				<div>
					<Spin spinning={isLoading} />
				</div>
			</div>
			<OrderBookHeader />
			<OrderBookItem dataSource={asks} type="ask" />
			<Ticker />
			<OrderBookItem dataSource={bids} type="bid" />
		</div>
	);
};