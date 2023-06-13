import { selectLoggedIn } from '@/redux/appSlice';
import orderlyService from '@/service/orderlyService';
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { BehaviorSubject } from 'rxjs';

export const useTickers = () => {
	const isLoggedIn = useSelector(selectLoggedIn);
	const subject = useRef(new BehaviorSubject([]));
	// useEffect(() => {
	// 	console.log('orderlyService', isLoggedIn, orderlyService.ws);
	// 	if (isLoggedIn) {
	// 		orderlyService.ws.setMessageCallback((message: any) => {
	// 			console.log('***** useTickers ****', message);
	// 		});

	// 		orderlyService.ws.websocket.addEventListener('open', () => {
	// 			orderlyService.ws.sendSubscription({
	// 				id: 'client_id1',
	// 				event: 'subscribe',
	// 				topic: 'tickers',
	// 			});
	// 		});
	// 	}
	// }, [isLoggedIn]);

	return subject.current;
};
