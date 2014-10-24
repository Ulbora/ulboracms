//ulboraUserService


var service = require('./service');
var manager = require('../managers/manager');
var ulboraUserManager = require('../managers/ulboraUserManager');

/**
 * 
 * @param req
    *      
 * @param res
    *      
 */
exports.create = function (req, res){
   if (req.is('application/json')) {
        var reqBody = req.body;
        var bodyJson = JSON.stringify(reqBody);
        console.log("body: " + bodyJson);
        service.authenticate(req, res, service.adminAuthRole, function(creds) {
            console.log("in auth callback");
            ulboraUserManager.create(reqBody, creds, function(result) {
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
exports.update = function (req, res){
  if (req.is('application/json')) {
        var reqBody = req.body;
        var bodyJson = JSON.stringify(reqBody);
        console.log("body: " + bodyJson);
        service.authenticate(req, res, service.adminAuthRole, function(creds) {
            console.log("in auth callback");
            ulboraUserManager.update(reqBody, creds, function(result) {
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
exports.delete = function (req, res){
  service.authenticate(req, res, service.adminAuthRole, function(creds) {
        console.log("in auth callback");
        var id = req.params.id;
        if (id !== null && id !== undefined) {
            ulboraUserManager.delete(id, creds, function(result) {
                res.send(result);
            });
        }else{
            res.send({success: false});
        }

    });
};


/**
 * 
 * @param req
    *      
 * @param res
    *      
 */
exports.get = function (req, res){
  service.authenticate(req, res, service.adminAuthRole, function(creds) {
        console.log("in auth callback");
        var id = req.params.id;
        if (id !== null && id !== undefined) {
            ulboraUserManager.get(id, creds, function(result) {
                res.send(result);
            });
        }else{
            res.send({});
        }

    });
};


/**
 * 
 * @param req
    *      
 * @param res
    *      
 */
exports.list = function (req, res){
  service.authenticate(req, res, service.adminAuthRole, function(creds) {
        console.log("in auth callback");
        ulboraUserManager.list(creds, function(result) {
            res.send(result);
        });
    });
};


/**
 * 
 * @param req
    *      
 * @param res
    *      
 */
exports.changePassword = function (req, res){
  if (req.is('application/json')) {
        var reqBody = req.body;
        var bodyJson = JSON.stringify(reqBody);
        console.log("body: " + bodyJson);
        service.authenticate(req, res, service.userAuthRole, function(creds) {
            console.log("in auth callback");
            ulboraUserManager.changePassword(reqBody, creds, function(result) {
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
exports.roleList = function (req, res){
  service.authenticate(req, res, service.adminAuthRole, function() {
        console.log("in auth callback");
        ulboraUserManager.roleList(function(result) {
            res.send(result);
        });
    });
};



