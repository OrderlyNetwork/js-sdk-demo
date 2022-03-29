import styled from 'styled-components';

export const ModalTransactionWapper = styled.div`
	display: flex;
	flex-direction: column;
	width: 440px;
	max-width: 440px;
	height: 308px;
	max-height: 308px;
`;

export const ModalTransactionHeaderWapper = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	padding: 20px 80px;
`;

export const ModalTransactionHeaderTitle = styled.span`
	font-weight: 700;
	font-size: 20px;
	color: #202024;
`;

export const ModalTransactionAmountLabel = styled.div`
	font-size: 14px;
	font-weight: 400;
	color: #a4a5af;
`;

export const ModalTransactionAmountCount = styled.span`
	font-weight: 700;
	font-size: 14px;
	color: #202024;
	margin-right: 10px;
`;

export const ModalTransactionAmountValue = styled.span`
	font-weight: 700;
	font-size: 14px;
	color: #a4a5af;
	text-transform: uppercase;
`;

export const ModalTransactionContentWrapper = styled.div`
	padding: 20px 80px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: 100%;
`;

export const ModalTransactionInputHelperInfo = styled.span`
	font-weight: 400;
	font-size: 12px;
	color: #202024;
`;

export const ModalTransactionSubmitBtn = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: ${({ active }: { active: boolean }) => (active ? '#202024' : '#ECEDF0')};
	max-width: 118px;
	padding: 12px 20px;
	box-sizing: border-box;
	cursor: ${({ active }: { active: boolean }) => (active ? 'pointer' : 'help')};
	color: ${({ active }: { active: boolean }) => (active ? '#fff' : '#202024')};
`;
