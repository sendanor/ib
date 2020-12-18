import { MainArgumentsObject } from "./services/InventoryArgumentService";
export declare class Main {
    static printFullUsage(): void;
    static printShortUsage(): void;
    static run(): Promise<number>;
    static loginAction(parsedArgs: MainArgumentsObject): Promise<number>;
    static logoutAction(parsedArgs: MainArgumentsObject): Promise<number>;
    static listHostsAction(parsedArgs: MainArgumentsObject): Promise<number>;
    static getResourceAction(parsedArgs: MainArgumentsObject): Promise<number>;
    static createAction(parsedArgs: MainArgumentsObject): Promise<number>;
    static setResourceAction(parsedArgs: MainArgumentsObject): Promise<number>;
    static deleteResourceAction(parsedArgs: MainArgumentsObject): Promise<number>;
    private static _jsonStringifyOutput;
    private static _jsonParseInput;
    private static _stringifyOutput;
    /**
     *
     * @param obj
     * @param key
     * @param value
     * @private
     */
    private static _flattenJsonAny;
    private static _flattenJsonArray;
    private static _flattenJsonObject;
    private static _flattenJson;
    private static _stringifyRecord;
    private static _createObjectFromSetActions;
    private static _createValueFromType;
    private static _getFilteredKeys;
    private static _isKeyMatch;
    private static _parsePropertyFilterString;
}
export default Main;
