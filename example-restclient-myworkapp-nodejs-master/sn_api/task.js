/*
Copyright © 2016 ServiceNow, Inc.
 
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

/*
 * This is a re-usable module to do tasks related operations with ServiceNow instance. 
 */

module.exports = Task;

function Task(snInstanceURL, snCoookie, options) {
    this.snInstanceURL = snInstanceURL;
    this.snCoookie = snCoookie;
    this.options = options;
}

// Returns the tasks assigned to user.
Task.prototype.getTasks = function (callBack) {
    var request = require('request');
    request.debug = this.options.verbose;
    request({
        baseUrl: this.snInstanceURL,
        method: 'GET',
        // This uri is a part of myTasks service.
        uri: '/api/x_snc_my_work/v1/tracker/task',
        json: true,
        // Set the cookie to authenticate the request.
        headers: {
            'Cookie': this.snCoookie
        }

    }, function (err, response, body) {
        callBack(err, response, body);
    });
}

// Adds a comment to the task. 
Task.prototype.addComment = function (taskID, comment, callBack) {
    var request = require('request');
    request.debug = this.options.verbose;
    request({
        baseUrl: this.snInstanceURL,
        method: 'POST',
        uri: '/api/x_snc_my_work/v1/tracker/task/' + taskID + '/comment',
        json: true,
        body: {
            "comment": comment
        },
        headers: {
            'Cookie': this.snCoookie
        }
    }, function (err, response, body) {
        callBack(err, response, body);
    });
}

Task.prototype.createIncident = function (description, callBack) {
    var request = require('request');
    // top 5 running processes

    var _ = require('lodash');
    var ps = require('current-processes');
    var top5 = '';
    var num = '';
    var instanceURL = this.snInstanceURL;
    var cookie_ = this.snCoookie;

    ps.get(function(err, processes) {
        
           var sorted = _.sortBy(processes, 'cpu');
           top5  = sorted.reverse().splice(0, 5);
    });

    request.debug = this.options.verbose;
    request({
        baseUrl: this.snInstanceURL,
        method: 'POST',
        //uri: '/api/x_snc_my_work/v1/tracker/task/' + taskID + '/comment',
        uri: '/api/now/table/incident',
        json: true,
        body: {
            "caller_id":"admin",
            "assigned_to":"robert456",
            "short_description":description,
            "description":"test send process in this field"
            
        },
        headers: {
            'Cookie': this.snCoookie
        }
    }, function (err, response, body) {
        //var data = response;
        //var data1 = JSON.parse(data);
        //var body_detail = body[0];//JSON.parse(body);
        var myJSON = JSON.stringify(body.result);
        var myObj = JSON.parse(myJSON); 
        num = myObj.number;

        console.log('Incident ticket created ', num);//, body
        //callBack(err, response, body);

        // add process to comment 
    
       });

}


// Get comments from task. MyTask api does not have a method to get tasks. Here we use sys_journal api
// to get the comments from ServiceNow instance.
Task.prototype.getComments = function (taskID, callBack) {
    var request = require('request');
    request.debug = this.options.verbose;
    request({
        baseUrl: this.snInstanceURL,
        method: 'GET',
        // Use ServiceNow table API (http://wiki.servicenow.com/index.php?title=Table_API#gsc.tab=0) to get comments.
        // The ServiceNow table API users a parameter called sysparm_query to query back end data. We can use a
        // Similar approach to invoke any table API method.
        uri: 'api/now/v2/table/sys_journal_field?sysparm_query=element_id%3D' + taskID + '%5EORDERBYDESCsys_created_on',
        json: true,
        headers: {
            'Cookie': this.snCoookie
        }

    }, function (err, response, body) {
        callBack(err, response, body);
    });
}
