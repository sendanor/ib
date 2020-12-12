export interface WritableJsonSerializable {
    toJSON(): JsonAny;
}
export interface ReadonlyJsonSerializable {
    toJSON(): ReadonlyJsonAny;
}
export declare function isReadonlyJsonSerializable(value: any): value is ReadonlyJsonSerializable;
export declare type JsonSerializable = WritableJsonSerializable | ReadonlyJsonSerializable;
export declare function isJsonSerializable(value: any): value is JsonSerializable;
export declare type FlatJsonValue = string | number | boolean | null;
export declare function isFlatJsonValue(value: any): value is FlatJsonValue;
export declare type FlatJsonObject = JsonObjectOf<FlatJsonValue>;
export declare type FlatJsonArray = JsonArrayOf<FlatJsonValue>;
export declare type JsonAny = FlatJsonValue | JsonArray | JsonObject | JsonSerializable;
export declare type JsonObjectOf<T extends JsonAny> = {
    [name: string]: T | undefined;
};
export declare type JsonObject = {
    [name: string]: JsonAny | undefined;
};
export declare type JsonArrayOf<T extends JsonAny> = Array<T>;
export declare type JsonArray = Array<JsonAny>;
export declare type ReadonlyJsonAny = FlatJsonValue | ReadonlyJsonArray | ReadonlyJsonObject;
export declare function isReadonlyJsonAny(value: any): value is ReadonlyJsonAny;
export declare type ReadonlyJsonObjectOf<T extends ReadonlyJsonAny> = {
    readonly [name: string]: T | undefined;
};
export declare type ReadonlyJsonObject = {
    readonly [name: string]: ReadonlyJsonAny | undefined;
};
export declare function isReadonlyJsonObject(value: any): value is ReadonlyJsonObject;
export declare type ReadonlyJsonArrayOf<T extends ReadonlyJsonAny> = ReadonlyArray<T>;
export declare type ReadonlyJsonArray = ReadonlyArray<ReadonlyJsonAny>;
export declare function isReadonlyJsonArray(value: any): value is ReadonlyJsonArray;
export declare type ReadonlyFlatJsonObject = ReadonlyJsonObjectOf<FlatJsonValue>;
export declare type ReadonlyFlatJsonArray = ReadonlyJsonArrayOf<FlatJsonValue>;
export default JsonAny;
