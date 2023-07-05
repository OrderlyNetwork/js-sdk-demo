import React, { useLayoutEffect, useMemo } from 'react';
import { TradeLayout } from '@/components/common/layout';
import { RightPanel } from '@/components/common/rightPanel';
import TradeBodyLayout from '@/components/common/tradeBodyLayout';
import { OrderBook } from '@/components/trade/orderbook';
import { TradeMarket } from '@/components/trade/tradeMarket';
import { OrdersGroupPanel } from '@/components/trade/orders';
import { MarketAndChartLayout } from '@/components/trade/marketAndChartLayout';

import { Dev } from '@/components/dev';
import { useDispatch, useSelector } from 'react-redux';
import { selectTradingType, setTradingType } from '@/redux/tradingSlice';
import { PositionGroupPanel } from '../futures/position';
import { PositionProvider } from '../futures/position/positionContext';

const TradeMain = () => {
	const tradeType = useSelector(selectTradingType);
	const dispatch = useDispatch();
	useLayoutEffect(() => {
		const type = window.localStorage.getItem('tradingType') as 'SPOT' | 'PERP';
		dispatch(setTradingType(type ?? 'SPOT'));
	}, []);

	const body = useMemo(() => {
		return (
			<TradeLayout
				right={<RightPanel />}
				content={
					<TradeBodyLayout
						orderBookView={
							<>
								<OrderBook />
								<TradeMarket />
							</>
						}
						ordersView={
							tradeType === 'SPOT' ? (
								<OrdersGroupPanel />
							) : (
								<PositionProvider>
									<PositionGroupPanel />
								</PositionProvider>
							)
						}
					>
						<MarketAndChartLayout />
					</TradeBodyLayout>
				}
			>
				{/* <Dev /> */}
			</TradeLayout>
		);
	}, [tradeType]);

	return body;

	// if (tradeType === 'SPOT') {
	// 	return body;
	// }

	// return <PositionProvider>{body}</PositionProvider>;

	// return (
	// 	<TradeLayout
	// 		right={<RightPanel />}
	// 		content={
	// 			<TradeBodyLayout
	// 				orderBookView={
	// 					<>
	// 						<OrderBook />
	// 						<TradeMarket />
	// 					</>
	// 				}
	// 				ordersView={<OrdersGroupPanel />}
	// 			>
	// 				<MarketAndChartLayout />
	// 			</TradeBodyLayout>
	// 		}
	// 	>
	// 		{/* <Dev /> */}
	// 	</TradeLayout>
	// );
};

export default TradeMain;
