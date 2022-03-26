import React, { FC } from 'react';

// Global styles
import { FlexWrapper } from 'AppStyled';

// Import types
import { ITradeInput } from './types';

// Import styled components
import { TradeInputWrapper, TradeLabel, TradeSubLabel, TradeInputData } from './TradeInputStyled';

export const TradeInput: FC<ITradeInput> = ({ value, label, subLabel, onChange }) => {
	return (
		<TradeInputWrapper>
			<TradeLabel>{label || ''}</TradeLabel>
			<FlexWrapper>
				<TradeInputData value={value || ''} onChange={onChange} />
				{subLabel && <TradeSubLabel>{subLabel || ''}</TradeSubLabel>}
			</FlexWrapper>
		</TradeInputWrapper>
	);
};
