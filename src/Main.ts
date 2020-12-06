import ProcessUtils from "./services/ProcessUtils";
import InventoryArgumentService, {
    InventoryOutputFormat,
    MainArgumentsObject
} from "./services/InventoryArgumentService";
import {some} from "./modules/lodash";
import InventoryAction from "./types/InventoryAction";
import InventoryClientUtils, {InventoryClientListResponse} from "./services/InventoryClientUtils";
import {IB_COLLECTION, IB_URL} from "./constants/env";
import LogService from "./services/LogService";

const LOG = LogService.createLogger('Main');

export class Main {

    public static printUsage () {

        console.log(

            '\n'+
            'ib [OPTION(S)] [list]\n' +
            '    List inventory items in the collection.\n' +
            '\n'+

            'ib [OPTION(S)] [get] UUID|NAME [[OBJ.]KEY[:FORMAT]][ [[OBJ2.]KEY2[:FORMAT]] ...]\n' +
            '    Fetch the inventory object (or specific properties from it).\n' +
            '    If properties are defined, only those will be returned, one at a line.\n' +
            '    See also Output Formats for FORMAT.\n' +
            '\n'+

            'ib [OPTION(S)] [set] UUID|NAME [OBJ.]KEY[:TYPE]=VALUE\n' +
            '    Set a property in a host object.\n' +
            '    See also Input Types for TYPE.\n' +
            '\n'+

            'ib [OPTION(S)] delete UUID|NAME\n' +
            '    Delete a host object\n' +
            '\n'+

            'Where OPTION(S) are:\n' +
            '\n'+

            '  --url=URL\n' +
            '    The URL to the backend.\n' +
            '    Defaults to “http://localhost/ib”.\n' +
            '    See also the IB_URL environment option.\n' +
            '\n'+
            '  --collection=COLLECTION\n' +
            '    The collection to use. This is by default “hosts”.\n' +
            '    See also the IB_COLLECTION environment option.\n'
        );

    }

    public static run () : Promise<number> {

        const args = ProcessUtils.getArguments();

        if (some(args, (item: string) => item === '--help' || item === '-h')) {
            Main.printUsage();
            return Promise.resolve(0);
        }

        const parsedArgs = InventoryArgumentService.parseInventoryArguments(args);

        LOG.debug('Args: ', parsedArgs);

        switch (parsedArgs.action) {

            case InventoryAction.LOGIN   : return Main.loginAction(parsedArgs);
            case InventoryAction.LOGOUT  : return Main.logoutAction(parsedArgs);
            case InventoryAction.LIST    : return Main.listCollectionAction(parsedArgs);
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

    public static listCollectionAction (parsedArgs : MainArgumentsObject) : Promise<number> {

        const url        = parsedArgs?.url        ?? IB_URL;
        const collection = parsedArgs?.collection ?? IB_COLLECTION;

        return InventoryClientUtils.listCollection({
            url: url,
            collection: collection
        }).then((response : InventoryClientListResponse) => {

            console.log( Main.stringifyOutput(response?.payload, InventoryOutputFormat.DEFAULT) );

            return 0;

        });

    }

    public static getResourceAction (parsedArgs : MainArgumentsObject) : Promise<number> {
        throw new TypeError(`The logout is not supported yet`);
    }

    public static setResourceAction (parsedArgs : MainArgumentsObject) : Promise<number> {
        throw new TypeError(`The logout is not supported yet`);
    }

    public static deleteResourceAction (parsedArgs : MainArgumentsObject) : Promise<number> {
        throw new TypeError(`The logout is not supported yet`);
    }

    private static jsonStringifyOutput ( value : any ) : string {
        try {
            return JSON.stringify(value);
        } catch (err) {
            throw new TypeError(`Cannot JSON stringify value "${value}: ${err}`);
        }
    }

    private static stringifyOutput (value : any, type : InventoryOutputFormat) : string {

        switch (type) {

            case InventoryOutputFormat.STRING:
                return `${value}`;

            case InventoryOutputFormat.RECORD:
                return `${ this.jsonStringifyOutput(value) }`;

            case InventoryOutputFormat.JSON:
                return `${ this.jsonStringifyOutput(value) }`;

            case InventoryOutputFormat.OBJECT:
                return `${ this.jsonStringifyOutput(value) }`;

            case InventoryOutputFormat.ARRAY:
                return `${ this.jsonStringifyOutput(value) }`;

            case InventoryOutputFormat.BOOLEAN:
                return `${ this.jsonStringifyOutput(value) }`;

            case InventoryOutputFormat.NUMBER:
                return `${ this.jsonStringifyOutput(value) }`;

            case InventoryOutputFormat.INTEGER:
                return `${ this.jsonStringifyOutput(value) }`;

            case InventoryOutputFormat.DEFAULT:
                return `${ this.jsonStringifyOutput(value) }`;

        }

        throw new TypeError(`The output type "${type}" is not implemented for stringifier.`);

    }

}

export default Main;
