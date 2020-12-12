"use strict";
// Copyright (c) 2020 Sendanor. All rights reserved.
exports.__esModule = true;
exports.Test = void 0;
var lodash_1 = require("../modules/lodash");
var Test = /** @class */ (function () {
    function Test() {
    }
    Test.isString = function (value) {
        return lodash_1.isString(value);
    };
    Test.isNumber = function (value) {
        return lodash_1.isNumber(value);
    };
    /**
     * Test if it is an regular object (eg. all keys are strings).
     *
     * @param value
     */
    Test.isRegularObject = function (value) {
        return lodash_1.isObject(value) && !lodash_1.isArray(value) && lodash_1.every(lodash_1.keys(value), function (key) { return lodash_1.isString(key); });
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
exports["default"] = Test;
//# sourceMappingURL=Test.js.map