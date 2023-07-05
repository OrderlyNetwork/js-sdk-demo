import React, { FC } from 'react';

import { OrderForm } from './form/orderForm';
import { useSelector } from 'react-redux';
import { TradingPairType, selectTradingType } from '@/redux/tradingSlice';

interface Props {}

export const OrderPane: FC<Props> = (props) => {
	return (
		<div className="p-4">
			<OrderForm />
		</div>
	);
};
