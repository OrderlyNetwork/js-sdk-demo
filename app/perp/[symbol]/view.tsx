import { ConnectorProvider } from '@orderly.network/web3-onboard';
import { OrderlyAppProvider, TradingPage } from '@orderly.network/react';

interface Props {
	onSymbolChange: (symbol: string) => void;
	symbol: string;
}

const tradingViewConfig: any = {
	scriptSRC: '/tradingview/charting_library/charting_library.js',
	library_path: '/tradingview/charting_library/',
};

const View = (props: Props) => {
	return (
		<ConnectorProvider>
			<OrderlyAppProvider
				networkId="mainnet"
				brokerId="woofi_pro"
				onlyTestnet={false}
				logoUrl="/orderly_logo.svg"
			>
				<TradingPage
					symbol={'PERP_ETH_USDC'}
					tradingViewConfig={tradingViewConfig}
				/>
			</OrderlyAppProvider>
		</ConnectorProvider>
	);
};

export default View;