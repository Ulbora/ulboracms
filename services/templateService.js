//categoryService

var service = require('./service');
var manager = require('../managers/manager');
var templateManager = require('../managers/templateManager');


/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
exports.create = function(req, res) {
    service.create(req, res, templateManager, service.adminAuthRole);
};


/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
exports.update = function(req, res) {
    service.update(req, res, templateManager, service.adminAuthRole);    
};


/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
exports.delete = function(req, res) {
    service.delete(req, res, templateManager, service.adminAuthRole);
};


/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
exports.get = function(req, res) {
    service.get(req, res, templateManager, service.adminAuthRole);
};


/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
exports.list = function(req, res) {
    service.list(req, res, templateManager, service.adminAuthRole);
};


exports.upload = function(req, res) {
    var reqBody = req.body;
    //if (req.is('application/json')) {
    if (reqBody !== undefined && reqBody !== null) {
        //var reqBody = req.body;
        var bodyJson = JSON.stringify(reqBody);
        console.log("body: " + bodyJson);
        //authenticate(req, res, service.authorAuthRole, function() {
        //console.log("in auth callback");
        templateManager.upload(reqBody, req.files, function(result) {
            res.redirect(result);
        });
        //});
    } else {
        res.status(415);
        res.send({success: false});
    }

};


