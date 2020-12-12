"use strict";
// Copyright (c) 2020 Sendanor. All rights reserved.
exports.__esModule = true;
exports.isReadonlyJsonArray = exports.isReadonlyJsonObject = exports.isReadonlyJsonAny = exports.isFlatJsonValue = exports.isJsonSerializable = exports.isReadonlyJsonSerializable = void 0;
var lodash_1 = require("../modules/lodash");
var Test_1 = require("../services/Test");
function isReadonlyJsonSerializable(value) {
    return !!value && lodash_1.isFunction(value.toJSON);
}
exports.isReadonlyJsonSerializable = isReadonlyJsonSerializable;
function isJsonSerializable(value) {
    return !!value && lodash_1.isFunction(value.toJSON);
}
exports.isJsonSerializable = isJsonSerializable;
function isFlatJsonValue(value) {
    return lodash_1.isString(value) || lodash_1.isNumber(value) || lodash_1.isBoolean(value) || lodash_1.isNull(value);
}
exports.isFlatJsonValue = isFlatJsonValue;
function isReadonlyJsonAny(value) {
    return isFlatJsonValue(value) || isReadonlyJsonArray(value) || isReadonlyJsonObject(value);
}
exports.isReadonlyJsonAny = isReadonlyJsonAny;
function isReadonlyJsonObject(value) {
    return Test_1.Test.isRegularObject(value) && lodash_1.every(lodash_1.keys(value), function (key) {
        var propertyValue = value[key];
        if (propertyValue === undefined)
            return true;
        return isReadonlyJsonAny(propertyValue);
    });
}
exports.isReadonlyJsonObject = isReadonlyJsonObject;
function isReadonlyJsonArray(value) {
    return lodash_1.isArray(value) && lodash_1.every(value, function (item) { return isReadonlyJsonAny(item); });
}
exports.isReadonlyJsonArray = isReadonlyJsonArray;
//# sourceMappingURL=Json.js.map