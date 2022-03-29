import { FC, useEffect, useState } from 'react';

// Import hepler
import { prettierBalance, FilterInputForNumber } from 'helper';

// Import services
import { GetAccountBalance } from 'services/getAccountBalance';
import { Deposit } from 'services/deposit';

// Import component
import { ModalProvider } from 'components/common';
import { ModalTransaction } from '..';

interface IModalDeposit {
	isOpen: boolean;
	onClose: () => void;
}

export const ModalDeposit: FC<IModalDeposit> = ({ isOpen, onClose }: any) => {
	const [balance, setBalance] = useState<string>('');
	const [depositVal, setDepositVal] = useState<string>('');

	useEffect(() => {
		(async () => {
			const { total } = await GetAccountBalance();
			setBalance(total);
		})();
	}, []);

	const handleDeposit = () => {
		if (depositVal.length > 0) {
			Deposit({ deposit: depositVal });
		}
	};

	return (
		<ModalProvider isOpen={isOpen} closeModal={onClose}>
			<ModalTransaction
				headerTitle="Deposit"
				amount={prettierBalance({ str: balance })}
				amountLabel="Token Balance"
				amountValue="TOKEN"
				inputHelper="Please, set amount to deposit."
				btnLabel="Deposit"
				inputCurrency="TKN"
				inputPlaceholder="Amount"
				inputValue={depositVal}
				onChange={(e) => setDepositVal(FilterInputForNumber({ value: e.target.value }))}
				onClick={handleDeposit}
			/>
		</ModalProvider>
	);
};
