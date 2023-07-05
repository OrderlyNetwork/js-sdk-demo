import { useCreateOrderMutation } from '@/redux/ordersApi';
import {
	selectCurrentTokenConfig,
	selectCurrentTradingPairConfig,
	selectTradingPairConfigBySymbol,
} from '@/redux/tradingSlice';
import { OrderFactory } from '@/service/createOrder';
import { PositionWithTableCell } from '@/types/prep';
import { numberToLenght } from '@/utils/order';
import { Popover, Toast, Tooltip } from '@douyinfe/semi-ui';
import { OrderSide, OrderType } from '@orderly.network/orderly-sdk/lib/enums';
import Decimal from 'decimal.js-light';
import React, { FC, ReactNode, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

interface Props {
	position: PositionWithTableCell;
}

const closeAmountPercentages = [10, 25, 50, 75, 100];
const CloseAmountPercenTag = (props: {
	percentage: number;
	onClick: (tag: number) => void;
}) => {
	return (
		<button
			onMouseDown={(event) => {
				event.stopPropagation();
				event.preventDefault();
				props.onClick(props.percentage);
			}}
			className="border border-gray-300 text-xs p-1 rounded hover:bg-blue-100 hover:text-blue-600 hover:border-blue-600"
		>
			{props.percentage}%
		</button>
	);
};

export const ClosePositionButton: FC<Props> = (props) => {
	const { position } = props;

	const tradingPairConfig = useSelector((state) =>
		selectTradingPairConfigBySymbol(state, position.symbol),
	);

	const dp = useMemo(
		() => numberToLenght(tradingPairConfig?.base_tick ?? 0),
		[tradingPairConfig],
	);

	const [amount, setAmount] = useState<string>(
		new Decimal(position.position_qty).toFixed(dp),
	);
	const [visible, setVisiable] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const [createOrder, { isLoading }] = useCreateOrderMutation();

	// console.log('tradingPairConfig', tradingPairConfig);

	const content = useMemo(() => {
		return (
			<div className="flex flex-row justify-center p-2 gap-2">
				{closeAmountPercentages.map((percentage, index) => {
					return (
						<CloseAmountPercenTag
							percentage={percentage}
							key={index}
							onClick={(tag) => {
								// setAmount((position.position_qty * tag) / 100);
								const amount = new Decimal(position.position_qty)
									.mul(tag)
									.div(100)
									.toFixed(dp);
								// console.log(
								// 	'amount',
								// 	amount,
								// 	numberToLenght(tradingPairConfig?.base_tick ?? 0),
								// );
								setAmount(amount);
								setVisiable(false);
								setTimeout(() => {
									if (inputRef.current) inputRef.current.blur();
								}, 100);
							}}
						/>
					);
				})}
			</div>
		);
	}, []);

	return (
		<div className="flex flex-row justify-end">
			<form
				onSubmit={(e) => {
					e.preventDefault();

					const orderCreator = OrderFactory.createOrder(OrderType.MARKET);

					if (!orderCreator) {
						throw new Error('orderCreator is null');
					}

					let data = orderCreator.createOrder({
						type: OrderType.MARKET,
						side: position.position_qty > 0 ? OrderSide.SELL : OrderSide.BUY,
						amount,
						symbol: position.symbol,
					});

					// console.log(data);

					createOrder(data)
						.then((res: any) => {
							// console.log(res);
							if (res.data) {
								Toast.success({
									content: 'Create Order Success',
									theme: 'light',
								});
							}
							if (res.error) {
								throw new Error(res.error);
							}
						})
						.catch((err) => {
							Toast.error({ content: err.message, theme: 'light' });
						});
				}}
			>
				<Popover trigger="custom" visible={visible} content={content}>
					<input
						ref={inputRef}
						onFocus={() => setVisiable(true)}
						onBlur={() => setVisiable(false)}
						type="text"
						readOnly={isLoading}
						className="bg-gray-100 px-2 border border-transparent rounded hover:bg-white hover:border-blue-500 focus:bg-white w-24 focus:border-blue-500"
						value={amount}
						onChange={(e: any) => setAmount(e.target.value)}
					/>
				</Popover>

				<Tooltip content="Close at market price">
					<button
						disabled={isLoading}
						className="text-red font-bold ml-1 px-1 text-blue-600 hover:text-blue-500"
						type="submit"
					>
						Market
					</button>
				</Tooltip>
			</form>
		</div>
	);
};
