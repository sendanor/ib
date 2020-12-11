"use strict";
// Copyright (c) 2020 Sendanor. All rights reserved.
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.LogService = exports.Logger = void 0;
var InventoryLogLevel_1 = __importDefault(require("../types/InventoryLogLevel"));
var env_1 = require("../constants/env");
var Logger = /** @class */ (function () {
    function Logger(name) {
        this.name = name;
    }
    Logger.prototype.debug = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        LogService.debug.apply(LogService, __spreadArrays(["[" + this.name + "]"], args));
    };
    Logger.prototype.info = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        LogService.info.apply(LogService, __spreadArrays(["[" + this.name + "]"], args));
    };
    Logger.prototype.warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        LogService.warn.apply(LogService, __spreadArrays(["[" + this.name + "]"], args));
    };
    Logger.prototype.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        LogService.error.apply(LogService, __spreadArrays(["[" + this.name + "]"], args));
    };
    return Logger;
}());
exports.Logger = Logger;
var LogService = /** @class */ (function () {
    function LogService() {
    }
    LogService.setLogLevel = function (value) {
        this._level = value;
    };
    LogService.setLogger = function (value) {
        if (!value)
            throw new TypeError("The logger was not defined");
        this._logger = value;
    };
    LogService.debug = function () {
        var _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this._level <= InventoryLogLevel_1["default"].DEBUG) {
            (_a = this._logger).debug.apply(_a, args);
        }
    };
    LogService.info = function () {
        var _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this._level <= InventoryLogLevel_1["default"].INFO) {
            (_a = this._logger).info.apply(_a, args);
        }
    };
    LogService.warn = function () {
        var _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this._level <= InventoryLogLevel_1["default"].WARN) {
            (_a = this._logger).warn.apply(_a, args);
        }
    };
    LogService.error = function () {
        var _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this._level <= InventoryLogLevel_1["default"].ERROR) {
            (_a = this._logger).error.apply(_a, args);
        }
    };
    LogService.createLogger = function (name) {
        return new Logger(name);
    };
    LogService._level = env_1.IB_LOG_LEVEL;
    LogService._logger = console;
    return LogService;
}());
exports.LogService = LogService;
exports["default"] = LogService;
//# sourceMappingURL=LogService.js.map