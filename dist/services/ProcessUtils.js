"use strict";
// Copyright (c) 2020 Sendanor. All rights reserved.
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.ProcessUtils = void 0;
var AssertUtils_1 = __importDefault(require("./AssertUtils"));
var lodash_1 = require("../modules/lodash");
var FS = require('fs');
var PATH = require('path');
var ProcessUtils = /** @class */ (function () {
    function ProcessUtils() {
    }
    ProcessUtils.getArguments = function () {
        AssertUtils_1["default"].isArray(process.argv);
        return process.argv.slice(2);
    };
    ProcessUtils.parseEnvFileLine = function (obj, line) {
        AssertUtils_1["default"].isRegularObject(obj);
        AssertUtils_1["default"].isString(line);
        if (line.indexOf('=') < 0) {
            if (line.length) {
                obj[line] = '';
            }
            return obj;
        }
        var parts = line.split('=');
        var key = parts.shift();
        AssertUtils_1["default"].isString(key);
        key = lodash_1.trim(key);
        if (key.length) {
            obj[key] = parts.join('=').trim();
        }
        return obj;
    };
    ProcessUtils.parseEnvFile = function (file) {
        var input = FS.readFileSync(file, { encoding: "utf-8" });
        AssertUtils_1["default"].isString(input);
        var rows = input.split('\n');
        AssertUtils_1["default"].isArray(rows);
        return rows.reduce(ProcessUtils.parseEnvFileLine, {});
    };
    ProcessUtils.initEnvFromFile = function (file) {
        var params = ProcessUtils.parseEnvFile(file);
        AssertUtils_1["default"].isRegularObject(params);
        process.env = __assign(__assign({}, params), process.env);
    };
    ProcessUtils.initEnvFromDefaultFiles = function () {
        var file = PATH.join(process.cwd(), '.env');
        if (FS.existsSync(file)) {
            ProcessUtils.initEnvFromFile(file);
        }
    };
    return ProcessUtils;
}());
exports.ProcessUtils = ProcessUtils;
exports["default"] = ProcessUtils;
//# sourceMappingURL=ProcessUtils.js.map