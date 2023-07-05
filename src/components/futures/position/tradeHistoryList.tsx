import { Empty } from '@/components/trade/orders/empty';
import { selectCurrentTradingPair } from '@/redux/tradingSlice';
import { futuresHideOtherPairsSelector } from '@/redux/uiSlice';
import orderlyService from '@/service/orderlyService';
import { Table } from '@douyinfe/semi-ui';
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

export const TradeHistoryList = () => {
	const [loading, setLoading] = useState(false);
	const [trades, setTrades] = useState([]);

	const hideOtherSymbols = useSelector(futuresHideOtherPairsSelector);
	const currentTradingPair = useSelector(selectCurrentTradingPair);

	const cols = useMemo(() => {
		return [
			{
				title: 'Symbol',
				dataIndex: 'symbol',
			},
			{
				title: 'Order ID',
				dataIndex: 'order_id',
			},
			{
				title: 'Side',
				dataIndex: 'side',
			},

			{
				title: 'Fee',
				dataIndex: 'fee_asset',
			},
			{
				title: 'Executed Price',
				dataIndex: 'executed_price',
			},
			{
				title: 'Executed Quantity',
				dataIndex: 'executed_quantity',
			},
		];
	}, []);

	useEffect(() => {
		setLoading(true);
		const queryParams: any = { size: 10 };
		if (hideOtherSymbols && currentTradingPair) {
			queryParams.symbol = currentTradingPair.symbol;
		}
		orderlyService.api.trade
			.getTrades(queryParams)
			.then((res) => {
				if (Array.isArray(res)) {
					setTrades(res);
				}
			})
			.finally(() => setLoading(false));
	}, [hideOtherSymbols, currentTradingPair]);

	return (
		<Table
			columns={cols}
			dataSource={trades}
			size="small"
			loading={loading}
			empty={<Empty />}
			pagination={false}
		/>
	);
};
