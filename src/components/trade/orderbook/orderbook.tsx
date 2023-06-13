import React, { FC, useMemo } from 'react';
import { OrderBookCell, orderBookType } from './cell';

interface Props {
	dataSource: any[];
	type: orderBookType;
	max: number;
	dp?: number;
}

export const OrderBookItem: FC<Props> = (props) => {
	const color = useMemo<string>(() => {
		if (props.type === 'ask') {
			return 'rgb(246, 70, 93)';
		}
		return 'rgb(14, 203, 129)';
	}, [props.type]);

	const { max } = props;

	// const max = useMemo(() => {
	// 	if (props.type === 'ask') {
	// 		const validItem = props.dataSource.find((item) => item.total !== '-');
	// 		return validItem ? validItem.total : 0;
	// 	}
	// 	return props.dataSource[props.dataSource.length - 1].total;
	// }, [props.dataSource, props.type]);

	return (
		<div className="text-xs overflow-hidden">
			<div>
				{props.dataSource.map((item, index) => {
					return (
						<OrderBookCell
							key={index}
							color={color}
							item={item}
							maxTotal={max}
							dp={props.dp}
						/>
					);
				})}
			</div>
		</div>
	);
};

OrderBookItem.defaultProps = {
	dp: 2,
};
