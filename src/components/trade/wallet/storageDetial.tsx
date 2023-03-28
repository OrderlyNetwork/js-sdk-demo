import { StorageAsset } from '@/redux/assetSlice';
import { RootState } from '@/store/store';
import { Button, ButtonGroup } from '@douyinfe/semi-ui';
import React from 'react';
import { useSelector } from 'react-redux';

export const StorageDetail = () => {
	const storage = useSelector<RootState, StorageAsset>(
		(state) => state.asset.storage,
	);

	return (
		<div className="min-h-20">
			<table className="w-full text-xs text-gray-500">
				<tr>
					<td>Total</td>
					<td className="text-right">{`${storage.total} NEAR`}</td>
				</tr>
				<tr>
					<td>Available</td>
					<td className="text-right">{`${storage.available} NEAR`}</td>
				</tr>
			</table>
			{/* <div className="mt-2">
				<ButtonGroup size={'small'} type="tertiary" className="w-full">
					<Button>Withdraw</Button>
					<Button>Deposit</Button>
				</ButtonGroup>
			</div> */}
		</div>
	);
};
