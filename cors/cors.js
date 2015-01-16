var conf = require('../configuration');


var CORS = function(req, res, next) {
    var origin = req.get('origin');
    console.log("origin:" + origin);
    var url = req.url;
    console.log('called url= ' + url);
    if (url !== null && url !== undefined) {
        res.header('Access-Control-Allow-Origin', conf.ALLOWED_ORIGINS);
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    }


    // intercept OPTIONS method
    if ('OPTIONS' === req.method) {
        res.send(200);
    }
    else {
        next();
    }
};

exports.CORS = CORS;