import React from 'react';
import { TradeLayout } from '@/components/common/layout';
import { RightPanel } from '@/components/common/rightPanel';
import TradeBodyLayout from '@/components/common/tradeBodyLayout';
import { OrderBook } from '@/components/trade/orderbook';
import { TradeMarket } from '@/components/trade/tradeMarket';
import { OrdersGroupPanel } from '@/components/trade/orders';
import { MarketAndChartLayout } from '@/components/trade/marketAndChartLayout';

import { Dev } from '@/components/dev';
import { PositionGroupPanel } from './position';
import { PositionProvider } from './position/positionContext';

const FuturesMain = () => {
	return (
		<PositionProvider>
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
						ordersView={<PositionGroupPanel />}
					>
						<MarketAndChartLayout />
					</TradeBodyLayout>
				}
			>
				{/* <Dev /> */}
			</TradeLayout>
		</PositionProvider>
	);
};

export default FuturesMain;
