//commentService

var service = require('./service');
var manager = require('../managers/manager');
var commentManager = require('../managers/commentManager');

/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
exports.create = function(req, res) {
    if (req.is('application/json')) {
        var isOk = manager.securityCheck(json);
        if (isOk) {
            var reqBody = req.body;
            var bodyJson = JSON.stringify(reqBody);
                console.log("body: " + bodyJson);
            if (reqBody.anonymousComments) {                
                //authenticate(req, res, service.adminAuthRole, function(creds) {
                    //console.log("in auth callback");
                    commentManager.create(reqBody, null, function(result) {
                        res.send(result);
                    });
                //});
            }else{                
                service.authenticate(req, res, service.userAuthRole, function(creds) {
                    console.log("in auth callback");
                    commentManager.create(reqBody, creds, function(result) {
                        res.send(result);
                    });
                });
            }

        } else {
            returnVal.message = "bad input";
            callback(returnVal);
        }

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
exports.update = function(req, res) {
    if (req.is('application/json')) {
        var reqBody = req.body;
        var bodyJson = JSON.stringify(reqBody);
        console.log("body: " + bodyJson);
        service.authenticate(req, res, service.adminAuthRole, function(creds) {
            console.log("in auth callback");
            commentManager.update(reqBody, creds, function(result) {
                res.send(result);
            });
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
exports.delete = function(req, res) {
    service.delete(req, res, commentManager, service.adminAuthRole);
};


/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
exports.get = function(req, res) {
    service.get(req, res, commentManager, service.adminAuthRole);
};


/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
exports.list = function(req, res) {
    service.list(req, res, commentManager, service.adminAuthRole);
};

