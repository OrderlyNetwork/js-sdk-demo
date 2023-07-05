import { Position, PositionWithTableCell } from '@/types/prep';
import { calcualteNotional, calcualteUnrealPnL } from '@/utils/perp';
import clsx from 'clsx';
import Decimal from 'decimal.js-light';
import React from 'react';
import { useMemo } from 'react';
import { ClosePositionButton } from './closeBtn';

export const usePositionCols = (onTradingClick: (symbol: string) => void) => {
	const cols = useMemo(() => {
		return [
			{
				title: 'Symbol',
				dataIndex: 'symbol',
				render: (text: string) => {
					// console.log(text);
					const arr = text.split('_');
					return (
						<a
							href={text}
							onClick={(e) => {
								e.preventDefault();
								onTradingClick(text);
							}}
						>{`${arr[1]}-${arr[0]}`}</a>
					);
				},
			},
			{
				title: 'Qty.',
				dataIndex: 'position_qty',
				sorter: (a, b) =>
					Math.abs(a.position_qty) - Math.abs(b.position_qty) > 0 ? 1 : -1,
				render: (qty: number, record: Position) => {
					return (
						<strong
							className={clsx(
								qty > 0 ? 'text-trade-green' : 'text-trade-red',
								'min-w-[80px]',
							)}
						>
							{qty}
						</strong>
					);
				},
			},

			{
				title: 'Avg.Open',
				dataIndex: 'average_open_price',
				render: (text: string, _: Position) => {
					return <div className="min-w-[80px]">{text}</div>;
				},
			},
			{
				title: 'Mark',
				dataIndex: 'mark_price',
				render: (text: string, _: Position) => {
					return <div className="min-w-[80px]">{text}</div>;
				},
			},
			{
				title: 'Unreal.PnL(USDC)',
				dataIndex: 'unrealPnL',
				key: 'unreal_pnl',
				render: (value: Decimal, record: Position) => {
					return (
						<strong
							className={clsx(
								value.gt(0) ? 'text-trade-green' : 'text-trade-red',
							)}
						>
							{value.toFixed(2)}
						</strong>
					);
				},
			},
			{
				title: 'Daily Real.',
				dataIndex: '_',
				key: 'daily_realized_pnl',
				render: (text: string, record: Position) => {
					return 0;
				},
			},
			{
				title: 'Notional',
				dataIndex: 'notional',
				key: 'notional',
				sorter: (a, b) => {
					return a.notional.sub(b.notional) > 0 ? 1 : -1;
				},
				render: (value: Decimal, record: Position) => {
					return value.abs().toFixed(2);
				},
			},
			{
				title: 'Unsetteld PnL',
				dataIndex: 'unsettled_pnl',
				key: 'unsettled_pnl',
				// sorter: (a, b) => {
				// 	return a.unsettledPnl.sub(b.unsettledPnl) > 0 ? 1 : -1;
				// },
				// render: (value: Decimal, record: Position) => {
				// 	return value.abs().toFixed(2);
				// },
			},
			{
				title: 'Liq.Price',
				dataIndex: 'est_liq_price',
				key: 'est_liq_price',
				// sorter: (a, b) => {
				// 	return a.unsettledPnl.sub(b.unsettledPnl) > 0 ? 1 : -1;
				// },
				// render: (value: Decimal, record: Position) => {
				// 	return value.abs().toFixed(2);
				// },
			},
			{
				title: 'Close',
				dataIndex: 'close',
				align: 'right',
				// className: 'text-blue-600',
				render: (text: string, record: PositionWithTableCell) => {
					return <ClosePositionButton position={record} />;
				},
			},
		];
	}, []);
	return cols;
};
