//accessLevelService

var service = require('./service');
var manager = require('../managers/manager');

/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
exports.create = function(req, res) {
    var returnVal = false;
    if (req.is('application/json')) {
        var reqBody = req.body;
        var bodyJson = JSON.stringify(reqBody);
        console.log("body: " + bodyJson);
        service.authenticate(req, res, service.adminAuthRole, function() {
            console.log("in auth callback");
            res.send({"success": true});
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
exports.update = function(req, res) {

};


/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
exports.delete = function(req, res) {

};


/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
exports.get = function(req, res) {

};


/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
exports.list = function(req, res) {

};



