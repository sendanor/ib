import InventoryData from "../types/InventoryData";
export interface ListPayload<T> {
    totalCount: number;
    pageCount: number;
    hosts: Array<T>;
}
export interface ItemPayload<T> {
    id: string;
    name: string;
    data: T;
}
export interface BackendResponse<T> {
    timestamp: string;
    payload: T;
    changed: boolean;
}
export interface InventoryClientUpdateRequestObject {
    readonly url: string;
    readonly group: string;
    readonly resource: string;
    readonly data: InventoryData;
}
export interface InventoryClientUpdateResponseObject {
    readonly request: InventoryClientUpdateRequestObject;
    readonly id: string;
    readonly name: string;
    readonly data: InventoryData;
}
export interface InventoryClientListRequestObject {
    readonly url: string;
    readonly group: string;
}
export interface InventoryClientListResponse {
    readonly request: InventoryClientListRequestObject;
    readonly hosts: Array<InventoryData>;
    readonly totalCount: number;
    readonly pageCount: number;
}
export interface InventoryClientGetRequestObject {
    readonly url: string;
    readonly group: string;
    readonly resource: string;
}
export interface InventoryClientGetResponse {
    readonly request: InventoryClientGetRequestObject;
    readonly payload: Readonly<InventoryData>;
}
export interface InventoryClientSetRequestObject {
    readonly url: string;
    readonly group: string;
    readonly resource: string;
}
export interface InventoryClientSetResponse {
    readonly request: InventoryClientSetRequestObject;
    readonly payload: Readonly<Record<string, any>>;
    readonly changed: boolean;
}
export interface InventoryClientDeleteRequestObject {
    readonly url: string;
    readonly group: string;
    readonly resource: string;
}
export interface InventoryClientDeleteResponse {
    readonly request: InventoryClientDeleteRequestObject;
    readonly changed: boolean;
}
export declare class InventoryClientUtils {
    static updateHost(request: InventoryClientUpdateRequestObject): Promise<InventoryClientUpdateResponseObject>;
    static listGroup(request: InventoryClientListRequestObject): Promise<InventoryClientListResponse>;
    static fetchResource(request: InventoryClientGetRequestObject): Promise<InventoryClientGetResponse>;
    private static q;
}
export default InventoryClientUtils;
