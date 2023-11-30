import { ConnectorProvider } from '@orderly.network/web3-onboard';
import { OrderlyAppProvider, TradingPage } from '@orderly.network/react';
import { useState } from 'react';

interface Props {
	onSymbolChange: (symbol: string) => void;
	symbol: string;
}

const tradingViewConfig: any = {
	scriptSRC: '/tradingview/charting_library/charting_library.js',
	library_path: '/tradingview/charting_library/',
};

const View = (props: Props) => {

	const networkId = localStorage.getItem('orderly-networkId') ?? 'testnet';
	return (
		<ConnectorProvider>
			<OrderlyAppProvider
				networkId={networkId}
				brokerId="woofi_pro"
				// onlyTestnet={true}
				logoUrl="/orderly_logo.svg"
				onChainChanged={(chainId, isTestnet) => {
					// console.log('chain changed', chainId, isTestnet);
					localStorage.setItem('orderly-networkId', isTestnet ? 'testnet' : 'mainnet');
					// realod page
					setTimeout(() => {
						window.location.reload();
					}, 50);
				}}
			>
				<TradingPage
					symbol={props.symbol}
					tradingViewConfig={tradingViewConfig}
					onSymbolChange={props.onSymbolChange}
				/>
			</OrderlyAppProvider>
		</ConnectorProvider>
	);
};

export default View;
