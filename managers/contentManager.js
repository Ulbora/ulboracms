//contentManager

var db = require('../db/db');
var manager = require('../managers/manager');


/**
 * 
 * @param id
 *      
 */
exports.getArticle = function (id, callback) {

};


/**
 * 
 * @param id
 *      
 */
exports.getProduct = function (id, callback) {

};


/**
 * 
 * @param json
 *      
 */
exports.getContentList = function (json, creds, callback) {
    var isOk = manager.securityCheck(json);
    var returnVal = {
        Frontpage: []
    };
    if (isOk) {
        findPublicAccessLevel(function (publicAccessLevel) {
            if (json.frontPage) {
                doFrontPage(function (frontPageList) {
                    var fpList = [];
                    for(var fpCnt = 0; fpCnt < frontPageList.length; fpCnt++){
                        var fp = frontPageList[fpCnt];
                        if(fp.accessLevel.toString() === publicAccessLevel){
                            fpList.push(fp);
                        }else{
                            if(creds !== null && creds.loggedIn){
                                fpList.push(fp);
                            }
                        }
                    }
                    returnVal.Frontpage = fpList;
                    
                });
            } else {

            }
        });
    } else {
        callback(returnVal);
    }
};


doFrontPage = function (callback) {

};

findPublicAccessLevel = function (callback) {
    var AccessLevel = db.getAccessLevel();
    AccessLevel.find({}, function (err, results) {
        var publicId = "-1";
        if (!err && results !== undefined && results !== null) {            
            for(var cnt = 0; cnt < results.length; cnt++){
                if(manager.ACCESS_LEVEL_PUBLIC === results.name){
                    publicId = results._id;
                    break;
                }
            }
            callback(publicId);
        } else {
            callback(publicId);
        }
    });
};

