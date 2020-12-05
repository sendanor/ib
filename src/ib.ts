#!/usr/bin/env node
const Main = require('./Main').default;
try {
    Main.run();
} catch(e) {

    console.error('ERROR: ' + (e?.message ?? ''+e) );

    console.debug('Exception: ', e);

}
