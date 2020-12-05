import HttpClientUtils, {HttpClientResponseObject, HttpMethod} from "./HttpClientUtils";
import AssertUtils from "./AssertUtils";

export interface InventoryClientListRequestObject {

    readonly url        : string;
    readonly collection : string;

}

export interface InventoryClientListResponse {

    readonly request : InventoryClientListRequestObject;
    readonly payload : Readonly<Record<string, any>>;

}

export interface InventoryClientGetRequestObject {

    readonly url        : string;
    readonly collection : string;
    readonly resource   : string;

}

export interface InventoryClientGetResponse {

    readonly request : InventoryClientGetRequestObject;
    readonly payload : Readonly<Record<string, any>>;

}

export interface InventoryClientSetRequestObject {

    readonly url        : string;
    readonly collection : string;
    readonly resource   : string;

}

export interface InventoryClientSetResponse {

    readonly request : InventoryClientSetRequestObject;
    readonly payload : Readonly<Record<string, any>>;
    readonly changed : boolean;

}



export interface InventoryClientDeleteRequestObject {

    readonly url        : string;
    readonly collection : string;
    readonly resource   : string;

}

export interface InventoryClientDeleteResponse {

    readonly request    : InventoryClientDeleteRequestObject;
    readonly changed    : boolean;

}

export class InventoryClientUtils {

    public static listCollection (request : InventoryClientListRequestObject) : Promise<InventoryClientListResponse> {

        AssertUtils.isObject(request);
        AssertUtils.isString(request.url);
        AssertUtils.isString(request.collection);

        const url = `${ request.url }/${ this.q(request.collection) }`;

        return HttpClientUtils.jsonRequest(HttpMethod.GET, url).then((response: HttpClientResponseObject) : InventoryClientListResponse => {

            const payload = response?.data?.payload ?? undefined;
            return {
                request: request,
                payload: payload
            };

        });

    }

    public static fetchResource (request : InventoryClientGetRequestObject) : Promise<InventoryClientGetResponse> {

        AssertUtils.isObject(request);
        AssertUtils.isString(request.url);
        AssertUtils.isString(request.collection);
        AssertUtils.isString(request.resource);

        const url = `${ request.url }/${ this.q(request.collection) }/${ this.q(request.resource) }`;

        return HttpClientUtils.jsonRequest(HttpMethod.GET, url).then((response: HttpClientResponseObject) : InventoryClientGetResponse => {

            const payload = response?.data?.payload ?? undefined;

            return {
                request: request,
                payload
            };

        });

    }

    private static q (value : string) : string {
        return HttpClientUtils.encodeURIComponent(value);
    }

}

export default InventoryClientUtils;
