// Copyright (c) 2020 Sendanor. All rights reserved.

import HttpClientUtils, {HttpResponse, HttpMethod} from "./HttpClientUtils";
import AssertUtils from "./AssertUtils";
import LogService from "./LogService";
import InventoryData from "../types/InventoryData";
import {ReadonlyJsonAny, ReadonlyJsonObject} from "../types/Json";
import InventoryItem from "../types/InventoryItem";
import {map} from "../modules/lodash";

const LOG = LogService.createLogger('InventoryClientUtils');

// Generic types for our inventory models

export type InventoryIdType       = string;
export type InventoryTimestamp    = string;
export type InventoryUrlType      = string;
export type InventoryDomainType   = string;
export type InventoryNameType     = string;

// Types for generic backend objects

export interface BackendListPayload< T extends ReadonlyJsonAny > extends ReadonlyJsonObject {

    readonly hosts      : ReadonlyArray<T>;
    readonly totalCount : number;
    readonly pageCount  : number;

}

export interface BackendItemPayload< T extends ReadonlyJsonAny|undefined > extends ReadonlyJsonObject {

    readonly id    : InventoryIdType;
    readonly name  : InventoryNameType;
    readonly data ?: T;

}

export interface BackendResponse<T extends ReadonlyJsonAny|undefined> extends ReadonlyJsonObject {

    readonly timestamp : InventoryTimestamp;
    readonly payload   : T;
    readonly changed   : boolean;

}

// Types for PATCH

export interface InventoryPatchRequest extends ReadonlyJsonObject {

    readonly url      : InventoryUrlType;
    readonly domain   : InventoryDomainType;
    readonly name     : InventoryNameType;
    readonly data     : InventoryData;

}

export interface InventoryPatchResponse extends InventoryItem {

    readonly $request  : InventoryPatchRequest;
    readonly $response : BackendResponse<BackendItemPayload<InventoryData>>;
    readonly $payload  : BackendItemPayload<InventoryData>;
    readonly $data     : InventoryData;

}

// Types for Listing

export interface InventoryListRequest extends ReadonlyJsonObject {

    readonly url    : InventoryUrlType;
    readonly domain : InventoryDomainType;
    readonly page  ?: number;
    readonly size  ?: number;

}

export interface InventoryListResponse {

    readonly $request   : InventoryListRequest;
    readonly $response  : BackendResponse<BackendListPayload<InventoryData>>;
    readonly $payload   : BackendListPayload<InventoryData>;

    readonly items      : ReadonlyArray<InventoryItem>;
    readonly totalCount : number;
    readonly pageCount  : number;

}

// Types for GET

export interface InventoryGetRequest extends ReadonlyJsonObject {

    readonly url     : InventoryUrlType;
    readonly domain  : InventoryDomainType;
    readonly name    : InventoryNameType;

}

export interface InventoryGetResponse extends InventoryItem {

    readonly $request  : InventoryGetRequest;
    readonly $response : BackendResponse<BackendItemPayload<InventoryData>>;
    readonly $payload  : BackendItemPayload<InventoryData>;
    readonly $data     : InventoryData;

}

// Types for DELETE

export interface InventoryDeleteRequest {

    readonly url    : InventoryUrlType;
    readonly domain : InventoryDomainType;
    readonly name   : InventoryNameType;

}

export interface InventoryDeleteResponse {

    readonly $request   : InventoryDeleteRequest;
    readonly $response  : BackendResponse<BackendItemPayload< InventoryData | undefined >>;
    readonly $payload   : BackendItemPayload< InventoryData | undefined >;

    readonly changed    : boolean;

}

/**
 * Utility services to implement Inventory Clients
 */
export class InventoryClientUtils {

    public static updateHost (request : InventoryPatchRequest) : Promise<InventoryPatchResponse> {

        AssertUtils.isRegularObject(request);
        AssertUtils.isRegularObject(request.data);
        AssertUtils.isString(request.url);
        AssertUtils.isString(request.domain);
        AssertUtils.isString(request.name);

        const url = InventoryClientUtils.getHostListUrl(request.url, request.domain);

        const name = request?.name;

        if (!name) throw new TypeError('The resource name is required.');

        const data = {
            name: name,
            data: request.data
        };

        return HttpClientUtils.jsonRequest(HttpMethod.PATCH, url, data).then((httpResponse: HttpResponse<BackendResponse<BackendItemPayload<InventoryData>>>) : InventoryPatchResponse => {

            const backendResponse : BackendResponse<BackendItemPayload<InventoryData>> = httpResponse.data;
            const payload         : BackendItemPayload<InventoryData>                  = backendResponse.payload;
            const item            : InventoryData | undefined                          = payload.data;

            LOG.debug('PATCH: item, backendResponse, httpResponse = ', item, backendResponse, httpResponse);

            if (!item) throw new TypeError('Backend payload did not have inventory data');

            return {
                ...item,
                $request  : request,
                $response : backendResponse,
                $payload  : payload,
                $id       : payload.id,
                $name     : payload.name,
                $data     : item
            };

        });

    }

    public static deleteHost (request : InventoryDeleteRequest) : Promise<InventoryDeleteResponse> {

        AssertUtils.isRegularObject(request);
        AssertUtils.isString(request.url);
        AssertUtils.isString(request.domain);
        AssertUtils.isString(request.name);

        const url = InventoryClientUtils.getHostUrl(request.url, request.domain, request.name);

        return HttpClientUtils.jsonRequest(HttpMethod.DELETE, url).then((httpResponse: HttpResponse<any>) : InventoryDeleteResponse => {

            const backendResponse : BackendResponse<BackendItemPayload<InventoryData>> = httpResponse.data;

            const payload         : BackendItemPayload<InventoryData>                  = backendResponse?.payload ?? undefined;

            LOG.debug('DELETE: payload, backendResponse, httpResponse = ', payload, backendResponse, httpResponse);

            return {
                $request  : request,
                $response : backendResponse,
                $payload  : payload,
                changed   : backendResponse.changed
            };

        });

    }

    public static listHosts (request : InventoryListRequest) : Promise<InventoryListResponse> {

        AssertUtils.isRegularObject(request);
        AssertUtils.isString(request.url);
        AssertUtils.isString(request.domain);
        if (request.page !== undefined) AssertUtils.isNumber(request.page);
        if (request.size !== undefined) AssertUtils.isNumber(request.size);

        const url = InventoryClientUtils.getHostListUrl(request.url, request.domain, request.page, request.size);

        return HttpClientUtils.jsonRequest(HttpMethod.GET, url).then((httpResponse: HttpResponse<BackendResponse<BackendListPayload<BackendItemPayload<InventoryData>>>>) : InventoryListResponse => {

            const backendResponse : BackendResponse<BackendListPayload<BackendItemPayload<InventoryData>>> = httpResponse.data;
            const payload         : BackendListPayload<BackendItemPayload<InventoryData>>                  = backendResponse.payload;

            LOG.debug('LIST: payload, backendResponse, httpResponse = ', payload, backendResponse, httpResponse);

            // FIXME: Add assert and/or type hint check for ReadonlyArray<InventoryItem>

            const items : ReadonlyArray<InventoryItem> = map(payload.hosts, (item : BackendItemPayload<InventoryData>) : InventoryItem => {

                const data : InventoryData | undefined = item.data;

                if (!data) throw new TypeError(`Item "${item?.id}" in the response did not have data property!`);

                return {
                    ...data,
                    $id   : item.id,
                    $name : item.name,
                    $data : item.data
                };

            });

            return {
                $request   : request,
                $response  : backendResponse,
                $payload   : payload,
                items      : items,
                totalCount : payload.totalCount,
                pageCount  : payload.pageCount
            };

        });

    }

    public static getHost (request : InventoryGetRequest) : Promise<InventoryGetResponse> {

        AssertUtils.isRegularObject(request);
        AssertUtils.isString(request.url);
        AssertUtils.isString(request.domain);
        AssertUtils.isString(request.name);

        const url = InventoryClientUtils.getHostUrl(request.url, request.domain, request.name);

        return HttpClientUtils.jsonRequest(HttpMethod.GET, url).then((httpResponse: HttpResponse<any>) : InventoryGetResponse => {

            const backendResponse : BackendResponse<BackendItemPayload<InventoryData>> = httpResponse.data;
            const payload         : BackendItemPayload<InventoryData>                  = backendResponse.payload;
            const item            : InventoryData | undefined                          = payload.data;

            if (!item) throw new TypeError('No inventory data in the response');

            LOG.debug('GET: payload= ', payload, ' | backendResponse=', backendResponse, ' | httpResponse=', httpResponse);

            return {
                ...item,
                $request  : request,
                $response : backendResponse,
                $payload  : payload,
                $id       : payload.id,
                $name     : payload.name,
                $data     : item
            };

        });

    }

    private static q (value : string) : string {
        return HttpClientUtils.encodeURIComponent(value);
    }

    public static getHostListUrl (
        url    : string,
        domain : string,
        page   : number | undefined = undefined,
        size   : number | undefined = undefined
    ) : string {

        let params = [];

        if (page !== undefined) {
            params.push( `page=${this.q(''+page)}` );
        }

        if (size !== undefined) {
            params.push( `size=${this.q(''+size)}` );
        }

        return InventoryClientUtils.getDomainUrl(url, domain) + '/hosts' + (params.length ? `?${ params.join('&') }` : '');

    }

    public static getHostUrl (url : string, domain: string, name: string) : string {
        return `${ InventoryClientUtils.getDomainUrl(url, domain) }/hosts/${ this.q(name) }`;
    }

    public static getDomainUrl (url : string, domain: string) : string {
        return `${ url }/domains/${ this.q(domain) }`;
    }

}

export default InventoryClientUtils;
