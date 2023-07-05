import { selectLoggedIn } from '@/redux/appSlice';
import { selectTradingType } from '@/redux/tradingSlice';
import orderlyService from '@/service/orderlyService';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export const useAvailableBalance = () => {
	const tradeType = useSelector(selectTradingType);
	const isLogged = useSelector(selectLoggedIn);
	const [availableBalance, setAvailableBalance] = useState(0);

	useEffect(() => {
		if (!isLogged) return;
		if (tradeType === 'SPOT') {
		}

		if (tradeType === 'PERP') {
			// get user holdings
			orderlyService.api.account.getCurrentHolding(true).then((data) => {
				console.log(data);
			});
		}
	}, [isLogged]);
};
