import { Dropdown, Button, Toast } from '@douyinfe/semi-ui';
import React, { FC, useEffect } from 'react';
import { IconCaretdown } from '@douyinfe/semi-icons';
import orderlyService from '@/service/orderlyService';
import { useDispatch } from 'react-redux';
import { logout } from '@/redux/appSlice';

interface Props {
	accountId: string;
	loading: boolean;
}

const AccountDropdown: FC<Props> = (props) => {
	const dispatch = useDispatch();
	const onLogout = () => {
		orderlyService.client
			.signOut()
			.then((res) => {
				dispatch(logout());
			})
			.catch((err) => {
				Toast.error(err.message);
			});
	};

	return (
		<Dropdown
			trigger={'click'}
			position={'bottomRight'}
			render={
				<Dropdown.Menu style={{ minWidth: '200px' }}>
					<Dropdown.Item onClick={onLogout}>disconnect wallet</Dropdown.Item>
				</Dropdown.Menu>
			}
		>
			<div className={'h-full flex flex-row items-center'}>
				<Button
					icon={<IconCaretdown style={{ marginTop: '-7px' }} />}
					loading={props.loading}
					disabled={props.loading}
					iconPosition="right"
				>
					<div className="flex flex-row items-center gap-2">
						<img
							style={{ height: '18px' }}
							src={orderlyService.assetManager.wallet?.wallet?.metadata.iconUrl}
						/>
						<span>{props.accountId}</span>
					</div>
				</Button>
			</div>
		</Dropdown>
	);
};

export default AccountDropdown;
