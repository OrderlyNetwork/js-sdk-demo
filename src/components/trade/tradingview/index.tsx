import React, { useEffect, useRef } from 'react';
import {
	IChartingLibraryWidget,
	widget as TradingViewWidget,
} from '@/static/charting_library/charting_library.min';
import { DataFeed } from '@/service/datafeed';
import { selectCurrentTradingPair } from '@/redux/tradingSlice';
import { useSelector } from 'react-redux';

export const TRADING_VIEW_CONTAINER_ID = 'trading-view-container';

export const TradingViewPanel = () => {
	const currentTradingPair = useSelector(selectCurrentTradingPair);

	const tvRef = useRef<IChartingLibraryWidget>();
	useEffect(() => {
		if (!tvRef.current) {
			tvRef.current = new TradingViewWidget({
				symbol: 'BTC/USDT',
				interval: '1D',

				// timezone: "America/New_York",
				autosize: true,
				container_id: TRADING_VIEW_CONTAINER_ID,
				locale: 'en',
				// disabled_features: ["left_toolbar"],
				enabled_features: ['hide_left_toolbar_by_default'],
				datafeed: new DataFeed(),
				fullscreen: false,
				library_path: '/charting_library/',
				// loading_screen: {
				//   backgroundColor: "#ffffff",
				// },
				overrides: {
					'paneProperties.background': '#ffffff',
					'paneProperties.vertGridProperties.color': '#f0f3fa',
					'paneProperties.horzGridProperties.color': '#f0f3fa',
					'scalesProperties.backgroundColor': 'red',
					'scalesProperties.lineColor': '#e0e3eb',
				},
			});
		}

		if (!currentTradingPair) return;
		// tvRef.current?.setSymbol(
		// 	currentTradingPair?.quote + ':' + currentTradingPair?.base,
		// 	'1D',
		// 	() => {
		// 		console.log('setSymbol success');
		// 	},
		// );
	}, [currentTradingPair]);

	useEffect(() => {
		if (tvRef.current && currentTradingPair) {
			tvRef.current.onChartReady(() => {
				tvRef.current?.setSymbol(
					`${currentTradingPair!.quote}/${currentTradingPair!.base}}`,
					'1D',
					() => {
						console.log('setSymbol success');
					},
				);
			});
		}
	}, [currentTradingPair]);

	return (
		<div
			id={TRADING_VIEW_CONTAINER_ID}
			className="h-full w-full flex flex-row items-center justify-center text-slate-300"
			style={{ fontSize: '100px' }}
		>
			TradingView
		</div>
	);
};
