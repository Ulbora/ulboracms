//mediaManager



var db = require('../db/db');
var manager = require('../managers/manager');

/**
 * 
 * @param json
 *      
 */
exports.create = function (body, files, callback) {
    var returnVal = "";
    var mediaJson = {
        name: "",
        extension: "",
        fileSize: 0,
        fileData: null
    };
    var isOk = manager.securityCheck(body);
    if (isOk) {
        var username = body.username;
        var name = body.name;
        var uploadKey = body.uploadKey;
        var returnLink = body.returnLink;
        var errorLink = body.errorLink;
        console.log("username:" + username);
        console.log("uploadKey:" + uploadKey);
        if (files !== undefined && files !== null &&
                username !== undefined && username !== null &&
                uploadKey !== undefined && uploadKey !== null &&
                manager.validateFileUploadKey(username.toString(), uploadKey.toString())) {
            var fs = require('fs');
            var fileList = files.file;
            if (fileList.length > 0) {
                var file = fileList[0];
                //console.log(file);
                fs.readFile(file.path, function (err, data) {
                    if (!err && data !== undefined && data !== null) {
                        var fileName = file.originalFilename;
                        var indexOfDot = fileName.indexOf(".");
                        var extension = fileName.substring(++indexOfDot);
                        mediaJson.name = name;
                        mediaJson.extension = extension;
                        mediaJson.fileSize = file.size;
                        mediaJson.fileData = data;
                        var Media = db.getMedia();
                        var m = new Media(mediaJson);
                        m.save(function (err) {
                            if (err) {
                                returnVal = errorLink;
                                console.log("media save error: " + err);
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
        var Media = db.getMedia();
        Media.findById(json.id, function (err, results) {
            console.log("found media in update: " + JSON.stringify(results));
            if (!err && (results !== undefined && results !== null)) {
                results.name = json.name;
                results.save(function (err) {
                    if (err) {
                        console.log("media save error: " + err);
                    } else {
                        returnVal.success = true;
                    }
                    callback(returnVal);
                });

            } else {
                returnVal.message = "media not found";
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
        var Media = db.getMedia();
        Media.findById(id, function (err, results) {
            console.log("found media for delete: " + JSON.stringify(results));
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
exports.get = function (id, imageUrl, callback) {
    var isOk = manager.securityCheck(id);
    if (isOk) {
        console.log("id: " + id);
        var Media = db.getMedia();
        Media.findById(id, function (err, results) {
            console.log("found media: " + JSON.stringify(results));
            if (!err && (results !== undefined && results !== null)) {
                var imageUrlLink = "http://" + imageUrl + "/image/get/";
                var m = {
                    "id": null,
                    "name": null,
                    "extension": null,
                    "imageLink": null
                };
                var media = results.toObject();
                m.id = media._id;
                m.name = media.name;
                m.extension = media.extension;
                m.imageLink = imageUrlLink + media._id;
                console.log("imageUrl:" + m.imageLink);
                callback(m);
            } else {
                callback({});
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
exports.list = function (imageUrl, callback) {
    var Media = db.getMedia();
    Media.find({}, null, {sort: {name: 1}}, function (err, results) {
        console.log("found media list: " + JSON.stringify(results));
        if (err) {
            callback({});
        } else {
            if (results !== undefined && results !== null) {
                var imageUrlLink = "http://" + imageUrl + "/image/get/";
                var returnVal = [];
                for (var cnt = 0; cnt < results.length; cnt++) {
                    var m = {
                        "id": null,
                        "name": null,
                        "extension": null,
                        "imageLink": null
                    };
                    var media = results[cnt].toObject();
                    m.id = media._id;
                    m.name = media.name;
                    m.extension = media.extension;
                    m.imageLink = imageUrlLink + media._id;
                    console.log("imageUrl:" + m.imageLink);
                    returnVal.push(m);
                }
                callback(returnVal);
            } else {
                callback({});
            }
        }
    });

};



