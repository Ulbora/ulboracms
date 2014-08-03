//languageService

var service = require('./service');
var manager = require('../managers/manager');
var languageManager = require('../managers/languageManager');


/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
exports.create = function(req, res) {
    service.create(req, res, languageManager, service.adminAuthRole);
    /*
    if (req.is('application/json')) {
        var reqBody = req.body;
        var bodyJson = JSON.stringify(reqBody);
        console.log("body: " + bodyJson);
        service.authenticate(req, res, service.adminAuthRole, function() {
            console.log("in auth callback");
            languageManager.create(reqBody, function(result) {
                res.send(result);
            });
        });
    } else {
        res.status(415);
        res.send({success: false});
    }
    */

};


/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
exports.update = function(req, res) {
    service.update(req, res, languageManager, service.adminAuthRole);
    /*
    if (req.is('application/json')) {
        var reqBody = req.body;
        var bodyJson = JSON.stringify(reqBody);
        console.log("body: " + bodyJson);
        service.authenticate(req, res, service.adminAuthRole, function() {
            console.log("in auth callback");
            languageManager.update(reqBody, function(result) {
                res.send(result);
            });
        });
    } else {
        res.status(415);
        res.send({success: false});
    }
    */
};


/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
exports.delete = function(req, res) {
    service.delete(req, res, languageManager, service.adminAuthRole);
    /*
    service.authenticate(req, res, service.adminAuthRole, function() {
        console.log("in auth callback");
        var id = req.params.id;
        if (id !== null && id !== undefined) {
            languageManager.delete(id, function(result) {
                res.send(result);
            });
        }else{
            res.send({success: false});
        }

    });
    
    */
};


/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
exports.get = function(req, res) {
    service.get(req, res, languageManager, service.adminAuthRole);
    /*
    service.authenticate(req, res, service.adminAuthRole, function() {
        console.log("in auth callback");
        var id = req.params.id;
        if (id !== null && id !== undefined) {
            languageManager.get(id, function(result) {
                res.send(result);
            });
        }else{
            res.send({});
        }

    });
    */
};


/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
exports.list = function(req, res) {
    service.list(req, res, languageManager, service.adminAuthRole);
    /*
    service.authenticate(req, res, service.adminAuthRole, function() {
        console.log("in auth callback");
        languageManager.list(function(result) {
            res.send(result);
        });
    });
    */
};



