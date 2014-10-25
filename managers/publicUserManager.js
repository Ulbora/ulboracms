//publicUserManager

var db = require('../db/db');
var manager = require('../managers/manager');
var proxy = require('../restProxy/restProxy');

/**
 * 
 * @param json
 *      
 */
exports.activate = function (json) {

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
exports.register = function (json) {

};


/**
 * 
 * @param json
 *      
 */
exports.resetPassword = function (json) {

};



