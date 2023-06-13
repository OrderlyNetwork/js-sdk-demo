import { Dropdown } from '@douyinfe/semi-ui';
import React, { useState } from 'react';
import { IconChevronDown } from '@douyinfe/semi-icons';
import { SymbolCell } from './symbolCell';
import { useDispatch, useSelector } from 'react-redux';
import {
	selectCurrentTradingPair,
	selectTradingPairs,
	setCurrentTradingPair,
	TradingPair,
} from '@/redux/tradingSlice';
import { SymbolLabel } from './symbolLabel';
import { usePublicWS } from '@/hooks/usePublicWS';
import { MarketListView } from './marketListView';

export const SymbolPicker = () => {
	const [visible, setVisible] = useState(false);

	// const tradingPairs = useSelector(selectTradingPairs);
	const currentTradingPair = useSelector(selectCurrentTradingPair);

	return (
		<Dropdown
			trigger={'click'}
			position={'bottomLeft'}
			clickToHide
			onVisibleChange={(visible) => {
				setVisible(visible);
			}}
			render={
				<div>
					<MarketListView tradingPair={currentTradingPair} />
				</div>
			}
		>
			<div className="h-full">
				<SymbolLabel
					tradingPair={currentTradingPair}
					loading={!currentTradingPair}
					open={visible}
				/>
			</div>
		</Dropdown>
	);
};
