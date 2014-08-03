//articleManager


var db = require('../db/db');
var manager = require('../managers/manager');


/**
 * 
 * @param json
 *      
 */
exports.create = function(json, callback) {

};


/**
 * 
 * @param json
 *      
 */
exports.update = function(json, callback) {

};


/**
 * 
 * @param id
 *      
 */
exports.delete = function(id, callback) {

};


/**
 * 
 * @param id
 *      
 */
exports.get = function(id, callback) {

};


/**
 * 
 * @param json
 *      
 */
exports.list = function(json, callback) {

};




/**
 * 
 * @param json
 *      
 */
exports.values = function(json, creds, callback) {
    if(json.languageCode !== undefined && json.languageCode !== null){
        json.languageCode = json.languageCode.toLowerCase();
        json.languageCode = json.languageCode.replace("_", "-");
    }    
    console.log("languageCode: " + JSON.stringify(json.languageCode));
    var returnVal = {
        "uploadKey": null,
        "username": null,
        "accessLevelList": null,
        "categoryList": null,
        "sectionList": null,
        "locationList": null,
        "languageList": null
    };
    var isOk = manager.securityCheck(json);
    if (isOk) {
        var LanguageLookup = db.getLanguage();
        LanguageLookup.findOne({code: json.languageCode}, function(lannerr, lan) {
            console.log("found lookup language: " + JSON.stringify(lan));
            if (!lannerr && lan !== undefined && lan !== null) {

                returnVal.uploadKey = manager.generateFileUploadKey(creds.username);
                returnVal.username = creds.username;
                var AccessLevel = db.getAccessLevel();
                AccessLevel.find({}, null, {sort: {name: 1}}, function(alerr, alList) {
                    console.log("found AccessLevel list: " + JSON.stringify(alList));
                    if (!alerr && alList !== undefined && alList !== null) {
                        returnVal.accessLevelList = alList;
                    }
                    var Category = db.getCategory();
                    Category.find({language: lan._id}, null, {sort: {name: 1}}, function(cerr, clist) {
                        console.log("found category list: " + JSON.stringify(clist));
                        if (!cerr && clist !== undefined && clist !== null) {
                            returnVal.categoryList = clist;
                        }
                        var Section = db.getSection();
                        Section.find({language: lan._id}, null, {sort: {name: 1}}, function(serr, slist) {
                            console.log("found section list: " + JSON.stringify(slist));
                            if (!serr && slist !== undefined && slist !== null) {
                                returnVal.sectionList = slist;
                            }
                            var Location = db.getLocation();
                            Location.find({}, null, {sort: {name: 1}}, function(lerr, llist) {
                                console.log("found locaton list: " + JSON.stringify(llist));
                                if (!lerr && llist !== undefined && llist !== null) {
                                    returnVal.locationList = llist;
                                }
                                var Language = db.getLanguage();
                                Language.find({}, null, {sort: {name: 1}}, function(lnerr, lnlist) {
                                    console.log("found locaton list: " + JSON.stringify(lnlist));
                                    if (!lnerr && lnlist !== undefined && lnlist !== null) {
                                        returnVal.languageList = lnlist;
                                    }
                                    callback(returnVal);
                                });
                            });
                        });
                    });
                });
            } else {
                callback(returnVal);
            }
        });
    } else {
        callback(returnVal);
    }
};

