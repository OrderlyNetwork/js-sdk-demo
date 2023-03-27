import React, { useEffect } from 'react';
import { FC, useCallback, useContext } from 'react';
import { Button, Toast } from '@douyinfe/semi-ui';
import OrderlyService from '@/service/orderlyService';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '@/redux/appSlice';
import { RootState } from '@/store/store';
import AccountDropdown from '@/components/common/accountDropdown';

export const AccountInfo: FC = () => {
	const dispatch = useDispatch();
	const accountId = useSelector<RootState, string | undefined>(
		(state) => state.app.accountId,
	);

	const loading = useSelector<RootState, boolean>((state) => state.app.loading);

	const onClick = useCallback(() => {
		OrderlyService.connect()
			.then(() => OrderlyService.client.accountId())
			.then((accountId) => {
				// console.log(OrderlyService.client);
				if (accountId) {
					dispatch(login(accountId));
				}
			});
	}, []);

	useEffect(() => {
		// console.log("***** start connect to wallet *****");
		OrderlyService.connect()
			.then(() => OrderlyService.client.accountId())
			.then(
				(accountId) => {
					// console.log("获取 AccountId 成功", accountId);
					if (accountId) {
						dispatch(login(accountId));
					}
					return OrderlyService.api.account.getInformation();
				},
				(error) => {
					console.log('get account id failed:', error);
				},
			)
			.then((res) => {
				// console.log("get account infomation:::", res);
				// return OrderlyService.assetManager.getUserTokenBalance();
				// return OrderlyService.api.account.getCurrentHolding();
			});
		// .then((res) => {
		//   console.log("get current holding:::", res);
		// });
	}, []);

	return (
		<div className={'h-full flex flex-row items-center'}>
			{typeof accountId !== 'undefined' ? (
				<AccountDropdown accountId={accountId} loading={loading} />
			) : (
				<Button onClick={onClick} type="primary">
					Connect Wallet
				</Button>
			)}
		</div>
	);
};
