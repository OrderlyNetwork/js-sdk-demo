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
import { sendPublicKey } from 'services/sendPublicKey';
import { sendTradingKey } from 'services/sendTradingKey';

export const MainPages = () => {
	const [depositVisibleModal, setDepositVisibleModal] = useState<boolean>(false);
	const [withdrawVisibleModal, setWithdrawVisibleModal] = useState<boolean>(false);

	const dispatch = useDispatch();

	useEffect(() => {
		sendPublicKey();
		sendTradingKey();
	}, []);

	useEffect(() => {
		(async () => {
			const data = await InitContract();
			dispatch(SetWalletConnections({ walletConnection: data.walletConnection }));
		})();
	}, []);

	return (
		<AppProvider>
			<Normalize />
			<ModalDeposit isOpen={depositVisibleModal} onClose={() => setDepositVisibleModal(false)} />
			<ModalWithdraw isOpen={withdrawVisibleModal} onClose={() => setWithdrawVisibleModal(false)} />
			<Header />
			<ContentProvider>
				<div>.</div>
				<SideBar
					onClickWithdraw={() => setWithdrawVisibleModal(true)}
					onClickDeposit={() => setDepositVisibleModal(true)}
				/>
			</ContentProvider>
		</AppProvider>
	);
};
