//mailServerManager


var db = require('../db/db');
var manager = require('../managers/manager');


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
        var MailServer = db.getMailServer();
        MailServer.findById(json.id, function(err, results) {
            console.log("found mail server in update: " + JSON.stringify(results));
            if (!err && (results !== undefined && results !== null)) {
                results.smtpHost = json.smtpHost;
                results.smtpPort = json.smtpPort;
                results.secure = json.secure;
                results.username = json.username;
                results.password = manager.aes256Encrypt(json.password);
                results.ignoreTLS = json.ignoreTLS;
                results.debug = json.debug;
                results.authMethod = json.authMethod;
                results.save(function(err) {
                    if (err) {
                        console.log("mail server save error: " + err);
                    } else {
                        returnVal.success = true;
                    }
                    callback(returnVal);
                });
            } else {
                returnVal.message = "mail server not found";
                callback(returnVal);
            }
        });
    }
};



/**
 * 
 * @param id
 *      
 */
exports.get = function(callback) {
    console.log("in mail server manager");
    var MailServer = db.getMailServer();
    MailServer.find({}, function(err, results) {
        console.log("found mail server: " + JSON.stringify(results));
        if (!err && (results !== undefined && results !== null && results.length > 0)) {
            var m = results[0].toObject();
            m.password = manager.aes256Decrypt(m.password);
            callback(m);
        } else {
            callback({});
        }
    });
};




