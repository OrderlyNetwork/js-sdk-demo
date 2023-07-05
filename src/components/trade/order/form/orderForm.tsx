import React, { FC, useLayoutEffect, useMemo, useRef } from 'react';
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
import {
	TradingPairType,
	selectCurrentTradingPair,
	selectTradingType,
} from '@/redux/tradingSlice';
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
import { CostAndMax } from './costAndMax';
import { Max } from './max';

const StorageKey = 'latestOrderType';

interface Props {}

export const OrderForm: FC<Props> = (props) => {
	const { validatePrice, base, quote } = useOrderValidate();
	const currentTradingPair = useSelector(selectCurrentTradingPair);
	const isLogged = useSelector(selectLoggedIn);
	const [loading, setLoading] = React.useState(false);
	const formRef = useRef<FormApi>();
	const [createOrder, { isLoading }] = useCreateOrderMutation();
	const tradeType = useSelector(selectTradingType);

	const type =
		typeof window !== 'undefined'
			? (localStorage.getItem(StorageKey) as OrderType)
			: OrderType.LIMIT;

	// const {submitOrder,lo} = useOrder({})
	const onSubmit = (values: any) => {
		// console.log(values, currentTradingPair);
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

		// Notification.info({
		// 	title: 'Create Order Params',
		// 	content: <pre>{JSON.stringify(data, null, 2)}</pre>,
		// 	duration: 20,
		// 	position: 'bottomRight',
		// });

		createOrder(data)
			.then((res: any) => {
				// console.log(res);
				if (res.data) {
					Toast.success({ content: 'Create Order Success', theme: 'light' });
					formRef.current?.reset();
					if (typeof window !== 'undefined') {
						localStorage.setItem(StorageKey, data.order_type);
					}
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
	};

	return (
		<div>
			<Form
				onSubmit={onSubmit}
				initValues={{
					side: OrderSide.BUY,
					type: type,
					price: '',
					amount: '',
				}}
				getFormApi={(formApi) => {
					formRef.current = formApi;
				}}
			>
				{({ formState, values, formApi }) => (
					<>
						{/* <SideField
							value={values.side}
							onChange={(side: OrderSide): void => {
								formApi.setValue('side', side);
							}}
						/> */}
						<div className="border-b pb-2">
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
						</div>

						<AvblField
							side={values.side}
							quote={quote}
							base={base}
							tradingPairType={tradeType}
						/>
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
							// validate={validatePrice}
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
						{/* <div className="pb-3 pt-2">
							<Slider
								marks={{
									0: '0',
									25: '25',
									50: '50',
									76: '75',
									100: '100',
								}}
							></Slider>
						</div> */}

						<div className="py-2 mt-3 flex flex-row gap-2">
							<div className="flex-1 flex flex-col">
								<Button
									onClick={() => {
										formApi.submitForm();
									}}
									block
									// htmlType="submit"
									theme="solid"
									style={{
										height: '40px',
									}}
									disabled={!currentTradingPair || !isLogged}
									loading={loading}
									className="!bg-trade-green hover:!bg-trade-green/90"
								>
									{`Buy ${currentTradingPair?.quote ?? ''}`}
								</Button>
								{/* <div className="flex flex-row mt-3 text-xs gap-2">
									<span className="text-gray-600">Cost</span>
									<span>0.00USDC</span>
								</div>
								<div className="flex flex-row mt-1 text-xs gap-2">
									<span className="text-gray-600">Max</span>
									<span>0.00USDC</span>
								</div> */}
								{tradeType === 'PERP' ? (
									<CostAndMax
										available={base}
										side={OrderSide.BUY}
										price={0}
										quantity={values.amount}
										type={values.type}
									/>
								) : (
									<Max />
								)}
							</div>

							<div className="flex-1 flex flex-col">
								<Button
									onClick={() => {
										formApi.submitForm();
									}}
									block
									// htmlType="submit"
									theme="solid"
									className="!bg-trade-red hover:!bg-trade-red/90"
									style={{
										height: '40px',
									}}
									disabled={!currentTradingPair || !isLogged}
									loading={loading}
								>{`Sell ${currentTradingPair?.quote ?? ''}`}</Button>
								{/* <div className="flex flex-row mt-3 text-xs gap-2">
									<span className="text-gray-600">Cost</span>
									<span>0.00USDC</span>
								</div>
								<div className="flex flex-row mt-1 text-xs gap-2">
									<span className="text-gray-600">Max</span>
									<span>0.00USDC</span>
								</div> */}
								{tradeType === 'PERP' ? (
									<CostAndMax
										available={base}
										side={OrderSide.SELL}
										price={0}
										quantity={values.amount}
										type={values.type}
									/>
								) : (
									<Max />
								)}
							</div>

							{/* <div className="mt-4">
								<Button
									block
									type="tertiary"
									htmlType="button"
									disabled={!isLogged}
								>
									CreateBatch Order (test)
								</Button>
							</div> */}
						</div>
					</>
				)}
			</Form>
		</div>
	);
};
