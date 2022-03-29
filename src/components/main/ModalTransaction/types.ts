export interface IModalTransaction {
	headerTitle: string;
	amountLabel: string;
	amount: string;
	amountValue: string;
	inputHelper: string;
	inputPlaceholder?: string;
	inputCurrency: string;
	inputValue: string;
	btnLabel: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onClick: () => void;
}
