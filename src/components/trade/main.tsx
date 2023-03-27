import React from 'react';
import { TradeLayout } from '@/components/common/layout';
import { LeftPanel } from '@/components/common/leftPanel';
import TradeBodyLayout from '@/components/common/tradeBodyLayout';
import { OrderBook } from '@/components/trade/orderbook';
import { TradeMarket } from '@/components/trade/tradeMarket';
import { PositionsGroupPanel } from '@/components/trade/positions';
import { MarketAndChartLayout } from '@/components/trade/marketAndChartLayout';
import { OrderlyProvider } from '@/hooks/orderlyContext';
import { store } from '@/store/store';
import { Provider } from 'react-redux';
import { Dev } from '@/components/dev';

const TradeMain = () => {
	return (
		<Provider store={store}>
			<OrderlyProvider>
				<TradeLayout
					left={<LeftPanel />}
					content={
						<TradeBodyLayout
							orderBookView={
								<>
									<OrderBook />
									<TradeMarket />
								</>
							}
							ordersView={<PositionsGroupPanel />}
						>
							<MarketAndChartLayout />
						</TradeBodyLayout>
					}
				>
					{/*<Dev />*/}
				</TradeLayout>
			</OrderlyProvider>
		</Provider>
	);
};

export default TradeMain;
