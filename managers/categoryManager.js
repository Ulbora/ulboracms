//categoryManager


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
        manager.validateLanguage(json.language, function(found) {
            if (found) {
                var Category = db.getCategory();
                Category.findOne({name: json.name}, function(err, results) {
                    console.log("found category in create: " + JSON.stringify(results));
                    if (!err && (results === undefined || results === null)) {
                        var cat = new Category(json);
                        cat.save(function(err) {
                            if (err) {
                                returnVal.message = "save failed";
                                console.log("category save error: " + err);
                            } else {
                                returnVal.success = true;
                            }
                            callback(returnVal);
                        });
                    } else {
                        returnVal.message = "existing category";
                        callback(returnVal);
                    }
                });
            } else {
                returnVal.message = "bad language";
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
    var returnVal = {
        success: false,
        message: ""
    };
    var isOk = manager.securityCheck(json);
    if (isOk) {
        manager.validateLanguage(json.language, function(found) {
            if (found) {
                var Category = db.getCategory();
                Category.findById(json.id, function(err, results) {
                    console.log("found category in update: " + JSON.stringify(results));
                    if (!err && (results !== undefined && results !== null)) {
                        var cat = results;
                        cat.name = json.name;
                        cat.language = json.language;
                        cat.save(function(err) {
                            if (err) {
                                console.log("category save error: " + err);
                            } else {
                                returnVal.success = true;
                            }
                            callback(returnVal);
                        });

                    } else {
                        returnVal.message = "category not found";
                        callback(returnVal);
                    }
                });
            } else {
                returnVal.message = "bad language";
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
exports.delete = function(id, callback) {
    var returnVal = {
        success: false,
        message: ""
    };
    var isOk = manager.securityCheck(id);
    if (isOk) {
        console.log("id: " + id);
        var Category = db.getCategory();
        Category.findById(id, function(err, results) {
            console.log("found category for delete: " + JSON.stringify(results));
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
        var Category = db.getCategory();
        Category.findById(id, function(err, results) {
            console.log("found category: " + JSON.stringify(results));
            if (!err && (results !== undefined && results !== null)) {
                callback(results);
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
    /*
    var Category = db.getCategory();
    Category.find({}, function(err, results) {
        console.log("found category list: " + JSON.stringify(results));
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
    */
    var returnVal = [];
    var Category = db.getCategory();
    Category.find({}, null, {sort: {language: 1, name: 1}}, function(err, results) {
        console.log("found category list: " + JSON.stringify(results));
        if (err) {
            callback({});
        } else {
            if (results !== undefined && results !== null) {
                var Language = db.getLanguage();
                Language.find({}, function(lanListErr, lanList) {
                    console.log("found language list: " + JSON.stringify(lanList));
                    if (!lanListErr && lanList !== undefined && lanList !== null) {
                        var Article = db.getArticle();
                        var useArticle = false;
                        Article.find({}, 'category', function(artErr, artList) {
                            //console.log("article:" + artList);
                            if (!artErr && artList !== undefined && artList !== null) {
                                useArticle = true;
                            }
                            for (var cnt = 0; cnt < results.length; cnt++) {
                                console.log("test:" + results[cnt].language);
                                var cat = results[cnt].toObject();
                                for (var lanCnt = 0; lanCnt < lanList.length; lanCnt++) {
                                    var lanId = lanList[lanCnt]._id.toString();
                                    var catLanId = results[cnt].language.toString();                                   
                                    if (lanId === catLanId) {                                        
                                        cat.language = lanList[lanCnt];
                                        console.log("found language: " + JSON.stringify(lanList[lanCnt]));
                                        break;
                                    }
                                }
                                cat.inUse = false;
                                var catId = cat._id.toString();
                                if (useArticle) {
                                    for (var artCnt = 0; artCnt < artList.length; artCnt++) {
                                        var artCatId = artList[artCnt].category.toString();
                                        if(catId === artCatId){
                                            cat.inUse = true;
                                            break;
                                        }
                                    }
                                }
                                returnVal.push(cat);
                                console.log("Category:" + JSON.stringify(cat));
                            }
                            callback(returnVal);
                        });
                    } else {
                        callback({});
                    }
                });
            } else {
                callback({});
            }
        }
    });
};



