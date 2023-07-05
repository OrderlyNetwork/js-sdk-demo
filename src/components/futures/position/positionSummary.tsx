import {
	futuresHideOtherPairsSelector,
	toggleFuturesHideOtherPairs,
} from '@/redux/uiSlice';
import orderlyService from '@/service/orderlyService';
import { PositionWithTableCell } from '@/types/prep';
import { Button, Checkbox, Modal } from '@douyinfe/semi-ui';
import clsx from 'clsx';
import Decimal from 'decimal.js-light';
import React, { FC, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface Props {
	positons: PositionWithTableCell[];
}

export const PositionSummary: FC<Props> = (props) => {
	const unrealPnL = useMemo(() => {
		return props.positons.reduce((acc, cur) => {
			return acc.plus(cur.unrealPnL);
		}, new Decimal(0));
	}, [props.positons]);

	const notional = useMemo(() => {
		return props.positons.reduce((acc, cur) => {
			return acc.plus(cur.notional);
		}, new Decimal(0));
	}, [props.positons]);

	const unsettledPnL = useMemo(() => {
		return props.positons.reduce((acc, cur) => {
			return acc.plus(cur.unsettled_pnl);
		}, new Decimal(0));
	}, [props.positons]);

	return (
		<div className="flex flex-row text-sm items-center px-5 py-1 border-b justify-between bg-gray-100">
			<div className="flex flex-row items-center">
				<div>Fu.Unreal.PnL</div>
				<div
					className={clsx(
						'text-lg font-bold ml-2',
						unrealPnL.gt(0) ? 'text-trade-green' : 'text-trade-red',
					)}
				>
					{unrealPnL.toFixed(2)}
				</div>
			</div>
			<div className="flex flex-col gap-1">
				<div>
					Fut.Daily Real. <strong className="ml-3">0</strong>
				</div>
				<div>
					Fut.Notional <strong className="ml-3">{notional.toFixed(2)}</strong>
				</div>
			</div>
			<div className="flex flex-row items-center gap-5">
				<div>
					<Checkbox disabled>Close Trades</Checkbox>
				</div>
			</div>
			<div className="flex flex-row items-center">
				<div className="mr-3">
					<span>Unsettled PnL:</span>

					<strong
						className={clsx('ml-2', unsettledPnL.lt(0) ? 'text-red-500' : '')}
					>
						{unsettledPnL.toFixed(2)}
					</strong>
				</div>
				<Button
					onClick={() => {
						Modal.confirm({
							title: 'Settle PnL',
							content: (
								<div>
									<div>
										By doing this, we’ll move your profit or loss from perp
										markets into the USDC token balance. This has no impact on
										your open positions or health.
									</div>
									<div className="mt-2">
										Total unsettled PnL:
										<strong className="text-red-500 ml-2">
											{unsettledPnL.toFixed(2)}
										</strong>
									</div>
								</div>
							),
							okText: 'Settle PnL',
							cancelText: 'Cancel',
							onOk: () => {
								return orderlyService.client
									.contractsApi()
									.userRequestSettlement();
							},
						});
					}}
				>
					Settle PnL
				</Button>
			</div>
		</div>
	);
};
