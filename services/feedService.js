//feedService

var feedManager = require('../managers/feedManager');

exports.rssFeed = function (req, res, cache) {    
    feedManager.rssFeed(cache, function (response) {
        console.log("feed:" + JSON.stringify(response));
        res.send(response);
    });
};
