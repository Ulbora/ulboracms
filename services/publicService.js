//publicService

var publicUserManager = require('../managers/publicUserManager');


/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
exports.activate = function (req, res) {

};


/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
exports.getMicbuttionChallenge = function (req, res) {
    var browserLan = req.headers["accept-language"];
    publicUserManager.getMicbuttionChallenge(browserLan, function (response) {
        console.log("micbutton challenge:" + JSON.stringify(response));
        res.send(response);
    });
};


/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
//PublicService.prototype.login = function(req, res) {
exports.login = function (req, res) {
    var returnVal = false;
    if (req.is('application/json')) {
        var reqBody = req.body;
        var json = JSON.stringify(reqBody);
        console.log("login request: " + json);
        publicUserManager.login(reqBody, function (loginStatus) {
            returnVal = loginStatus;
            //console.log("login success: " + returnVal);
            console.log("exit service login success: " + returnVal);
            res.send({success: returnVal});
        });

    } else {
        res.status(415);
        res.send({success: returnVal});
    }

};


/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
exports.register = function (req, res) {
    if (req.is('application/json')) {
        var reqBody = req.body;
        var json = JSON.stringify(reqBody);
        console.log("registration request: " + json);
        publicUserManager.register(reqBody, function (regStatus) {
            //returnVal = regStatus;
            //console.log("login success: " + returnVal);
            console.log("exit service registration success: " + JSON.stringify(regStatus));
            res.send(regStatus);
        });

    } else {
        res.status(415);
        res.send({success: false});
    }
};


/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
exports.resetPassword = function (req, res) {

};




