/*
Copyright © 2016 ServiceNow, Inc.
 
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

/*
 * This is a test script which shows how to use ServiceNow api, from a client code to communicate
 * with a ServiceNow instance.
 */
// load the modules
var BasicAuth = require('../sn_api/basicAuth');
var Task = require('../sn_api/task');

// set your ServiceNow instance uri, username and password. Make sure you have installed the MyTasks
// service.
var client = new BasicAuth('https://demonightlyinterfaces.service-now.com', 'fred.luddy', 'fred');
client.authenticate(function(err, response, body, cookie) {
	var client = new Task('https://demonightlyinterfaces.service-now.com', cookie);
	client.getTasks(function(err, response, body) {
	    console.log(JSON.stringify(body));	
	}); 
});
