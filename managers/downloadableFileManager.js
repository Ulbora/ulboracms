//downloadableFileManager

var db = require('../db/db');
var manager = require('../managers/manager');

/**
 * 
 * @param json
 *      
 */
exports.create = function (body, files, callback) {
    var returnVal = "";
    var downloadableFileJson = {
        name: "",
        dateEntered: null,
        extension: "",
        fileSize: 0,
        fileData: null,
        downloadCount: 0,
        version: null,
        product: null
    };
    var isOk = manager.securityCheck(body);
    if (isOk) {
        var username = body.username;
        var name = body.name;
        var version = body.version;
        var uploadKey = body.uploadKey;
        var returnLink = body.returnLink;
        var errorLink = body.errorLink;
        var product = body.product;
        if (files !== undefined && files !== null &&
                username !== undefined && username !== null &&
                uploadKey !== undefined && uploadKey !== null &&
                manager.validateFileUploadKey(username, uploadKey)) {
            var fs = require('fs');
            fs.readFile(files.file.path, function (err, data) {
                if (!err && data !== undefined && data !== null) {
                    var fileName = files.file.name;
                    console.log("file name: " + fileName);
                    var indexOfDot = fileName.lastIndexOf(".");
                    var extension = fileName.substring(++indexOfDot);
                    downloadableFileJson.name = name;
                    downloadableFileJson.dateEntered = new Date();
                    downloadableFileJson.extension = extension;
                    downloadableFileJson.fileSize = files.file.size;
                    downloadableFileJson.fileData = data;
                    downloadableFileJson.version = version;
                    downloadableFileJson.product = product;
                    var DownloadableFile = db.getDownloadableFile();
                    var dlf = new DownloadableFile(downloadableFileJson);
                    dlf.save(function (err) {
                        if (err) {
                            returnVal = errorLink;
                            console.log("file save error: " + err);
                        } else {
                            returnVal = returnLink;
                        }
                        callback(returnVal);
                    });
                } else {
                    returnVal = errorLink;
                    callback(returnVal);
                }
            });
        } else {
            returnVal = errorLink;
            callback(returnVal);
        }
    } else {
        callback(returnVal);
    }
};


/**
 * 
 * @param json
 *      
 */
exports.update = function (json, callback) {
    var returnVal = {
        success: false,
        message: ""
    };
    var isOk = manager.securityCheck(json);
    if (isOk) {
        var DownloadableFile = db.getDownloadableFile();
        DownloadableFile.findById(json.id, function (err, results) {
            console.log("found file: " + JSON.stringify(results));
            if (!err && (results !== undefined && results !== null)) {
                results.name = json.name;
                results.version = json.version;
                results.save(function (err) {
                    if (err) {
                        returnVal.message = "save failed";
                        console.log("file save error: " + err);
                    } else {
                        returnVal.success = true;
                    }
                    callback(returnVal);
                });
            } else {
                callback(returnVal);
            }
        });
    } else {
        callback(returnVal);
    }
};


/**
 * 
 * @param id
 *      
 */
exports.delete = function (id, callback) {
    var returnVal = {
        success: false,
        message: ""
    };
    var isOk = manager.securityCheck(id);
    if (isOk) {
        console.log("id: " + id);
        var DownloadableFile = db.getDownloadableFile();
        DownloadableFile.findById(id, function (err, results) {
            console.log("found file for delete: " + JSON.stringify(results));
            if (!err && (results !== undefined && results !== null)) {
                results.remove();
                returnVal.success = true;
                callback(returnVal);
            } else {
                callback(returnVal);
            }
        });
    } else {
        callback(returnVal);
    }
};


/**
 * 
 * @param id
 *      
 */
exports.get = function (id, callback) {
    var isOk = manager.securityCheck(id);
    if (isOk) {
        var DownloadableFile = db.getDownloadableFile();
        DownloadableFile.findById(id, function (err, results) {
            console.log("found file: " + JSON.stringify(results));
            if (!err && (results !== undefined && results !== null)) {
                var f = {
                    _id: null,
                    name: null,
                    version: null,
                    product: null
                };
                f._id = results._id;
                f.name = results.name;
                f.version = results.version;
                f.product = results.product;
                callback(f);
            } else {
                callback({}, null);
            }
        });
    } else {
        callback({});
    }
};


/**
 * 
 * @param json
 *      
 */
exports.list = function (callback) {
    var DownloadableFile = db.getDownloadableFile();
    DownloadableFile.find({}, null, {sort: {name: 1}}, function (err, results) {
        console.log("found files list: " + JSON.stringify(results));
        if (err) {
            callback({});
        } else {
            if (results !== undefined && results !== null) {
                var returnVal = [];
                for (var cnt = 0; cnt < results.length; cnt++) {
                    var file = {
                        _id: null,
                        name: null,
                        version: null,
                        downloadCount: 0
                    };
                    var f = results[cnt];
                    file._id = f._id;
                    file.name = f.name;
                    file.version = f.version;
                    file.downloadCount = f.downloadCount;
                    returnVal.push(file);
                }

                callback(returnVal);
            } else {
                callback({});
            }
        }
    });
};


/**
 * 
 * @param json
 *      
 */
exports.download = function (id, username, downloadKey, callback) {
    console.log(" in manager = id: " + id + "username: " + username + "downloadKey: " + downloadKey);
    var idOk = manager.securityCheck(id);
    var unOk = manager.securityCheck(username);
    var keyOk = manager.securityCheck(downloadKey);
    if (idOk && unOk && keyOk && manager.validateFileUploadKey(username, decodeURIComponent(downloadKey))) {
        var DownloadableFile = db.getDownloadableFile();
        DownloadableFile.findById(id, function (err, results) {
            console.log("found file: " + JSON.stringify(results));
            if (!err && (results !== undefined && results !== null)) {
                var fileName = results.name + "." + results.extension;
                callback(results.fileData, fileName);
            } else {
                callback({}, null);
            }
        });
    } else {
        callback({}, null);
    }

};



