import { Dropdown } from '@douyinfe/semi-ui';
import React, { useState } from 'react';
import { IconChevronDown } from '@douyinfe/semi-icons';
import { SymbolCell } from './symbolCell';
import { useDispatch, useSelector } from 'react-redux';
import {
	selectCurrentTradingPair,
	selectTradingPairs,
	selectTradingType,
	setCurrentTradingPair,
	TradingPair,
	TradingPairType,
} from '@/redux/tradingSlice';
import { SymbolLabel } from './symbolLabel';
import { usePublicWS } from '@/hooks/usePublicWS';
import { MarketListView } from './marketListView';
import type { RootState } from '@/store/store';

interface Props {
	// type: SymbolType;
}

export const SymbolPicker = () => {
	const [visible, setVisible] = useState(false);

	// const tradingPairs = useSelector(selectTradingPairs);
	const currentTradingPair = useSelector(selectCurrentTradingPair);
	const currentTradingType = useSelector<RootState, TradingPairType>(
		selectTradingType,
	);

	return (
		<Dropdown
			trigger={'click'}
			position={'bottomLeft'}
			clickToHide
			onVisibleChange={(visible) => {
				setVisible(visible);
			}}
			render={
				<MarketListView
					tradingPair={currentTradingPair}
					type={currentTradingType}
				/>
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
