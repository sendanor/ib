import { MainArgumentsObject } from "./services/InventoryArgumentService";
export declare class Main {
    static printUsage(): void;
    static run(): Promise<number>;
    static loginAction(parsedArgs: MainArgumentsObject): Promise<number>;
    static logoutAction(parsedArgs: MainArgumentsObject): Promise<number>;
    static listGroupAction(parsedArgs: MainArgumentsObject): Promise<number>;
    static getResourceAction(parsedArgs: MainArgumentsObject): Promise<number>;
    static setResourceAction(parsedArgs: MainArgumentsObject): Promise<number>;
    static deleteResourceAction(parsedArgs: MainArgumentsObject): Promise<number>;
    private static jsonStringifyOutput;
    private static jsonParseInput;
    private static stringifyOutput;
    private static _createObjectFromSetActions;
    private static _createValueFromType;
}
export default Main;
