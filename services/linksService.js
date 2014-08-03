//linksService

var service = require('./service');
var manager = require('../managers/manager');
var linksManager = require('../managers/linksManager');

/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
exports.create = function(req, res) {
    service.create(req, res, linksManager, service.adminAuthRole);
};


/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
exports.update = function(req, res) {
    service.update(req, res, linksManager, service.adminAuthRole);
};


/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
exports.delete = function(req, res) {
    service.delete(req, res, linksManager, service.adminAuthRole);
};


/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
exports.get = function(req, res) {
    service.get(req, res, linksManager, service.adminAuthRole);
};


/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
exports.list = function(req, res) {
    service.list(req, res, linksManager, service.adminAuthRole);
};



