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
import { useOrderBookWS } from './useOrderBookWS';

export const OrderBook = () => {
	// const { bids, asks, isLoading } = useOrderbook();
	const currentTradingPair = useSelector(selectCurrentTradingPair);
	const [asks, bids, max] = useOrderBookWS(currentTradingPair?.symbol);

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
					<Spin spinning={false} />
				</div>
			</div>
			<OrderBookHeader />
			<OrderBookItem dataSource={asks} type="ask" max={max} />
			<Ticker />
			<OrderBookItem dataSource={bids} type="bid" max={max} />
		</div>
	);
};
