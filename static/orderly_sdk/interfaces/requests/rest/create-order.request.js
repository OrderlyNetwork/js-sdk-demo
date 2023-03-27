"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateOrderRequest = void 0;
const validateCreateOrderRequest = (params) => {
    const errors = [];
    // if (!params.order_price && params.order_type !== OrderType.MARKET) {
    //   errors.push('order_price is required');
    // }
    // if (
    //   !params.order_amount &&
    //   ![OrderType.BID, OrderType.ASK, OrderType.MARKET].includes(OrderType[params.order_type])
    // ) {
    //   errors.push('order_amount is required');
    // }
    return { success: errors.length === 0, errors };
};
exports.validateCreateOrderRequest = validateCreateOrderRequest;
