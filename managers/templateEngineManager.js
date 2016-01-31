//categoryManager


var db = require('../db/db');
var manager = require('../managers/manager');
//var fs = require('fs');
//var tar = require('tar');
//var zlib = require('zlib');
//var path = require('path');
//var mkdirp = require('mkdirp'); // used to create directory tree





/**
 * 
 * @param json
 *      
 */
exports.update = function (json, callback) {
    var returnVal = {
        success: false,
        message: ""
    };
    var isOk = manager.securityCheck(json);
    if (isOk) {
        if (json.defaultEngine) {
            removeDefaultTemplateEngine(function (deleteSuccess) {
                console.log("updating template engine: " + deleteSuccess);
                if (deleteSuccess) {
                    updateTemplateEngine(json, function (addResults) {
                        callback(addResults);
                    });
                } else {
                    callback(returnVal);
                }
            });
        }// else {
           // updateTemplateEngine(json, function (addResults) {
              //  callback(addResults);
            //});
       // }
    } else {
        callback(returnVal);
    }
};



/**
 * 
 * @param id
 *      
 */
exports.get = function (id, callback) {
    var isOk = manager.securityCheck(id);
    if (isOk) {
        console.log("id: " + id);
        var TemplateEngine = db.getTemplateEngine();
        TemplateEngine.findById(id, function (err, results) {
            console.log("found template engine: " + JSON.stringify(results));
            if (!err && (results !== undefined && results !== null)) {
                callback(results);
            } else {
                callback({});
            }
        });
    } else {
        callback({});
    }
};


/**
 * 
 * @param json
 *      
 */
exports.list = function (callback) {
    var TemplateEngine = db.getTemplateEngine();
    TemplateEngine.find({}, null, {sort: {name: 1}}, function (err, results) {
        console.log("found template engine list: " + JSON.stringify(results));
        if (err) {
            callback({});
        } else {
            if (results !== undefined && results !== null) {
                callback(results);
            } else {
                callback({});
            }
        }
    });
};




removeDefaultTemplateEngine = function (callback) {
    var TemplateEngine = db.getTemplateEngine();
    TemplateEngine.find({defaultEngine: true}, function (err, results) {
        console.log("found default template engine: " + JSON.stringify(results));
        if (!err && (results !== undefined && results !== null)) {
            var doCallback = false;
            if (results.length === 0) {
                callback(true);
            }
            for (var cnt = 0; cnt < results.length; cnt++) {
                if (cnt === (results.length - 1)) {
                    doCallback = true;
                }
                var temp = results[cnt];
                temp.defaultEngine = false;
                temp.save(function (err) {
                    if (err) {
                        console.log("template engine update error: " + err);
                    }
                    if (doCallback) {
                        callback(true);
                    }
                });
            }

        } else {
            callback(false);
        }
    });
};


updateTemplateEngine = function (json, callback) {
    var returnVal = {
        success: false,
        message: ""
    };
    //console.log("json1: " + JSON.stringify(json));
    //if (json.defaultEngine === undefined || json.defaultEngine === null) {
      //  json.defaultEngine = false;
    //}
    
    var TemplateEngine = db.getTemplateEngine();
    TemplateEngine.findById(json.id, function (err, results) {
        console.log("found template engine: " + JSON.stringify(results));
        if (!err && (results !== undefined && results !== null)) {
            //var abortUpdate = false;
            //if (results.defaultEngine && !json.defaultEngine) {
                //abortUpdate = true;
            //}
            //if (!abortUpdate) {                
                console.log("json: " + JSON.stringify(json));
                results.defaultEngine = json.defaultEngine;                
                console.log("results: " + JSON.stringify(results));
                results.save(function (err) {
                    if (err) {
                        returnVal.message = "update failed";
                        console.log("template engine update error: " + err);
                    } else {
                        returnVal.success = true;
                    }
                    callback(returnVal);
                });
            //} else {
               // callback(returnVal);
            //}
        } else {
            callback(returnVal);
        }
    });
};