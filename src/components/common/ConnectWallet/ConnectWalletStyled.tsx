import styled from 'styled-components';

interface WalletLabel {
	readonly isCurrensy: boolean;
}

export const ConnectWrapperButton = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 12px;
	background-color: #202024;
	cursor: pointer;
	max-width: 198px;
`;

export const Logotype = styled.img`
	width: 24px;
	height: 24px;
`;

export const ArrowDown = styled.img`
	width: 16px;
	height: 16px;
`;

export const ConnectWrapperInfo = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-direction: column;
	padding: 0 20px;
`;

export const ConnectWrapperInfoLabel = styled.div<WalletLabel>`
	font-size: 12px;
	line-height: 18px;
	color: ${({ isCurrensy }) => (isCurrensy ? '#A4A5AF' : '#ffffff')};
`;

export const NotConnectedLabel = styled.span`
	font-size: 20px;
	color: white;
`;
