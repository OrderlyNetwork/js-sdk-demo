"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParameterNotFoundError = void 0;
class ParameterNotFoundError extends Error {
    constructor(parameterName) {
        super(`${parameterName} parameter is not set. Please add it to your env file.`);
    }
}
exports.ParameterNotFoundError = ParameterNotFoundError;
