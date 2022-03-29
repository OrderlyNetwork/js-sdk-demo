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

export const AssetsBlock: FC<IAssetsBlock> = ({ balance, onClickDeposit, onClickWithdraw }) => {
	return (
		<AssetsBlockWrapper>
			<AssetsInfo label="Total Balance" price={prettierBalance({ str: balance.total })} currency="NEAR" />
			<AssetsInfo label="Accessible Balance" price={prettierBalance({ str: balance.available })} currency="NEAR" />
			<ButtonWrapperTradeBlock>
				<ButtonSideBar onClick={onClickDeposit} theme={{ dark: false }} title="Deposit" />
				<ButtonSideBar onClick={onClickWithdraw} theme={{ dark: false }} title="Withdrow" />
			</ButtonWrapperTradeBlock>
		</AssetsBlockWrapper>
	);
};
