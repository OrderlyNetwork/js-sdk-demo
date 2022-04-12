import { FC } from 'react';
import { useSelector } from 'react-redux';

// Import assets
import ArrowDownIcon from 'assets/images/arrow-down.png';

// Import helper
import { prettierBalance } from 'helper';

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

const WalletInfo: FC<Pick<IConnectWaller, 'accountId' | 'walletBalance'>> = ({ walletBalance, accountId }) => {
	return (
		<ConnectWrapperInfo>
			<ConnectWrapperInfoLabel isCurrensy={false}>{accountId || ''}</ConnectWrapperInfoLabel>
			<ConnectWrapperInfoLabel isCurrensy>{`${prettierBalance({
				str: `${walletBalance}`,
			})} NEAR`}</ConnectWrapperInfoLabel>
		</ConnectWrapperInfo>
	);
};

export const ConnectWallet: FC<IConnectWaller> = ({ logo, connected, onClick }) => {
	const { account } = useSelector((state: any) => state?.NearRPCReducer);

	return (
		<ConnectWrapperButton onClick={onClick}>
			{!connected ? (
				<NotConnectedLabel>Connect Near</NotConnectedLabel>
			) : (
				<>
					<Logotype src={logo.src} alt={logo.alt} />
					<WalletInfo walletBalance={account.walletBalance || ''} accountId={account.accountId || ''} />
					<ArrowDown src={ArrowDownIcon} />
				</>
			)}
		</ConnectWrapperButton>
	);
};
