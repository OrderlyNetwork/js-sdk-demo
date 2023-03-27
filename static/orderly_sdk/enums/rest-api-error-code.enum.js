"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestApiErrorCode = void 0;
/**
 * Orderly REST API Error codes
 *
 * @link https://docs-api.orderly.network/#error-codes
 */
var RestApiErrorCode;
(function (RestApiErrorCode) {
    /**
     * An unknown error occurred while processing the request.
     */
    RestApiErrorCode[RestApiErrorCode["UNKNOWN"] = -1000] = "UNKNOWN";
    /**
     * The api key or secret is in wrong format.
     */
    RestApiErrorCode[RestApiErrorCode["INVALID_SIGNATURE"] = -1001] = "INVALID_SIGNATURE";
    /**
     * API key or secret is invalid, it may because key have insufficient permission or the key is expired/revoked.
     */
    RestApiErrorCode[RestApiErrorCode["UNAUTHORIZED"] = -1002] = "UNAUTHORIZED";
    /**
     * Rate limit exceed.
     */
    RestApiErrorCode[RestApiErrorCode["TOO_MANY_REQUEST"] = -1003] = "TOO_MANY_REQUEST";
    /**
     * An unknown parameter was sent.
     */
    RestApiErrorCode[RestApiErrorCode["UNKNOWN_PARAM"] = -1004] = "UNKNOWN_PARAM";
    /**
     * Some parameters are in wrong format for api.
     */
    RestApiErrorCode[RestApiErrorCode["INVALID_PARAM"] = -1005] = "INVALID_PARAM";
    /**
     * The data is not found in server. For example, when client try canceling a CANCELLED order, will raise this error.
     */
    RestApiErrorCode[RestApiErrorCode["RESOURCE_NOT_FOUND"] = -1006] = "RESOURCE_NOT_FOUND";
    /**
     * The data is already exists or your request is duplicated.
     */
    RestApiErrorCode[RestApiErrorCode["DUPLICATE_REQUEST"] = -1007] = "DUPLICATE_REQUEST";
    /**
     * The quantity of settlement is too high than you can request.
     */
    RestApiErrorCode[RestApiErrorCode["QUANTITY_TOO_HIGH"] = -1008] = "QUANTITY_TOO_HIGH";
    /**
     * Can not request withdrawal settlement, you need to deposit other arrears first.
     */
    RestApiErrorCode[RestApiErrorCode["CAN_NOT_WITHDRAWAL"] = -1009] = "CAN_NOT_WITHDRAWAL";
    /**
     * Can not place/cancel orders, it may because internal network error. Please try again in a few seconds.
     */
    RestApiErrorCode[RestApiErrorCode["RPC_NOT_CONNECT"] = -1011] = "RPC_NOT_CONNECT";
    /**
     * The place/cancel order request is rejected by internal module, it may because the account is in liquidation or other internal errors.
     * Please try again in a few seconds.
     */
    RestApiErrorCode[RestApiErrorCode["RPC_REJECT"] = -1012] = "RPC_REJECT";
    /**
     * The risk exposure for client is too high, it may cause by sending too big order or the leverage is too low.
     * Please refer to client info to check the current exposure.
     */
    RestApiErrorCode[RestApiErrorCode["RISK_TOO_HIGH"] = -1101] = "RISK_TOO_HIGH";
    /**
     * The order value (price * size) is too small.
     */
    RestApiErrorCode[RestApiErrorCode["MIN_NOTIONAL"] = -1102] = "MIN_NOTIONAL";
    /**
     * The order price is not following the tick size rule for the symbol.
     */
    RestApiErrorCode[RestApiErrorCode["PRICE_FILTER"] = -1103] = "PRICE_FILTER";
    /**
     * The order quantity is not following the step size rule for the symbol.
     */
    RestApiErrorCode[RestApiErrorCode["SIZE_FILTER"] = -1104] = "SIZE_FILTER";
    /**
     * Price is X% too high or X% too low from the mid price.
     */
    RestApiErrorCode[RestApiErrorCode["PERCENTAGE_FILTER"] = -1105] = "PERCENTAGE_FILTER";
})(RestApiErrorCode = exports.RestApiErrorCode || (exports.RestApiErrorCode = {}));
