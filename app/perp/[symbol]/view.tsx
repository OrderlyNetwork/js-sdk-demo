import { ConnectorProvider } from '@orderly.network/web3-onboard';
import { OrderlyAppProvider, TradingPage } from '@orderly.network/react';
import injectedModule from "@web3-onboard/injected-wallets";
import ledgerModule from '@web3-onboard/ledger'
import trezorModule from '@web3-onboard/trezor'
import walletConnectModule from '@web3-onboard/walletconnect';

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

	const wcV2InitOptions = {
		version: 2,
		projectId: '93dba83e8d9915dc6a65ffd3ecfd19fd',
		requiredChains: [42161],
		optionalChains: [421613, 42161],
		dappUrl: window.location.host,
	};

	const ledgerInitOptions = {
		projectId: '93dba83e8d9915dc6a65ffd3ecfd19fd',
	};
	const walletConnect = walletConnectModule(wcV2InitOptions);
	const ledger = ledgerModule(ledgerInitOptions);


	const trezor = trezorModule({
		email: '<EMAIL_CONTACT>',
		appUrl: '<APP_URL>'
	  })

	return (
		<ConnectorProvider options={{
			wallets: [injectedModule(), walletConnect, ledger, trezor],
		}}>
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
