import { useEffect, useState } from 'react';
import { Normalize } from 'styled-normalize';
import { useDispatch } from 'react-redux';
import { utils } from 'near-api-js';

// Import services
import { InitContract } from 'services/initContract';
import { sendTradingKey } from 'services/sendTradingKey';
import { calculateGas } from 'services/estimateTransactionFee';

// Import component
import { Header } from 'components/common';
import { ModalDeposit, ModalWithdraw, SideBar } from 'components/main';

// Import actions
import { SetWalletConnections, SetAccountInfo } from 'store/actions';

// Import styled components
import { AppProvider, ContentProvider } from 'AppStyled';
import { createUserAccount } from 'services/createUserAccount';
import { sendPublicKey } from 'services/sendPublicKey';
import { GetAccountBalance } from 'services/getAccountBalance';

export const MainPages = () => {
	const [depositVisibleModal, setDepositVisibleModal] = useState<boolean>(false);
	const [withdrawVisibleModal, setWithdrawVisibleModal] = useState<boolean>(false);

	const dispatch = useDispatch();

	useEffect(() => {
		(async () => {
			const { walletConnection, contract } = await InitContract();

			if (walletConnection.isSignedIn()) {
				const { available } = await GetAccountBalance();

				// Check if user exist on contract
				const isUserExistOnContract = await contract.user_account_exists({
					user: walletConnection.getAccountId(),
				});
				console.log({ isUserExistOnContract });

				if (!isUserExistOnContract) {
					createUserAccount();
				}

				dispatch(SetAccountInfo({ walletBalance: available, accountId: walletConnection.getAccountId() }));
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
				{/* FIXME */}
				<div style={{ padding: 20 }}>
					Main block
					<div
						style={{
							cursor: 'pointer',
							background: 'black',
							padding: '10px 20px',
							color: 'white',
							borderRadius: 20,
							marginTop: 15,
						}}
						onClick={sendPublicKey}
					>
						Send Public Key
					</div>
					<div
						style={{
							cursor: 'pointer',
							background: 'black',
							padding: '10px 20px',
							color: 'white',
							borderRadius: 20,
							marginTop: 15,
						}}
						onClick={sendTradingKey}
					>
						Send Trading Key
					</div>
					<div
						style={{
							cursor: 'pointer',
							background: 'black',
							padding: '10px 20px',
							color: 'white',
							borderRadius: 20,
							marginTop: 15,
						}}
						onClick={() => calculateGas('user_deposit_native_token')}
					>
						Estimate Transaction FEE for Deposit
					</div>
					<div
						style={{
							cursor: 'pointer',
							background: 'black',
							padding: '10px 20px',
							color: 'white',
							borderRadius: 20,
							marginTop: 15,
						}}
						onClick={() =>
							calculateGas('user_request_withdraw', { token: 'near', amount: utils.format.parseNearAmount('1') })
						}
					>
						Estimate Transaction FEE for Withdraw
					</div>
				</div>
				<SideBar
					onClickWithdraw={() => setWithdrawVisibleModal(true)}
					onClickDeposit={() => setDepositVisibleModal(true)}
				/>
			</ContentProvider>
		</AppProvider>
	);
};
