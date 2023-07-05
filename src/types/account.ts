export interface AccountInfo {
	account_id: string;
	email: string;
	account_mode: string;
	tier: string;
	maintenance_cancel_orders: boolean;
	taker_fee_rate: number;
	maker_fee_rate: number;
	max_leverage: number;
	futures_taker_fee_rate: number;
	futures_maker_fee_rate: number;
	imr_factor: ImrFactor;
}

export interface ImrFactor {
	BTC: number;
	ETH: number;
	NEAR: number;
}
