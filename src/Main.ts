import ProcessUtils from "./services/ProcessUtils";
import InventoryArgumentService from "./services/InventoryArgumentService";

export class Main {

    public static run () {

        const args = InventoryArgumentService.parseInventoryArguments(ProcessUtils.getArguments());

        console.log('Args: ', args);

    }

}

export default Main;
