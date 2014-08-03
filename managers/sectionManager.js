//sectionManager


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
                var Section = db.getSection();
                Section.findOne({name: json.name}, function(err, results) {
                    console.log("found section in create: " + JSON.stringify(results));
                    if (!err && (results === undefined || results === null)) {
                        var sec = new Section(json);
                        sec.save(function(err) {
                            if (err) {
                                returnVal.message = "save failed";
                                console.log("section save error: " + err);
                            } else {
                                returnVal.success = true;
                            }
                            callback(returnVal);
                        });
                    } else {
                        returnVal.message = "existing section";
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
                var Section = db.getSection();
                Section.findById(json.id, function(err, results) {
                    console.log("found section in update: " + JSON.stringify(results));
                    if (!err && (results !== undefined && results !== null)) {
                        var sec = results;
                        sec.name = json.name;
                        sec.language = json.language;
                        sec.save(function(err) {
                            if (err) {
                                console.log("section save error: " + err);
                            } else {
                                returnVal.success = true;
                            }
                            callback(returnVal);
                        });

                    } else {
                        returnVal.message = "section not found";
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
        var Section = db.getSection();
        Section.findById(id, function(err, results) {
            console.log("found section for delete: " + JSON.stringify(results));
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
        var Section = db.getSection();
        Section.findById(id, function(err, results) {
            console.log("found section: " + JSON.stringify(results));
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
    var returnVal = [];
    var Section = db.getSection();
    Section.find({}, null, {sort: {language: 1, name: 1}}, function(err, results) {
        console.log("found section list: " + JSON.stringify(results));
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
                        Article.find({}, function(artErr, artList) {
                            if (!artErr && artList !== undefined && artList !== null) {
                                useArticle = true;
                            }
                            for (var cnt = 0; cnt < results.length; cnt++) {
                                console.log("test:" + results[cnt].language);
                                var sec = results[cnt].toObject();
                                for (var lanCnt = 0; lanCnt < lanList.length; lanCnt++) {
                                    var lanId = lanList[lanCnt]._id.toString();
                                    var secLanId = results[cnt].language.toString();                                   
                                    if (lanId === secLanId) {                                        
                                        sec.language = lanList[lanCnt];
                                        console.log("found language: " + JSON.stringify(lanList[lanCnt]));
                                        break;
                                    }
                                }
                                sec.inUse = false;
                                var secId = sec._id.toString();
                                if (useArticle) {
                                    for (var artCnt = 0; cnt < artList.length; artCnt++) {
                                        var artSecId = artList[artCnt].section.toString();
                                        if(secId === artSecId){
                                            sec.inUse = true;
                                            break;
                                        }
                                    }
                                }
                                returnVal.push(sec);
                                console.log("Section:" + JSON.stringify(sec));
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



