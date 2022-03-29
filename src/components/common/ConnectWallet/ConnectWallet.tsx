import { FC } from 'react';

// Import Assets
import ArrowDownIcon from 'assets/images/arrow-down.png';

// Import Helpers
import { formatAddress } from 'helper';

// Import types
import { IConnectWaller } from './types';

// Import styled components
import {
	ConnectWrapperButton,
	Logotype,
	ArrowDown,
	ConnectWrapperInfo,
	ConnectWrapperInfoLabel,
	NotConnectedLabel,
} from './ConnectWalletStyled';

const WalletInfo: FC<Pick<IConnectWaller, 'wallet'>> = ({ wallet }) => {
	const { wallet_currency, wallet_address, total_balance } = wallet;

	return (
		<ConnectWrapperInfo>
			<ConnectWrapperInfoLabel isCurrensy={false}>
				{formatAddress({ address: wallet_address || '' })}
			</ConnectWrapperInfoLabel>
			<ConnectWrapperInfoLabel isCurrensy>{`${total_balance} ${wallet_currency}`}</ConnectWrapperInfoLabel>
		</ConnectWrapperInfo>
	);
};

export const ConnectWallet: FC<IConnectWaller> = ({ logo, wallet, connected, onClick }) => {
	return (
		<ConnectWrapperButton onClick={onClick}>
			{!connected ? (
				<NotConnectedLabel>Connect Near</NotConnectedLabel>
			) : (
				<>
					<Logotype src={logo.src} alt={logo.alt} />
					<WalletInfo wallet={wallet} />
					<ArrowDown src={ArrowDownIcon} />
				</>
			)}
		</ConnectWrapperButton>
	);
};
