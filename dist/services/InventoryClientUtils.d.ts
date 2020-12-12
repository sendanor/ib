import InventoryData from "../types/InventoryData";
import { ReadonlyJsonAny, ReadonlyJsonObject } from "../types/Json";
import InventoryItem from "../types/InventoryItem";
export declare type InventoryIdType = string;
export declare type InventoryTimestamp = string;
export declare type InventoryUrlType = string;
export declare type InventoryDomainType = string;
export declare type InventoryNameType = string;
export interface BackendListPayload<T extends ReadonlyJsonAny> extends ReadonlyJsonObject {
    readonly hosts: ReadonlyArray<T>;
    readonly totalCount: number;
    readonly pageCount: number;
}
export interface BackendItemPayload<T extends ReadonlyJsonAny | undefined> extends ReadonlyJsonObject {
    readonly id: InventoryIdType;
    readonly name: InventoryNameType;
    readonly data?: T;
}
export interface BackendResponse<T extends ReadonlyJsonAny | undefined> extends ReadonlyJsonObject {
    readonly timestamp: InventoryTimestamp;
    readonly payload: T;
    readonly changed: boolean;
}
export interface InventoryPatchRequest extends ReadonlyJsonObject {
    readonly url: InventoryUrlType;
    readonly domain: InventoryDomainType;
    readonly name: InventoryNameType;
    readonly data: InventoryData;
}
export interface InventoryPatchResponse extends InventoryItem {
    readonly $request: InventoryPatchRequest;
    readonly $response: BackendResponse<BackendItemPayload<InventoryData>>;
    readonly $payload: BackendItemPayload<InventoryData>;
    readonly $data: InventoryData;
}
export interface InventoryListRequest extends ReadonlyJsonObject {
    readonly url: InventoryUrlType;
    readonly domain: InventoryDomainType;
    readonly page?: number;
    readonly size?: number;
}
export interface InventoryListResponse {
    readonly $request: InventoryListRequest;
    readonly $response: BackendResponse<BackendListPayload<InventoryData>>;
    readonly $payload: BackendListPayload<InventoryData>;
    readonly items: ReadonlyArray<InventoryItem>;
    readonly totalCount: number;
    readonly pageCount: number;
}
export interface InventoryGetRequest extends ReadonlyJsonObject {
    readonly url: InventoryUrlType;
    readonly domain: InventoryDomainType;
    readonly name: InventoryNameType;
}
export interface InventoryGetResponse extends InventoryItem {
    readonly $request: InventoryGetRequest;
    readonly $response: BackendResponse<BackendItemPayload<InventoryData>>;
    readonly $payload: BackendItemPayload<InventoryData>;
    readonly $data: InventoryData;
}
export interface InventoryDeleteRequest {
    readonly url: InventoryUrlType;
    readonly domain: InventoryDomainType;
    readonly resource: InventoryNameType;
}
export interface InventoryDeleteResponse {
    readonly $request: InventoryDeleteRequest;
    readonly $response: BackendResponse<BackendItemPayload<InventoryData | undefined>>;
    readonly $payload: BackendItemPayload<InventoryData | undefined>;
    readonly changed: boolean;
}
/**
 * Utility services to implement Inventory Clients
 */
export declare class InventoryClientUtils {
    static updateHost(request: InventoryPatchRequest): Promise<InventoryPatchResponse>;
    static deleteHost(request: InventoryDeleteRequest): Promise<InventoryDeleteResponse>;
    static listHosts(request: InventoryListRequest): Promise<InventoryListResponse>;
    static getHost(request: InventoryGetRequest): Promise<InventoryGetResponse>;
    private static q;
}
export default InventoryClientUtils;
