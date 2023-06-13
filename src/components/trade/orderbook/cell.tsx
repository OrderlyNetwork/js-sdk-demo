import { TokenNum } from '@/components/common/tokenNum';
import React, { FC } from 'react';
import { OrderBookItem } from './useOrderbook';

export type orderBookType = 'ask' | 'bid';

interface Props {
	// color: OrderBookColor;
	color: string;
	item: any[];
	maxTotal: number;
	onClick?: (price: string) => void;
	dp?: number;
}

export const OrderBookCell: FC<Props> = (props) => {
	const { item, color } = props;

	const position =
		item[2] === '-' ? 2 : Math.max(item[2] / props.maxTotal, 0.02) * 100;

	// console.log('position', item[2], props.maxTotal, position);
	return (
		<div className="px-3 relative cursor-pointer mb-[1px] odd:bg-slate-50">
			<div
				className="absolute left-[-100%] top-0 bottom-0 z-0 opacity-10 w-full transition-transform"
				style={{
					backgroundColor: color,
					transform: `translate3d(${position}%,0,0)`,
				}}
			/>
			<div className="flex flex-row z-10 relative h-[20px] items-center">
				<div className="flex-1 " style={{ color: color }}>
					{item[0]}
				</div>
				<div className="flex-1 text-right">{item[1]}</div>

				<div className="flex-1 text-right">
					<TokenNum value={item[2]} dp={props.dp} />
				</div>
			</div>
		</div>
	);
};
