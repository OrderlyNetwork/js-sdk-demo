import { useState } from 'react';
import OrderlyService from '@/service/orderlyService';
import { OrderFactory, OrderFormData } from '@/service/createOrder';

interface UserOrderParams {
	onSuccess?: () => void;
	onError?: () => void;
}

export const useOrder = ({ onSuccess, onError }: UserOrderParams) => {
	const [loading, setLoading] = useState(false);

	const submitOrder = async (order: OrderFormData) => {
		setLoading(true);
		try {
			const orderCreator = OrderFactory.createOrder(order.type);

			if (!orderCreator) {
				throw new Error('orderCreator is null');
			}

			// order = orderCreator.createOrder({
			// 	...data,
			// 	...order,
			// });
			const res = await OrderlyService.api.orders.create(order);
			console.log(res);
		} catch (error) {
			console.log(error);
		}
		setLoading(false);
	};

	return {
		loading,
		submitOrder,
	};
};
