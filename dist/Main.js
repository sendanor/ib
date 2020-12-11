"use strict";
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
var ProcessUtils_1 = __importDefault(require("./services/ProcessUtils"));
var InventoryArgumentService_1 = __importStar(require("./services/InventoryArgumentService"));
var lodash_1 = require("./modules/lodash");
var InventoryAction_1 = __importDefault(require("./types/InventoryAction"));
var InventoryClientUtils_1 = __importDefault(require("./services/InventoryClientUtils"));
var env_1 = require("./constants/env");
var LogService_1 = __importDefault(require("./services/LogService"));
var LOG = LogService_1["default"].createLogger('Main');
var Main = /** @class */ (function () {
    function Main() {
    }
    Main.printUsage = function () {
        console.log('\n' +
            'ib [OPTION(S)] [list]\n' +
            '    List inventory items in the group.\n' +
            '\n' +
            'ib [OPTION(S)] [get] UUID|NAME [[OBJ.]KEY[:FORMAT]][ [[OBJ2.]KEY2[:FORMAT]] ...]\n' +
            '    Fetch the inventory object (or specific properties from it).\n' +
            '    If properties are defined, only those will be returned, one at a line.\n' +
            '    See also Output Formats for FORMAT.\n' +
            '\n' +
            'ib [OPTION(S)] [set] UUID|NAME [OBJ.]KEY[:TYPE]=VALUE\n' +
            '    Set a property in a host object.\n' +
            '    See also Input Types for TYPE.\n' +
            '\n' +
            'ib [OPTION(S)] delete UUID|NAME\n' +
            '    Delete a host object\n' +
            '\n' +
            'Where OPTION(S) are:\n' +
            '\n' +
            '  --url=URL\n' +
            '    The URL to the backend.\n' +
            '    Defaults to “http://localhost/ib”.\n' +
            '    See also the IB_URL environment option.\n' +
            '\n' +
            '  --group=GROUP\n' +
            '    The group to use. This is by default “hosts”.\n' +
            '    See also the IB_GROUP environment option.\n');
    };
    Main.run = function () {
        var args = ProcessUtils_1["default"].getArguments();
        if (lodash_1.some(args, function (item) { return item === '--help' || item === '-h'; })) {
            Main.printUsage();
            return Promise.resolve(0);
        }
        var parsedArgs = InventoryArgumentService_1["default"].parseInventoryArguments(args);
        LOG.debug('Args: ', parsedArgs);
        switch (parsedArgs.action) {
            case InventoryAction_1["default"].LOGIN: return Main.loginAction(parsedArgs);
            case InventoryAction_1["default"].LOGOUT: return Main.logoutAction(parsedArgs);
            case InventoryAction_1["default"].LIST: return Main.listGroupAction(parsedArgs);
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
    Main.listGroupAction = function (parsedArgs) {
        var _a, _b;
        var url = (_a = parsedArgs === null || parsedArgs === void 0 ? void 0 : parsedArgs.url) !== null && _a !== void 0 ? _a : env_1.IB_URL;
        var group = (_b = parsedArgs === null || parsedArgs === void 0 ? void 0 : parsedArgs.group) !== null && _b !== void 0 ? _b : env_1.IB_GROUP;
        return InventoryClientUtils_1["default"].listHosts({
            url: url,
            group: group
        }).then(function (response) {
            console.log(Main._stringifyOutput(response.hosts, InventoryArgumentService_1.InventoryOutputFormat.DEFAULT));
            return 0;
        });
    };
    Main.getResourceAction = function (parsedArgs) {
        var _a, _b, _c;
        var url = (_a = parsedArgs === null || parsedArgs === void 0 ? void 0 : parsedArgs.url) !== null && _a !== void 0 ? _a : env_1.IB_URL;
        var group = (_b = parsedArgs === null || parsedArgs === void 0 ? void 0 : parsedArgs.group) !== null && _b !== void 0 ? _b : env_1.IB_GROUP;
        var resource = (_c = parsedArgs === null || parsedArgs === void 0 ? void 0 : parsedArgs.resource) !== null && _c !== void 0 ? _c : env_1.IB_GROUP;
        return InventoryClientUtils_1["default"].getHost({
            url: url,
            group: group,
            resource: resource
        }).then(function (response) {
            console.log(Main._stringifyOutput(response.data, InventoryArgumentService_1.InventoryOutputFormat.DEFAULT));
            return 0;
        });
    };
    Main.setResourceAction = function (parsedArgs) {
        var _a, _b;
        var url = (_a = parsedArgs === null || parsedArgs === void 0 ? void 0 : parsedArgs.url) !== null && _a !== void 0 ? _a : env_1.IB_URL;
        var group = (_b = parsedArgs === null || parsedArgs === void 0 ? void 0 : parsedArgs.group) !== null && _b !== void 0 ? _b : env_1.IB_GROUP;
        var resource = parsedArgs === null || parsedArgs === void 0 ? void 0 : parsedArgs.resource;
        var propertySetActions = parsedArgs === null || parsedArgs === void 0 ? void 0 : parsedArgs.propertySetActions;
        if (!resource)
            throw new TypeError("No resource name defined.");
        var data = propertySetActions ? Main._createObjectFromSetActions(propertySetActions, {}) : {};
        return InventoryClientUtils_1["default"].updateHost({
            url: url,
            group: group,
            resource: resource,
            data: data
        }).then(function (response) {
            console.log(Main._stringifyOutput(response.data, InventoryArgumentService_1.InventoryOutputFormat.DEFAULT));
            return 0;
        });
    };
    Main.deleteResourceAction = function (parsedArgs) {
        var _a, _b, _c;
        var url = (_a = parsedArgs === null || parsedArgs === void 0 ? void 0 : parsedArgs.url) !== null && _a !== void 0 ? _a : env_1.IB_URL;
        var group = (_b = parsedArgs === null || parsedArgs === void 0 ? void 0 : parsedArgs.group) !== null && _b !== void 0 ? _b : env_1.IB_GROUP;
        var resource = (_c = parsedArgs === null || parsedArgs === void 0 ? void 0 : parsedArgs.resource) !== null && _c !== void 0 ? _c : env_1.IB_GROUP;
        return InventoryClientUtils_1["default"].deleteHost({
            url: url,
            group: group,
            resource: resource
        }).then(function (response) {
            console.log(Main._stringifyOutput(response.changed, InventoryArgumentService_1.InventoryOutputFormat.DEFAULT));
            return 0;
        });
    };
    Main._jsonStringifyOutput = function (value) {
        try {
            return JSON.stringify(value);
        }
        catch (err) {
            throw new TypeError("Cannot JSON stringify value \"" + value + ": " + err);
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
    Main._stringifyOutput = function (value, type) {
        switch (type) {
            case InventoryArgumentService_1.InventoryOutputFormat.STRING:
                return "" + value;
            case InventoryArgumentService_1.InventoryOutputFormat.RECORD:
                return "" + this._jsonStringifyOutput(value);
            case InventoryArgumentService_1.InventoryOutputFormat.JSON:
                return "" + this._jsonStringifyOutput(value);
            case InventoryArgumentService_1.InventoryOutputFormat.OBJECT:
                return "" + this._jsonStringifyOutput(value);
            case InventoryArgumentService_1.InventoryOutputFormat.ARRAY:
                return "" + this._jsonStringifyOutput(value);
            case InventoryArgumentService_1.InventoryOutputFormat.BOOLEAN:
                return "" + this._jsonStringifyOutput(value);
            case InventoryArgumentService_1.InventoryOutputFormat.NUMBER:
                return "" + this._jsonStringifyOutput(value);
            case InventoryArgumentService_1.InventoryOutputFormat.INTEGER:
                return "" + this._jsonStringifyOutput(value);
            case InventoryArgumentService_1.InventoryOutputFormat.DEFAULT:
                return "" + this._jsonStringifyOutput(value);
        }
        throw new TypeError("The output type \"" + type + "\" is not implemented for stringifier.");
    };
    Main._createObjectFromSetActions = function (actions, object) {
        lodash_1.forEach(actions, function (item) {
            var _a;
            if (item.key) {
                object[item.key] = item.value ? Main._createValueFromType(item.value, (_a = item.type) !== null && _a !== void 0 ? _a : InventoryArgumentService_1.InventoryInputType.STRING) : undefined;
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
    return Main;
}());
exports.Main = Main;
exports["default"] = Main;
//# sourceMappingURL=Main.js.map