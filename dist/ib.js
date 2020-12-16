#!/usr/bin/env node
"use strict";
// Copyright (c) 2020 Sendanor. All rights reserved.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var ProcessUtils_1 = __importDefault(require("./services/ProcessUtils"));
// Must be first line to load the ENV
ProcessUtils_1["default"].initEnvFromDefaultFiles();
var LogService_1 = __importDefault(require("./services/LogService"));
var env_1 = require("./constants/env");
LogService_1["default"].setLogLevel(env_1.IB_LOG_LEVEL);
var HTTP = __importStar(require("http"));
var URL = __importStar(require("url"));
var Main_1 = __importDefault(require("./Main"));
var HttpClientUtils_1 = __importDefault(require("./services/HttpClientUtils"));
var lodash_1 = require("./modules/lodash");
var LOG = LogService_1["default"].createLogger('ib');
function handleError(err) {
    var _a, _b, _c, _d, _e, _f, _g;
    var statusCode = err === null || err === void 0 ? void 0 : err.status;
    if (lodash_1.isNumber(statusCode) && lodash_1.isString((_b = (_a = err === null || err === void 0 ? void 0 : err.data) === null || _a === void 0 ? void 0 : _a.payload) === null || _b === void 0 ? void 0 : _b.reason)) {
        var reason = (_d = (_c = err === null || err === void 0 ? void 0 : err.data) === null || _c === void 0 ? void 0 : _c.payload) === null || _d === void 0 ? void 0 : _d.reason;
        console.error("ERROR: " + statusCode + " " + reason);
    }
    else if (lodash_1.isNumber(statusCode) && lodash_1.isString((_e = err === null || err === void 0 ? void 0 : err.data) === null || _e === void 0 ? void 0 : _e.payload)) {
        var reason = (_f = err === null || err === void 0 ? void 0 : err.data) === null || _f === void 0 ? void 0 : _f.payload;
        console.error("ERROR: " + statusCode + " " + reason);
    }
    else {
        console.error('ERROR: ' + ((_g = err === null || err === void 0 ? void 0 : err.message) !== null && _g !== void 0 ? _g : '' + err));
    }
    // Enable later when there is a support for debug flag
    LOG.debug('Exception: ', err);
    Main_1["default"].printShortUsage();
    process.exit(2);
}
try {
    HttpClientUtils_1["default"].setUrlModule(URL);
    HttpClientUtils_1["default"].setHttpModule(HTTP);
    Main_1["default"].run().then(function (status) {
        process.exit(status);
    })["catch"](handleError);
}
catch (e) {
    handleError(e);
}
//# sourceMappingURL=ib.js.map