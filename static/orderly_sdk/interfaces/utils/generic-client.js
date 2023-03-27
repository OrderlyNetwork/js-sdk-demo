"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericClient = void 0;
const logger_1 = require("../../logger");
class GenericClient {
    constructor(name, debug) {
        this.logger = (0, logger_1.getLogger)(name, debug);
    }
}
exports.GenericClient = GenericClient;
