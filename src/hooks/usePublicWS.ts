import orderlyService from '@/service/orderlyService';
import { WsTopic } from '@/service/orderlyWsService';
import {
	tap,
	map,
	filter,
	exhaustMap,
	switchMap,
	withLatestFrom,
	throttleTime,
} from 'rxjs/operators';

import { useObservable } from 'rxjs-hooks';
import { selectLoggedIn } from '@/redux/appSlice';
import { useSelector } from 'react-redux';
import { lastValueFrom, of } from 'rxjs';
import { useEffect, useMemo, useState } from 'react';

const _defaultDataFilter =
	(topic: WsTopic | Function) =>
	(data: any): boolean => {
		if (typeof data['topic'] !== 'undefined') {
			const _topic = typeof topic === 'function' ? topic() : topic;
			console.log(data, _topic);
			return data['topic'] === _topic.topic;
		}
		return true;
	};

// export type WsTopicType = WsTopic | ()=>WsTopic;

export interface useWSOptions {
	dataFilter?: (data: any) => boolean;
	dataMap?: (data: any) => any;
	defaultValue?: any;
}

export const usePublicWS = <T>(
	topic: WsTopic | Function,
	options?: useWSOptions,
) => {
	const [data, setData] = useState<T>(options?.defaultValue);

	const _topic = useMemo(() => {
		try {
			return typeof topic === 'function' ? topic() : topic;
		} catch (e) {
			return;
		}
	}, [topic]);

	useEffect(() => {
		if (!_topic) return;
		const subscriber = orderlyService.publicWs
			.subscribe(_topic)
			.pipe(
				filter((data: any) => data['event'] !== 'ping'),
				filter((data) =>
					options && options.dataFilter
						? options!.dataFilter?.(data)
						: _defaultDataFilter(_topic)(data),
				),
				map((data) =>
					options && options.dataMap ? options!.dataMap?.(data) : data,
				),
			)
			.subscribe((data) => {
				setData(data);
			});

		return () => {
			if (_topic['topic']) {
				// console.log('unsubscribe', _topic['topic']);
				orderlyService.publicWs.unsubscribe({
					id: `${_topic['id']}_unsubscribe`,
					topic: _topic['topic'],
					event: 'unsubscribe',
				});
			}
			subscriber.unsubscribe();
		};
	}, [_topic?.topic, _topic?.event]);

	// const data = useObservable(
	// 	(_, input$) =>
	// 		input$.pipe(
	// 			filter(([isLoggedIn, _]) => isLoggedIn),
	// 			filter(([_, topic]) => {
	// 				try {
	// 					if (typeof topic === 'function') {
	// 						const _topic = topic();
	// 						console.log('???????', _topic, !!_topic);

	// 						return !!_topic;
	// 					}
	// 					return true;
	// 				} catch (e) {
	// 					return false;
	// 				}
	// 			}),
	// 			map(([_, topic, options]) => [
	// 				typeof topic === 'function' ? topic() : topic,
	// 				options,
	// 			]),
	// 			throttleTime(1000),
	// 			switchMap(([topic, options]) => {
	// 				// const _topic = typeof topic === 'function' ? topic() : topic;
	// 				// console.log('+++++++', topic);
	// 				return orderlyService.ws.subscribe(topic).pipe(
	// 					filter((data: any) => data['event'] !== 'ping'),
	// 					filter((data) =>
	// 						options && options.dataFilter
	// 							? options!.dataFilter?.(data)
	// 							: _defaultDataFilter(topic),
	// 					),
	// 					map((data) =>
	// 						options && options.dataMap ? options!.dataMap?.(data) : data,
	// 					),
	// 				);
	// 			}),
	// 		),

	// 	null,
	// 	[isLoggedIn, topic, options],
	// );

	return data as T;
};
