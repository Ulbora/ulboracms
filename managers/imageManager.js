//imageManager


var db = require('../db/db');
var manager = require('../managers/manager');

/**
 * 
 * @param id
    *      
 */
exports.get = function (id, callback){
  var isOk = manager.securityCheck(id);
    if (isOk) {
        console.log("id: " + id);
        var Media = db.getMedia();
        Media.findById(id, function(err, results) {
            console.log("found media: " + JSON.stringify(results));
            if (!err && (results !== undefined && results !== null)) {
                callback(results.fileData, results.extension);
            } else {
                callback({}, null);
            }
        });
    } else {
        callback({});
    }
};



