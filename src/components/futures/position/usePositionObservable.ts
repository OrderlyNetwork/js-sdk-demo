import orderlyService from '@/service/orderlyService';
import { Position, PositionWithTableCell } from '@/types/prep';
import { calcualteNotional, calcualteUnrealPnL } from '@/utils/perp';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';

import {
	combineLatestWith,
	distinctUntilChanged,
	filter,
	from,
	map,
	mergeWith,
	scan,
} from 'rxjs';
import { PositionContext } from './positionContext';
// import { mergeAll } from 'ramda';

export const usePositionObservable = () => {
	// imput: 1, marketPrice, position api response;

	const { positionSubject } = useContext(PositionContext);

	const [position, setPosition] = useState<PositionWithTableCell[]>([]);

	// const position$ = useMemo(() => {
	// 	return orderlyService.privateWs
	// 		.subscribe({
	// 			id: '',
	// 			event: 'subscribe',
	// 			topic: 'position',
	// 		})
	// 		.pipe(
	// 			filter((data: any) => data['topic'] === 'position'),
	// 			map((data: any) => data['data']?.['positions'] ?? []),
	// 			map((data: any[]) => {
	// 				return data.map((item) => {
	// 					const d = {
	// 						...item,
	// 						// calcualte
	// 						position_qty:
	// 							item.positionQty + item.pendingShortQty + item.pendingLongQty,
	// 						average_open_price: item.averageOpenPrice,
	// 						unsettled_pnl: item.unsettledPnl,

	// 						mark_price: item.markPrice,
	// 					};

	// 					return {
	// 						...d,
	// 						unrealPnL: calcualteUnrealPnL(d, item.markPrice),
	// 						notional: calcualteNotional(d, item.markPrice),
	// 					};
	// 				});
	// 			}),
	// 		);
	// }, []);

	useEffect(() => {
		// combineLatest
		// const subscriber = from(orderlyService.api.trade.getAllPositionInfo())
		// 	.pipe(
		// 		mergeWith(position$),
		// 		scan<PositionWithTableCell[], PositionWithTableCell[]>((acc, curr) => {
		// 			// console.log('acc, curr:', acc, curr);
		// 			if (acc.length === 0) return curr;

		// 			const changed = [...curr];
		// 			const newPositions = [];

		// 			for (let index = 0; index < acc.length; index++) {
		// 				const element = acc[index];
		// 				const index2 = changed.findIndex(
		// 					(item) => item.symbol === element.symbol,
		// 				);
		// 				if (index2 === -1) {
		// 					newPositions.push(element);
		// 					continue;
		// 				}
		// 				const p = changed.splice(index2, 1);
		// 				newPositions.push(p[0]);
		// 			}

		// 			if (changed.length > 0) {
		// 				newPositions.push(...changed);
		// 			}

		// 			return newPositions;
		// 		}, []),
		// 		combineLatestWith(
		// 			orderlyService.publicWs
		// 				.subscribe({
		// 					id: 'clientID',
		// 					topic: 'markprices',
		// 					event: 'subscribe',
		// 				})
		// 				.pipe(
		// 					filter((data: any) => data['topic'] === 'markprices'),
		// 					map((data: any) => data['data']),
		// 					// convert array to object
		// 					map((data: any[]) => {
		// 						const result: any = {};

		// 						data.forEach((item) => {
		// 							result[item['symbol']] = item;
		// 						});

		// 						return result;
		// 					}),
		// 				),
		// 		),
		// 		map(([positions, marketPrice]) => {
		// 			return positions.map((item: Position) => {
		// 				let price = marketPrice[item.symbol]?.['price'] ?? item.mark_price;
		// 				return {
		// 					...item,
		// 					// calcualte

		// 					unrealPnL: calcualteUnrealPnL(item, price),
		// 					notional: calcualteNotional(item, price),
		// 					mark_price: price,
		// 				};
		// 			});
		// 		}),
		// 	)
		const subscriber = positionSubject.subscribe((positions) => {
			// console.log('positions', positions);
			setPosition(positions);
		});

		return () => {
			subscriber.unsubscribe();
		};
	}, []);

	return position;
};
