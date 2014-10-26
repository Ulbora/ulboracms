//publicUserManager

var db = require('../db/db');
var manager = require('../managers/manager');
var proxy = require('../restProxy/restProxy');
var emailSender = require('../mailSender/mailSender');

/**
 * 
 * @param json
 *      
 */
exports.activate = function (json, callback) {    
    var success = "<div style='float: left; width: 100%; text-align: center; margin: 20% 0 0 0; color: green; font-size: 14pt;'>Success</div>";
    var fail = "<div style='float: left; width: 100%; text-align: center; margin: 20% 0 0 0; color: red; font-size: 14pt;'>Failed</div>";
    var returnVal = fail;
    var isOk = manager.securityCheck(json);
    if (isOk) {
        var User = db.getUser();
        User.findOne({username: json.username}, function (usrErr, results) {
            if (!usrErr && results !== undefined && results !== null) {
                if (json.code === results.activationCode) {
                    results.enabled = true;
                    results.save(function (err) {
                        if (err) {
                            console.log("user update error: " + err);
                        } else {
                            returnVal = success;
                        }
                        callback(returnVal);
                    });
                }else{
                     callback(returnVal);
                }
            }
        });
    } else {
        callback(returnVal);
    }
};


/**
 * 
 * @param languageCode
 *      
 */
exports.getMicbuttionChallenge = function (browserLan, callback) {
    console.log("browser language: " + browserLan);
    var languageCode = null;
    if (browserLan !== undefined && browserLan !== null && browserLan !== "null") {
        //console.log("browser language inside if: " + browserLan);
        var parsedLan = manager.browserLanguageParser(browserLan);
        if (parsedLan !== undefined && parsedLan !== null && parsedLan.browLan !== undefined && parsedLan.browLan !== null) {
            languageCode = parsedLan.browLan;
            languageCode = languageCode.replace("-", "_");
        } else {
            languageCode = "en_us";
        }
    } else {
        languageCode = "en_us";
    }
    console.log("language code: " + languageCode);
    var a = {
        basicAuth: false,
        username: null,
        password: null,
        //method: null,
        url: null,
        jsonRequest: null,
        queryParameters: null,
        pathParameters: null
    };
    a.url = "http://micbutton1-micbuttoncloud.rhcloud.com/MicbuttonChallengeAPI/challenge";
    a.pathParameters = [languageCode];

    proxy.doGet(a, function (results) {
        if (results.success) {
            //returnVal.success = true;
            console.log("micbutton challenge results: " + results);
            var jsonRes = results.jsonResponse;
            if (jsonRes === undefined || jsonRes === null) {
                jsonRes = {};
            }
            callback(jsonRes);
        } else {
            callback({});
        }
    });
};


/**
 * 
 * @param json
 *      
 */
exports.login = function (json, callback) {
    var returnVal = false;
    var User = db.getUser();
    var isOk = manager.securityCheck(json);
    if (isOk) {
        User.findOne({username: json.username}, function (err, results) {
            if (!err && results !== undefined && results !== null) {
                var foundUser = results.toObject();
                if (foundUser.password === manager.hashPasswordSync(json.username, json.password) && foundUser.enabled) {
                    returnVal = true;
                }
            }
            console.log("manager login success: " + returnVal);
            callback(returnVal);
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
exports.register = function (json, callback) {
    var returnVal = {
        success: false,
        message: ""
    };
    var isOk = manager.securityCheck(json);
    if (isOk) {
        var mbReq = {
            answer: json.answer,
            key: json.key
        };
        // validate micbutton challenge
        validateMicbuttonChallenge(mbReq, function (micbuttonSuccess) {
            if (micbuttonSuccess && json.emailAddress !== undefined &&
                    json.emailAddress !== null && json.emailAddress.length > 5 &&
                    json.username !== undefined && json.username !== null &&
                    json.password !== undefined && json.password !== null) {

                // generate activation code
                var actCode = manager.generateActivationCode(json.emailAddress);
                console.log("user activation code: " + actCode);
                //validate user not already registered
                var User = db.getUser();
                User.findOne({username: json.username}, function (userErr, userResults) {
                    if (!userErr && (userResults === undefined || userResults === null)) {
                        var Role = db.getRole();
                        //find user role
                        Role.findOne({name: manager.ROLE_USER}, function (roleErr, roleResults) {
                            console.log("user role: " + roleResults);
                            if (!roleErr && (roleResults !== undefined && roleResults !== null)) {
                                var ePw = manager.hashPasswordSync(json.username, json.password);
                                var uJson = {
                                    username: json.username,
                                    password: ePw,
                                    enabled: false,
                                    activationCode: actCode,
                                    emailAddress: json.emailAddress,
                                    firstName: json.firstName,
                                    lastName: json.lastName,
                                    role: roleResults._id
                                };
                                //add user
                                var u = new User(uJson);
                                u.save(function (err) {
                                    if (err) {
                                        returnVal.message = "save failed";
                                        console.log("user save error: " + err);
                                    } else {
                                        returnVal.success = true;
                                        // send activation code email
                                        emailSender.sendActivationEmail(json.username, json.emailAddress, actCode);
                                    }
                                    callback(returnVal);
                                });
                            } else {
                                callback(returnVal);
                            }
                        });
                    } else {
                        returnVal.message = "user exists";
                        callback(returnVal);
                    }
                });
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
 * @param json
 *      
 */
exports.resetPassword = function (json) {

};


validateMicbuttonChallenge = function (json, callback) {
    console.log("manager json: " + JSON.stringify(json));
    var returnVal = false;
    var a = {
        basicAuth: false,
        username: null,
        password: null,
        //method: null,
        url: null,
        jsonRequest: json,
        queryParameters: null,
        pathParameters: null
    };
    a.url = "http://micbutton1-micbuttoncloud.rhcloud.com/MicbuttonChallengeAPI/challenge";

    proxy.doPost(a, function (results) {
        console.log("proxy response json: " + JSON.stringify(results));
        if (results.success) {
            var jsonRes = results.jsonResponse;
            if (jsonRes !== undefined && jsonRes !== null) {
                var proxyJson = JSON.parse(jsonRes);
                returnVal = proxyJson.success;
            }
        }
        callback(returnVal);
    });
};



