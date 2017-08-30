/*
Copyright © 2016 ServiceNow, Inc.
 
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

/*
 * Wraps the command line arguments
 */
module.exports = {

    // gets options from the command line
    processArgs: function(filename) {
        // helper function for printing usage info
        function printUsageAndExit() {
            console.log("\nUsage: node " + filename + " [ -h ] [ -p <port> ] [ -v ]");
            console.log("   -h, --help                  Show this usage help");
            console.log("   -p <port>, --port=<port>    HTTP server listen port (default 3000)");
            console.log("   -v, --verbose               Verbose HTTP output");
            process.exit(-1);
        }

        var minimist = require('minimist');

        var o = {
            port: 3000, // default listen port
            verbose: false
        };

        var argv = minimist(process.argv.slice(2));
        o.verbose = 'verbose' in argv || 'v' in argv;

        // print the usage on --help or -h
        if ('help' in argv || 'h' in argv) {
            printUsageAndExit();
        }

        // get the listen port
        if ('port' in argv) {
            o.port = argv['port'];
        } else if ('p' in argv) {
            o.port = argv['p'];
        }
        if (isNaN(o.port) || o.port % 1 !== 0) {
            console.log("Error: port must be an integer");
            printUsageAndExit();
        }

        return o;
    }
}
