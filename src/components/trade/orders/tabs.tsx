import React, { FC } from 'react';

export enum OrderStatus {
	'NEW' = 'NEW',
	'PARTIAL_FILLED' = 'PARTIAL_FILLED',
	'FILLED' = 'FILLED',
	'CANCELLED' = 'CANCELLED',
	'REJECTED' = 'REJECTED',
	'INCOMPLETE' = 'INCOMPLETE',
	'COMPLETED' = 'COMPLETED',
}

interface Props {
	status: OrderStatus;
	onStatusChange: (status: OrderStatus) => void;
	disabled?: boolean;
}

export const OrdersTabs: FC<Props> = (props) => {
	return (
		<div className="flex flex-row gap-3 px-4 border-b border-t border-solid text-xs">
			{Object.keys(OrderStatus).map((key) => {
				return (
					<button
						disabled={props.disabled}
						key={key}
						className={
							props.status === key
								? `mx-2 py-2 text-primary font-bold active-tab`
								: 'mx-2 py-2 text-gray-600'
						}
						onClick={() => props.onStatusChange(key as OrderStatus)}
					>
						{key}
					</button>
				);
			})}
		</div>
	);
};
