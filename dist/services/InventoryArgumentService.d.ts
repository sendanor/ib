import InventoryAction from "../types/InventoryAction";
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
    URL = "url",
    GROUP = "group"
}
export interface PropertyGetAction {
    readonly key?: string;
    readonly format?: InventoryOutputFormat;
}
export interface PropertySetAction {
    readonly key?: string;
    readonly type?: InventoryInputType;
    readonly value?: string;
}
export interface MainArgumentsObject {
    readonly action?: InventoryAction;
    readonly group?: string;
    readonly url?: string;
    readonly resource?: string;
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
    static parseInventoryArguments(args: Array<string>): MainArgumentsObject;
}
export default InventoryArgumentService;
