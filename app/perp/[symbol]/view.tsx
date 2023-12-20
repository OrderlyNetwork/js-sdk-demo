import { ConnectorProvider } from '@orderly.network/web3-onboard';
import { OrderlyAppProvider, TradingPage } from '@orderly.network/react';
import { OrderlyConfig } from '@/app/config';
import { useCallback } from 'react';

interface Props {
	onSymbolChange: (symbol: any) => void;
	symbol: string;
}

const View = (props: Props) => {

	const networkId = localStorage.getItem('orderly-networkId') ?? 'mainnet';

	const { onboard, app, tradingViewConfig } = OrderlyConfig();

	const onChainChanged = useCallback((chainId, isTestnet) => {
		// console.log('chain changed', chainId, isTestnet);
		localStorage.setItem('orderly-networkId', isTestnet ? 'testnet' : 'mainnet');
		// realod page
		setTimeout(() => {
			window.location.reload();
		}, 100);
	}, [props.symbol]);

	return (
		<ConnectorProvider options={onboard}>
			<OrderlyAppProvider
				networkId={networkId}
				brokerId={app.brokerId}
				brokerName={app.brokerName}
				// onlyTestnet={true}
				// logoUrl="/orderly_logo.svg"
				enableSwapDeposit={app.enableSwapDeposit}
				appIcons={app.appIcons}
				onChainChanged={onChainChanged}
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
