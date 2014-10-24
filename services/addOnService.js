//addOnService

var service = require('./service');
var manager = require('../managers/manager');
var addOnManager = require('../managers/addOnManager');


/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
exports.create = function (req, res) {
    service.create(req, res, addOnManager, service.adminAuthRole);
};


/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
exports.update = function (req, res) {
    service.update(req, res, addOnManager, service.adminAuthRole);
};


/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
exports.delete = function (req, res) {
    service.delete(req, res, addOnManager, service.adminAuthRole);
};


/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
exports.get = function (req, res) {
    service.get(req, res, addOnManager, service.adminAuthRole);
};


/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
exports.list = function (req, res) {
    service.list(req, res, addOnManager, service.adminAuthRole);
};


/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
exports.call = function (req, res) {
    if (req.is('application/json')) {
        var reqBody = req.body;
        var bodyJson = JSON.stringify(reqBody);
        console.log("body: " + bodyJson);
        if (reqBody.anonymousServiceCall) {
            console.log("in anonimouse call callback");
            addOnManager.call(reqBody, null, function (result) {
                res.send(result);
            });
        } else {
            service.authenticate(req, res, service.userAuthRole, function (creds) {
                console.log("in auth callback");
                addOnManager.call(reqBody, creds, function (result) {
                    res.send(result);
                });
            });
        }
    } else {
        res.status(415);
        res.send({success: false});
    }
};



