import { Table } from '@douyinfe/semi-ui';
import { OrderStatus } from 'orderly-sdk/lib/enums';
import React, { FC, useMemo } from 'react';
import { Empty } from './empty';
import { useColumns } from './useColumns';

interface Props {
	dataSource: any[];
	isLoading: boolean;

	status: OrderStatus;

	onCancel?: (orderId: string) => void;
	disabled?: boolean;
}

export const OrderListview: FC<Props> = (props) => {
	const columns = useColumns(props.status, props.onCancel, props.isLoading);

	return (
		<Table
			columns={columns}
			dataSource={props.dataSource}
			empty={<Empty />}
			pagination={false}
			size="small"
			loading={props.isLoading}
			// scroll={scroll}
		/>
	);
};
