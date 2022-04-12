import { useEffect, useState } from 'react';
import { Normalize } from 'styled-normalize';
import { useDispatch } from 'react-redux';

// Import services
import { InitContract } from 'services/initContract';

// Import component
import { Header } from 'components/common';
import { ModalDeposit, ModalWithdraw, SideBar } from 'components/main';

// Import actions
import { SetWalletConnections } from 'store/actions';

// Import styled components
import { AppProvider, ContentProvider } from 'AppStyled';
import { createUserAccount } from 'services/createUserAccount';

export const MainPages = () => {
	const [depositVisibleModal, setDepositVisibleModal] = useState<boolean>(false);
	const [withdrawVisibleModal, setWithdrawVisibleModal] = useState<boolean>(false);

	const dispatch = useDispatch();

	useEffect(() => {
		(async () => {
			const { walletConnection, contract } = await InitContract();

			if (walletConnection.isSignedIn()) {
				// Check if user exist on contract
				const isUserExistOnContract = await contract.user_account_exists({
					user: walletConnection.getAccountId(),
				});
				console.log({ isUserExistOnContract });

				if (!isUserExistOnContract) {
					createUserAccount();
					contract.create_user_account();
				}
			}
			dispatch(SetWalletConnections({ walletConnection }));
		})();
	}, []);

	return (
		<AppProvider>
			<Normalize />
			<ModalDeposit isOpen={depositVisibleModal} onClose={() => setDepositVisibleModal(false)} />
			<ModalWithdraw isOpen={withdrawVisibleModal} onClose={() => setWithdrawVisibleModal(false)} />
			<Header />
			<ContentProvider>
				<div>Main block </div>
				<SideBar
					onClickWithdraw={() => setWithdrawVisibleModal(true)}
					onClickDeposit={() => setDepositVisibleModal(true)}
				/>
			</ContentProvider>
		</AppProvider>
	);
};
