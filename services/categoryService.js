//categoryService

var service = require('./service');
var manager = require('../managers/manager');
var categoryManager = require('../managers/categoryManager');


/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
exports.create = function(req, res) {
    service.create(req, res, categoryManager, service.adminAuthRole);
};


/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
exports.update = function(req, res) {
    service.update(req, res, categoryManager, service.adminAuthRole);    
};


/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
exports.delete = function(req, res) {
    service.delete(req, res, categoryManager, service.adminAuthRole);
};


/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
exports.get = function(req, res) {
    service.get(req, res, categoryManager, service.adminAuthRole);
};


/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
exports.list = function(req, res) {
    service.list(req, res, categoryManager, service.adminAuthRole);
};



