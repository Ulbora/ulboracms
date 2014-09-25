//downloadableFileService

var service = require('./service');
var manager = require('../managers/manager');
var downloadableFileManager = require('../managers/downloadableFileManager');


/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
exports.create = function (req, res) {
    var reqBody = req.body;
    //if (req.is('application/json')) {
    if (reqBody !== undefined && reqBody !== null) {
        //var reqBody = req.body;
        var bodyJson = JSON.stringify(reqBody);
        console.log("body: " + bodyJson);
        //authenticate(req, res, service.authorAuthRole, function() {
        //console.log("in auth callback");
        downloadableFileManager.create(reqBody, req.files, function (result) {
            res.redirect(result);
        });
        //});
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
exports.update = function (req, res) {
    service.update(req, res, downloadableFileManager, service.adminAuthRole);
};


/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
exports.delete = function (req, res) {
    service.delete(req, res, downloadableFileManager, service.adminAuthRole);
};


/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
exports.get = function (req, res) {
    service.get(req, res, downloadableFileManager, service.adminAuthRole);
};


/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
exports.list = function (req, res) {
    service.list(req, res, downloadableFileManager, service.adminAuthRole);
};


/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
exports.download = function (req, res) {
    var id = req.query.id;
    var username = req.query.username;
    var downloadKey = req.query.downloadKey;
    console.log("in service = id: " + id + "username: " + username + "downloadKey: " + downloadKey);
    if (id !== undefined && id !== null && username !== undefined && username !== null && downloadKey !== undefined && downloadKey !== null) {
        downloadableFileManager.download(id, username, downloadKey, function (fileData, fileName) {
            if (fileName !== null) {
                res.attachment(fileName);
                //res.setHeader('Content-Type', 'application/octet-stream')
                res.send(fileData);
            } else {
                res.send(fileData);
            }

        });
    } else {
        res.send({});
    }
};



