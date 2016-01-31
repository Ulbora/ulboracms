//categoryService

var service = require('./service');
var manager = require('../managers/manager');
var templateEngineManager = require('../managers/templateEngineManager');



/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
exports.update = function(req, res) {
    service.update(req, res, templateEngineManager, service.adminAuthRole);    
};




/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
exports.get = function(req, res) {
    service.get(req, res, templateEngineManager, service.adminAuthRole);
};


/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
exports.list = function(req, res) {
    service.list(req, res, templateEngineManager, service.adminAuthRole);
};



