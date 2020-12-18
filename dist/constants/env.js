"use strict";
// Copyright (c) 2020 Sendanor. All rights reserved.
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
exports.__esModule = true;
exports.IB_LOG_LEVEL = exports.IB_META_KEY = exports.IB_FILTER = exports.IB_URL = exports.IB_DOMAIN = void 0;
var LogService_1 = require("../services/LogService");
/**
 * The default resource domain to use.
 *
 * This defaults to "hosts".
 */
exports.IB_DOMAIN = (_b = (_a = process === null || process === void 0 ? void 0 : process.env) === null || _a === void 0 ? void 0 : _a.IB_DOMAIN) !== null && _b !== void 0 ? _b : "main";
/**
 * The default URL to use to the backend.
 *
 * It defaults to "http://localhost/ib"
 */
exports.IB_URL = (_d = (_c = process === null || process === void 0 ? void 0 : process.env) === null || _c === void 0 ? void 0 : _c.IB_URL) !== null && _d !== void 0 ? _d : "http://localhost/ib";
/**
 * Default output filters.
 *
 * These is space separated property names to filter out of the results.
 *
 * It defaults to "-$*", eg. to hide all meta properties from the output.
 *
 * @see You can control this also using --include and --exclude
 */
exports.IB_FILTER = (_f = (_e = process === null || process === void 0 ? void 0 : process.env) === null || _e === void 0 ? void 0 : _e.IB_FILTER) !== null && _f !== void 0 ? _f : "-$*";
/**
 * The meta character to use for meta properties like id and name, which are not part of the host variables.
 *
 * It defaults to `@`.
 */
exports.IB_META_KEY = (_h = (_g = process === null || process === void 0 ? void 0 : process.env) === null || _g === void 0 ? void 0 : _g.IB_META_KEY) !== null && _h !== void 0 ? _h : '@';
/**
 * The default log level
 */
exports.IB_LOG_LEVEL = LogService_1.parseLogLevel((_k = (_j = process === null || process === void 0 ? void 0 : process.env) === null || _j === void 0 ? void 0 : _j.IB_LOG_LEVEL) !== null && _k !== void 0 ? _k : "INFO");
//# sourceMappingURL=env.js.map