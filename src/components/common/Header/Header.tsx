import { FC } from 'react';
import { useSelector } from 'react-redux';

// Import services
import { ConnectToWallet } from 'services/connectWallet';

// Import assets
import LogoImg from 'assets/images/logo-header.png';

// Import types
import { Logotype, ConnectWallet } from 'components/common';

// Import component
import { IHeader } from './types';

// Import styled components
import { HeaderWrapper, ComponentWrapper } from './HeaderStyled';

// FIXME IHeader
export const Header: FC<IHeader> = () => {
	const { walletConnection } = useSelector((state: any) => state?.NearRPCReducer);

	return (
		<HeaderWrapper>
			<ComponentWrapper>
				<Logotype url={LogoImg} />
			</ComponentWrapper>
			<ComponentWrapper>
				{/* <Network network="BTC" /> */}
				<ConnectWallet
					onClick={ConnectToWallet}
					connected={walletConnection?.isSignedIn()}
					logo={{
						src: '',
						alt: '',
					}}
				/>
			</ComponentWrapper>
		</HeaderWrapper>
	);
};
