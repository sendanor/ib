import {ClientRequest, IncomingMessage} from "http";
import LogService from "./LogService";

const LOG = LogService.createLogger('HttpClientUtils');

export enum HttpMethod {
    GET    = 'GET',
    POST   = 'POST',
    PUT    = 'PUT',
    PATCH  = 'PATCH',
    DELETE = 'DELETE'
}

export interface HttpClientResponseObject {

    readonly status  : number;

    readonly headers : Record<string, string>;

    readonly data    ?: any;

}

export class HttpClientUtils {

    private static _HTTP : any | undefined = undefined;
    private static _URL  : any | undefined = undefined;

    public static setUrlModule (url: any) {

        this._URL = url;

    }

    public static setHttpModule (http: any) {

        this._HTTP = http;

    }

    public static encodeURIComponent (value : string) : string {
        return encodeURIComponent(value);
    }

    public static stringifyHttpMethod (method : HttpMethod) : string {

        switch (method) {
            case HttpMethod.GET    : return 'GET';
            case HttpMethod.POST   : return 'POST';
            case HttpMethod.PUT    : return 'PUT';
            case HttpMethod.PATCH  : return 'PATCH';
            case HttpMethod.DELETE : return 'DELETE';
        }

        throw new TypeError(`The method is not supported: ${method}`);

    }

    public static jsonRequest (method: HttpMethod, url: string, body: any = undefined) : Promise<HttpClientResponseObject> {

        const postDataString : string | undefined = body !== undefined ? this._jsonStringify(body) : undefined;

        LOG.debug('The request data string: ', postDataString);
        LOG.debug('The request URL method: ', method);
        LOG.debug('The request URL string: ', url);

        const urlObject : URL = new this._URL.URL(url);

        const protocol : string | undefined = urlObject?.protocol;

        if (protocol !== "http:") {
            throw new TypeError(`The protocol "${protocol}" in URL "${url}" is not yet supported.`);
        }

        return new Promise((resolve, reject) => {
            try {

                const options = {
                    hostname : urlObject.hostname,
                    port     : urlObject.port      ?? 80,
                    path     : (urlObject.pathname ?? '/') + (urlObject?.search ?? ''),
                    method   : HttpClientUtils.stringifyHttpMethod(method),
                    headers  : {
                        'Content-Type': 'application/json',
                        'Content-Length': postDataString !== undefined ? Buffer.byteLength(postDataString) : 0
                    }
                };

                const req : ClientRequest = this._HTTP.request(options, (res: IncomingMessage) => {

                    const chunks : Array<Buffer> = [];

                    res.on('data', (chunk : Buffer) => {
                        try {
                            chunks.push(chunk);
                        } catch (e) {
                            reject(e);
                        }
                    });

                    res.on('end', () => {
                        try {

                            const allChunks : Buffer = Buffer.concat(chunks);

                            const bodyString : string = allChunks.toString('utf8');

                            const body : any = this._jsonParse(bodyString);

                            const statusCode = res?.statusCode ?? 0;

                            if ( statusCode >= 200 && statusCode < 400 ) {
                                resolve({
                                    status  : res?.statusCode ?? 0,
                                    headers : (res?.headers ?? {}) as Record<string, string>,
                                    data    : body
                                });
                            } else {
                                reject({
                                    status  : res?.statusCode ?? 0,
                                    headers : (res?.headers ?? {}) as Record<string, string>,
                                    data    : body
                                });
                            }

                        } catch (e) {
                            reject(e);
                        }
                    });

                });

                req.on('error', (e : any) => {
                    reject(e);
                });

                if (postDataString !== undefined) {
                    req.write(postDataString);
                }

                req.end();

            } catch (e) {
                reject(e);
            }
        });

    }

    private static _jsonStringify (value : any) : string {

        try {
            return JSON.stringify(value);
        } catch(err) {
            throw new TypeError(`Failed to stringify "${value}" as JSON: ${err}`);
        }

    }

    private static _jsonParse (value : string) : any {

        try {
            return JSON.parse(value);
        } catch(err) {
            throw new TypeError(`Failed to parse JSON string "${value}": ${err}`);
        }

    }

}

export default HttpClientUtils;
