import { FC, useEffect, useState } from 'react';

// Import hepler
import { prettierBalance, FilterInputForNumber } from 'helper';

// Import services
import { GetAccountBalance } from 'services/getAccountBalance';
import { Withdraw } from 'services/withdraw';

// Import component
import { ModalProvider } from 'components/common';
import { ModalTransaction } from '..';

interface IModalWithdraw {
	isOpen: boolean;
	onClose: () => void;
}

export const ModalWithdraw: FC<IModalWithdraw> = ({ isOpen, onClose }: any) => {
	const [balance, setBalance] = useState<string>('');
	const [withdrawVal, setWithdrawVal] = useState<string>('');

	useEffect(() => {
		(async () => {
			const { total } = await GetAccountBalance();
			setBalance(total);
		})();
	}, []);

	const handleDeposit = () => {
		if (withdrawVal.length > 0) {
			Withdraw({ withdraw: withdrawVal });
		}
	};

	return (
		<ModalProvider isOpen={isOpen} closeModal={onClose}>
			<ModalTransaction
				headerTitle="Withdraw"
				amount={prettierBalance({ str: balance })}
				amountLabel="Token Balance"
				amountValue="TOKEN"
				inputHelper="Please, set amount to withdraw."
				btnLabel="Withdraw"
				inputCurrency="TKN"
				inputPlaceholder="Amount"
				inputValue={withdrawVal}
				onChange={(e) => setWithdrawVal(FilterInputForNumber({ value: e.target.value }))}
				onClick={handleDeposit}
			/>
		</ModalProvider>
	);
};
