import {
	selectCurrentTokenConfig,
	selectCurrentTradingPair,
	selectTokensConfig,
	setOrderBooksLatest,
	setTickerPrice,
} from '@/redux/tradingSlice';
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { OrderBookHeader } from './header';
import { OrderBookItem } from './orderbook';
import { Ticker } from './ticker';
import { Spin } from '@douyinfe/semi-ui';

import { useOrderbook } from './useOrderbook';
import { useOrderBookWS } from './useOrderBookWS';
import { usePublicWS } from '@/hooks/usePublicWS';

export const OrderBook = () => {
	// const { bids, asks, isLoading } = useOrderbook();
	const currentTradingPair = useSelector(selectCurrentTradingPair);
	const [asks, bids, max] = useOrderBookWS(currentTradingPair?.symbol);
	const dispatch = useDispatch();

	const markPrice = usePublicWS(
		() => ({
			id: 'clientID8',
			topic: `${currentTradingPair!.symbol}@markprice`,
			event: 'subscribe',
		}),
		{
			dataFilter: (data) => {
				return data['topic'] === `${currentTradingPair!.symbol}@markprice`;
			},
			dataMap: (data) => {
				return data['data']['price'];
			},
		},
	);

	// broadcast: the order-book data is updated
	useEffect(() => {
		if (bids.length === 0 || asks.length === 0) return;
		// dispatch(setOrderBooksLatest([bids[0], asks[asks.length - 1]]));
	}, [bids, asks]);

	const tickerPrice = useMemo(() => {
		const bid1 = bids[0]?.price;
		const ask1 = asks[0]?.price;
		if (!bid1 || !ask1) return markPrice ?? 0;

		return [bid1, ask1, markPrice].sort((a, b) => b - a)[1];
	}, [markPrice, asks, bids]);

	useEffect(() => {
		dispatch(setTickerPrice(tickerPrice));
	}, [tickerPrice]);

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
			<Ticker price={tickerPrice} markPrice={markPrice as number} />
			<OrderBookItem dataSource={bids} type="bid" max={max} />
		</div>
	);
};
