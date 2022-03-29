import React, { FC } from 'react';

// Global styles
import { FlexWrapperE } from 'AppStyled';

// Import types
import { ITradeInput } from './types';

// Import styled components
import { TradeInputWrapper, TradeLabel, TradeSubLabel, TradeInputData } from './TradeInputStyled';

export const TradeInput: FC<ITradeInput> = ({ value, label, subLabel, onChange, style }) => {
	return (
		<TradeInputWrapper style={style}>
			<TradeLabel>{label || ''}</TradeLabel>
			<FlexWrapperE>
				<TradeInputData value={value || ''} onChange={onChange} />
				{subLabel && <TradeSubLabel>{subLabel || ''}</TradeSubLabel>}
			</FlexWrapperE>
		</TradeInputWrapper>
	);
};
