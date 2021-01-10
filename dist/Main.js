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
exports.Main = void 0;
var env_1 = require("./constants/env");
var ProcessUtils_1 = __importDefault(require("./services/ProcessUtils"));
var InventoryArgumentService_1 = __importStar(require("./services/InventoryArgumentService"));
var lodash_1 = require("./modules/lodash");
var InventoryAction_1 = __importDefault(require("./types/InventoryAction"));
var InventoryClientUtils_1 = __importDefault(require("./services/InventoryClientUtils"));
var Json_1 = require("./types/Json");
var LogService_1 = __importDefault(require("./services/LogService"));
var LOG = LogService_1["default"].createLogger('Main');
var Main = /** @class */ (function () {
    function Main() {
    }
    Main.printFullUsage = function () {
        console.log('\n' +
            'ib [OPTION(S)] [create]\n' +
            '\n' +
            '    Create the inventory domain.\n' +
            '\n' +
            'ib [OPTION(S)] [list]\n' +
            '\n' +
            '    List inventory items in the domain.\n' +
            '\n' +
            'ib [OPTION(S)] [get] UUID|NAME [[OBJ.]KEY[:FORMAT]][ [[OBJ2.]KEY2[:FORMAT]] ...]\n' +
            '\n' +
            '    Fetch the inventory object (or specific properties from it).\n' +
            '\n' +
            '    If properties are defined, only those will be returned, one at a line.\n' +
            '\n' +
            '    See also Output Formats for FORMAT.\n' +
            '\n' +
            'ib [OPTION(S)] [set] UUID|NAME [OBJ.]KEY[:TYPE]=VALUE [[OBJ2.]KEY2[:TYPE2]=VALUE2 ...]\n' +
            '\n' +
            '    Set a property in a host object.\n' +
            '\n' +
            '    See also Input Types for TYPE.\n' +
            '\n' +
            'ib [OPTION(S)] delete UUID|NAME\n' +
            '\n' +
            '    Delete a host object\n' +
            '\n' +
            'Where OPTION(S) are:\n' +
            '\n' +
            '  --url=URL\n' +
            '\n' +
            '    The URL to the backend.\n' +
            '\n' +
            '    Defaults to “http://localhost/ib”.\n' +
            '\n' +
            '    See also the IB_URL environment option.\n' +
            '\n' +
            '  --log[-level]=DEBUG|INFO|ERROR|WARN\n' +
            '\n' +
            '    The log level.\n' +
            '\n' +
            '    Defaults to “INFO”.\n' +
            '\n' +
            '    See also the IB_LOG_LEVEL environment option.\n' +
            '\n' +
            '  --include=VALUE\n' +
            '\n' +
            '    Add property name filter to include names.\n' +
            '\n' +
            '    See also the IB_FILTER environment option.\n' +
            '\n' +
            '  --exclude=VALUE\n' +
            '\n' +
            '    Add property name filter to exclude names.\n' +
            '\n' +
            '    See also the IB_FILTER environment option.\n' +
            '\n' +
            '  --domain=DOMAIN\n' +
            '\n' +
            '    The domain to use. This is by default “hosts”.\n' +
            '\n' +
            '    See also the IB_DOMAIN environment option.\n');
    };
    Main.printShortUsage = function () {
        console.log('\n' +
            'ib [OPTION(S)] [create]\n' +
            '\n' +
            'ib [OPTION(S)] [list]\n' +
            '\n' +
            'ib [OPTION(S)] [get] UUID|NAME [[OBJ.]KEY[:FORMAT]][ [[OBJ2.]KEY2[:FORMAT]] ...]\n' +
            '\n' +
            'ib [OPTION(S)] [set] UUID|NAME [OBJ.]KEY[:TYPE]=VALUE [[OBJ2.]KEY2[:TYPE2]=VALUE2 ...]\n' +
            '\n' +
            'ib [OPTION(S)] delete UUID|NAME\n' +
            '\n' +
            'Check \'ib --help\' for full usage.\n');
    };
    Main.run = function () {
        var args = ProcessUtils_1["default"].getArguments();
        if (lodash_1.some(args, function (item) { return item === '--help' || item === '-h'; })) {
            Main.printFullUsage();
            return Promise.resolve(0);
        }
        var parsedArgs = InventoryArgumentService_1["default"].parseInventoryArguments(args, {
            propertyFilters: Main._parsePropertyFilterString(env_1.IB_FILTER)
        });
        if (parsedArgs.logLevel !== undefined) {
            LogService_1["default"].setLogLevel(parsedArgs.logLevel);
        }
        LOG.debug('Args: ', parsedArgs);
        switch (parsedArgs.action) {
            case InventoryAction_1["default"].LOGIN: return Main.loginAction(parsedArgs);
            case InventoryAction_1["default"].LOGOUT: return Main.logoutAction(parsedArgs);
            case InventoryAction_1["default"].CREATE: return Main.createAction(parsedArgs);
            case InventoryAction_1["default"].LIST: return Main.listHostsAction(parsedArgs);
            case InventoryAction_1["default"].GET: return Main.getResourceAction(parsedArgs);
            case InventoryAction_1["default"].SET: return Main.setResourceAction(parsedArgs);
            case InventoryAction_1["default"].DELETE: return Main.deleteResourceAction(parsedArgs);
            default:
                throw new TypeError("The action \"" + parsedArgs.action + "\" is unsupported");
        }
    };
    Main.loginAction = function (parsedArgs) {
        throw new TypeError("The login is not supported yet");
    };
    Main.logoutAction = function (parsedArgs) {
        throw new TypeError("The logout is not supported yet");
    };
    Main.listHostsAction = function (parsedArgs) {
        var _a, _b;
        var url = (_a = parsedArgs === null || parsedArgs === void 0 ? void 0 : parsedArgs.url) !== null && _a !== void 0 ? _a : env_1.IB_URL;
        var domain = (_b = parsedArgs === null || parsedArgs === void 0 ? void 0 : parsedArgs.domain) !== null && _b !== void 0 ? _b : env_1.IB_DOMAIN;
        var propertyFilters = parsedArgs === null || parsedArgs === void 0 ? void 0 : parsedArgs.propertyFilters;
        return InventoryClientUtils_1["default"].listHosts({
            url: url,
            domain: domain
        }).then(function (response) {
            console.log(Main._stringifyOutput(response.items, InventoryArgumentService_1.InventoryOutputFormat.DEFAULT, propertyFilters));
            return 0;
        });
    };
    Main.getResourceAction = function (parsedArgs) {
        var _this = this;
        var _a, _b, _c;
        var url = (_a = parsedArgs === null || parsedArgs === void 0 ? void 0 : parsedArgs.url) !== null && _a !== void 0 ? _a : env_1.IB_URL;
        var domain = (_b = parsedArgs === null || parsedArgs === void 0 ? void 0 : parsedArgs.domain) !== null && _b !== void 0 ? _b : env_1.IB_DOMAIN;
        var resource = (_c = parsedArgs === null || parsedArgs === void 0 ? void 0 : parsedArgs.resource) !== null && _c !== void 0 ? _c : env_1.IB_DOMAIN;
        var propertyFilters = parsedArgs === null || parsedArgs === void 0 ? void 0 : parsedArgs.propertyFilters;
        var propertyGetActions = parsedArgs === null || parsedArgs === void 0 ? void 0 : parsedArgs.propertyGetActions;
        return InventoryClientUtils_1["default"].getHost({
            url: url,
            domain: domain,
            name: resource
        }).then(function (response) {
            if (propertyGetActions === undefined || propertyGetActions.length === 0) {
                console.log(Main._stringifyOutput(response, InventoryArgumentService_1.InventoryOutputFormat.DEFAULT, propertyFilters));
            }
            else {
                var flatResponse_1 = _this._flattenJson(response);
                if (Json_1.isFlatJsonValue(flatResponse_1)) {
                    throw new TypeError("Only objects and arrays supported with properties.");
                }
                lodash_1.forEach(propertyGetActions, function (action) {
                    var _a;
                    var key = action === null || action === void 0 ? void 0 : action.key;
                    var format = (_a = action === null || action === void 0 ? void 0 : action.format) !== null && _a !== void 0 ? _a : InventoryArgumentService_1.InventoryOutputFormat.DEFAULT;
                    if (!key)
                        throw new TypeError("Action was not correct. Missing key.");
                    if (flatResponse_1 && lodash_1.has(flatResponse_1, key)) {
                        console.log(Main._stringifyOutput(flatResponse_1[key], format, propertyFilters));
                    }
                    else if (lodash_1.has(response, key)) {
                        console.log(Main._stringifyOutput(response[key], format, propertyFilters));
                    }
                    else {
                        throw new TypeError("Key \"" + key + "\" not found from the response.");
                    }
                });
            }
            return 0;
        });
    };
    Main.createAction = function (parsedArgs) {
        var _a, _b;
        var url = (_a = parsedArgs === null || parsedArgs === void 0 ? void 0 : parsedArgs.url) !== null && _a !== void 0 ? _a : env_1.IB_URL;
        var domain = (_b = parsedArgs === null || parsedArgs === void 0 ? void 0 : parsedArgs.domain) !== null && _b !== void 0 ? _b : env_1.IB_DOMAIN;
        var resource = parsedArgs === null || parsedArgs === void 0 ? void 0 : parsedArgs.resource;
        var propertySetActions = parsedArgs === null || parsedArgs === void 0 ? void 0 : parsedArgs.propertySetActions;
        var propertyFilters = parsedArgs === null || parsedArgs === void 0 ? void 0 : parsedArgs.propertyFilters;
        // let data : InventoryData = propertySetActions ? Main._createObjectFromSetActions(propertySetActions, {}) : {};
        if (resource)
            throw new TypeError("Host create is not implemented. Use 'set' action.");
        return InventoryClientUtils_1["default"].createDomain({
            url: url,
            domain: domain
        }).then(function (response) {
            console.log(Main._stringifyOutput(response, InventoryArgumentService_1.InventoryOutputFormat.DEFAULT, propertyFilters));
            return 0;
        });
    };
    Main.setResourceAction = function (parsedArgs) {
        var _a, _b;
        var url = (_a = parsedArgs === null || parsedArgs === void 0 ? void 0 : parsedArgs.url) !== null && _a !== void 0 ? _a : env_1.IB_URL;
        var domain = (_b = parsedArgs === null || parsedArgs === void 0 ? void 0 : parsedArgs.domain) !== null && _b !== void 0 ? _b : env_1.IB_DOMAIN;
        var resource = parsedArgs === null || parsedArgs === void 0 ? void 0 : parsedArgs.resource;
        var propertySetActions = parsedArgs === null || parsedArgs === void 0 ? void 0 : parsedArgs.propertySetActions;
        var propertyFilters = parsedArgs === null || parsedArgs === void 0 ? void 0 : parsedArgs.propertyFilters;
        if (!resource)
            throw new TypeError("No resource name defined.");
        var data = propertySetActions ? Main._createObjectFromSetActions(propertySetActions, {}) : {};
        return InventoryClientUtils_1["default"].updateHost({
            url: url,
            domain: domain,
            name: resource,
            data: data
        }).then(function (response) {
            console.log(Main._stringifyOutput(response, InventoryArgumentService_1.InventoryOutputFormat.DEFAULT, propertyFilters));
            return 0;
        });
    };
    Main.deleteResourceAction = function (parsedArgs) {
        var _a, _b, _c;
        var url = (_a = parsedArgs === null || parsedArgs === void 0 ? void 0 : parsedArgs.url) !== null && _a !== void 0 ? _a : env_1.IB_URL;
        var domain = (_b = parsedArgs === null || parsedArgs === void 0 ? void 0 : parsedArgs.domain) !== null && _b !== void 0 ? _b : env_1.IB_DOMAIN;
        var resource = (_c = parsedArgs === null || parsedArgs === void 0 ? void 0 : parsedArgs.resource) !== null && _c !== void 0 ? _c : env_1.IB_DOMAIN;
        var propertyFilters = parsedArgs === null || parsedArgs === void 0 ? void 0 : parsedArgs.propertyFilters;
        return InventoryClientUtils_1["default"].deleteHost({
            url: url,
            domain: domain,
            name: resource
        }).then(function (response) {
            console.log(Main._stringifyOutput(response.changed, InventoryArgumentService_1.InventoryOutputFormat.DEFAULT, propertyFilters));
            return 0;
        });
    };
    Main._jsonStringifyOutput = function (value) {
        try {
            return JSON.stringify(value);
        }
        catch (err) {
            throw new TypeError("Cannot stringify value \"" + value + "\" as JSON: " + err);
        }
    };
    Main._jsonParseInput = function (value) {
        try {
            return JSON.parse(value);
        }
        catch (err) {
            throw new TypeError("Cannot parse JSON string \"" + value + ": " + err);
        }
    };
    Main._stringifyOutput = function (value, type, propertyFilters) {
        switch (type) {
            case InventoryArgumentService_1.InventoryOutputFormat.STRING:
                return "" + value;
            case InventoryArgumentService_1.InventoryOutputFormat.RECORD:
                return this._stringifyRecord(value, propertyFilters);
            case InventoryArgumentService_1.InventoryOutputFormat.JSON:
                return this._jsonStringifyOutput(value);
            case InventoryArgumentService_1.InventoryOutputFormat.OBJECT:
                return this._jsonStringifyOutput(value);
            case InventoryArgumentService_1.InventoryOutputFormat.ARRAY:
                return this._jsonStringifyOutput(value);
            case InventoryArgumentService_1.InventoryOutputFormat.BOOLEAN:
                return this._jsonStringifyOutput(value);
            case InventoryArgumentService_1.InventoryOutputFormat.NUMBER:
                return this._jsonStringifyOutput(value);
            case InventoryArgumentService_1.InventoryOutputFormat.INTEGER:
                return this._jsonStringifyOutput(value);
            case InventoryArgumentService_1.InventoryOutputFormat.DEFAULT:
                if (lodash_1.isString(value))
                    return this._stringifyOutput(value, InventoryArgumentService_1.InventoryOutputFormat.STRING, propertyFilters);
                if (lodash_1.isObject(value))
                    return this._stringifyOutput(value, InventoryArgumentService_1.InventoryOutputFormat.RECORD, propertyFilters);
                return this._jsonStringifyOutput(value);
        }
        throw new TypeError("The output type \"" + type + "\" is not implemented for stringifier.");
    };
    /**
     *
     * @param obj
     * @param key
     * @param value
     * @private
     */
    Main._flattenJsonAny = function (obj, key, value) {
        var _a;
        // JSON doesn't have undefined values (except you could think of properties which are not defined as same thing)
        if (value === undefined)
            return obj;
        if (Json_1.isReadonlyJsonArray(value)) {
            return this._flattenJsonArray(obj, key, value);
        }
        if (Json_1.isReadonlyJsonSerializable(value)) {
            return this._flattenJsonAny(obj, key, value.toJSON());
        }
        if (Json_1.isReadonlyJsonObject(value)) {
            return this._flattenJsonObject(obj, key, value);
        }
        return __assign(__assign({}, obj), (_a = {}, _a[key] = value, _a));
    };
    Main._flattenJsonArray = function (obj, key, value) {
        var _this = this;
        return lodash_1.reduce(value, function (obj, item, index) { return _this._flattenJsonAny(obj, key + '#' + index, item); }, obj);
    };
    Main._flattenJsonObject = function (obj, key, value) {
        var _this = this;
        return lodash_1.reduce(lodash_1.keys(value), function (obj, propertyKey) { return _this._flattenJsonAny(obj, key ? key + '.' + propertyKey : propertyKey, value[propertyKey]); }, obj);
    };
    Main._flattenJson = function (value) {
        if (Json_1.isFlatJsonValue(value))
            return value;
        return this._flattenJsonAny({}, "", value);
    };
    Main._stringifyRecord = function (value, propertyFilters) {
        if (lodash_1.isArray(value)) {
            return lodash_1.map(value, function (item) {
                var _a;
                var id = item === null || item === void 0 ? void 0 : item.$id;
                var name = (_a = item === null || item === void 0 ? void 0 : item.$name) !== null && _a !== void 0 ? _a : id;
                return name + "\t" + Main._stringifyRecord(item, propertyFilters).replace(/\n/g, '\t');
            }).join('\n');
        }
        if (lodash_1.isObject(value)) {
            var flatValue_1 = this._flattenJson(value);
            if (!Json_1.isReadonlyJsonObject(flatValue_1)) { // FIXME: Change to flat test
                throw new TypeError('flatValue was not ReadonlyJsonObject');
            }
            var propertyKeys = propertyFilters ? Main._getFilteredKeys(lodash_1.keys(flatValue_1), propertyFilters) : lodash_1.keys(flatValue_1);
            return lodash_1.map(propertyKeys, function (key) {
                var keyValue = flatValue_1[key];
                var keyValueString = Main._stringifyRecord(keyValue, propertyFilters);
                return key + "=" + keyValueString;
            }).join('\n');
        }
        if (lodash_1.isString(value)) {
            return value;
        }
        return Main._jsonStringifyOutput(value);
    };
    Main._createObjectFromSetActions = function (actions, object) {
        lodash_1.forEach(actions, function (item) {
            var _a;
            var _b;
            if (item.key) {
                object = __assign(__assign({}, object), (_a = {}, _a[item.key] = item.value ? Main._createValueFromType(item.value, (_b = item.type) !== null && _b !== void 0 ? _b : InventoryArgumentService_1.InventoryInputType.STRING) : undefined, _a));
            }
        });
        return object;
    };
    Main._createValueFromType = function (value, type) {
        switch (type) {
            case InventoryArgumentService_1.InventoryInputType.STRING: return value;
            case InventoryArgumentService_1.InventoryInputType.JSON: return Main._jsonParseInput(value);
            case InventoryArgumentService_1.InventoryInputType.OBJECT: return Main._jsonParseInput(value);
            case InventoryArgumentService_1.InventoryInputType.ARRAY: return Main._jsonParseInput(value);
            case InventoryArgumentService_1.InventoryInputType.BOOLEAN: return Main._jsonParseInput(value);
            case InventoryArgumentService_1.InventoryInputType.NUMBER: return Main._jsonParseInput(value);
            case InventoryArgumentService_1.InventoryInputType.INTEGER: return Main._jsonParseInput(value);
            case InventoryArgumentService_1.InventoryInputType.NULL: return null;
            default: throw new TypeError("Unsupported input type \"" + type + "\"");
        }
    };
    Main._getFilteredKeys = function (propertyKeys, propertyFilters) {
        var keys = [].concat(propertyKeys);
        lodash_1.forEach(propertyFilters, function (item) {
            switch (item.type) {
                case InventoryArgumentService_1.PropertyFilterType.INCLUDE:
                    keys = lodash_1.filter(keys, function (key) { return !Main._isKeyMatch(key, item.name); });
                    keys = lodash_1.concat(keys, lodash_1.filter(propertyKeys, function (key) { return Main._isKeyMatch(key, item.name); }));
                    break;
                case InventoryArgumentService_1.PropertyFilterType.EXCLUDE:
                    keys = lodash_1.filter(keys, function (key) { return !Main._isKeyMatch(key, item.name); });
                    break;
            }
        });
        return keys;
    };
    Main._isKeyMatch = function (key, rule) {
        var parts = key.split('.').map(function (item) { return lodash_1.trim(item); });
        return lodash_1.some(parts, function (item) {
            if (rule[rule.length - 1] === '*') {
                return item.startsWith(rule.substr(0, rule.length - 1));
            }
            else {
                return item === rule;
            }
        });
    };
    Main._parsePropertyFilterString = function (value) {
        var parts = value.split(' ').map(function (item) { return lodash_1.trim(item); }).filter(function (item) { return !!item; });
        return lodash_1.reduce(parts, function (list, item) {
            if (item[0] === '-') {
                list.push({
                    type: InventoryArgumentService_1.PropertyFilterType.EXCLUDE,
                    name: item.substr(1)
                });
            }
            else {
                list.push({
                    type: InventoryArgumentService_1.PropertyFilterType.INCLUDE,
                    name: item
                });
            }
            return list;
        }, []);
    };
    return Main;
}());
exports.Main = Main;
exports["default"] = Main;
//# sourceMappingURL=Main.js.map