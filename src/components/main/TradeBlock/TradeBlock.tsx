import { ChangeEvent, FC, useState } from 'react';

// Import helpers
import { FilterInputForNumber } from 'helper';

// Import components
import { TradeInput, ButtonSideBar } from 'components/common';

// Import types
import { ITradeBlock } from './types';

// Import styled components
import { TradeBlockWrapper, ButtonWrapperTradeBlock } from './TradeBlockStyled';

export const TradeBlock: FC = () => {
	const [tradeBlockData, setTradeBlockData] = useState<ITradeBlock>({
		size: '',
		price: '',
	});

	const handleChangeInput = (e: ChangeEvent<HTMLInputElement>, key: string) => {
		setTradeBlockData({ ...tradeBlockData, [key]: FilterInputForNumber({ value: e.target.value }) });
	};

	return (
		<TradeBlockWrapper>
			<TradeInput
				label="Price"
				subLabel="TOKEN"
				onChange={(e) => handleChangeInput(e, 'price')}
				value={tradeBlockData.price}
			/>
			<TradeInput label="Size" onChange={(e) => handleChangeInput(e, 'size')} value={tradeBlockData.size} />
			<ButtonWrapperTradeBlock>
				<ButtonSideBar theme={{ dark: true }} title="Sell" />
				<ButtonSideBar theme={{ dark: true }} title="Buy" />
			</ButtonWrapperTradeBlock>
		</TradeBlockWrapper>
	);
};
