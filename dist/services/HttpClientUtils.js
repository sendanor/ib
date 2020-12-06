"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.HttpClientUtils = exports.HttpMethod = void 0;
var LogService_1 = __importDefault(require("./LogService"));
var LOG = LogService_1["default"].createLogger('HttpClientUtils');
var HttpMethod;
(function (HttpMethod) {
    HttpMethod["GET"] = "GET";
    HttpMethod["POST"] = "POST";
    HttpMethod["PUT"] = "PUT";
    HttpMethod["PATCH"] = "PATCH";
    HttpMethod["DELETE"] = "DELETE";
})(HttpMethod = exports.HttpMethod || (exports.HttpMethod = {}));
var HttpClientUtils = /** @class */ (function () {
    function HttpClientUtils() {
    }
    HttpClientUtils.setUrlModule = function (url) {
        this._URL = url;
    };
    HttpClientUtils.setHttpModule = function (http) {
        this._HTTP = http;
    };
    HttpClientUtils.encodeURIComponent = function (value) {
        return encodeURIComponent(value);
    };
    HttpClientUtils.stringifyHttpMethod = function (method) {
        switch (method) {
            case HttpMethod.GET: return 'GET';
            case HttpMethod.POST: return 'POST';
            case HttpMethod.PUT: return 'PUT';
            case HttpMethod.PATCH: return 'PATCH';
            case HttpMethod.DELETE: return 'DELETE';
        }
        throw new TypeError("The method is not supported: " + method);
    };
    HttpClientUtils.jsonRequest = function (method, url, body) {
        var _this = this;
        if (body === void 0) { body = undefined; }
        var postDataString = body !== undefined ? this._jsonStringify(body) : undefined;
        LOG.debug('The request method / URL / data: ', method, url, postDataString);
        var urlObject = new this._URL.URL(url);
        var protocol = urlObject === null || urlObject === void 0 ? void 0 : urlObject.protocol;
        if (protocol !== "http:") {
            throw new TypeError("The protocol \"" + protocol + "\" in URL \"" + url + "\" is not yet supported.");
        }
        return new Promise(function (resolve, reject) {
            var _a, _b, _c;
            try {
                var options = {
                    hostname: urlObject.hostname,
                    port: (_a = urlObject.port) !== null && _a !== void 0 ? _a : 80,
                    path: ((_b = urlObject.pathname) !== null && _b !== void 0 ? _b : '/') + ((_c = urlObject === null || urlObject === void 0 ? void 0 : urlObject.search) !== null && _c !== void 0 ? _c : ''),
                    method: HttpClientUtils.stringifyHttpMethod(method),
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': postDataString !== undefined ? Buffer.byteLength(postDataString) : 0
                    }
                };
                var req = _this._HTTP.request(options, function (res) {
                    var chunks = [];
                    res.on('data', function (chunk) {
                        try {
                            chunks.push(chunk);
                        }
                        catch (e) {
                            reject(e);
                        }
                    });
                    res.on('end', function () {
                        var _a, _b, _c, _d, _e;
                        try {
                            var allChunks = Buffer.concat(chunks);
                            var bodyString = allChunks.toString('utf8');
                            var body_1 = _this._jsonParse(bodyString);
                            var statusCode = (_a = res === null || res === void 0 ? void 0 : res.statusCode) !== null && _a !== void 0 ? _a : 0;
                            if (statusCode >= 200 && statusCode < 400) {
                                resolve({
                                    status: (_b = res === null || res === void 0 ? void 0 : res.statusCode) !== null && _b !== void 0 ? _b : 0,
                                    headers: ((_c = res === null || res === void 0 ? void 0 : res.headers) !== null && _c !== void 0 ? _c : {}),
                                    data: body_1
                                });
                            }
                            else {
                                reject({
                                    status: (_d = res === null || res === void 0 ? void 0 : res.statusCode) !== null && _d !== void 0 ? _d : 0,
                                    headers: ((_e = res === null || res === void 0 ? void 0 : res.headers) !== null && _e !== void 0 ? _e : {}),
                                    data: body_1
                                });
                            }
                        }
                        catch (e) {
                            reject(e);
                        }
                    });
                });
                req.on('error', function (e) {
                    reject(e);
                });
                if (postDataString !== undefined) {
                    req.write(postDataString);
                }
                req.end();
            }
            catch (e) {
                reject(e);
            }
        });
    };
    HttpClientUtils._jsonStringify = function (value) {
        try {
            return JSON.stringify(value);
        }
        catch (err) {
            throw new TypeError("Failed to stringify \"" + value + "\" as JSON: " + err);
        }
    };
    HttpClientUtils._jsonParse = function (value) {
        try {
            return JSON.parse(value);
        }
        catch (err) {
            throw new TypeError("Failed to parse JSON string \"" + value + "\": " + err);
        }
    };
    HttpClientUtils._HTTP = undefined;
    HttpClientUtils._URL = undefined;
    return HttpClientUtils;
}());
exports.HttpClientUtils = HttpClientUtils;
exports["default"] = HttpClientUtils;
//# sourceMappingURL=HttpClientUtils.js.map