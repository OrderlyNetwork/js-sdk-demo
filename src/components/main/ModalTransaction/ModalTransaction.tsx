import { FC } from 'react';

// Import components
import { TradeInput } from 'components/common';

// Import styled component
import { Divider, FlexWrapperSB, FlexWrapperC } from 'AppStyled';
import {
	ModalTransactionWapper,
	ModalTransactionHeaderWapper,
	ModalTransactionHeaderTitle,
	ModalTransactionAmountCount,
	ModalTransactionAmountLabel,
	ModalTransactionAmountValue,
	ModalTransactionContentWrapper,
	ModalTransactionInputHelperInfo,
	ModalTransactionSubmitBtn,
} from './ModalTransactionStyled';

// Import types
import { IModalTransaction } from './types';

export const ModalTransaction: FC<IModalTransaction> = ({
	headerTitle,
	amount,
	amountLabel,
	amountValue,
	inputHelper,
	btnLabel,
	inputCurrency,
	inputPlaceholder,
	inputValue,
	onChange,
	onClick,
}) => {
	return (
		<ModalTransactionWapper>
			<ModalTransactionHeaderWapper>
				<ModalTransactionHeaderTitle>{headerTitle || ''}</ModalTransactionHeaderTitle>
			</ModalTransactionHeaderWapper>
			<Divider />
			<ModalTransactionContentWrapper>
				<div>
					<FlexWrapperSB>
						<ModalTransactionAmountLabel>{amountLabel || ''}</ModalTransactionAmountLabel>
						<FlexWrapperSB>
							<ModalTransactionAmountCount>{amount || ''}</ModalTransactionAmountCount>
							<ModalTransactionAmountValue>{amountValue || ''}</ModalTransactionAmountValue>
						</FlexWrapperSB>
					</FlexWrapperSB>
					<TradeInput
						style={{ marginTop: 17, marginBottom: 7 }}
						label={inputPlaceholder || ''}
						onChange={onChange}
						value={inputValue}
						subLabel={inputCurrency || ''}
					/>
					<ModalTransactionInputHelperInfo>{inputHelper || ''}</ModalTransactionInputHelperInfo>
				</div>
				<FlexWrapperC>
					<ModalTransactionSubmitBtn active={inputValue?.length > 0 && true} onClick={onClick}>
						{btnLabel || ''}
					</ModalTransactionSubmitBtn>
				</FlexWrapperC>
			</ModalTransactionContentWrapper>
		</ModalTransactionWapper>
	);
};
