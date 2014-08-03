//linksManager



var db = require('../db/db');
var manager = require('../managers/manager');


/**
 * 
 * @param json
    *      
 */
exports.create = function (json, callback){
  var returnVal = {
        success: false,
        message: ""
    };
    var isOk = manager.securityCheck(json);
    if (isOk) {
        manager.validateLanguage(json.language, function(found) {
            if (found) {
                var Link = db.getLink();
                Link.findOne({link: json.link}, function(err, results) {
                    console.log("found link in create: " + JSON.stringify(results));
                    if (!err && (results === undefined || results === null)) {
                        var link = new Link(json);
                        link.save(function(err) {
                            if (err) {
                                returnVal.message = "save failed";
                                console.log("link save error: " + err);
                            } else {
                                returnVal.success = true;
                            }
                            callback(returnVal);
                        });
                    } else {
                        returnVal.message = "existing link";
                        callback(returnVal);
                    }
                });
            } else {
                returnVal.message = "bad language";
                callback(returnVal);
            }
        });
    } else {
        callback(returnVal);
    }
};


/**
 * 
 * @param json
    *      
 */
exports.update = function (json, callback){
  var returnVal = {
        success: false,
        message: ""
    };
    var isOk = manager.securityCheck(json);
    if (isOk) {
        manager.validateLanguage(json.language, function(found) {
            if (found) {
                var Link = db.getLink();
                Link.findById(json.id, function(err, results) {
                    console.log("found link in update: " + JSON.stringify(results));
                    if (!err && (results !== undefined && results !== null)) {
                        var link = results;
                        link.name = json.name;
                        link.link = json.link;
                        link.language = json.language;
                        link.save(function(err) {
                            if (err) {
                                console.log("link save error: " + err);
                            } else {
                                returnVal.success = true;
                            }
                            callback(returnVal);
                        });

                    } else {
                        returnVal.message = "link not found";
                        callback(returnVal);
                    }
                });
            } else {
                returnVal.message = "bad language";
                callback(returnVal);
            }
        });

    } else {
        callback(returnVal);
    }
};


/**
 * 
 * @param id
    *      
 */
exports.delete = function (id, callback){
  var returnVal = {
        success: false,
        message: ""
    };
    var isOk = manager.securityCheck(id);
    if (isOk) {
        console.log("id: " + id);
        var Link = db.getLink();
        Link.findById(id, function(err, results) {
            console.log("found link for delete: " + JSON.stringify(results));
            if (!err && (results !== undefined && results !== null)) {
                results.remove();
                returnVal.success = true;
                callback(returnVal);
            } else {
                callback(returnVal);
            }
        });
    } else {
        callback(returnVal);
    }
};


/**
 * 
 * @param id
    *      
 */
exports.get = function (id, callback){
  var isOk = manager.securityCheck(id);
    if (isOk) {
        console.log("id: " + id);
        var Link = db.getLink();
        Link.findById(id, function(err, results) {
            console.log("found link: " + JSON.stringify(results));
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
exports.list = function (callback){
  var Link = db.getLink();
    Link.find({}, null, {sort: {name: 1}}, function(err, results) {
        console.log("found link list: " + JSON.stringify(results));
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



