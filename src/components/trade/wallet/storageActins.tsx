import React, { useState } from 'react';
import { StorageDeposit } from './form/storageDepost';
import { StorageWithdraw } from './form/storageWithdraw';

enum StorageModal {
	Deposit,
	Withdraw,
	None,
}

export const StorageActions = () => {
	const [modal, setModal] = useState<StorageModal>(StorageModal.None);
	const onClose = () => setModal(StorageModal.None);
	return (
		<>
			<div className="flex flex-row text-xs gap-1">
				<button
					onClick={() => {
						setModal(StorageModal.Withdraw);
					}}
					className="hover:bg-slate-100 px-1 text-gray-500 rounded underline"
				>
					Withdraw
				</button>
				<button
					onClick={() => {
						setModal(StorageModal.Deposit);
					}}
					className="hover:bg-slate-100 px-1 text-gray-500 rounded underline"
				>
					Deposit
				</button>
			</div>
			<StorageDeposit
				visible={modal === StorageModal.Deposit}
				onClose={onClose}
			/>
			<StorageWithdraw
				visible={modal === StorageModal.Withdraw}
				onClose={onClose}
			/>
		</>
	);
};
