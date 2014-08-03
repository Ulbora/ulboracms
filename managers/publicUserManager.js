//publicUserManager

var db = require('../db/db');
var manager = require('../managers/manager');

/**
 * 
 * @param json
 *      
 */
exports.activate = function(json) {

};


/**
 * 
 * @param languageCode
 *      
 */
exports.getMicbuttionChallenge = function(languageCode, callback) {

};


/**
 * 
 * @param json
 *      
 */
exports.login = function(json, callback) {
    var returnVal = false;
    var User = db.getUser();
    var isOk = manager.securityCheck(json);
    if (isOk) {
        User.findOne({username: json.username}, function(err, results) {
            if (!err && results !== undefined && results !== null) {
                var foundUser = results.toObject();
                if (foundUser.password === manager.hashPasswordSync(json.username, json.password) && foundUser.enabled) {
                    returnVal = true;
                }
            }
            console.log("manager login success: " + returnVal);
            callback(returnVal);
        });
    }else{
        callback(returnVal);
    }


};


/**
 * 
 * @param json
 *      
 */
exports.register = function(json) {

};


/**
 * 
 * @param json
 *      
 */
exports.resetPassword = function(json) {

};



