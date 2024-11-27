import { TradingPage } from '@orderly.network/trading';
import { OrderlyConfig } from '@/app/config';

interface Props {
	onSymbolChange: (symbol: any) => void;
	symbol: string;
}

const View = (props: Props) => {
	const { tradingViewConfig, app } = OrderlyConfig();

	return (
		<TradingPage
			symbol={props.symbol}
			tradingViewConfig={tradingViewConfig}
			onSymbolChange={props.onSymbolChange}
			sharePnLConfig={app.sharePnLConfig}
			referral={{
				saveRefCode: true,
				onBoundRefCode(success, error) {
					
				},
				onClickReferral() {
					
				},
			}}
			tradingRewards={{
				onClickTradingRewards() {
					
				},
			}}
		/>
	);
};

export default View;
