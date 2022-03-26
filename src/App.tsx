import { useEffect, useState } from 'react';
import { Normalize } from 'styled-normalize';

// Import services
import { InitContract } from 'services/connect-wallet';

// Import Types
import { IWallet } from 'types';

// Import component
import { Header } from 'components/common';
import { SideBar } from 'components/main';

// Import styled components
import { AppProvider, ContentProvider } from './AppStyled';

export const App = () => {
	const [walletData, setWalletData] = useState<IWallet>({ isLoading: true });

	useEffect(() => {
		(async () => {
			const { currentUser, walletConnection, contract, nearConfig, near } = await InitContract();
			setWalletData({ contract, walletConnection, nearConfig, currentUser, near, isLoading: false });
		})();
	}, []);

	if (walletData.isLoading) {
		<>Loading</>;
	}
	return (
		<AppProvider>
			<Normalize />
			<Header contractInfo={walletData} />
			<ContentProvider>
				<div>.</div>
				<SideBar contractInfo={walletData} />
			</ContentProvider>
		</AppProvider>
	);
};
