//contentController
var db = require('../db/db');
var manager = require('../managers/manager');
var contentManager = require('../managers/contentManager');
var atob = require('atob');//base64 to json

exports.getContentList = function (req, filter, callback) {
    console.log("filter data in content list: " + JSON.stringify(filter));
    var browserLan = req.headers["accept-language"];
    var locations = [];
    locations.push("FrontPage");
    var Location = db.getLocation();
    Location.find({}, function (err, locs) {
        if (!err && locs !== undefined && locs !== null) {
            for (var locCnt = 0; locCnt < locs.length; locCnt++) {
                var foundLoc = locs[locCnt];
                locations.push(foundLoc.name);
            }
        }
        contentManager.getContentList(filter, null, browserLan, function (result) {
            console.log("in callback");
            console.log("articleLocation: " + JSON.stringify(result));
            for (var lcnt = 0; lcnt < locations.length; lcnt++) {
                var locName = locations[lcnt];
                console.log("location:" + locName);
                for (var cnt = 0; cnt < result.articleLocations[locName].length; cnt++) {
                    console.log("location array all:" + JSON.stringify(result.articleLocations));
                    console.log("location array:" + JSON.stringify(result.articleLocations[locName]));
                    console.log("location before conversion html:" + result.articleLocations[locName][cnt].articleText.text);
                    if (result.articleLocations[locName][cnt].articleText.processed === undefined || result.articleLocations[locName][cnt].articleText.processed === null) {
                        result.articleLocations[locName][cnt].articleText.text = atob(result.articleLocations[locName][cnt].articleText.text);
                        console.log("location after conversion html:" + result.articleLocations[locName][cnt].articleText.text);
                        result.articleLocations[locName][cnt].articleText.processed = true;
                    }

                }
            }

            callback(result);
        });
    });


};