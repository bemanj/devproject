/*
Copyright © 2016 ServiceNow, Inc.
 
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

/*
 * This module provides a simple response logging mechanism
 */
module.exports = {
    logResponse: function(options, response, body) {
        if (options.verbose) {
            console.log("RESPONSE " + response.statusCode);
            console.log("RESPONSE headers"); console.log(response.headers);
            console.log("RESPONSE body"); console.log(JSON.stringify(body, null, 2));
        }
    }
}
