import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { AccountBalance } from 'near-api-js/lib/account';

// Import components
import { TradeBlock, AssetsBlock } from 'components/main';

// Import services
import { GetAccountBalance } from 'services/getAccountBalance';

// Import types
import { ISideBar } from './types';

// Import styled components
import { SideBarWrapper, SideBarDivider } from './SideBarStyled';

export const SideBar: FC<ISideBar> = ({ onClickDeposit, onClickWithdraw }) => {
	const { walletConnection } = useSelector((state: any) => state?.NearRPCReducer);

	const [balance, setBalance] = useState<Pick<AccountBalance, 'available' | 'total'>>({ total: '', available: '' });

	const getWalletBalance = async () => {
		const { total, available } = await GetAccountBalance();
		setBalance({ total, available });
	};

	useEffect(() => {
		getWalletBalance();
	}, []);

	return (
		<SideBarWrapper>
			{walletConnection?.isSignedIn() && (
				<>
					<TradeBlock />
					<SideBarDivider />

					<AssetsBlock onClickWithdraw={onClickWithdraw} onClickDeposit={onClickDeposit} balance={balance} />
					<SideBarDivider />
				</>
			)}
		</SideBarWrapper>
	);
};
