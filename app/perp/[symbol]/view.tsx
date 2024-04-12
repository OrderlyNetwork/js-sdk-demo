import { TradingPage } from '@orderly.network/react';
import { OrderlyConfig } from '@/app/config';

interface Props {
	onSymbolChange: (symbol: any) => void;
	symbol: string;
}

const View = (props: Props) => {
	const { tradingViewConfig } = OrderlyConfig();

	return (
		<TradingPage symbol={props.symbol} tradingViewConfig={tradingViewConfig} onSymbolChange={props.onSymbolChange} />
	);
};

export default View;
