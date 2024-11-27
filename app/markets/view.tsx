'use client';
import { OrderlyConfig } from '../config';
import { MarketsHomePage } from '@orderly.network/markets';

const View = () => {
	const { tradingViewConfig, app } = OrderlyConfig();

	return <MarketsHomePage />;
};

export default View;
