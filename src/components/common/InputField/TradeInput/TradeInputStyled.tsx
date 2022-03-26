import styled from 'styled-components';

export const TradeInputWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	background-color: #ecedf0;
	padding: 12px;
	margin-bottom: 12px;
`;

export const TradeInputData = styled.input`
	padding: 0px;
	color: #202024;
	font-size: 14px;
	font-weight: 700;
	background-color: transparent;
	border: 0;
	text-align: right;
	width: 60%;

	:focus {
		outline: none;
	}
`;

export const TradeLabel = styled.span`
	font-size: 14px;
	font-weight: 400;
	color: #85878f;
	text-transform: capitalize;
`;

export const TradeSubLabel = styled.span`
	font-size: 14px;
	font-weight: 700;
	color: #85878f;
	text-transform: uppercase;
	margin-left: 10px;
`;
