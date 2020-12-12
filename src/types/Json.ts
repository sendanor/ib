// Copyright (c) 2020 Sendanor. All rights reserved.

import {every, isFunction, isNumber, isString, keys, isBoolean, isNull, isArray} from "../modules/lodash";
import {Test} from "../services/Test";

export interface WritableJsonSerializable {
    toJSON () : JsonAny;
}

export interface ReadonlyJsonSerializable {
    toJSON () : ReadonlyJsonAny;
}

export function isReadonlyJsonSerializable (value: any) : value is ReadonlyJsonSerializable {
    return !!value && isFunction(value.toJSON);
}


export type JsonSerializable = WritableJsonSerializable | ReadonlyJsonSerializable;

export function isJsonSerializable (value: any) : value is JsonSerializable {
    return !!value && isFunction(value.toJSON);
}


export type FlatJsonValue                   = string | number | boolean | null;

export function isFlatJsonValue (value: any) : value is FlatJsonValue {
    return isString(value) || isNumber(value) || isBoolean(value) || isNull(value);
}


export type FlatJsonObject                  = JsonObjectOf<FlatJsonValue>;


export type FlatJsonArray                   = JsonArrayOf<FlatJsonValue>;


export type JsonAny                         = FlatJsonValue | JsonArray | JsonObject | JsonSerializable;
export type JsonObjectOf<T extends JsonAny> = { [name: string]: T       | undefined };
export type JsonObject                      = { [name: string]: JsonAny | undefined };
export type JsonArrayOf<T extends JsonAny>  = Array<T>;
export type JsonArray                       = Array<JsonAny>;

export type ReadonlyJsonAny                                 = FlatJsonValue | ReadonlyJsonArray | ReadonlyJsonObject;

export function isReadonlyJsonAny (value: any) : value is ReadonlyJsonAny {
    return isFlatJsonValue(value) || isReadonlyJsonArray(value) || isReadonlyJsonObject(value);
}


export type ReadonlyJsonObjectOf<T extends ReadonlyJsonAny> = { readonly [name: string]: T               | undefined };


export type ReadonlyJsonObject                              = { readonly [name: string]: ReadonlyJsonAny | undefined };

export function isReadonlyJsonObject (value: any) : value is ReadonlyJsonObject {

    return Test.isRegularObject(value) && every(keys(value), (key : string) : boolean => {

        const propertyValue = value[key];

        if (propertyValue === undefined) return true;

        return isReadonlyJsonAny(propertyValue);

    });

}

export type ReadonlyJsonArrayOf<T extends ReadonlyJsonAny>  = ReadonlyArray<T>;


export type ReadonlyJsonArray                               = ReadonlyArray<ReadonlyJsonAny>;

export function isReadonlyJsonArray (value: any) : value is ReadonlyJsonArray {
    return isArray(value) && every(value, (item : any) : boolean => isReadonlyJsonAny(item));
}


export type ReadonlyFlatJsonObject = ReadonlyJsonObjectOf<FlatJsonValue>;
export type ReadonlyFlatJsonArray  = ReadonlyJsonArrayOf<FlatJsonValue>;

export default JsonAny;
