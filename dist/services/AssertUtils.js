"use strict";
// Copyright (c) 2020 Sendanor. All rights reserved.
exports.__esModule = true;
exports.AssertUtils = exports.Test = void 0;
var lodash_1 = require("../modules/lodash");
var Test = /** @class */ (function () {
    function Test() {
    }
    Test.isString = function (value) {
        return lodash_1.isString(value);
    };
    /**
     * Test if it is an regular object.
     *
     * @param value
     */
    Test.isObject = function (value) {
        return lodash_1.isObject(value) && !lodash_1.isArray(value);
    };
    /**
     * Test if the value is an array
     *
     * @param value
     */
    Test.isArray = function (value) {
        return lodash_1.isArray(value);
    };
    Test.isPromise = function (value) {
        // @ts-ignore
        return lodash_1.isObject(value) && !!value.then && !!value["catch"];
    };
    return Test;
}());
exports.Test = Test;
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
    AssertUtils.isObject = function (value) {
        if (!Test.isObject(value)) {
            throw new TypeError('Value was not object: ' + value);
        }
    };
    AssertUtils.notObject = function (value) {
        if (Test.isObject(value)) {
            throw new TypeError('Value was object: ' + value);
        }
    };
    AssertUtils.isString = function (value) {
        if (!Test.isString(value)) {
            throw new TypeError('Value was not string: ' + value);
        }
    };
    AssertUtils.notString = function (value) {
        if (Test.isString(value)) {
            throw new TypeError('Value was string: ' + value);
        }
    };
    AssertUtils.isArray = function (value) {
        if (!Test.isArray(value)) {
            throw new TypeError('Value was not array: ' + value);
        }
    };
    AssertUtils.notArray = function (value) {
        if (Test.isArray(value)) {
            throw new TypeError('Value was array: ' + value);
        }
    };
    AssertUtils.isPromise = function (value) {
        if (!Test.isPromise(value)) {
            throw new TypeError('Value was not promise: ' + value);
        }
    };
    AssertUtils.notPromise = function (value) {
        if (Test.isPromise(value)) {
            throw new TypeError('Value was promise: ' + value);
        }
    };
    return AssertUtils;
}());
exports.AssertUtils = AssertUtils;
exports["default"] = AssertUtils;
//# sourceMappingURL=AssertUtils.js.map