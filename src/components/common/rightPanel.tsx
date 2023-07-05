import React, { FC } from 'react';
import { OrderPane } from '../trade/order';
import { WalletPanel } from '../trade/wallet';
import { Divider } from '@douyinfe/semi-ui';
import { TradingPairType } from '@/redux/tradingSlice';

interface Props {}

export const RightPanel: FC<Props> = (props) => {
	return (
		<div>
			<OrderPane />
			<Divider />
			<div>
				<WalletPanel />
			</div>
		</div>
	);
};
