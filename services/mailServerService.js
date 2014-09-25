//languageService

var service = require('./service');
var manager = require('../managers/manager');
var mailServerManager = require('../managers/mailServerManager');



/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
exports.update = function(req, res) {
    service.update(req, res, mailServerManager, service.adminAuthRole);
};



/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
exports.get = function(req, res) {
    authenticate(req, res, service.adminAuthRole, function() {
        console.log("in auth callback");
        mailServerManager.get(function(result) {
            res.send(result);
        });

    });
};





