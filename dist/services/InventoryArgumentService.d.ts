import InventoryAction from "../types/InventoryAction";
import { LogLevel } from "./LogService";
export declare enum InventoryOutputFormat {
    RECORD = "record",
    STRING = "string",
    JSON = "json",
    OBJECT = "object",
    ARRAY = "array",
    BOOLEAN = "boolean",
    NUMBER = "number",
    INTEGER = "integer",
    DEFAULT = "default"
}
export declare enum InventoryInputType {
    STRING = "string",
    JSON = "json",
    OBJECT = "object",
    ARRAY = "array",
    BOOLEAN = "boolean",
    NUMBER = "number",
    INTEGER = "integer",
    NULL = "null"
}
export declare enum InventoryOptionKey {
    LOG_LEVEL = "log-level",
    URL = "url",
    DOMAIN = "domain",
    INCLUDE = "include",
    EXCLUDE = "exclude"
}
export declare function parseInventoryOptionKey(value: string): InventoryOptionKey | undefined;
export interface PropertyGetAction {
    readonly key?: string;
    readonly format?: InventoryOutputFormat;
}
export interface PropertySetAction {
    readonly key?: string;
    readonly type?: InventoryInputType;
    readonly value?: string;
}
export declare enum PropertyFilterType {
    INCLUDE = "INCLUDE",
    EXCLUDE = "EXCLUDE"
}
export interface PropertyFilter {
    /**
     * Match specific property by key name, eg. value `"$*"` will match any keyword with start as `"$"`
     *
     * This will also match sub properties, eg. `"$*"` will match `"foo.$id"`.
     *
     */
    name: string;
    /**
     * Show (include) or hide (exclude) the property
     */
    type: PropertyFilterType;
}
export interface MainArgumentsObject {
    readonly action?: InventoryAction;
    readonly domain?: string;
    readonly url?: string;
    readonly resource?: string;
    readonly logLevel?: LogLevel;
    readonly propertyFilters?: Array<PropertyFilter>;
    readonly propertyGetActions?: Array<PropertyGetAction>;
    readonly propertySetActions?: Array<PropertySetAction>;
}
export declare class InventoryArgumentService {
    private static _optionValues;
    static parseInventoryOptionKeyToValue(value: string): InventoryOptionKey;
    static isInventoryOptionKey(value: string): value is InventoryOptionKey;
    static parseInventoryAction(value: string): InventoryAction | undefined;
    static parseInventoryOptionArgument(result: MainArgumentsObject, item: string): MainArgumentsObject;
    static parseInventoryActionArgument(result: MainArgumentsObject, item: string): MainArgumentsObject;
    static parseKeyValue(value: string, separatorKey: string): {
        key: string;
        value: string;
    };
    /**
     * Parse keyword which may have keywords with IB_META_KEY prefix and transfer those to use "$" internally.
     *
     * @param value
     */
    static parseKeyString(value: string): string;
    static parseInventoryOutputFormat(value: string): InventoryOutputFormat;
    static parseInventoryInputType(value: string): InventoryInputType;
    static parseGetPropertyOptions(args: Array<string>): Array<PropertyGetAction>;
    static parseBooleanValue(key: string, value: string): boolean;
    static parseJsonValue(key: string, value: string): number;
    static isStringNumberValue(value: string): boolean;
    static isStringIntegerValue(value: string): boolean;
    static isStringArrayValue(value: string): boolean;
    static isStringObjectValue(value: string): boolean;
    static parseNumberValue(key: string, value: string): number;
    static parseArrayValue(key: string, value: string): number;
    static parseObjectValue(key: string, value: string): number;
    static parseIntegerValue(key: string, value: string): number;
    static parseNullValue(key: string, value: string): any;
    static parseInventoryInputValue(key: string, type: InventoryInputType, value: string): any;
    static parseSetPropertyOptions(args: Array<string>): Array<PropertySetAction>;
    static parseInventoryArguments(args: Array<string>, defaultArgs: MainArgumentsObject): MainArgumentsObject;
}
export default InventoryArgumentService;
