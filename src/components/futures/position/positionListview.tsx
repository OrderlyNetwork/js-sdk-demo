import { useGetPositionsQuery } from '@/redux/positionApi';
import { Table } from '@douyinfe/semi-ui';
import React, { useMemo } from 'react';
import { usePositionCols } from './usePositionCols';
import { usePositionObservable } from './usePositionObservable';
import { PositionSummary } from './positionSummary';
import { useDispatch, useSelector } from 'react-redux';
import {
	selectCurrentTradingPair,
	setCurrentTradingPairBySymbol,
} from '@/redux/tradingSlice';
import { futuresHideOtherPairsSelector } from '@/redux/uiSlice';

export const PositionListView = () => {
	const dispath = useDispatch();
	const hideOtherSymbols = useSelector(futuresHideOtherPairsSelector);
	const currentTradingPair = useSelector(selectCurrentTradingPair);

	const onTradingClick = (symbol: string) => {
		dispath(setCurrentTradingPairBySymbol(symbol));
	};

	const columuns = usePositionCols(onTradingClick);

	const positions = usePositionObservable();

	const filtedPositions = useMemo(() => {
		if (!hideOtherSymbols) return positions;
		return positions.filter((p) => p.symbol === currentTradingPair?.symbol);
	}, [positions, hideOtherSymbols, currentTradingPair]);

	return (
		<div className="text-sm">
			<PositionSummary positons={positions} />
			<Table
				columns={columuns}
				dataSource={filtedPositions}
				loading={false}
				size="small"
				pagination={false}
			/>
		</div>
	);
};
