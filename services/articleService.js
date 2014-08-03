//articleService

var service = require('./service');
var manager = require('../managers/manager');
var articleManager = require('../managers/articleManager');

/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
exports.create = function(req, res) {

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



/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
exports.values = function(req, res) {
    if (req.is('application/json')) {
        var reqBody = req.body;
        var bodyJson = JSON.stringify(reqBody);
        console.log("body: " + bodyJson);
        authenticate(req, res, service.adminAuthRole, function(creds) {
            console.log("in auth callback");
            articleManager.values(reqBody, creds, function(result) {
                res.send(result);
            });
        });
    } else {
        res.status(415);
        res.send({success: false});
    }

};
