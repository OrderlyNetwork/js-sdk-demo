"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogger = void 0;
const pino_1 = __importDefault(require("pino"));
const getLogger = (name, debugMode = true) => {
    return (0, pino_1.default)({
        name,
        transport: {
            target: 'pino-pretty',
        },
        level: debugMode ? 'debug' : 'silent',
    });
};
exports.getLogger = getLogger;
