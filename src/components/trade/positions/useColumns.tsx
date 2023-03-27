import { OrderStatus } from 'orderly-sdk/lib/enums';
import { useMemo } from 'react';
import { Button } from '@douyinfe/semi-ui';
import React from 'react';

export const useColumns = (
	status: OrderStatus,
	onCancel?: (orderId: string) => void,
	disabled?: boolean,
) => {
	const cols = useMemo(() => {
		const cols = [
			{
				title: 'OrderId',
				dataIndex: 'order_id',
			},
			{
				title: 'Side',
				dataIndex: 'side',
			},
			{
				title: 'orderType',
				dataIndex: 'type',
			},
			{
				title: 'Price',
				dataIndex: 'price',
				render: (text: string, record: any) => {
					return text || '-';
				},
			},
			{
				title: 'Quantity',
				dataIndex: 'quantity',
				render: (text: string, record: any) => {
					return text || record.amount;
				},
			},
			{
				title: 'Executed',
				dataIndex: 'executed',
			},
			{
				title: 'Fee',
				dataIndex: 'total_fee',
			},
			{
				title: 'FeeCurrency',
				dataIndex: 'fee_asset',
			},
		];

		if (status === OrderStatus.NEW) {
			cols.push({
				title: '',
				dataIndex: 'order_id',
				render: (text, record) => {
					return (
						<div className={'flex flex-row justify-end'}>
							<Button
								size={'small'}
								disabled={disabled}
								style={{ fontSize: '12px' }}
								onClick={() => {
									// console.log('cancel order', record);
									onCancel?.(record.order_id);
								}}
							>
								Cancel
							</Button>
						</div>
					);
				},
			});
		}

		return cols;
	}, [status, onCancel, disabled]);

	return cols;
};
