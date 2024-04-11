'use client';

import { ORDERLY_SDK_DEMO_TITLE_KEY } from '@/app/config';
import '@orderly.network/react/dist/styles.css';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

// export function

const MainView = dynamic(() => import('./view'), { ssr: false });

const _orderlySymbolKey = 'orderly-sdk-demo-symbol';

export default function PerpPage({ params }: { params: { slug: string } }) {
	const router = useRouter();
	

	let symbol = params.slug;
	if (symbol === undefined) {
		symbol = localStorage.getItem(_orderlySymbolKey) ?? 'PERP_ETH_USDC';
	}


	const updateTitle = useCallback((title) => {
		var titleElement = document.getElementById(ORDERLY_SDK_DEMO_TITLE_KEY);
		if (titleElement) {
			titleElement.textContent = title ?? symbol.toString();
		}
	}, []);

	return <MainView
		symbol={symbol}
		onSymbolChange={(symbol) => {
			console.log('update symbol', symbol);
			localStorage.setItem(_orderlySymbolKey, symbol.symbol);
			router.push(`/perp/${symbol.symbol}`);

			updateTitle(symbol.symbol);

		}}
	/>;
}
