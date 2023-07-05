import React from 'react';
import { usePublicWS } from '@/hooks/usePublicWS';
import { Dropdown } from '@douyinfe/semi-ui';
import { SymbolCell } from './symbolCell';
import {
	TradingPair,
	TradingPairType,
	setCurrentTradingPair,
} from '@/redux/tradingSlice';
import { useDispatch } from 'react-redux';

export const MarketListView: React.FC<{
	tradingPair?: TradingPair;
	type: TradingPairType;
}> = (props) => {
	const { tradingPair: currentTradingPair } = props;
	const dispatch = useDispatch();
	const tradingPairs = usePublicWS<any[]>(
		{
			id: 'tickers',
			event: 'subscribe',
			topic: 'tickers',
		},
		{
			dataMap: (data) =>
				data
					? data.data
							?.filter((item: any) => item.symbol.startsWith(props.type))
							.map((item: any) => {
								const arr = item.symbol.split('_');
								return {
									...item,
									base: arr[2],
									quote: arr[1],
									type: arr[0],
								};
							})
					: [],
			dataFilter: (data) => {
				return data['topic'] === 'tickers';
			},
		},
	);

	const onSelectTradingPair = (tradingPair: TradingPair) => {
		dispatch(setCurrentTradingPair(tradingPair));
	};

	return (
		<Dropdown.Menu>
			{tradingPairs?.map((pair) => {
				return (
					<SymbolCell
						tradingPair={pair}
						key={pair.symbol}
						active={pair.symbol === currentTradingPair?.symbol}
						onClick={onSelectTradingPair}
					/>
				);
			})}
		</Dropdown.Menu>
	);
};
