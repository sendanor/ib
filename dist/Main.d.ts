import { MainArgumentsObject } from "./services/InventoryArgumentService";
export declare class Main {
    static printFullUsage(): void;
    static printShortUsage(): void;
    static run(): Promise<number>;
    static loginAction(parsedArgs: MainArgumentsObject): Promise<number>;
    static logoutAction(parsedArgs: MainArgumentsObject): Promise<number>;
    static listHostsAction(parsedArgs: MainArgumentsObject): Promise<number>;
    static getResourceAction(parsedArgs: MainArgumentsObject): Promise<number>;
    static setResourceAction(parsedArgs: MainArgumentsObject): Promise<number>;
    static deleteResourceAction(parsedArgs: MainArgumentsObject): Promise<number>;
    private static _jsonStringifyOutput;
    private static _jsonParseInput;
    private static _stringifyOutput;
    private static _stringifyRecord;
    private static _createObjectFromSetActions;
    private static _createValueFromType;
}
export default Main;
