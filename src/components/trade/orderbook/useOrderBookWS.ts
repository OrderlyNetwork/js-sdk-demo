import { selectLoggedIn } from '@/redux/appSlice';
import orderlyService from '@/service/orderlyService';
import Decimal from 'decimal.js-light';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { combineLatest, merge } from 'rxjs';
import {
	concatWith,
	combineLatestWith,
	filter,
	tap,
	map,
	scan,
} from 'rxjs/operators';

const paddingFn = (len: number): string[] => Array(len).fill(['-', '-', '-']);

const dataMap = (data: any[]) => {
	let total = 0;

	return data.map((item) => {
		total += item[1];
		return [item[0], item[1], total];
	});
};

const mergeData = (prev: any[], current: any[]) => {
	if (prev.length === 0) return current;

	const data = [...prev];

	current.forEach((item) => {
		const index = data.findIndex((prevItem) => prevItem[0] === item[0]);
		if (index !== -1) {
			// data[index] = item;
			if (item[1] === 0) {
				data.splice(index, 1);
			} else {
				data[index] = item;
			}
		} else {
			data.push(item);
		}
	});

	data.sort((a, b) => {
		return a[0] - b[0];
	});

	return data;
};

export const useOrderBookWS = (symbol?: string): any[] => {
	const [level, setLevel] = useState(10);
	const [asks, setAsks] = useState(paddingFn(10));
	const [bids, setBids] = useState(paddingFn(10));
	const [max, setMax] = useState(0);

	useEffect(() => {
		if (!symbol) return;
		const topic = `${symbol}@orderbookupdate`;

		const subscriber = merge(
			orderlyService.publicWs
				.subscribe({
					id: `${symbol}_request`,
					event: 'request',
					params: {
						type: 'orderbook',
						symbol: symbol,
					},
				})
				.pipe(
					filter((data: any) => data['event'] === 'request'),
					// tap((data) => console.log('------request-----', data)),
					map((data) => data['data']),
				),
			orderlyService.publicWs
				.subscribe({
					id: topic,
					topic,
					event: 'subscribe',
				})
				.pipe(
					filter((data: any) => data['topic'] === topic),
					// tap((data) => console.log('------update-----', data)),
					map((data) => data['data']),
				),
		)
			.pipe(
				scan(
					(acc, value, index) => {
						// console.log('------orderbook', acc, value, index);
						let asks = mergeData(acc.asks, value.asks).slice(0, level);
						let bids = mergeData(acc.bids, value.bids).slice(0, level);

						// if (index === 0) {
						// let asks = value.asks.slice(0, level);
						asks = dataMap(asks);

						asks.reverse();
						// let bids = value.bids.slice(0, level);
						// bids.reduce(accFun, [0, 0, 0]);
						bids = dataMap(bids);

						const max = new Decimal(asks[0][2])
							.add(bids[bids.length - 1][2])
							.toNumber();

						// console.log('max', max, asks[0][2], bids[bids.length - 1][2]);

						return {
							asks,
							bids,
							total: max,
						};

						// return acc;
					},
					{ asks: [], bids: [], total: 0 },
				),
			)
			.subscribe((data) => {
				// console.log('//////////orderbook', data);
				setAsks(paddingFn(level - data.asks.length).concat(data.asks));
				setBids(data.bids.concat(paddingFn(level - data.bids.length)));
				setMax(data.total);
			});

		// console.log('!!!!!!', topic);

		return () => {
			orderlyService.publicWs.unsubscribe({
				id: topic,
				topic,
				event: 'unsubscribe',
			});
			subscriber.unsubscribe();
			setAsks(paddingFn(10));
			setBids(paddingFn(10));
			setMax(0);
		};
	}, [symbol]);

	return [asks, bids, max];
};
