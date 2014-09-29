//adminService
var service = require('./service');
var manager = require('../managers/manager');
var adminManager = require('../managers/adminManager');



/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
exports.summary = function (req, res) {
    authenticate(req, res, service.adminAuthRole, function () {
        console.log("in auth callback");
        adminManager.summary(function (result) {
            res.send(result);
        });
    });
};



