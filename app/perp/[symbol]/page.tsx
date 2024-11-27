'use client';
import { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { ORDERLY_SDK_DEMO_TITLE_KEY, OrderlyConfig } from '@/app/config';
import { _orderlySymbolKey } from '@/app/constant';
import { CampaignPositionEnum, Scaffold } from '@orderly.network/ui-scaffold';
import { useNav } from '@/app/common/useNav';

const MainView = dynamic(() => import('./view'), { ssr: false });

export default function PerpPage({ params }: { params: { slug: string } }) {
	const router = useRouter();
	const [symbol, setSymbol] = useState(params.slug);
	const { tradingViewConfig, app } = OrderlyConfig();

	useEffect(() => {
		if (symbol === undefined) {
			setSymbol(localStorage?.getItem(_orderlySymbolKey)!);
		}
	}, [symbol]);

	const updateTitle = useCallback((title) => {
		var titleElement = document.getElementById(ORDERLY_SDK_DEMO_TITLE_KEY);
		if (titleElement) {
			titleElement.textContent = title ?? symbol.toString();
		}
	}, []);

	const { onRouteChange, mainMenus, campaigns, initialProduct, products } = useNav();

	return (
		<Scaffold
			leftSidebar={null}
			footerProps={app.footerStatusBarProps}
			mainNavProps={{
				mainMenus: mainMenus,
				products,
				initialProduct,
				initialMenu: '/trade',
				campaignPosition: CampaignPositionEnum.navTailing,
				campaigns,
			}}
			routerAdapter={{
				onRouteChange: onRouteChange,
				currentPath: '/',
			}}
		>
			<MainView
				symbol={symbol || 'PERP_ETH_UESC'}
				onSymbolChange={(symbol: { symbol: string; }) => {
					console.log('update symbol', symbol);
					localStorage.setItem(_orderlySymbolKey, symbol.symbol);
					router.push(`/perp/${symbol.symbol}`);

					updateTitle(symbol.symbol);
				}}
			/>
		</Scaffold>
	);

	// return (
	// 	<MainView
	// 		symbol={symbol || 'PERP_ETH_USDC'}
	// 		onSymbolChange={(symbol) => {
	// 			console.log('update symbol', symbol);
	// 			localStorage.setItem(_orderlySymbolKey, symbol.symbol);
	// 			router.push(`/perp/${symbol.symbol}`);

	// 			updateTitle(symbol.symbol);
	// 		}}
	// 	/>
	// );
}
