//configurationManger


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
    var isOk = manager.securityCheck(json);
    if (isOk) {
        manager.validateLanguage(json.language, function(found) {
            if (found) {
                var Configuration = db.getConfiguration();
                Configuration.findOne({language: json.language}, function(err, results) {
                    console.log("found Configuration in create: " + JSON.stringify(results));
                    if (!err && (results === undefined || results === null)) {
                        var conf = new Configuration(json);
                        conf.save(function(err) {
                            if (err) {
                                returnVal.message = "save failed";
                                console.log("Configuration save error: " + err);
                            } else {
                                returnVal.success = true;
                            }
                            callback(returnVal);
                        });
                    } else {
                        returnVal.message = "existing Configuration";
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
exports.update = function(json, callback) {
    var returnVal = {
        success: false,
        message: ""
    };
    var isOk = manager.securityCheck(json);
    if (isOk) {
        manager.validateLanguage(json.language, function(found) {
            if (found) {
                var Configuration = db.getConfiguration();
                Configuration.findOne({language: json.language}, function(err, existingConf) {
                    console.log("found existing configuration: " + JSON.stringify(existingConf));
                    //if (!err && (existingConf === undefined || existingConf === null)) {
                    Configuration.findById(json.id, function(err, results) {
                        console.log("found Configuration in update: " + JSON.stringify(results));
                        var sameLanguage = false;
                        if (results.language.toString() === json.language) {
                            sameLanguage = true;
                        }
                        if (!err && ((sameLanguage) || (existingConf === undefined || existingConf === null))) {
                            if (!err && (results !== undefined && results !== null)) {
                                var conf = results;
                                conf.siteName = json.siteName;
                                conf.siteDesc = json.siteDesc;
                                conf.domainName = json.domainName;

                                conf.registrationEmailActivationSubject = json.registrationEmailActivationSubject;
                                conf.registrationEmailActivationTitle = json.registrationEmailActivationTitle;
                                conf.registrationEmailActivationGreeting = json.registrationEmailActivationGreeting;
                                conf.registrationEmailActivationMessage = json.registrationEmailActivationMessage;
                                conf.registrationEmailActivationUrl = json.registrationEmailActivationUrl;

                                conf.registrationEmailWelcomeSubject = json.registrationEmailWelcomeSubject;
                                conf.registrationEmailWelcomeTitle = json.registrationEmailWelcomeTitle;
                                conf.registrationEmailWelcomeGreeting = json.registrationEmailWelcomeGreeting;
                                conf.registrationEmailWelcomeMessage = json.registrationEmailWelcomeMessage;
                                conf.registrationEmailWelcomeUrl = json.registrationEmailWelcomeUrl;

                                conf.resetPasswordEmailSubject = json.resetPasswordEmailSubject;
                                conf.resetPasswordEmailTitle = json.resetPasswordEmailTitle;
                                conf.resetPasswordEmailGreeting = json.resetPasswordEmailGreeting;
                                conf.resetPasswordEmailMessage = json.resetPasswordEmailMessage;
                                conf.resetPasswordEmailUrl = json.resetPasswordEmailUrl;

                                conf.language = json.language;

                                conf.save(function(err) {
                                    if (err) {
                                        console.log("Configuration save error: " + err);
                                    } else {
                                        returnVal.success = true;
                                    }
                                    callback(returnVal);
                                });

                            } else {
                                returnVal.message = "Configuration not found";
                                callback(returnVal);
                            }
                        } else {
                            returnVal.message = "existing Configuration";
                            callback(returnVal);

                        }

                    });
                    // }else {
                    //returnVal.message = "existing Configuration";
                    //callback(returnVal);
                    // }
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
exports.delete = function(id, callback) {
    var returnVal = {
        success: false,
        message: ""
    };
    var isOk = manager.securityCheck(id);
    if (isOk) {
        console.log("id: " + id);
        var Configuration = db.getConfiguration();
        Configuration.findById(id, function(err, results) {
            console.log("found Configuration for delete: " + JSON.stringify(results));
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
exports.get = function(id, callback) {
    var isOk = manager.securityCheck(id);
    if (isOk) {
        console.log("id: " + id);
        var Configuration = db.getConfiguration();
        Configuration.findById(id, function(err, results) {
            console.log("found Configuration: " + JSON.stringify(results));
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
    var returnVal = [];
    var Configuration = db.getConfiguration();
    Configuration.find({}, null, {sort: {language: 1, name: 1}}, function(err, results) {
        console.log("found Configuration list: " + JSON.stringify(results));
        if (err) {
            callback({});
        } else {
            if (results !== undefined && results !== null) {
                var Language = db.getLanguage();
                Language.find({}, function(lanListErr, lanList) {
                    console.log("found language list: " + JSON.stringify(lanList));
                    if (!lanListErr && lanList !== undefined && lanList !== null) {
                        for (var cnt = 0; cnt < results.length; cnt++) {
                            console.log("test:" + results[cnt].language);
                            var conf = results[cnt].toObject();
                            for (var lanCnt = 0; lanCnt < lanList.length; lanCnt++) {
                                var lanId = lanList[lanCnt]._id.toString();
                                var confLanId = results[cnt].language.toString();
                                if (lanId === confLanId) {
                                    conf.language = lanList[lanCnt];
                                    console.log("found language: " + JSON.stringify(lanList[lanCnt]));
                                    break;
                                }
                            }
                            returnVal.push(conf);
                            console.log("Configuration:" + JSON.stringify(conf));
                        }
                        callback(returnVal);
                    } else {
                        callback({});
                    }
                });
            } else {
                callback({});
            }
        }
    });
};



