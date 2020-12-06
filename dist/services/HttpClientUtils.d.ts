export declare enum HttpMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    PATCH = "PATCH",
    DELETE = "DELETE"
}
export interface HttpResponse<T> {
    readonly status: number;
    readonly headers: Record<string, string>;
    readonly data: T;
}
export declare class HttpClientUtils {
    private static _HTTP;
    private static _URL;
    static setUrlModule(url: any): void;
    static setHttpModule(http: any): void;
    static encodeURIComponent(value: string): string;
    static stringifyHttpMethod(method: HttpMethod): string;
    static jsonRequest(method: HttpMethod, url: string, body?: any): Promise<HttpResponse<any>>;
    private static _jsonStringify;
    private static _jsonParse;
}
export default HttpClientUtils;
