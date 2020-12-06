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
exports.InventoryClientUtils = void 0;
var HttpClientUtils_1 = __importStar(require("./HttpClientUtils"));
var AssertUtils_1 = __importDefault(require("./AssertUtils"));
var LogService_1 = __importDefault(require("./LogService"));
var LOG = LogService_1["default"].createLogger('InventoryClientUtils');
var InventoryClientUtils = /** @class */ (function () {
    function InventoryClientUtils() {
    }
    InventoryClientUtils.updateHost = function (request) {
        AssertUtils_1["default"].isObject(request);
        AssertUtils_1["default"].isObject(request.data);
        AssertUtils_1["default"].isString(request.url);
        AssertUtils_1["default"].isString(request.group);
        AssertUtils_1["default"].isString(request.resource);
        var url = request.url + "/" + this.q(request.group);
        var name = request === null || request === void 0 ? void 0 : request.resource;
        if (!name)
            throw new TypeError('The resource name is required.');
        var data = {
            name: name,
            data: request.data
        };
        return HttpClientUtils_1["default"].jsonRequest(HttpClientUtils_1.HttpMethod.PATCH, url, data).then(function (response) {
            LOG.debug('response = ', response);
            var data = response.data;
            var payload = data.payload;
            return {
                request: request,
                id: payload.id,
                name: payload.name,
                data: payload.data
            };
        });
    };
    InventoryClientUtils.listGroup = function (request) {
        AssertUtils_1["default"].isObject(request);
        AssertUtils_1["default"].isString(request.url);
        AssertUtils_1["default"].isString(request.group);
        // FIXME: Add support for changing these from the command line
        var page = 1;
        var size = 10;
        var url = request.url + "/" + this.q(request.group) + "?page=" + this.q('' + page) + "&size=" + this.q('' + size);
        return HttpClientUtils_1["default"].jsonRequest(HttpClientUtils_1.HttpMethod.GET, url).then(function (response) {
            LOG.debug('response = ', response);
            var data = response.data;
            var payload = data.payload;
            return {
                request: request,
                hosts: payload.hosts,
                totalCount: payload.totalCount,
                pageCount: payload.pageCount
            };
        });
    };
    InventoryClientUtils.fetchResource = function (request) {
        AssertUtils_1["default"].isObject(request);
        AssertUtils_1["default"].isString(request.url);
        AssertUtils_1["default"].isString(request.group);
        AssertUtils_1["default"].isString(request.resource);
        var url = request.url + "/" + this.q(request.group) + "/" + this.q(request.resource);
        return HttpClientUtils_1["default"].jsonRequest(HttpClientUtils_1.HttpMethod.GET, url).then(function (response) {
            var _a, _b;
            var payload = (_b = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.payload) !== null && _b !== void 0 ? _b : undefined;
            return {
                request: request,
                payload: payload
            };
        });
    };
    InventoryClientUtils.q = function (value) {
        return HttpClientUtils_1["default"].encodeURIComponent(value);
    };
    return InventoryClientUtils;
}());
exports.InventoryClientUtils = InventoryClientUtils;
exports["default"] = InventoryClientUtils;
//# sourceMappingURL=InventoryClientUtils.js.map