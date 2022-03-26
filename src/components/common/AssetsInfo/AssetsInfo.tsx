import { FC } from 'react';

import { FlexWrapper } from 'AppStyled';

// Import styled component
import { AssetsInfoWrapper, AssetsInfoCurrency, AssetsInfoLabel, AssetsInfoPrice } from './AssetsInfoStyled';

// Import types
import { IAssetsInfo } from './types';

export const AssetsInfo: FC<IAssetsInfo> = ({ label, price, currency }) => {
	return (
		<AssetsInfoWrapper>
			<AssetsInfoLabel>{label}</AssetsInfoLabel>
			<FlexWrapper>
				<AssetsInfoPrice>{price}</AssetsInfoPrice>
				<AssetsInfoCurrency>{currency}</AssetsInfoCurrency>
			</FlexWrapper>
		</AssetsInfoWrapper>
	);
};
