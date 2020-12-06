"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d, _e, _f;
exports.__esModule = true;
exports.IB_LOG_LEVEL = exports.IB_URL = exports.IB_GROUP = void 0;
var LogUtils_1 = __importDefault(require("../services/LogUtils"));
/**
 * The default collection to use.
 *
 * This defaults to "hosts".
 */
exports.IB_GROUP = (_b = (_a = process === null || process === void 0 ? void 0 : process.env) === null || _a === void 0 ? void 0 : _a.IB_GROUP) !== null && _b !== void 0 ? _b : "hosts";
/**
 * The default URL to use to the backend.
 *
 * It defaults to "http://localhost/ib"
 */
exports.IB_URL = (_d = (_c = process === null || process === void 0 ? void 0 : process.env) === null || _c === void 0 ? void 0 : _c.IB_URL) !== null && _d !== void 0 ? _d : "http://localhost/ib";
/**
 * The default log level
 */
exports.IB_LOG_LEVEL = LogUtils_1["default"].parseLogLevelString((_f = (_e = process === null || process === void 0 ? void 0 : process.env) === null || _e === void 0 ? void 0 : _e.IB_LOG_LEVEL) !== null && _f !== void 0 ? _f : "INFO");
//# sourceMappingURL=env.js.map