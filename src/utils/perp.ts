/**
 * Liquidation Price = max (Mark Price + ( total_collateral_value - total_notional * MMR ) / ( |Qi| * MMRi - Qi ) , 0)
 * unsettled_pnl = position_qty * mark_price - cost_position - accrued_funding
 * accrued_funding = position_qty * (sum_unitary_fundings - last_sum_unitary_funding)
 * unrealPnL = position_qty * (markPrice - average_open_price)
 * margin_ratio = total_collateral_value / sum(abs(position_notional_i))
 */

import { Position } from '@/types/prep';
import Decimal from 'decimal.js-light';

/**
 * Calculate the PnL of a position
 */
export const calcualteUnrealPnL = (
	position: Position,
	marketPrice: number,
): Decimal => {
	const d = new Decimal(position.position_qty);
	// 看空
	if (d.lt(0)) return d.mul(position.average_open_price - marketPrice);
	return d.mul(marketPrice - position.average_open_price);
};

export const calcualteUnsettlePnL = (
	position: Position,
	markPrice: number,
): number => {
	const accruedFunding =
		position.position_qty *
		(position.last_sum_unitary_funding - position.last_sum_unitary_funding);
	return (
		position.position_qty * markPrice - position.cost_position - accruedFunding
	);
};

export const calcualteNotional = (
	position: Position,
	markPrice: number,
): Decimal => {
	return new Decimal(position.position_qty).mul(markPrice);
};

export const calcualteLiquidationPrice = (
	position: Position,
	markPrice: string,
): number => {
	return 0;
};

export const timeConvertString = (time: number): number[] => {
	time /= 1000;
	var h = Math.floor(time / 3600);
	var m = Math.floor((time / 60) % 60);
	var s = Math.floor(time % 60);
	// return result = h + "小时" + m + "分钟" + s + "秒";
	return [h, m, s];
};
