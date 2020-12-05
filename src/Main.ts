import ProcessUtils from "./services/ProcessUtils";
import InventoryArgumentService from "./services/InventoryArgumentService";
import {some} from "./modules/lodash";

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

    public static run () {

        const args = ProcessUtils.getArguments();

        if (some(args, (item: string) => item === '--help' || item === '-h')) {
            Main.printUsage();
            return;
        }

        const parsedArgs = InventoryArgumentService.parseInventoryArguments(args);

        console.log('Args: ', parsedArgs);

    }

}

export default Main;
