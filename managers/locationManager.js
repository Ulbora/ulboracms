//locationiManager



var db = require('../db/db');
var manager = require('../managers/manager');

/**
 * 
 * @param json
 *      
 */
exports.create = function(json, callback) {
    var returnVal = {
        success: false,
        message: ""
    };
    var isOk = manager.securityCheck(json);
    if (isOk) {
        var Location = db.getLocation();
        Location.findOne({name: json.name}, function(err, results) {
            console.log("found location in create: " + JSON.stringify(results));
            if (!err && (results === undefined || results === null)) {
                var loc = new Location(json);
                loc.save(function(err) {
                    if (err) {
                        returnVal.message = "save failed";
                        console.log("location save error: " + err);
                    } else {
                        returnVal.success = true;
                    }
                    callback(returnVal);
                });
            } else {
                returnVal.message = "existing location";
                callback(returnVal);
            }
        });

    } else {
        callback(returnVal);
    }
};


/**
 * 
 * @param json
 *      
 */
exports.update = function(json, callback) {
    // not currently used
};


/**
 * 
 * @param id
 *      
 */
exports.delete = function(id, callback) {
    var returnVal = {
        success: false,
        message: ""
    };
    var isOk = manager.securityCheck(id);
    if (isOk) {
        console.log("id: " + id);
        var Location = db.getLocation();
        Location.findById(id, function(err, results) {
            console.log("found location for delete: " + JSON.stringify(results));
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
exports.get = function(id, callback) {
    var isOk = manager.securityCheck(id);
    if (isOk) {
        console.log("id: " + id);
        var Location = db.getLocation();
        Location.findById(id, function(err, location) {
            console.log("found location: " + JSON.stringify(location));
            if (!err && (location !== undefined && location !== null)) {
                var loc = location.toObject();
                var ArticleLocation = db.getArticleLocation();
                ArticleLocation.find({location: location._id}, function(err, articleLocations) {
                    console.log("found article locations: " + JSON.stringify(articleLocations));
                    if (!err && (articleLocations !== undefined && articleLocations !== null)) {
                        loc.articleList = articleLocations;
                    } else {
                        loc.articleList = [];
                    }
                    var ProductLocation = db.getProductLocation();
                    ProductLocation.find({location: location._id}, function(err, productLocations) {
                        console.log("found product locations: " + JSON.stringify(productLocations));
                        if (!err && (productLocations !== undefined && productLocations !== null)) {
                            loc.productList = productLocations;
                        } else {
                            loc.productList = [];
                        }
                        console.log("location returned: " + JSON.stringify(loc));
                        callback(loc);
                    });
                });

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
exports.list = function(callback) {
    var Location = db.getLocation();
    Location.find({}, null, {sort: {name: 1}}, function(err, results) {
        console.log("found location list: " + JSON.stringify(results));
        if (err) {
            callback({});
        } else {
            if (results !== undefined && results !== null) {
                callback(results);
            } else {
                callback({});
            }
        }
    });
};



