import { TradingPage } from '@orderly.network/react';
import { OrderlyConfig } from '@/app/config';
import OrderlyContainer from '@/app/common/OrderlyContainer';

interface Props {
	onSymbolChange: (symbol: any) => void;
	symbol: string;
}

const View = (props: Props) => {
	const { tradingViewConfig } = OrderlyConfig();

	return (
		<OrderlyContainer>
			<TradingPage symbol={props.symbol} tradingViewConfig={tradingViewConfig} onSymbolChange={props.onSymbolChange} />
		</OrderlyContainer>
	);
};

export default View;
