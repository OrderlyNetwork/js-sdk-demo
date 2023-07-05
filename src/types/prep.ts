import Decimal from 'decimal.js-light';

export interface Position {
	symbol: string;
	position_qty: number;
	cost_position: number;
	last_sum_unitary_funding: number;
	pending_long_qty: number;
	pending_short_qty: number;
	settle_price: number;
	average_open_price: number;
	unsettled_pnl: number;
	mark_price: number;
	est_liq_price: number;
	timestamp: number;
	mmr: number;
	imr: number;
	IMR_withdraw_orders: number;
	MMR_with_orders: number;
	pnl_24_h: number;
	fee_24_h: number;
}

export interface PositionWithTableCell extends Position {
	unrealPnL: Decimal;
	notional: Decimal;
}
