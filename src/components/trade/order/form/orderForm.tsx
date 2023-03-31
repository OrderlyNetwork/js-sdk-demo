import React, { useMemo, useRef } from 'react';
import {
	Form,
	Button,
	Space,
	Toast,
	Notification,
	Slider,
} from '@douyinfe/semi-ui';
import { useOrderValidate } from './useOrderValidate';
import { useSelector } from 'react-redux';
import { selectCurrentTradingPair } from '@/redux/tradingSlice';
import orderlyService from '@/service/orderlyService';
import { OrderSide, OrderType } from '@orderly.network/orderly-sdk/lib/enums';
import { FormApi } from '@douyinfe/semi-ui/lib/es/form';
import { SideField } from './sideField';
import { OrderTypeField } from './orderType';
import clsx from 'clsx';
import { OrderFactory } from '@/service/createOrder';
// import { useOrder } from '@/components/trade/order/form/useOrder';
import { selectLoggedIn } from '@/redux/appSlice';
import { useCreateOrderMutation } from '@/redux/ordersApi';
import MaxField from '@/components/trade/order/form/maxField';
import AvblField from '@/components/trade/order/form/avblField';

export const OrderForm = () => {
	const { validatePrice, base, quote } = useOrderValidate();
	const currentTradingPair = useSelector(selectCurrentTradingPair);
	const isLogged = useSelector(selectLoggedIn);
	const [loading, setLoading] = React.useState(false);
	const formRef = useRef<FormApi>();
	const [createOrder, { isLoading }] = useCreateOrderMutation();

	// const {submitOrder,lo} = useOrder({})
	const onSubmit = (values: any) => {
		console.log(values, currentTradingPair);
		if (!currentTradingPair || loading) return;
		setLoading(true);

		let data: any = {
			symbol: currentTradingPair?.symbol,
			order_type: values.type,
			side: values.side,
		};

		const orderCreator = OrderFactory.createOrder(values.type);

		if (!orderCreator) {
			throw new Error('orderCreator is null');
		}

		data = orderCreator.createOrder({
			...data,
			...values,
		});

		Notification.info({
			title: 'Create Order Params',
			content: <pre>{JSON.stringify(data, null, 2)}</pre>,
			duration: 20,
			position: 'bottomRight',
		});

		createOrder(data)
			.then((res: any) => {
				// console.log(res);
				if (res.data) {
					Toast.success({ content: 'Create Order Success', theme: 'light' });
					formRef.current?.reset();
				}
				if (res.error) {
					throw new Error(res.error);
				}
			})
			.catch((err) => {
				Toast.error({ content: err.message, theme: 'light' });
			})
			.finally(() => {
				setLoading(false);
			});

		// orderlyService.api.orders
		// 	.create(data)
		// 	.then((res) => {
		// 		// console.log(res);
		// 		Toast.success({ content: 'Create Order Success', theme: 'light' });
		// 		formRef.current?.reset();
		// 	})
		// 	.catch((err) => {
		// 		Toast.error({ content: err.message, theme: 'light' });
		// 	})
		// 	.finally(() => {
		// 		setLoading(false);
		// 	});
	};

	return (
		<div>
			<Form
				onSubmit={onSubmit}
				initValues={{
					side: OrderSide.BUY,
					type: OrderType.LIMIT,
					price: '',
					amount: '',
				}}
				getFormApi={(formApi) => {
					formRef.current = formApi;
				}}
			>
				{({ formState, values, formApi }) => (
					<>
						<SideField
							value={values.side}
							onChange={(side: OrderSide): void => {
								formApi.setValue('side', side);
							}}
						/>
						<OrderTypeField
							value={values.type}
							onChange={(type: OrderType): void => {
								formApi.setValue('type', type);
								if (type === OrderType.MARKET || type === OrderType.ASK) {
									formApi.setValue('price', 0);
									formApi.setError('price', null);
								}
							}}
						/>
						<AvblField side={values.side} quote={quote} base={base} />
						<Form.Input
							field="price"
							label="价格"
							noLabel
							prefix="Price"
							autoComplete="off"
							disabled={
								values.type === OrderType.MARKET ||
								values.type === OrderType.ASK ||
								!currentTradingPair
							}
							suffix={
								<div className="w-[60px] pr-2 text-right">
									{currentTradingPair?.base}
								</div>
							}
							className="order-input"
							validate={validatePrice}
						/>
						<Form.Input
							autofocus
							field="amount"
							label={{
								text: 'quantity',
							}}
							autoComplete="off"
							disabled={!currentTradingPair}
							noLabel
							suffix={
								<div className="w-[60px] pr-2 text-right">
									{currentTradingPair?.quote}
								</div>
							}
							prefix={'Amount'}
							rules={[{ required: true }]}
							className="order-input"
						/>
						{/* <div>
							<Slider showBoundary={true}></Slider>
						</div> */}
						<div className="py-2 mt-2">
							<Button
								block
								htmlType="submit"
								theme="solid"
								style={{
									height: '40px',
								}}
								disabled={!currentTradingPair || !isLogged}
								loading={loading}
								className={clsx(
									'text-white !transition-all',
									values.side === OrderSide.SELL
										? '!bg-trade-red hover:!bg-trade-red/90'
										: '!bg-trade-green hover:!bg-trade-green/90',
								)}
							>
								{values.side === OrderSide.BUY
									? `Buy ${currentTradingPair?.quote ?? ''}`
									: `Sell ${currentTradingPair?.quote ?? ''}`}
							</Button>
							<div className="mt-4">
								<Button
									block
									type="tertiary"
									htmlType="button"
									disabled={!isLogged}
								>
									CreateBatch Order (test)
								</Button>
							</div>
						</div>
					</>
				)}
			</Form>
		</div>
	);
};
