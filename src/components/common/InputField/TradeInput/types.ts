export interface ITradeInput {
	label: string;
	value?: string;
	subLabel?: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	style?: object;
}
