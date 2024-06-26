'use client';
import { PropsWithChildren, useCallback } from 'react';
import { ConnectorProvider } from '@orderly.network/web3-onboard';
import { OrderlyAppProvider } from '@orderly.network/react';
import { OrderlyConfig } from '@/app/config';
import { CustomConfigStore, ENV_NAME } from './CustomConfigStore';
import NavbarTab from './NavbarTab';
import { _orderlySymbolKey } from '../constant';
import { useRouter } from 'next/navigation';
import { CustomContractManager } from './CustomContract';
import { ARBITRUM_TESTNET_CHAINID, MANTLE_TESTNET_CHAINID } from '@orderly.network/types';
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
	const router = useRouter();

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
	const contracts = new CustomContractManager(configStore);

	return (
		<ConnectorProvider options={onboard as any}>
			<OrderlyAppProvider
				configStore={configStore}
				// contracts={contracts}
				networkId={networkId}
				brokerId={app.brokerId}
				brokerName={app.brokerName}
				appIcons={app.appIcons}
				onChainChanged={onChainChanged}
				footerStatusBarProps={app.footerStatusBarProps}
				shareOptions={app.shareOptions}
				// chainFilter={{
				// 	mainnet: [
				// 		{
				// 			id: 5000,
				// 			chainInfo: {
				// 			  chainId: `0x${(5000).toString(16)}`,
				// 			  chainName: "Mantle",
				// 			  nativeCurrency: {
				// 				name: "MNT",
				// 				symbol: "MNT",
				// 				decimals: 6,
				// 				fix: 4,
				// 			  },
				// 			  rpcUrls: ["https://rpc.mantle.xyz/"],
				// 			  blockExplorerUrls: ["https://mantlescan.xyz/"],
				// 			},
				// 			minGasBalance: 0.0002,
				// 			minCrossGasBalance: 0.002,
				// 			maxPrepayCrossGas: 0.03,
				// 			blockExplorerName: "Mantle",
				// 			chainName: "Mantle",
				// 			chainNameShort: "Mantle",
				// 			requestRpc: "https://rpc.mantle.xyz/",
				// 			chainLogo: "",
				// 		  }
				// 	],
				// 	testnet: [],
				// }}
				topBarProps={{
					left: (
						<div className="orderly-h-[48px] orderly-p-3">
							<img className="orderly-w-[200px] orderly-h-[24px]" src="/orderly-logo.svg" />
						</div>
					),
					nav: <NavbarTab />,
				}}
				referral={{
					saveRefCode: true,
					onBoundRefCode: (success: boolean, error: any) => {
						const path = window.location.pathname;
						if ((path.endsWith('/dashboard') || path.endsWith('/referral')) && success) {
							router.push('/referral/dashboard');
						}
					},
					onClickReferral: () => {
						router.push('/referral/dashboard');
					},
				}}
				theme={undefined}
				// chainFilter={
				// 	{
				// 		mainnet: [{ id: 42161 }, { id: 8453 }, { id: 10 }, { id: 169 }],
				// 		testnet: [{ id: 421614 }, { id: 421613 }],
				// 	} as any
				// }
				// chainFilter={{
				// 	mainnet: [],
				// 	testnet: [{ id: ARBITRUM_TESTNET_CHAINID }, { id: MANTLE_TESTNET_CHAINID }],
				// }}
			>
				{props.children}
			</OrderlyAppProvider>
		</ConnectorProvider>
	);
};

export default OrderlyContainer;
