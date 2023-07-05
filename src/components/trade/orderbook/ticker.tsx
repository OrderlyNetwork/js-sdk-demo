import React from 'react';

import { IconArrowDown } from '@douyinfe/semi-icons';

export const Ticker: React.FC<{ price: number; markPrice: number }> = (
	props,
) => {
	return (
		<div className="p-2 flex flex-row items-center">
			<div className="text-xl text-trade-green flex flex-row items-center">
				<span>{props.price}</span>
				{/* <IconArrowDown /> */}
				<span className="text-gray-400 text-sm ml-2">{props.markPrice}</span>
			</div>
		</div>
	);
};
