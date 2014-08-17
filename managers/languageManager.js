//languageManager



var db = require('../db/db');
var manager = require('../managers/manager');


/**
 * 
 * @param json
 *      
 */
exports.create = function(json, callback) {
    var returnVal = {
        success: false,
        message: ""
    };
    if (json.code !== undefined && json.code !== null) {
        json.code = json.code.toLowerCase();
        json.code = json.code.replace("_", "-");
    }
    var isOk = manager.securityCheck(json);
    if (isOk) {
        var Language = db.getLanguage();
        Language.findOne({code: json.code}, function(err, results) {
            console.log("found language in create: " + JSON.stringify(results));
            if (!err && (results === undefined || results === null)) {
                handleDefault(json, function() {
                    var lan = new Language(json);
                    lan.save(function(err) {
                        if (err) {
                            returnVal.message = "save failed";
                            console.log("language save error: " + err);
                        } else {
                            returnVal.success = true;
                        }
                        callback(returnVal);
                    });
                });

            } else {
                returnVal.message = "existing language";
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
exports.update = function(json, callback) {
    var returnVal = {
        success: false,
        message: ""
    };
    if (json.code !== undefined && json.code !== null) {
        json.code = json.code.toLowerCase();
        json.code = json.code.replace("_", "-");
    }
    var isOk = manager.securityCheck(json);
    if (isOk) {
        var Language = db.getLanguage();
        Language.findById(json.id, function(err, results) {
            console.log("found language in update: " + JSON.stringify(results));
            if (!err && (results !== undefined && results !== null)) {
                handleDefault(json, function() {
                    var lan = results;
                    lan.name = json.name;
                    lan.code = json.code;
                    lan.defaultLanguage = json.defaultLanguage;
                    lan.save(function(err) {
                        if (err) {
                            console.log("language save error: " + err);
                        } else {
                            returnVal.success = true;
                        }
                        callback(returnVal);
                    });
                });

            } else {
                returnVal.message = "language not found";
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
exports.delete = function(id, callback) {
    var returnVal = {
        success: false,
        message: ""
    };
    var isOk = manager.securityCheck(id);
    if (isOk) {
        console.log("id: " + id);
        var Language = db.getLanguage();
        Language.findById(id, function(err, results) {
            console.log("found language for delete: " + JSON.stringify(results));
            if (!err && (results !== undefined && results !== null)) {
                if (!results.defaultLanguage) {
                    results.remove();
                    returnVal.success = true;
                } else {
                    returnVal.message = "Default Language";
                }
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
exports.get = function(id, callback) {
    var isOk = manager.securityCheck(id);
    if (isOk) {
        console.log("id: " + id);
        var Language = db.getLanguage();
        Language.findById(id, function(err, results) {
            console.log("found language: " + JSON.stringify(results));
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
exports.list = function(callback) {
    var Language = db.getLanguage();
    Language.find({}, null, {sort: {name: 1}}, function(err, results) {
        console.log("found language list: " + JSON.stringify(results));
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


handleDefault = function(json, callback) {
    var Language = db.getLanguage();
    console.log("Checking for existing defaults");
    if (json.defaultLanguage) {
        Language.find({defaultLanguage: true}, function(err, results) {
            console.log("found language set to default: " + JSON.stringify(results));
            if (!err && (results !== undefined && results !== null)) {
                for (var cnt = 0; cnt < results.length; cnt++) {
                    var lan = results[cnt];
                    lan.defaultLanguage = false;
                    lan.save(function(err) {
                        if (err) {
                            console.log("language update error: " + err);
                        }
                    });
                }
                callback();
            } else {
                callback();
            }
        });
    } else {
        callback();
    }

};



