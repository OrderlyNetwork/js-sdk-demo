'use client';
import { PropsWithChildren, useCallback } from 'react';
import { ConnectorProvider } from '@orderly.network/web3-onboard';
import { OrderlyAppProvider } from '@orderly.network/react';
import { OrderlyConfig } from '@/app/config';
import { CustomConfigStore, ENV_NAME } from './CustomConfigStore';
import NavbarTab from './NavbarTab';
import { _orderlySymbolKey } from '../constant';

export type NetworkId = 'testnet' | 'mainnet';

const HostEnvMap: Record<string, ENV_NAME> = {
	'dev-sdk-demo.orderly.network': 'dev',
	'qa-sdk-demo.orderly.network': 'qa',
	'sdk-demo-iap.orderly.network': 'staging',
	'localhost': 'staging',
};
type OrderlyContainerProps = PropsWithChildren<{
	symbol?: string;
}>;

const OrderlyContainer: React.FC<OrderlyContainerProps> = (props) => {
	const networkId = (localStorage.getItem('orderly-networkId') ?? 'mainnet') as NetworkId;

	const { onboard, app } = OrderlyConfig();

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
				topBarProps={{
					left: (
						<div className="orderly-h-[48px] orderly-p-3">
							<img className="orderly-w-[200px] orderly-h-[24px]" src="/orderly-logo.svg" />
						</div>
					),
					nav: <NavbarTab />,
				}}
				// onBoundRefCode={() => {}}
				// onClickReferral={() => {}}
				// saveRefCode={(localStorage.getItem("enable_save_ref_code") || "0") === "1"}
			>
				{props.children}
			</OrderlyAppProvider>
		</ConnectorProvider>
	);
};

export default OrderlyContainer;
