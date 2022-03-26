import styled from 'styled-components';

export const ButtonSideBarWrapper = styled.div`
	padding: 12px 10px;
	width: 100%;
	max-width: 90px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	background-color: ${({ theme }) => (theme.dark ? '#202024' : '#ffffff')};
	border: ${({ theme }) => (theme.dark ? '' : '1px solid #A8ACB3')};
`;

export const ButtonSideBarTitle = styled.span`
	font-size: 17px;
	font-weight: 600;
	color: ${({ theme }) => (theme.dark ? '#ffffff' : '#202024')};
`;
