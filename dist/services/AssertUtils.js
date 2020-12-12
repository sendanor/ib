"use strict";
// Copyright (c) 2020 Sendanor. All rights reserved.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.AssertUtils = void 0;
var Test_1 = __importDefault(require("./Test"));
var AssertUtils = /** @class */ (function () {
    function AssertUtils() {
    }
    /**
     * Use AssertUtils.isEqual()
     *
     * @deprecated
     * @param value1
     * @param value2
     */
    AssertUtils.equals = function (value1, value2) {
        if (value1 !== value2) {
            throw new TypeError('Values were not equal: ' + value1 + ' !== ' + value2);
        }
    };
    AssertUtils.isEqual = function (value1, value2) {
        if (value1 !== value2) {
            throw new TypeError('Values were not equal: ' + value1 + ' !== ' + value2);
        }
    };
    AssertUtils.notEqual = function (value1, value2) {
        if (value1 === value2) {
            throw new TypeError('Values were equal: ' + value1 + ' === ' + value2);
        }
    };
    AssertUtils.isLessThanOrEqual = function (value1, value2) {
        if (!(value1 <= value2)) {
            throw new TypeError('Value is not less than or equal: !(' + value1 + ' <= ' + value2 + ')');
        }
    };
    AssertUtils.isLessThan = function (value1, value2) {
        if (!(value1 < value2)) {
            throw new TypeError('Value is not less than or equal: !(' + value1 + ' < ' + value2 + ')');
        }
    };
    AssertUtils.isTrue = function (value) {
        if (value !== true) {
            throw new TypeError('Value was not true: ' + value);
        }
    };
    AssertUtils.notTrue = function (value) {
        if (value === true) {
            throw new TypeError('Value was true: ' + value);
        }
    };
    AssertUtils.isFalse = function (value) {
        if (value !== false) {
            throw new TypeError('Value was not false: ' + value);
        }
    };
    AssertUtils.notFalse = function (value) {
        if (value === false) {
            throw new TypeError('Value was false: ' + value);
        }
    };
    AssertUtils.isRegularObject = function (value) {
        if (!Test_1["default"].isRegularObject(value)) {
            throw new TypeError('Value was not regular object: ' + value);
        }
    };
    AssertUtils.notRegularObject = function (value) {
        if (Test_1["default"].isRegularObject(value)) {
            throw new TypeError('Value was regular object: ' + value);
        }
    };
    AssertUtils.isString = function (value) {
        if (!Test_1["default"].isString(value)) {
            throw new TypeError('Value was not string: ' + value);
        }
    };
    AssertUtils.notString = function (value) {
        if (Test_1["default"].isString(value)) {
            throw new TypeError('Value was string: ' + value);
        }
    };
    AssertUtils.isNumber = function (value) {
        if (!Test_1["default"].isNumber(value)) {
            throw new TypeError('Value was not number: ' + value);
        }
    };
    AssertUtils.notNumber = function (value) {
        if (Test_1["default"].isNumber(value)) {
            throw new TypeError('Value was number: ' + value);
        }
    };
    AssertUtils.isArray = function (value) {
        if (!Test_1["default"].isArray(value)) {
            throw new TypeError('Value was not array: ' + value);
        }
    };
    AssertUtils.notArray = function (value) {
        if (Test_1["default"].isArray(value)) {
            throw new TypeError('Value was array: ' + value);
        }
    };
    AssertUtils.isPromise = function (value) {
        if (!Test_1["default"].isPromise(value)) {
            throw new TypeError('Value was not promise: ' + value);
        }
    };
    AssertUtils.notPromise = function (value) {
        if (Test_1["default"].isPromise(value)) {
            throw new TypeError('Value was promise: ' + value);
        }
    };
    return AssertUtils;
}());
exports.AssertUtils = AssertUtils;
exports["default"] = AssertUtils;
//# sourceMappingURL=AssertUtils.js.map