"use strict";
// Copyright (c) 2020 Sendanor. All rights reserved.
exports.__esModule = true;
exports.LogUtils = void 0;
var lodash_1 = require("../modules/lodash");
var LogService_1 = require("./LogService");
var LogUtils = /** @class */ (function () {
    function LogUtils() {
    }
    LogUtils.parseLogLevelString = function (value) {
        switch (lodash_1.trim(value).toUpperCase()) {
            case 'DEBUG': return LogService_1.LogLevel.DEBUG;
            case 'INFO': return LogService_1.LogLevel.INFO;
            case 'WARN': return LogService_1.LogLevel.WARN;
            case 'ERROR': return LogService_1.LogLevel.ERROR;
        }
        throw new TypeError("The log level \"" + value + "\" was not valid log level.");
    };
    return LogUtils;
}());
exports.LogUtils = LogUtils;
exports["default"] = LogUtils;
//# sourceMappingURL=LogUtils.js.map