// Copyright (c) 2020 Sendanor. All rights reserved.

import HttpClientUtils, {HttpResponse, HttpMethod} from "./HttpClientUtils";
import AssertUtils from "./AssertUtils";
import LogService from "./LogService";
import InventoryData from "../types/InventoryData";

const LOG = LogService.createLogger('InventoryClientUtils');

export interface ListPayload<T> {

    totalCount : number;
    pageCount : number;
    hosts : Array<T>;

}

export interface ItemPayload<T> {

    id   : string;
    name : string;
    data : T;

}

export interface BackendResponse<T> {

    timestamp : string;
    payload   : T;
    changed   : boolean;

}

export interface InventoryClientUpdateRequestObject {

    readonly url      : string;
    readonly domain    : string;
    readonly resource : string;
    readonly data     : InventoryData;

}

export interface InventoryClientUpdateResponseObject {

    readonly request  : InventoryClientUpdateRequestObject;

    readonly id       : string;
    readonly name     : string;
    readonly data     : InventoryData;

}

export interface InventoryClientListRequestObject {

    readonly url   : string;
    readonly domain : string;

}

export interface InventoryClientFetchRequestObject {

    readonly url      : string;
    readonly domain    : string;
    readonly resource : string;

}

export interface InventoryClientFetchResponse {

    readonly request    : InventoryClientFetchRequestObject;
    readonly data       : InventoryData;

}

export interface InventoryClientListResponse {

    readonly request    : InventoryClientListRequestObject;
    readonly hosts      : Array<InventoryData>;
    readonly totalCount : number;
    readonly pageCount  : number;

}

export interface InventoryClientGetRequestObject {

    readonly url        : string;
    readonly domain      : string;
    readonly resource   : string;

}

export interface InventoryClientGetResponse {

    readonly request : InventoryClientGetRequestObject;
    readonly data    : Readonly<InventoryData>;

}

export interface InventoryClientSetRequestObject {

    readonly url        : string;
    readonly domain : string;
    readonly resource   : string;

}

export interface InventoryClientSetResponse {

    readonly request : InventoryClientSetRequestObject;
    readonly payload : Readonly<Record<string, any>>;
    readonly changed : boolean;

}

export interface InventoryClientDeleteRequestObject {

    readonly url        : string;
    readonly domain : string;
    readonly resource   : string;

}

export interface InventoryClientDeleteResponse {

    readonly request    : InventoryClientDeleteRequestObject;
    readonly changed    : boolean;

}

export class InventoryClientUtils {

    public static updateHost (request : InventoryClientUpdateRequestObject) : Promise<InventoryClientUpdateResponseObject> {

        AssertUtils.isObject(request);
        AssertUtils.isObject(request.data);
        AssertUtils.isString(request.url);
        AssertUtils.isString(request.domain);
        AssertUtils.isString(request.resource);

        const url = `${ request.url }/${ this.q(request.domain) }`;

        const name = request?.resource;

        if (!name) throw new TypeError('The resource name is required.');

        const data = {
            name: name,
            data: request.data
        };

        return HttpClientUtils.jsonRequest(HttpMethod.PATCH, url, data).then((response: HttpResponse<BackendResponse<ItemPayload<InventoryData>>>) : InventoryClientUpdateResponseObject => {

            LOG.debug('response = ', response);

            const data    : BackendResponse<ItemPayload<InventoryData>> = response.data;
            const payload : ItemPayload<InventoryData>                  = data.payload;

            return {
                request: request,
                id: payload.id,
                name: payload.name,
                data: payload.data
            };

        });

    }

    public static deleteHost (request : InventoryClientDeleteRequestObject) : Promise<InventoryClientDeleteResponse> {

        AssertUtils.isObject(request);
        AssertUtils.isString(request.url);
        AssertUtils.isString(request.domain);
        AssertUtils.isString(request.resource);

        const url = `${ request.url }/${ this.q(request.domain) }/${ this.q(request.resource) }`;

        return HttpClientUtils.jsonRequest(HttpMethod.DELETE, url).then((response: HttpResponse<any>) : InventoryClientDeleteResponse => {

            const payload = response?.data?.payload ?? undefined;

            return {
                request: request,
                changed: payload.changed
            };

        });

    }

    public static listHosts (request : InventoryClientListRequestObject) : Promise<InventoryClientListResponse> {

        AssertUtils.isObject(request);
        AssertUtils.isString(request.url);
        AssertUtils.isString(request.domain);

        // FIXME: Add support for changing these from the command line
        const page = 1;
        const size = 10;

        const url = `${ request.url }/${ this.q(request.domain) }?page=${this.q(''+page)}&size=${this.q(''+size)}`;

        return HttpClientUtils.jsonRequest(HttpMethod.GET, url).then((response: HttpResponse<BackendResponse<ListPayload<InventoryData>>>) : InventoryClientListResponse => {

            LOG.debug('response = ', response);

            const data : BackendResponse<ListPayload<InventoryData>> = response.data;
            const payload : ListPayload<InventoryData> = data.payload;

            return {
                request: request,
                hosts: payload.hosts,
                totalCount: payload.totalCount,
                pageCount: payload.pageCount
            };

        });

    }

    public static getHost (request : InventoryClientGetRequestObject) : Promise<InventoryClientGetResponse> {

        AssertUtils.isObject(request);
        AssertUtils.isString(request.url);
        AssertUtils.isString(request.domain);
        AssertUtils.isString(request.resource);

        const url = `${ request.url }/${ this.q(request.domain) }/${ this.q(request.resource) }`;

        return HttpClientUtils.jsonRequest(HttpMethod.GET, url).then((response: HttpResponse<any>) : InventoryClientGetResponse => {

            const payload = response?.data?.payload ?? undefined;

            return {
                request : request,
                data    : payload.data
            };

        });

    }

    private static q (value : string) : string {
        return HttpClientUtils.encodeURIComponent(value);
    }

}

export default InventoryClientUtils;
