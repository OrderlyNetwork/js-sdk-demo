import React, { useEffect, useRef } from 'react';
import type {
	IChartingLibraryWidget,
	ResolutionString,
} from '@/static/charting_library/charting_library';

import { DataFeed } from '@/service/datafeed';
import { selectCurrentTradingPair } from '@/redux/tradingSlice';
import { useSelector } from 'react-redux';

export const TRADING_VIEW_CONTAINER_ID = 'trading-view-container';

export const TradingViewPanel = () => {
	const currentTradingPair = useSelector(selectCurrentTradingPair);

	const tvRef = useRef<IChartingLibraryWidget>();
	useEffect(() => {
		if (typeof window === 'undefined' || !window.TradingView) return;
		if (!tvRef.current) {
			tvRef.current = new window.TradingView.widget({
				symbol: 'SPOT_NEAR_USDC',
				interval: 'D' as ResolutionString,

				// timezone: "America/New_York",
				autosize: true,
				container: TRADING_VIEW_CONTAINER_ID,
				locale: 'en',

				disabled_features: ['header_widget'],
				enabled_features: ['hide_left_toolbar_by_default'],
				datafeed: new DataFeed(),
				// datafeed: Datafeeds.UDFCompatibleDatafeed(
				// 	'https://demo_feed.tradingview.com',
				// ),
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
				debug: true,
				client_id: 'tradingview.com',
				user_id: 'public_user_id',
			});
		}

		if (!currentTradingPair) return;

		tvRef.current.activeChart().setSymbol(currentTradingPair.symbol);

		// tvRef.current?.setSymbol(
		// 	// currentTradingPair?.quote + '/' + currentTradingPair?.base,
		// 	currentTradingPair.symbol,
		// 	'15' as ResolutionString,
		// 	() => {
		// 		console.log('setSymbol success');
		// 	},
		// );
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
