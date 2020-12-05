#!/usr/bin/env node
import * as HTTP from 'http';
import * as URL from 'url';
import Main from './Main';
import HttpClientUtils from "./services/HttpClientUtils";
import ProcessUtils from "./services/ProcessUtils";
import LogService from "./services/LogService";

const LOG = LogService.createLogger('ib');

function handleError (err : any) {

    console.error('ERROR: ' + (err?.message ?? ''+err) );

    // Enable later when there is a support for debug flag
    LOG.debug('Exception: ', err);

    Main.printUsage();

    process.exit(2);

}

try {

    ProcessUtils.initEnvFromDefaultFiles();

    HttpClientUtils.setUrlModule(URL);

    HttpClientUtils.setHttpModule(HTTP);

    Main.run().then((status: number) => {
        process.exit(status);
    }).catch(handleError);

} catch(e) {
    handleError(e);
}
