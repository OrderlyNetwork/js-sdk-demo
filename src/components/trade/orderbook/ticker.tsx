import React from 'react';

import { IconArrowDown } from '@douyinfe/semi-icons';

export const Ticker: React.FC<{ price: number }> = (props) => {
	return (
		<div className="p-2 flex flex-row items-center">
			<div className="text-xl text-trade-green">
				<span>{props.price}</span>
				{/* <IconArrowDown /> */}
			</div>
		</div>
	);
};
