// Copyright (c) 2020 Sendanor. All rights reserved.

export interface JsonSerializable {
    toJSON () : JsonAny;
}

export type JsonAny                         = string | number | boolean | null | JsonArray | JsonObject | JsonSerializable;
export type JsonObjectOf<T extends JsonAny> = { [name: string]: T       | undefined };
export type JsonObject                      = { [name: string]: JsonAny | undefined };
export type JsonArrayOf<T extends JsonAny>  = Array<T>;
export type JsonArray                       = Array<JsonAny>;

export type ReadonlyJsonAny                                 = string | number | boolean | null | ReadonlyJsonArray | ReadonlyJsonObject;
export type ReadonlyJsonObjectOf<T extends ReadonlyJsonAny> = { readonly [name: string]: T               | undefined };
export type ReadonlyJsonObject                              = { readonly [name: string]: ReadonlyJsonAny | undefined };
export type ReadonlyJsonArrayOf<T extends ReadonlyJsonAny>  = ReadonlyArray<T>;
export type ReadonlyJsonArray                               = ReadonlyArray<ReadonlyJsonAny>;

export default JsonAny;
