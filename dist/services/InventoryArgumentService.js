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
exports.InventoryArgumentService = exports.parseInventoryOptionKey = exports.InventoryOptionKey = exports.InventoryInputType = exports.InventoryOutputFormat = void 0;
var lodash_1 = require("../modules/lodash");
var InventoryAction_1 = __importDefault(require("../types/InventoryAction"));
var LogService_1 = __importStar(require("./LogService"));
var env_1 = require("../constants/env");
var LOG = LogService_1["default"].createLogger('InventoryArgumentService');
var InventoryOutputFormat;
(function (InventoryOutputFormat) {
    InventoryOutputFormat["RECORD"] = "record";
    InventoryOutputFormat["STRING"] = "string";
    InventoryOutputFormat["JSON"] = "json";
    InventoryOutputFormat["OBJECT"] = "object";
    InventoryOutputFormat["ARRAY"] = "array";
    InventoryOutputFormat["BOOLEAN"] = "boolean";
    InventoryOutputFormat["NUMBER"] = "number";
    InventoryOutputFormat["INTEGER"] = "integer";
    InventoryOutputFormat["DEFAULT"] = "default";
})(InventoryOutputFormat = exports.InventoryOutputFormat || (exports.InventoryOutputFormat = {}));
var InventoryInputType;
(function (InventoryInputType) {
    InventoryInputType["STRING"] = "string";
    InventoryInputType["JSON"] = "json";
    InventoryInputType["OBJECT"] = "object";
    InventoryInputType["ARRAY"] = "array";
    InventoryInputType["BOOLEAN"] = "boolean";
    InventoryInputType["NUMBER"] = "number";
    InventoryInputType["INTEGER"] = "integer";
    InventoryInputType["NULL"] = "null";
})(InventoryInputType = exports.InventoryInputType || (exports.InventoryInputType = {}));
var InventoryOptionKey;
(function (InventoryOptionKey) {
    InventoryOptionKey["LOG_LEVEL"] = "log-level";
    InventoryOptionKey["URL"] = "url";
    InventoryOptionKey["DOMAIN"] = "domain";
})(InventoryOptionKey = exports.InventoryOptionKey || (exports.InventoryOptionKey = {}));
function parseInventoryOptionKey(value) {
    switch (value) {
        case 'log':
        case 'loglevel':
        case 'log-level': return InventoryOptionKey.LOG_LEVEL;
        case 'url': return InventoryOptionKey.URL;
        case 'domain': return InventoryOptionKey.DOMAIN;
    }
    return undefined;
}
exports.parseInventoryOptionKey = parseInventoryOptionKey;
var InventoryArgumentService = /** @class */ (function () {
    function InventoryArgumentService() {
    }
    InventoryArgumentService.parseInventoryOptionKeyToValue = function (value) {
        // @ts-ignore
        return InventoryOptionKey[value];
    };
    InventoryArgumentService.isInventoryOptionKey = function (value) {
        return lodash_1.indexOf(InventoryArgumentService._optionValues, value) >= 0;
    };
    InventoryArgumentService.parseInventoryAction = function (value) {
        switch (value) {
            case 'list': return InventoryAction_1["default"].LIST;
            case 'get': return InventoryAction_1["default"].GET;
            case 'set': return InventoryAction_1["default"].SET;
            case 'delete': return InventoryAction_1["default"].DELETE;
            default: return undefined;
        }
    };
    InventoryArgumentService.parseInventoryOptionArgument = function (result, item) {
        // Parse options
        if (lodash_1.startsWith(item, '--')) {
            var valueKeyIndex = item.indexOf('=');
            var hasValue = valueKeyIndex >= 0;
            var optKey = parseInventoryOptionKey(item.substr('--'.length, hasValue ? valueKeyIndex - '--'.length : item.length - 2));
            if (optKey) {
                var value = hasValue ? item.substr(valueKeyIndex + 1) : '';
                switch (optKey) {
                    case InventoryOptionKey.URL:
                        result = __assign(__assign({}, result), { url: value });
                        break;
                    case InventoryOptionKey.DOMAIN:
                        result = __assign(__assign({}, result), { domain: value });
                        break;
                    case InventoryOptionKey.LOG_LEVEL:
                        result = __assign(__assign({}, result), { logLevel: LogService_1.parseLogLevel(value) });
                        break;
                    default:
                        throw new TypeError("The option was not implemented: \"" + optKey + "\"");
                }
            }
            else {
                throw new TypeError("The argument is unknown: \"" + item + "\"");
            }
        }
        return result;
    };
    InventoryArgumentService.parseInventoryActionArgument = function (result, item) {
        var action = InventoryArgumentService.parseInventoryAction(item);
        if (action === undefined)
            return result;
        return __assign(__assign({}, result), { action: action });
    };
    InventoryArgumentService.parseKeyValue = function (value, separatorKey) {
        var i = value.indexOf(separatorKey);
        if (i >= 0) {
            return {
                key: this.parseKeyString(value.substr(0, i)),
                value: value.substr(i + separatorKey.length)
            };
        }
        return {
            key: this.parseKeyString(value),
            value: ''
        };
    };
    /**
     * Parse keyword which may have keywords with IB_META_KEY prefix and transfer those to use "$" internally.
     *
     * @param value
     */
    InventoryArgumentService.parseKeyString = function (value) {
        var keys = lodash_1.map(value.split('.'), function (item) {
            item = lodash_1.trim(item);
            if (lodash_1.startsWith(item, env_1.IB_META_KEY)) {
                return '$' + item.substr(env_1.IB_META_KEY.length);
            }
            return item;
        });
        return keys.join('.');
    };
    InventoryArgumentService.parseInventoryOutputFormat = function (value) {
        value = lodash_1.trim(value);
        if (value.length >= 2) {
            value = value.toLowerCase();
        }
        switch (value) {
            case 'record':
            case 'r':
                return InventoryOutputFormat.RECORD;
            case 'string':
            case 's':
                return InventoryOutputFormat.STRING;
            case 'json':
            case 'j':
                return InventoryOutputFormat.JSON;
            case 'object':
            case 'o':
                return InventoryOutputFormat.OBJECT;
            case 'array':
            case 'a':
                return InventoryOutputFormat.ARRAY;
            case 'boolean':
            case 'bool':
            case 'b':
                return InventoryOutputFormat.BOOLEAN;
            case 'number':
            case 'n':
                return InventoryOutputFormat.NUMBER;
            case 'integer':
            case 'int':
            case 'i':
                return InventoryOutputFormat.INTEGER;
            case '':
                return InventoryOutputFormat.DEFAULT;
            default:
                throw new TypeError("Unsupported inventory output format: \"" + value + "\"");
        }
    };
    InventoryArgumentService.parseInventoryInputType = function (value) {
        value = lodash_1.trim(value);
        if (value.length >= 2) {
            value = value.toLowerCase();
        }
        switch (value) {
            case 'string':
            case 's':
            case '':
                return InventoryInputType.STRING;
            case 'json':
            case 'j':
                return InventoryInputType.JSON;
            case 'object':
            case 'o':
                return InventoryInputType.OBJECT;
            case 'array':
            case 'a':
                return InventoryInputType.ARRAY;
            case 'boolean':
            case 'bool':
            case 'b':
                return InventoryInputType.BOOLEAN;
            case 'number':
            case 'n':
                return InventoryInputType.NUMBER;
            case 'integer':
            case 'int':
            case 'i':
                return InventoryInputType.INTEGER;
            case 'null':
            case 'nul':
            case 'N':
                return InventoryInputType.NULL;
            default:
                throw new TypeError("Unsupported inventory input type: \"" + value + "\"");
        }
    };
    InventoryArgumentService.parseGetPropertyOptions = function (args) {
        var _this = this;
        return lodash_1.reduce(args, function (result, item) {
            var parsedKeyType = InventoryArgumentService.parseKeyValue(item, ':');
            var key = parsedKeyType.key;
            var type = parsedKeyType.value;
            result.push({
                key: _this.parseKeyString(key),
                format: InventoryArgumentService.parseInventoryOutputFormat(type)
            });
            return result;
        }, []);
    };
    InventoryArgumentService.parseBooleanValue = function (key, value) {
        switch (lodash_1.trim(value).toLowerCase()) {
            case '1':
            case 't':
            case 'true':
            case 'enabled':
            case 'on':
                return true;
            case '0':
            case 'f':
            case 'false':
            case 'off':
            case 'disabled':
            case 'nul':
            case 'null':
            case 'nan':
            case 'undefined':
                return false;
        }
        throw new TypeError("The value for property \"" + key + "\" is not a boolean value: \"" + value + "\"");
    };
    InventoryArgumentService.parseJsonValue = function (key, value) {
        try {
            return JSON.parse(value);
        }
        catch (err) {
            LOG.debug('JSON parsing error: ', err);
            throw new TypeError("The value for property \"" + key + "\" was not a valid JSON string: \"" + value + "\"");
        }
    };
    InventoryArgumentService.isStringNumberValue = function (value) {
        if (!value.length)
            return false;
        switch (value[0]) {
            case '-':
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                break;
            default:
                return false;
        }
        // FIXME: Implement rest of the JSON spec
        return true;
    };
    InventoryArgumentService.isStringIntegerValue = function (value) {
        if (!value)
            return false;
        if (value.indexOf('.') >= 0) {
            return false;
        }
        // FIXME: Implement rest of the JSON spec
        return InventoryArgumentService.isStringNumberValue(value);
    };
    InventoryArgumentService.isStringArrayValue = function (value) {
        // FIXME: Implement the rest of the JSON spec
        return (!!value && (value.length >= 2) && (value[0] !== '[') && (value[value.length - 1] === ']'));
    };
    InventoryArgumentService.isStringObjectValue = function (value) {
        // FIXME: Implement the rest of the JSON spec
        return (!!value && (value.length >= 2) && (value[0] !== '{') && (value[value.length - 1] === '}'));
    };
    InventoryArgumentService.parseNumberValue = function (key, value) {
        value = lodash_1.trim(value);
        if (InventoryArgumentService.isStringNumberValue(value)) {
            return InventoryArgumentService.parseJsonValue(key, value);
        }
        throw new TypeError("The value for property \"" + key + "\" was not a valid number: \"" + value + "\"");
    };
    InventoryArgumentService.parseArrayValue = function (key, value) {
        value = lodash_1.trim(value);
        if (InventoryArgumentService.isStringArrayValue(value)) {
            throw new TypeError("The value for property \"" + key + "\" was not a valid array: \"" + value + "\"");
        }
        // FIXME: This should throw an exception if the value was not a number.
        return InventoryArgumentService.parseJsonValue(key, value);
    };
    InventoryArgumentService.parseObjectValue = function (key, value) {
        value = lodash_1.trim(value);
        if (InventoryArgumentService.isStringObjectValue(value)) {
            throw new TypeError("The value for property \"" + key + "\" was not a valid array: \"" + value + "\"");
        }
        // FIXME: This should throw an exception if the value was not a number.
        return InventoryArgumentService.parseJsonValue(key, value);
    };
    InventoryArgumentService.parseIntegerValue = function (key, value) {
        if (!InventoryArgumentService.isStringIntegerValue(value)) {
            throw new TypeError("The value for property \"" + key + "\" was not a valid number: \"" + value + "\"");
        }
        var result = parseInt(value, 10);
        if (!lodash_1.isNumber(result) || isNaN(result)) {
            throw new TypeError("The value for property \"" + key + "\" was not a valid number: \"" + value + "\"");
        }
        return result;
    };
    InventoryArgumentService.parseNullValue = function (key, value) {
        value = lodash_1.trim(value).toLowerCase();
        if ((value === "") || (value === "null") || (value === "nul")) {
            return null;
        }
        throw new TypeError("The value for property \"" + key + "\" was not type of null: \"" + value + "\"");
    };
    InventoryArgumentService.parseInventoryInputValue = function (key, type, value) {
        switch (type) {
            case InventoryInputType.STRING: return value;
            case InventoryInputType.JSON: return InventoryArgumentService.parseJsonValue(key, value);
            case InventoryInputType.OBJECT: return InventoryArgumentService.parseObjectValue(key, value);
            case InventoryInputType.ARRAY: return InventoryArgumentService.parseArrayValue(key, value);
            case InventoryInputType.BOOLEAN: return InventoryArgumentService.parseBooleanValue(key, value);
            case InventoryInputType.NUMBER: return InventoryArgumentService.parseNumberValue(key, value);
            case InventoryInputType.INTEGER: return InventoryArgumentService.parseIntegerValue(key, value);
            case InventoryInputType.NULL: return InventoryArgumentService.parseNullValue(key, value);
            default: throw new TypeError("The input type for property \"" + key + "\" was not implemented: \"" + type + "\"");
        }
    };
    InventoryArgumentService.parseSetPropertyOptions = function (args) {
        var _this = this;
        return lodash_1.reduce(args, function (result, item) {
            var parsedKeyValue = InventoryArgumentService.parseKeyValue(item, '=');
            var keyType = parsedKeyValue.key;
            var value = parsedKeyValue.value;
            var parsedKeyType = InventoryArgumentService.parseKeyValue(keyType, ':');
            var key = lodash_1.trim(parsedKeyType.key);
            var type = InventoryArgumentService.parseInventoryInputType(parsedKeyType.value);
            result.push({
                key: _this.parseKeyString(key),
                type: type,
                value: InventoryArgumentService.parseInventoryInputValue(key, type, value)
            });
            return result;
        }, []);
    };
    InventoryArgumentService.parseInventoryArguments = function (args) {
        var result = {};
        var freeArgs = [];
        lodash_1.forEach(args, function (item) {
            var prevResult = result;
            result = InventoryArgumentService.parseInventoryOptionArgument(result, item);
            if (result !== prevResult)
                return;
            // Add others to free args
            freeArgs.push(item);
        });
        // Parse the action
        if (freeArgs.length) {
            var prevResult = result;
            result = InventoryArgumentService.parseInventoryActionArgument(result, freeArgs[0]);
            if (result !== prevResult) {
                freeArgs.shift();
            }
        }
        // Parse the resource
        if (freeArgs.length) {
            result = __assign(__assign({}, result), { resource: freeArgs.shift() });
        }
        // Set the default action
        if (!(result === null || result === void 0 ? void 0 : result.action)) {
            var hasSets = lodash_1.some(freeArgs, function (item) { return item.indexOf('=') >= 0; });
            if (!(result === null || result === void 0 ? void 0 : result.resource)) {
                result = __assign(__assign({}, result), { action: InventoryAction_1["default"].LIST });
            }
            else {
                result = __assign(__assign({}, result), { action: hasSets ? InventoryAction_1["default"].SET : InventoryAction_1["default"].GET });
            }
        }
        if (freeArgs.length) {
            switch (result.action) {
                case InventoryAction_1["default"].GET:
                    result = __assign(__assign({}, result), { propertyGetActions: InventoryArgumentService.parseGetPropertyOptions(freeArgs) });
                    break;
                case InventoryAction_1["default"].SET:
                    result = __assign(__assign({}, result), { propertySetActions: InventoryArgumentService.parseSetPropertyOptions(freeArgs) });
                    break;
                default:
                    throw new TypeError("The action \"" + result.action + "\" does not support property arguments: " + freeArgs.join(' '));
            }
        }
        return result;
    };
    InventoryArgumentService._optionValues = lodash_1.map(lodash_1.keys(InventoryOptionKey), InventoryArgumentService.parseInventoryOptionKeyToValue);
    return InventoryArgumentService;
}());
exports.InventoryArgumentService = InventoryArgumentService;
exports["default"] = InventoryArgumentService;
//# sourceMappingURL=InventoryArgumentService.js.map