import { useCallback } from 'react';
import { ConnectorProvider } from '@orderly.network/web3-onboard';
import { OrderlyAppProvider, TradingPage } from '@orderly.network/react';
import { OrderlyConfig } from '@/app/config';
import { CustomConfigStore, ENV_NAME } from './CustomConfigStore';

interface Props {
	onSymbolChange: (symbol: any) => void;
	symbol: string;
}

export type NetworkId = 'testnet' | 'mainnet';

const HostEnvMap: Record<string, ENV_NAME> = {
	'dev-sdk-demo.orderly.network': 'dev',
	'qa-sdk-demo.orderly.network': 'qa',
	'sdk-demo-iap.orderly.network': 'staging',
	'localhost': 'staging',
};

const View = (props: Props) => {
	const networkId = (localStorage.getItem('orderly-networkId') ?? 'mainnet') as NetworkId;

	const { onboard, app, tradingViewConfig } = OrderlyConfig();

	const onChainChanged = useCallback(
		(chainId, isTestnet) => {
			// console.log('chain changed', chainId, isTestnet);
			localStorage.setItem('orderly-networkId', isTestnet ? 'testnet' : 'mainnet');
			// realod page
			setTimeout(() => {
				window.location.reload();
			}, 100);
		},
		[props.symbol],
	);

	const env = networkId === 'mainnet' ? 'prod' : HostEnvMap[window.location.hostname] || 'staging';

	const configStore = new CustomConfigStore({ networkId, env });

	return (
		<ConnectorProvider options={onboard as any}>
			<OrderlyAppProvider
				configStore={configStore}
				networkId={networkId}
				brokerId={app.brokerId}
				brokerName={app.brokerName}
				appIcons={app.appIcons}
				onChainChanged={onChainChanged}
				footerStatusBarProps={app.footerStatusBarProps}
				shareOptions={app.shareOptions}
				chainFilter={app.chainFilter}
				theme={'dark'}
				// onBoundRefCode={() => {}}
				// onClickReferral={() => {}}
				// saveRefCode={(localStorage.getItem("enable_save_ref_code") || "0") === "1"}
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
