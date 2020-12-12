export interface JsonSerializable {
    toJSON(): JsonAny;
}
export declare type JsonAny = string | number | boolean | null | JsonArray | JsonObject | JsonSerializable;
export declare type JsonObjectOf<T extends JsonAny> = {
    [name: string]: T | undefined;
};
export declare type JsonObject = {
    [name: string]: JsonAny | undefined;
};
export declare type JsonArrayOf<T extends JsonAny> = Array<T>;
export declare type JsonArray = Array<JsonAny>;
export declare type ReadonlyJsonAny = string | number | boolean | null | ReadonlyJsonArray | ReadonlyJsonObject;
export declare type ReadonlyJsonObjectOf<T extends ReadonlyJsonAny> = {
    readonly [name: string]: T | undefined;
};
export declare type ReadonlyJsonObject = {
    readonly [name: string]: ReadonlyJsonAny | undefined;
};
export declare type ReadonlyJsonArrayOf<T extends ReadonlyJsonAny> = ReadonlyArray<T>;
export declare type ReadonlyJsonArray = ReadonlyArray<ReadonlyJsonAny>;
export default JsonAny;
