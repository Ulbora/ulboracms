//categoryManager


var db = require('../db/db');
var manager = require('../managers/manager');


/**
 * 
 * @param json
 *      
 */
exports.create = function (json, callback) {
    var returnVal = {
        success: false,
        message: ""
    };
    var isOk = manager.securityCheck(json);
    if (isOk) {
        if (json.defaultTemplate) {
            removeDefaultTemplate(function (deleteSuccess) {
                console.log("adding template: " + deleteSuccess);
                if (deleteSuccess) {
                    addTemplate(json, function (addResults) {
                        callback(addResults);
                    });
                } else {
                    callback(returnVal);
                }
            });
        } else {
            addTemplate(json, function (addResults) {
                callback(addResults);
            });
        }

    } else {
        callback(returnVal);
    }
};


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
        if (json.defaultTemplate) {
            removeDefaultTemplate(function (deleteSuccess) {
                console.log("adding template: " + deleteSuccess);
                if (deleteSuccess) {
                    updateTemplate(json, function (addResults) {
                        callback(addResults);
                    });
                } else {
                    callback(returnVal);
                }
            });
        } else {
            addTemplate(json, function (addResults) {
                callback(addResults);
            });
        }
    } else {
        callback(returnVal);
    }
};


/**
 * 
 * @param id
 *      
 */
exports.delete = function (id, callback) {
    var returnVal = {
        success: false,
        message: ""
    };
    var isOk = manager.securityCheck(id);
    if (isOk) {
        console.log("id: " + id);
        var Template = db.getTemplate();
        Template.findById(id, function (err, results) {
            console.log("found template for delete: " + JSON.stringify(results));
            if (!err && (results !== undefined && results !== null)) {
                if (!results.defaultTemplate) {
                    results.remove();
                    returnVal.success = true;
                    callback(returnVal);
                } else {
                    returnVal.message = "can not delete default template";
                    callback(returnVal);
                }
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
exports.get = function (id, callback) {
    var isOk = manager.securityCheck(id);
    if (isOk) {
        console.log("id: " + id);
        var Template = db.getTemplate();
        Template.findById(id, function (err, results) {
            console.log("found template: " + JSON.stringify(results));
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
    var Template = db.getTemplate();
    Template.find({}, null, {sort: {name: 1}}, function (err, results) {
        console.log("found template list: " + JSON.stringify(results));
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


addTemplate = function (json, callback) {
    var returnVal = {
        success: false,
        message: ""
    };
    var Template = db.getTemplate();
    var temp = new Template(json);
    temp.save(function (err) {
        if (err) {
            returnVal.message = "save failed";
            console.log("template save error: " + err);
        } else {
            returnVal.success = true;
        }
        callback(returnVal);
    });
};

updateTemplate = function (json, callback) {
    var returnVal = {
        success: false,
        message: ""
    };
    var Template = db.getTemplate();
    Template.findById(json.id, function (err, results) {
        console.log("found template: " + JSON.stringify(results));
        if (!err && (results !== undefined && results !== null)) {
            results.name = json.name;
            results.defaultTemplate = json.defaultTemplate;
            results.save(function (err) {
                if (err) {
                    returnVal.message = "update failed";
                    console.log("template update error: " + err);
                } else {
                    returnVal.success = true;
                }
                callback(returnVal);
            });
        } else {
            callback(returnVal);
        }
    });
};

removeDefaultTemplate = function (callback) {
    var Template = db.getTemplate();
    Template.find({defaultTemplate: true}, function (err, results) {
        console.log("found default templates in create: " + JSON.stringify(results));
        if (!err && (results !== undefined && results !== null)) {
            for (var cnt = 0; cnt < results.length; cnt++) {
                var temp = results[cnt];
                temp.defaultTemplate = false;
                temp.save(function (err) {
                    if (err) {
                        console.log("template update error: " + err);
                    }
                });
            }
            callback(true);
        } else {
            callback(false);
        }
    });
};
