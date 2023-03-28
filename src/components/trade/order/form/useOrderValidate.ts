import { OrderSide, OrderType } from 'orderly-sdk/lib/enums';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
	selectCurrentBaseAssets,
	selectCurrentQuoteAssets,
} from '@/redux/assetSlice';
import { createSelector } from '@reduxjs/toolkit';
import { selectTokensConfig } from '@/redux/tradingSlice';
import { priceToFixed } from '@/utils/decimal';

interface useOrderValidateReturn {
	// validate: (values: any) => any;
	validateAmount: (values: any) => any;
	validatePrice: (val: string, values: any) => any;
	base: any;
	quote: any;
}

const selectBaseAndFormat = createSelector(
	selectCurrentBaseAssets,
	selectTokensConfig,
	(base, config) => {
		if (!base) return base;
		if (!base.balance) return base;
		const tokenConfig: any = config[base.name];
		if (!tokenConfig) {
			return base;
		}
		return {
			...base,
			formatted: priceToFixed({
				decimal: tokenConfig.decimals,
				dp: tokenConfig.minimum,
				value: base.balance.balance,
			}),
		};
	},
);
const selectQuoteAndFormat = createSelector(
	selectCurrentQuoteAssets,
	selectTokensConfig,
	(base, config) => {
		if (!base) return base;
		if (!base.balance) return base;
		const tokenConfig = config[base.name];
		if (!tokenConfig) {
			return base;
		}
		return {
			...base,
			formatted: priceToFixed({
				decimal: tokenConfig.decimals,
				dp: tokenConfig.minimum,
				value: base.balance.balance,
			}),
		};
	},
);

export const useOrderValidate = (): useOrderValidateReturn => {
	// const orderBookLatest = useSelector(selectOrderBookLatest);
	const base = useSelector(selectBaseAndFormat);
	const quote = useSelector(selectQuoteAndFormat);

	// const validate = useCallback((values: any): any => {
	// 	const errors: any = {};
	// 	const { side, type } = values;

	// 	if (type !== OrderType.MARKET && type !== OrderType.ASK) {
	// 		if (!values.price) {
	// 			errors.price = 'Price is required';
	// 		}
	// 	}

	// 	if (!values.amount) {
	// 		errors.amount = 'Amount is required';
	// 	}

	// 	console.log(errors);

	// 	return errors;
	// }, []);

	const validatePrice = (val: string, values: any): any => {
		const { side, type } = values;

		console.log(type);

		if (type !== OrderType.MARKET && type !== OrderType.ASK) {
			if (!val) {
				return 'Price is required';
			}
		}
	};

	const validateAmount = useCallback((values: any): any => {}, [base, quote]);

	return { validatePrice, validateAmount, base, quote };
};
