// Copyright (c) 2020 Sendanor. All rights reserved.

import ProcessUtils from "./services/ProcessUtils";
import InventoryArgumentService, {
    InventoryInputType,
    InventoryOutputFormat,
    MainArgumentsObject, PropertyGetAction, PropertySetAction
} from "./services/InventoryArgumentService";
import {forEach, has, isArray, isObject, isString, keys, map, reduce, some} from "./modules/lodash";
import InventoryAction from "./types/InventoryAction";
import InventoryClientUtils, {
    InventoryDeleteResponse,
    InventoryGetResponse,
    InventoryListResponse,
    InventoryPatchResponse
} from "./services/InventoryClientUtils";
import {IB_DOMAIN, IB_URL} from "./constants/env";
import LogService from "./services/LogService";
import InventoryData from "./types/InventoryData";
import PlainObject, {PlainObjectOf} from "./types/PlainObject";
import JsonAny, {
    FlatJsonValue,
    isFlatJsonValue,
    isJsonSerializable,
    isReadonlyJsonAny,
    isReadonlyJsonArray,
    isReadonlyJsonObject,
    isReadonlyJsonSerializable,
    ReadonlyFlatJsonObject,
    ReadonlyJsonAny, ReadonlyJsonArray,
    ReadonlyJsonArrayOf,
    ReadonlyJsonObject,
    ReadonlyJsonObjectOf
} from "./types/Json";

const LOG = LogService.createLogger('Main');

export class Main {

    public static printFullUsage () {

        console.log(

            '\n'+
            'ib [OPTION(S)] [list]\n' +
            '\n'+
            '    List inventory items in the domain.\n' +
            '\n'+

            'ib [OPTION(S)] [get] UUID|NAME [[OBJ.]KEY[:FORMAT]][ [[OBJ2.]KEY2[:FORMAT]] ...]\n' +
            '\n'+
            '    Fetch the inventory object (or specific properties from it).\n' +
            '\n'+
            '    If properties are defined, only those will be returned, one at a line.\n' +
            '\n'+
            '    See also Output Formats for FORMAT.\n' +
            '\n'+

            'ib [OPTION(S)] [set] UUID|NAME [OBJ.]KEY[:TYPE]=VALUE [[OBJ2.]KEY2[:TYPE2]=VALUE2 ...]\n' +
            '\n'+
            '    Set a property in a host object.\n' +
            '\n'+
            '    See also Input Types for TYPE.\n' +
            '\n'+

            'ib [OPTION(S)] delete UUID|NAME\n' +
            '\n'+
            '    Delete a host object\n' +
            '\n'+

            'Where OPTION(S) are:\n' +
            '\n'+

            '  --url=URL\n' +
            '\n'+
            '    The URL to the backend.\n' +
            '\n'+
            '    Defaults to “http://localhost/ib”.\n' +
            '\n'+
            '    See also the IB_URL environment option.\n' +
            '\n'+
            '  --domain=DOMAIN\n' +
            '\n'+
            '    The domain to use. This is by default “hosts”.\n' +
            '\n'+
            '    See also the IB_DOMAIN environment option.\n'
        );

    }

    public static printShortUsage () {

        console.log(

            '\n'+
            'ib [OPTION(S)] [list]\n' +
            '\n'+

            'ib [OPTION(S)] [get] UUID|NAME [[OBJ.]KEY[:FORMAT]][ [[OBJ2.]KEY2[:FORMAT]] ...]\n' +
            '\n'+

            'ib [OPTION(S)] [set] UUID|NAME [OBJ.]KEY[:TYPE]=VALUE [[OBJ2.]KEY2[:TYPE2]=VALUE2 ...]\n' +
            '\n'+

            'ib [OPTION(S)] delete UUID|NAME\n' +
            '\n'+

            'Check \'ib --help\' for full usage.\n'
        );

    }

    public static run () : Promise<number> {

        const args = ProcessUtils.getArguments();

        if (some(args, (item: string) => item === '--help' || item === '-h')) {
            Main.printFullUsage();
            return Promise.resolve(0);
        }

        const parsedArgs = InventoryArgumentService.parseInventoryArguments(args);

        LOG.debug('Args: ', parsedArgs);

        switch (parsedArgs.action) {

            case InventoryAction.LOGIN   : return Main.loginAction(parsedArgs);
            case InventoryAction.LOGOUT  : return Main.logoutAction(parsedArgs);
            case InventoryAction.LIST    : return Main.listHostsAction(parsedArgs);
            case InventoryAction.GET     : return Main.getResourceAction(parsedArgs);
            case InventoryAction.SET     : return Main.setResourceAction(parsedArgs);
            case InventoryAction.DELETE  : return Main.deleteResourceAction(parsedArgs);

            default:
                throw new TypeError(`The action "${parsedArgs.action}" is unsupported`);

        }

    }

    public static loginAction (parsedArgs : MainArgumentsObject) : Promise<number> {
        throw new TypeError(`The login is not supported yet`);
    }

    public static logoutAction (parsedArgs : MainArgumentsObject) : Promise<number> {
        throw new TypeError(`The logout is not supported yet`);
    }

    public static listHostsAction (parsedArgs : MainArgumentsObject) : Promise<number> {

        const url    = parsedArgs?.url    ?? IB_URL;
        const domain = parsedArgs?.domain ?? IB_DOMAIN;

        return InventoryClientUtils.listHosts({
            url    : url,
            domain : domain
        }).then((response : InventoryListResponse) => {

            console.log( Main._stringifyOutput(response.items, InventoryOutputFormat.DEFAULT) );

            return 0;

        });

    }

    public static getResourceAction (parsedArgs : MainArgumentsObject) : Promise<number> {

        const url      = parsedArgs?.url      ?? IB_URL;
        const domain   = parsedArgs?.domain   ?? IB_DOMAIN;
        const resource = parsedArgs?.resource ?? IB_DOMAIN;

        const propertyGetActions : Array<PropertyGetAction> | undefined = parsedArgs?.propertyGetActions;

        return InventoryClientUtils.getHost({
            url: url,
            domain: domain,
            name: resource
        }).then((response : InventoryGetResponse) => {

            if ( propertyGetActions === undefined || propertyGetActions.length === 0 ) {

                console.log( Main._stringifyOutput(response, InventoryOutputFormat.DEFAULT) );

            } else {

                const flatResponse = this._flattenJson(response);

                if (isFlatJsonValue(flatResponse)) {
                    throw new TypeError(`Only objects and arrays supported with properties.`);
                }

                forEach(propertyGetActions, (action : PropertyGetAction) => {

                    const key    = action?.key;
                    const format = action?.format ?? InventoryOutputFormat.DEFAULT;

                    if (!key) throw new TypeError(`Action was not correct. Missing key.`);

                    if ( flatResponse && has(flatResponse, key) ) {

                        console.log( Main._stringifyOutput(flatResponse[key], format) );

                    } else if (has(response, key)) {

                        console.log( Main._stringifyOutput(response[key], format) );

                    } else {
                        throw new TypeError(`Key "${key}" not found from the response.`);
                    }

                });

            }

            return 0;

        });

    }

    public static setResourceAction (parsedArgs : MainArgumentsObject) : Promise<number> {

        const url      = parsedArgs?.url    ?? IB_URL;
        const domain   = parsedArgs?.domain ?? IB_DOMAIN;
        const resource = parsedArgs?.resource;
        const propertySetActions : Array<PropertySetAction> | undefined = parsedArgs?.propertySetActions;

        if (!resource) throw new TypeError(`No resource name defined.`);

        let data : InventoryData = propertySetActions ? Main._createObjectFromSetActions(propertySetActions, {}) : {};

        return InventoryClientUtils.updateHost({
            url: url,
            domain: domain,
            name: resource,
            data: data
        }).then((response : InventoryPatchResponse) => {

            console.log( Main._stringifyOutput(response, InventoryOutputFormat.DEFAULT) );

            return 0;

        });

    }

    public static deleteResourceAction (parsedArgs : MainArgumentsObject) : Promise<number> {

        const url      = parsedArgs?.url      ?? IB_URL;
        const domain    = parsedArgs?.domain    ?? IB_DOMAIN;
        const resource = parsedArgs?.resource ?? IB_DOMAIN;

        return InventoryClientUtils.deleteHost({
            url: url,
            domain: domain,
            resource: resource
        }).then((response : InventoryDeleteResponse) => {

            console.log( Main._stringifyOutput(response.changed, InventoryOutputFormat.DEFAULT) );

            return 0;

        });

    }


    private static _jsonStringifyOutput ( value : any ) : string {
        try {
            return JSON.stringify(value);
        } catch (err) {
            throw new TypeError(`Cannot stringify value "${value}" as JSON: ${err}`);
        }
    }

    private static _jsonParseInput ( value : string ) : any {
        try {
            return JSON.parse(value);
        } catch (err) {
            throw new TypeError(`Cannot parse JSON string "${value}: ${err}`);
        }
    }

    private static _stringifyOutput (value : any, type : InventoryOutputFormat) : string {

        switch (type) {

            case InventoryOutputFormat.STRING:
                return `${value}`;

            case InventoryOutputFormat.RECORD:
                return this._stringifyRecord(value);

            case InventoryOutputFormat.JSON:
                return this._jsonStringifyOutput(value);

            case InventoryOutputFormat.OBJECT:
                return this._jsonStringifyOutput(value);

            case InventoryOutputFormat.ARRAY:
                return this._jsonStringifyOutput(value);

            case InventoryOutputFormat.BOOLEAN:
                return this._jsonStringifyOutput(value);

            case InventoryOutputFormat.NUMBER:
                return this._jsonStringifyOutput(value);

            case InventoryOutputFormat.INTEGER:
                return this._jsonStringifyOutput(value);

            case InventoryOutputFormat.DEFAULT:

                if (isString(value)) return this._stringifyOutput(value, InventoryOutputFormat.STRING);
                if (isObject(value)) return this._stringifyOutput(value, InventoryOutputFormat.RECORD);

                return this._jsonStringifyOutput(value);

        }

        throw new TypeError(`The output type "${type}" is not implemented for stringifier.`);

    }

    /**
     *
     * @param obj
     * @param key
     * @param value
     * @private
     */
    private static _flattenJsonAny (
        obj   : ReadonlyFlatJsonObject,
        key   : keyof ReadonlyFlatJsonObject,
        value : ReadonlyJsonAny | undefined
    ) : ReadonlyFlatJsonObject {

        // JSON doesn't have undefined values (except you could think of properties which are not defined as same thing)
        if (value === undefined) return obj;

        if (isReadonlyJsonArray(value)) {
            return this._flattenJsonArray(obj, key, value);
        }

        if (isReadonlyJsonSerializable(value)) {
            return this._flattenJsonAny(obj, key, value.toJSON());
        }

        if (isReadonlyJsonObject(value)) {
            return this._flattenJsonObject(obj, key, value);
        }

        return {
            ...obj,
            [key]: value
        };

    }

    private static _flattenJsonArray (
        obj   : ReadonlyFlatJsonObject,
        key   : keyof ReadonlyFlatJsonObject,
        value : ReadonlyJsonArray
    ) : ReadonlyFlatJsonObject {

        return reduce(
            value,
            (
                obj   : ReadonlyFlatJsonObject,
                item  : ReadonlyJsonAny,
                index : number
            ) : ReadonlyFlatJsonObject => this._flattenJsonAny(obj, key + '#' + index, item),
            obj
        );

    }

    private static _flattenJsonObject (
        obj   : ReadonlyFlatJsonObject,
        key   : keyof ReadonlyFlatJsonObject,
        value : ReadonlyJsonObject
    ) : ReadonlyFlatJsonObject {

        return reduce(
            keys(value),
            (
                obj         : ReadonlyFlatJsonObject,
                propertyKey : keyof ReadonlyJsonObject
            ) : ReadonlyFlatJsonObject => this._flattenJsonAny(obj, key ? key + '.' + propertyKey : propertyKey, value[propertyKey]),
            obj
        );

    }

    private static _flattenJson (value : any) : ReadonlyFlatJsonObject | FlatJsonValue {

        if (isFlatJsonValue(value)) return value;

        return this._flattenJsonAny({}, "", value);

    }

    private static _stringifyRecord (value : any) : string {

        if (isArray(value)) {
            return map(value, (item : any) => {

                const id   = item?.$id;
                const name = item?.$name ?? id;

                return `${name}\t${ Main._stringifyRecord(item).replace(/\n/g, '\t') }`;

            }).join('\n');
        }

        if (isObject(value)) {

            const flatValue = this._flattenJson(value);

            if (!isReadonlyJsonObject(flatValue)) { // FIXME: Change to flat test
                throw new TypeError('flatValue was not ReadonlyJsonObject');
            }

            return map(keys(flatValue), (key : string) : string => {
                const keyValue       : any    = flatValue[key];
                const keyValueString : string = Main._stringifyRecord(keyValue);
                return `${key}=${keyValueString}`;
            }).join('\n');

        }

        if (isString(value)) {
            return value;
        }

        return Main._jsonStringifyOutput(value);

    }

    private static _createObjectFromSetActions (actions : Array<PropertySetAction>, object : InventoryData) : InventoryData {

        forEach(actions, (item: PropertySetAction) => {
            if (item.key) {
                object = {
                    ...object,
                    [item.key]: item.value ? Main._createValueFromType(item.value, item.type ?? InventoryInputType.STRING) : undefined
                };
            }
        });

        return object;

    }

    private static _createValueFromType (value : string, type: InventoryInputType) : any {
        switch (type) {

            case InventoryInputType.STRING  : return value;
            case InventoryInputType.JSON    : return Main._jsonParseInput(value);
            case InventoryInputType.OBJECT  : return Main._jsonParseInput(value);
            case InventoryInputType.ARRAY   : return Main._jsonParseInput(value);
            case InventoryInputType.BOOLEAN : return Main._jsonParseInput(value);
            case InventoryInputType.NUMBER  : return Main._jsonParseInput(value);
            case InventoryInputType.INTEGER : return Main._jsonParseInput(value);
            case InventoryInputType.NULL    : return null;
            default                         : throw new TypeError(`Unsupported input type "${type}"`);

        }
    }

}

export default Main;
