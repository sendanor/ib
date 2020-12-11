import {forEach, indexOf, isNumber, keys, map, reduce, some, startsWith, trim} from "../modules/lodash";
import InventoryAction from "../types/InventoryAction";
import LogService from "./LogService";

const LOG = LogService.createLogger('InventoryArgumentService');

export enum InventoryOutputFormat {

    RECORD  = 'record',
    STRING  = 'string',
    JSON    = 'json',
    OBJECT  = 'object',
    ARRAY   = 'array',
    BOOLEAN = 'boolean',
    NUMBER  = 'number',
    INTEGER = 'integer',
    DEFAULT = 'default'

}

export enum InventoryInputType {

    STRING  = 'string',
    JSON    = 'json',
    OBJECT  = 'object',
    ARRAY   = 'array',
    BOOLEAN = 'boolean',
    NUMBER  = 'number',
    INTEGER = 'integer',
    NULL    = 'null'

}

export enum InventoryOptionKey {

    URL    = "url",
    DOMAIN = "domain"

}

export interface PropertyGetAction {

    readonly key    ?: string;
    readonly format ?: InventoryOutputFormat;

}

export interface PropertySetAction {

    readonly key    ?: string;
    readonly type   ?: InventoryInputType;
    readonly value  ?: string;

}

export interface MainArgumentsObject {

    readonly action             ?: InventoryAction;
    readonly domain             ?: string;
    readonly url                ?: string;
    readonly resource           ?: string;

    readonly propertyGetActions ?: Array<PropertyGetAction>;
    readonly propertySetActions ?: Array<PropertySetAction>;

}

export class InventoryArgumentService {

    private static _optionValues : Array<InventoryOptionKey> = map(keys(InventoryOptionKey), InventoryArgumentService.parseInventoryOptionKeyToValue);

    public static parseInventoryOptionKeyToValue (value : string) : InventoryOptionKey {
        // @ts-ignore
        return InventoryOptionKey[value];
    }

    public static isInventoryOptionKey (value : string) : value is InventoryOptionKey {
        return indexOf(InventoryArgumentService._optionValues, value) >= 0;
    }

    public static parseInventoryAction (value : string) : InventoryAction | undefined {
        switch (value) {
            case 'list'  : return InventoryAction.LIST;
            case 'get'   : return InventoryAction.GET;
            case 'set'   : return InventoryAction.SET;
            case 'delete': return InventoryAction.DELETE;
            default      : return undefined;
        }
    }

    public static parseInventoryOptionArgument (result: MainArgumentsObject, item : string) : MainArgumentsObject {

        // Parse options
        if (startsWith(item, '--')) {

            const valueKeyIndex : number = item.indexOf('=');

            const hasValue : boolean = valueKeyIndex >= 0;

            const optKey : string | InventoryOptionKey = item.substr('--'.length, hasValue ? valueKeyIndex - '--'.length : item.length - 2);

            const value : string | undefined = hasValue ? item.substr(valueKeyIndex+1) : '';

            if (InventoryArgumentService.isInventoryOptionKey(optKey)) {
                switch(optKey) {

                    case InventoryOptionKey.URL:
                        result = {
                            ...result,
                            url: value
                        };
                        break;

                    case InventoryOptionKey.DOMAIN:
                        result = {
                            ...result,
                            domain: value
                        };
                        break;

                    default:
                        throw new TypeError(`The option was not implemented: "${optKey}"`);

                }
            } else {
                throw new TypeError(`The argument is unknown: "${item}"`);
            }

        }

        return result;

    }

    public static parseInventoryActionArgument (result: MainArgumentsObject, item : string) : MainArgumentsObject {

        const action : InventoryAction | undefined = InventoryArgumentService.parseInventoryAction(item);

        if (action === undefined) return result;

        return {
            ...result,
            action: action
        };

    }

    public static parseKeyValue (value : string, separatorKey : string) : {key: string, value: string} {

        const i = value.indexOf(separatorKey);

        if (i >= 0) {
            return {
                key: value.substr(0, i),
                value: value.substr(i+separatorKey.length)
            };
        }

        return {
            key: value,
            value:''
        };

    }

    public static parseInventoryOutputFormat (value : string) : InventoryOutputFormat {

        value = trim(value);

        if (value.length >= 2) {
            value = value.toLowerCase();
        }

        switch (value) {

            case 'record':
            case 'r':
                return InventoryOutputFormat.RECORD;

            case 'string':
            case 's':
                return InventoryOutputFormat.STRING;

            case 'json':
            case 'j':
                return InventoryOutputFormat.JSON;

            case 'object':
            case 'o':
                return InventoryOutputFormat.OBJECT;

            case 'array':
            case 'a':
                return InventoryOutputFormat.ARRAY;

            case 'boolean':
            case 'bool':
            case 'b':
                return InventoryOutputFormat.BOOLEAN;

            case 'number':
            case 'n':
                return InventoryOutputFormat.NUMBER;

            case 'integer':
            case 'int':
            case 'i':
                return InventoryOutputFormat.INTEGER;

            case '':
                return InventoryOutputFormat.DEFAULT;

            default:
                throw new TypeError(`Unsupported inventory output format: "${value}"`);

        }

    }

    public static parseInventoryInputType (value : string) : InventoryInputType {

        value = trim(value);

        if (value.length >= 2) {
            value = value.toLowerCase();
        }

        switch (value) {

            case 'string':
            case 's':
            case '':
                return InventoryInputType.STRING;

            case 'json':
            case 'j':
                return InventoryInputType.JSON;

            case 'object':
            case 'o':
                return InventoryInputType.OBJECT;

            case 'array':
            case 'a':
                return InventoryInputType.ARRAY;

            case 'boolean':
            case 'bool':
            case 'b':
                return InventoryInputType.BOOLEAN;

            case 'number':
            case 'n':
                return InventoryInputType.NUMBER;

            case 'integer':
            case 'int':
            case 'i':
                return InventoryInputType.INTEGER;

            case 'null':
            case 'nul':
            case 'N':
                return InventoryInputType.NULL;

            default:
                throw new TypeError(`Unsupported inventory input type: "${value}"`);

        }

    }

    public static parseGetPropertyOptions (args: Array<string>) : Array<PropertyGetAction> {
        return reduce(args, (result : Array<PropertyGetAction>, item : string) => {

            const parsedKeyType = InventoryArgumentService.parseKeyValue(item, ':');
            const key  : string = parsedKeyType.key;
            const type : string = parsedKeyType.value;

            result.push({
                key: trim(key),
                format: InventoryArgumentService.parseInventoryOutputFormat(type)
            });

            return result;

        }, []);
    }

    public static parseBooleanValue (key: string, value : string ) : boolean {

        switch(trim(value).toLowerCase()) {

            case '1':
            case 't':
            case 'true':
            case 'enabled':
            case 'on':
                return true;

            case '0':
            case 'f':
            case 'false':
            case 'off':
            case 'disabled':
            case 'nul':
            case 'null':
            case 'nan':
            case 'undefined':
                return false;

        }

        throw new TypeError(`The value for property "${key}" is not a boolean value: "${value}"`);

    }

    public static parseJsonValue (key: string, value : string ) : number {
        try {

            return JSON.parse(value);

        } catch (err) {

            LOG.debug('JSON parsing error: ', err);

            throw new TypeError(`The value for property "${key}" was not a valid JSON string: "${value}"`);

        }
    }

    public static isStringNumberValue (value: string) : boolean {

        if (!value.length) return false;

        switch (value[0]) {
            case '-':
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                break;
            default:
                return false;
        }

        // FIXME: Implement rest of the JSON spec

        return true;

    }

    public static isStringIntegerValue (value: string) : boolean {

        if (!value) return false;

        if (value.indexOf('.') >= 0) {
            return false;
        }

        // FIXME: Implement rest of the JSON spec

        return InventoryArgumentService.isStringNumberValue(value);

    }

    public static isStringArrayValue (value: string) : boolean {

        // FIXME: Implement the rest of the JSON spec

        return ( !!value && (value.length >= 2) && (value[0] !== '[') && (value[value.length -1 ] === ']') );

    }

    public static isStringObjectValue (value: string) : boolean {

        // FIXME: Implement the rest of the JSON spec

        return ( !!value && (value.length >= 2) && (value[0] !== '{') && (value[value.length -1 ] === '}') );

    }

    public static parseNumberValue (key: string, value : string ) : number {

        value = trim(value);

        if (InventoryArgumentService.isStringNumberValue(value)) {
            return InventoryArgumentService.parseJsonValue(key, value);
        }

        throw new TypeError(`The value for property "${key}" was not a valid number: "${value}"`);

    }

    public static parseArrayValue (key: string, value : string ) : number {

        value = trim(value);

        if (InventoryArgumentService.isStringArrayValue(value)) {
            throw new TypeError(`The value for property "${key}" was not a valid array: "${value}"`);
        }

        // FIXME: This should throw an exception if the value was not a number.
        return InventoryArgumentService.parseJsonValue(key, value);

    }

    public static parseObjectValue (key: string, value : string ) : number {

        value = trim(value);

        if (InventoryArgumentService.isStringObjectValue(value)) {
            throw new TypeError(`The value for property "${key}" was not a valid array: "${value}"`);
        }

        // FIXME: This should throw an exception if the value was not a number.
        return InventoryArgumentService.parseJsonValue(key, value);

    }

    public static parseIntegerValue (key: string, value : string) : number {

        if (!InventoryArgumentService.isStringIntegerValue(value)) {
            throw new TypeError(`The value for property "${key}" was not a valid number: "${value}"`);
        }

        const result = parseInt(value, 10);

        if ( !isNumber(result) || isNaN(result) ) {
            throw new TypeError(`The value for property "${key}" was not a valid number: "${value}"`);
        }

        return result;

    }

    public static parseNullValue (key: string, value: string) : any {

        value = trim(value).toLowerCase();

        if ( (value === "") || (value === "null") || (value === "nul") ) {
            return null;
        }

        throw new TypeError(`The value for property "${key}" was not type of null: "${value}"`);

    }

    public static parseInventoryInputValue (key: string, type: InventoryInputType, value : string) : any {

        switch (type) {

            case InventoryInputType.STRING  : return value;
            case InventoryInputType.JSON    : return InventoryArgumentService.parseJsonValue   (key, value);
            case InventoryInputType.OBJECT  : return InventoryArgumentService.parseObjectValue (key, value);
            case InventoryInputType.ARRAY   : return InventoryArgumentService.parseArrayValue  (key, value);
            case InventoryInputType.BOOLEAN : return InventoryArgumentService.parseBooleanValue(key, value);
            case InventoryInputType.NUMBER  : return InventoryArgumentService.parseNumberValue (key, value);
            case InventoryInputType.INTEGER : return InventoryArgumentService.parseIntegerValue(key, value);
            case InventoryInputType.NULL    : return InventoryArgumentService.parseNullValue   (key, value);
            default                         : throw new TypeError(`The input type for property "${key}" was not implemented: "${type}"`);

        }

    }

    public static parseSetPropertyOptions (args: Array<string>) : Array<PropertySetAction> { return reduce(args, (result : Array<PropertySetAction>, item : string) => {

            const parsedKeyValue = InventoryArgumentService.parseKeyValue(item, '=');
            const keyType : string = parsedKeyValue.key;
            const value   : string = parsedKeyValue.value;

            const parsedKeyType = InventoryArgumentService.parseKeyValue(keyType, ':');
            const key  : string = trim(parsedKeyType.key);
            const type : InventoryInputType = InventoryArgumentService.parseInventoryInputType(parsedKeyType.value);

            result.push({
                key: key,
                type: type,
                value: InventoryArgumentService.parseInventoryInputValue(key, type, value)
            });

            return result;

        }, []);
    }

    public static parseInventoryArguments (args: Array<string>) : MainArgumentsObject {

        let result : MainArgumentsObject = {};
        let freeArgs : Array<string> = [];

        forEach(args, (item : string) => {

            const prevResult = result;
            result = InventoryArgumentService.parseInventoryOptionArgument(result, item);
            if (result !== prevResult) return;

            // Add others to free args
            freeArgs.push(item);

        });

        // Parse the action
        if (freeArgs.length) {

            const prevResult = result;
            result = InventoryArgumentService.parseInventoryActionArgument(result, freeArgs[0]);
            if (result !== prevResult) {
                freeArgs.shift();
            }

        }

        // Parse the resource
        if (freeArgs.length) {
            result = {
                ...result,
                resource: freeArgs.shift()
            };
        }

        // Set the default action
        if (!result?.action) {

            const hasSets : boolean = some(freeArgs, (item: string) : boolean => item.indexOf('=') >= 0);

            if (!result?.resource) {
                result = {
                    ...result,
                    action: InventoryAction.LIST
                };
            } else {
                result = {
                    ...result,
                    action: hasSets ? InventoryAction.SET : InventoryAction.GET
                };
            }
        }

        if (freeArgs.length) {

            switch (result.action) {

                case InventoryAction.GET:
                    result = {
                        ...result,
                        propertyGetActions: InventoryArgumentService.parseGetPropertyOptions(freeArgs)
                    };
                    break;

                case InventoryAction.SET:
                    result = {
                        ...result,
                        propertySetActions: InventoryArgumentService.parseSetPropertyOptions(freeArgs)
                    };
                    break;

                default:
                    throw new TypeError(`The action "${result.action}" does not support property arguments: ${freeArgs.join(' ')}`);

            }
        }

        return result;

    }

}

export default InventoryArgumentService;
