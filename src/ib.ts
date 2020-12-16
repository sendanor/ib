#!/usr/bin/env node
// Copyright (c) 2020 Sendanor. All rights reserved.

import ProcessUtils from "./services/ProcessUtils";

// Must be first line to load the ENV
ProcessUtils.initEnvFromDefaultFiles();

import LogService from "./services/LogService";
import {IB_LOG_LEVEL} from "./constants/env";

LogService.setLogLevel(IB_LOG_LEVEL);

import * as HTTP from 'http';
import * as URL from 'url';

import Main from './Main';
import HttpClientUtils from "./services/HttpClientUtils";
import {isNumber, isString} from "./modules/lodash";

const LOG = LogService.createLogger('ib');

function handleError (err : any) {

    const statusCode : any = err?.status;

    if ( isNumber(statusCode) && isString(err?.data?.payload?.reason) ) {

        const reason = err?.data?.payload?.reason;

        console.error(`ERROR: ${statusCode} ${reason}`);

    } else if ( isNumber(statusCode) && isString(err?.data?.payload) ) {

        const reason = err?.data?.payload;

        console.error(`ERROR: ${statusCode} ${reason}` );

    } else {

        console.error('ERROR: ' + (err?.message ?? ''+err) );

    }

    // Enable later when there is a support for debug flag
    LOG.debug('Exception: ', err);

    Main.printShortUsage();

    process.exit(2);

}

try {

    HttpClientUtils.setUrlModule(URL);

    HttpClientUtils.setHttpModule(HTTP);

    Main.run().then((status: number) => {
        process.exit(status);
    }).catch(handleError);

} catch(e) {
    handleError(e);
}
