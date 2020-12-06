"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.LogUtils = void 0;
var InventoryLogLevel_1 = __importDefault(require("../types/InventoryLogLevel"));
var lodash_1 = require("../modules/lodash");
var LogUtils = /** @class */ (function () {
    function LogUtils() {
    }
    LogUtils.parseLogLevelString = function (value) {
        switch (lodash_1.trim(value).toUpperCase()) {
            case 'DEBUG': return InventoryLogLevel_1["default"].DEBUG;
            case 'INFO': return InventoryLogLevel_1["default"].INFO;
            case 'WARN': return InventoryLogLevel_1["default"].WARN;
            case 'ERROR': return InventoryLogLevel_1["default"].ERROR;
        }
        throw new TypeError("The log level \"" + value + "\" was not valid log level.");
    };
    return LogUtils;
}());
exports.LogUtils = LogUtils;
exports["default"] = LogUtils;
//# sourceMappingURL=LogUtils.js.map