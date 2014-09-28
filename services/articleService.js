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
    if (req.is('application/json')) {
        var reqBody = req.body;
        var bodyJson = JSON.stringify(reqBody);
        console.log("body: " + bodyJson);
        authenticate(req, res, service.authorAuthRole, function(creds) {
            console.log("in auth callback");
            articleManager.create(reqBody, creds, function(result) {
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
exports.update = function(req, res) {
    if (req.is('application/json')) {
        var reqBody = req.body;
        var bodyJson = JSON.stringify(reqBody);
        console.log("body: " + bodyJson);
        authenticate(req, res, service.authorAuthRole, function(creds) {
            console.log("in auth callback");
            articleManager.update(reqBody, creds, function(result) {
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
    service.delete(req, res, articleManager, service.adminAuthRole);
};


/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
exports.get = function(req, res) {
    service.get(req, res, articleManager, service.authorAuthRole);
};


/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
exports.list = function(req, res) {
    service.list(req, res, articleManager, service.authorAuthRole);
};

/*
 * 
 * @param {type} req
 * @param {type} res
 * @returns {undefined}/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
/*
exports.list = function(req, res) {
    if (req.is('application/json')) {
        var reqBody = req.body;
        var bodyJson = JSON.stringify(reqBody);
        console.log("body: " + bodyJson);
        authenticate(req, res, service.adminAuthRole, function() {
            console.log("in auth callback");
            articleManager.list(reqBody, function(result) {
                res.send(result);
            });
        });
    }else {
        res.status(415);
        res.send({success: false});
    }

    // service.list(req, res, articleManager, service.adminAuthRole);
};
 */


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
