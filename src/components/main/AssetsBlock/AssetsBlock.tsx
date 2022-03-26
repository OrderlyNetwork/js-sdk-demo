import { FC } from 'react';

// Import heplers
import { prettierBalance } from 'helper';

// Import component
import { ButtonSideBar, AssetsInfo } from 'components/common';

// Import styled component
import { AssetsBlockWrapper } from './AssetsBlockStyled';

// Import types
import { IAssetsBlock } from './types';
import { ButtonWrapperTradeBlock } from '../TradeBlock/TradeBlockStyled';

export const AssetsBlock: FC<IAssetsBlock> = ({ balance }) => {
	return (
		<AssetsBlockWrapper>
			<AssetsInfo label="Total Balance" price={prettierBalance({ str: balance.total })} currency="USDT" />
			<AssetsInfo label="Accessible Balance" price={prettierBalance({ str: balance.available })} currency="USDT" />
			<AssetsInfo label="Test connection" price={prettierBalance({ str: balance.available })} currency="EURO" />
			<ButtonWrapperTradeBlock>
				<ButtonSideBar theme={{ dark: false }} title="Deposit" />
				<ButtonSideBar theme={{ dark: false }} title="Withdrow" />
			</ButtonWrapperTradeBlock>
		</AssetsBlockWrapper>
	);
};
