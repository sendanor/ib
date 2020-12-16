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
exports.InventoryClientUtils = void 0;
var HttpClientUtils_1 = __importStar(require("./HttpClientUtils"));
var AssertUtils_1 = __importDefault(require("./AssertUtils"));
var LogService_1 = __importDefault(require("./LogService"));
var lodash_1 = require("../modules/lodash");
var LOG = LogService_1["default"].createLogger('InventoryClientUtils');
/**
 * Utility services to implement Inventory Clients
 */
var InventoryClientUtils = /** @class */ (function () {
    function InventoryClientUtils() {
    }
    InventoryClientUtils.updateHost = function (request) {
        AssertUtils_1["default"].isRegularObject(request);
        AssertUtils_1["default"].isRegularObject(request.data);
        AssertUtils_1["default"].isString(request.url);
        AssertUtils_1["default"].isString(request.domain);
        AssertUtils_1["default"].isString(request.name);
        var url = InventoryClientUtils.getHostListUrl(request.url, request.domain);
        var name = request === null || request === void 0 ? void 0 : request.name;
        if (!name)
            throw new TypeError('The resource name is required.');
        var data = {
            name: name,
            data: request.data
        };
        return HttpClientUtils_1["default"].jsonRequest(HttpClientUtils_1.HttpMethod.PATCH, url, data).then(function (httpResponse) {
            var backendResponse = httpResponse.data;
            var payload = backendResponse.payload;
            var item = payload.data;
            LOG.debug('PATCH: item, backendResponse, httpResponse = ', item, backendResponse, httpResponse);
            if (!item)
                throw new TypeError('Backend payload did not have inventory data');
            return __assign(__assign({}, item), { $request: request, $response: backendResponse, $payload: payload, $id: payload.id, $name: payload.name, $data: item });
        });
    };
    InventoryClientUtils.deleteHost = function (request) {
        AssertUtils_1["default"].isRegularObject(request);
        AssertUtils_1["default"].isString(request.url);
        AssertUtils_1["default"].isString(request.domain);
        AssertUtils_1["default"].isString(request.name);
        var url = InventoryClientUtils.getHostUrl(request.url, request.domain, request.name);
        return HttpClientUtils_1["default"].jsonRequest(HttpClientUtils_1.HttpMethod.DELETE, url).then(function (httpResponse) {
            var _a;
            var backendResponse = httpResponse.data;
            var payload = (_a = backendResponse === null || backendResponse === void 0 ? void 0 : backendResponse.payload) !== null && _a !== void 0 ? _a : undefined;
            LOG.debug('DELETE: payload, backendResponse, httpResponse = ', payload, backendResponse, httpResponse);
            return {
                $request: request,
                $response: backendResponse,
                $payload: payload,
                changed: backendResponse.changed
            };
        });
    };
    InventoryClientUtils.listHosts = function (request) {
        AssertUtils_1["default"].isRegularObject(request);
        AssertUtils_1["default"].isString(request.url);
        AssertUtils_1["default"].isString(request.domain);
        if (request.page !== undefined)
            AssertUtils_1["default"].isNumber(request.page);
        if (request.size !== undefined)
            AssertUtils_1["default"].isNumber(request.size);
        var url = InventoryClientUtils.getHostListUrl(request.url, request.domain, request.page, request.size);
        return HttpClientUtils_1["default"].jsonRequest(HttpClientUtils_1.HttpMethod.GET, url).then(function (httpResponse) {
            var backendResponse = httpResponse.data;
            var payload = backendResponse.payload;
            LOG.debug('LIST: payload, backendResponse, httpResponse = ', payload, backendResponse, httpResponse);
            // FIXME: Add assert and/or type hint check for ReadonlyArray<InventoryItem>
            var items = lodash_1.map(payload.hosts, function (item) {
                var data = item.data;
                if (!data)
                    throw new TypeError("Item \"" + (item === null || item === void 0 ? void 0 : item.id) + "\" in the response did not have data property!");
                return __assign(__assign({}, data), { $id: item.id, $name: item.name, $data: item.data });
            });
            return {
                $request: request,
                $response: backendResponse,
                $payload: payload,
                items: items,
                totalCount: payload.totalCount,
                pageCount: payload.pageCount
            };
        });
    };
    InventoryClientUtils.getHost = function (request) {
        AssertUtils_1["default"].isRegularObject(request);
        AssertUtils_1["default"].isString(request.url);
        AssertUtils_1["default"].isString(request.domain);
        AssertUtils_1["default"].isString(request.name);
        var url = InventoryClientUtils.getHostUrl(request.url, request.domain, request.name);
        return HttpClientUtils_1["default"].jsonRequest(HttpClientUtils_1.HttpMethod.GET, url).then(function (httpResponse) {
            var backendResponse = httpResponse.data;
            var payload = backendResponse.payload;
            var item = payload.data;
            if (!item)
                throw new TypeError('No inventory data in the response');
            LOG.debug('GET: payload= ', payload, ' | backendResponse=', backendResponse, ' | httpResponse=', httpResponse);
            return __assign(__assign({}, item), { $request: request, $response: backendResponse, $payload: payload, $id: payload.id, $name: payload.name, $data: item });
        });
    };
    InventoryClientUtils.q = function (value) {
        return HttpClientUtils_1["default"].encodeURIComponent(value);
    };
    InventoryClientUtils.getHostListUrl = function (url, domain, page, size) {
        if (page === void 0) { page = undefined; }
        if (size === void 0) { size = undefined; }
        var params = [];
        if (page !== undefined) {
            params.push("page=" + this.q('' + page));
        }
        if (size !== undefined) {
            params.push("size=" + this.q('' + size));
        }
        return InventoryClientUtils.getDomainUrl(url, domain) + '/hosts' + (params.length ? "?" + params.join('&') : '');
    };
    InventoryClientUtils.getHostUrl = function (url, domain, name) {
        return InventoryClientUtils.getDomainUrl(url, domain) + "/hosts/" + this.q(name);
    };
    InventoryClientUtils.getDomainUrl = function (url, domain) {
        return url + "/domains/" + this.q(domain);
    };
    return InventoryClientUtils;
}());
exports.InventoryClientUtils = InventoryClientUtils;
exports["default"] = InventoryClientUtils;
//# sourceMappingURL=InventoryClientUtils.js.map