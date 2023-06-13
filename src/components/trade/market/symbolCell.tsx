import React, { FC } from 'react';

import { IconStar } from '@douyinfe/semi-icons';
import { TradingPair } from '@/redux/tradingSlice';
import { Dropdown } from '@douyinfe/semi-ui';

interface Props {
	tradingPair: TradingPair;
	onClick?: (tradingPair: TradingPair) => void;
	active?: boolean;
}

export const SymbolCell: FC<Props> = (props) => {
	const { tradingPair, onClick } = props;
	const percent =
		((tradingPair.close - tradingPair.open) / tradingPair.open) * 100;
	return (
		<Dropdown.Item
			active={props.active}
			className={props.active ? 'bg-slate-200' : ''}
			onClick={() => {
				onClick?.(tradingPair);
			}}
		>
			<div className="flex flex-row items-center " style={{ width: '300px' }}>
				<div className="flex-1">{`${tradingPair.quote}-${tradingPair.type}/${tradingPair.base}`}</div>
				<div className="flex flex-col">
					<div className="text-right">{tradingPair.close}</div>
					<div
						className="text-right text-xs"
						style={{
							color: percent > 0 ? 'green' : 'red',
						}}
					>{`${percent.toFixed(2)}%`}</div>
				</div>
			</div>
		</Dropdown.Item>
	);
};
