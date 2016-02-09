//mediaService
var multiparty = require('multiparty');
//var http = require('http');
//var util = require('util');

var service = require('./service');
var manager = require('../managers/manager');
var mediaManager = require('../managers/mediaManager');


/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
exports.create = function (req, res) {    
    var form = new multiparty.Form();
    form.parse(req, function (err, fields, files) {
        //console.log("fields: " + fields);
        //util.inspect({fields: fields, files: files})
        //res.writeHead(200, {'content-type': 'text/plain'});
        //res.write('received upload:\n\n');
        //res.end(util.inspect({fields: fields, files: files}));
       // var reqBody = req.body;
        //if (req.is('application/json')) {
        if (!err && fields !== undefined && fields !== null) {
            //var reqBody = req.body;
            var bodyJson = JSON.stringify(fields);
            console.log("body: " + bodyJson);
            //authenticate(req, res, service.authorAuthRole, function() {
            //console.log("in auth callback");
            mediaManager.create(fields, files, function (result) {
                res.redirect(result);
            });
            //});
        } else {
            res.status(415);
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
exports.update = function (req, res) {
    service.update(req, res, mediaManager, service.adminAuthRole);
};


/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
exports.delete = function (req, res) {
    service.delete(req, res, mediaManager, service.adminAuthRole);
};


/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
exports.get = function (req, res) {
    //console.log("url:"+ req.host+":"+port);
    service.authenticate(req, res, service.adminAuthRole, function () {
        console.log("in auth callback");
        var imageUrl = req.get("Host");//host + ":" + port;
        //console.log("imageUrl:"+ imageUrl);
        var id = req.params.id;
        if (id !== null && id !== undefined) {
            mediaManager.get(id, imageUrl, function (result) {
                res.send(result);
            });
        } else {
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
exports.list = function (req, res) {
    service.authenticate(req, res, service.adminAuthRole, function () {
        console.log("in auth callback");
        var imageUrl = req.get("Host");//host + ":" + port;
        console.log("imageUrl:" + imageUrl);
        mediaManager.list(imageUrl, function (result) {
            res.send(result);
        });
    });
};



