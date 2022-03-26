import { FC, useEffect } from 'react';

// Import assets
import LogoImg from 'assets/images/logo-header.png';

// Import types
import { IHeader } from './types';

// Import styled components
import { HeaderWrapper, ComponentWrapper } from './HeaderStyled';

// Import component
import { Logotype } from '../Logo';
import { ConnectWallet } from '../ConnectWallet';
import { Network } from './Network';

export const Header: FC<IHeader> = ({ contractInfo }) => {
	useEffect(() => {
		console.log({ contractInfo });
	}, []);

	return (
		<HeaderWrapper>
			<ComponentWrapper>
				<Logotype url={LogoImg} />
			</ComponentWrapper>
			<ComponentWrapper>
				{/* <Network network="BTC" /> */}
				<ConnectWallet
					connected={contractInfo.currentUser && true}
					logo={{
						src: '',
						alt: '',
					}}
					wallet={{
						total_balance: '34 213.14',
						wallet_address: '313adwd3321',
						wallet_name: 'near.name',
						wallet_currency: 'usdt',
						walletConnection: contractInfo.walletConnection,
					}}
				/>
			</ComponentWrapper>
		</HeaderWrapper>
	);
};
