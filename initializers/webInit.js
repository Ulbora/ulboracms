//initialize web interface
//var db = require('../db/db');
var fs = require('fs');
var refreshRssCache = false;
var cashedPages = [];
var contentController = require('../controllers/contentController');
var webtpl = require('../utils/webtpl');
var angular = require('./angularJsInit');
var fileRouteInit = require('./routes/fileRouteInit');
var ejsRouteInit = require('./routes/ejsRouteInit');
exports.initialize = function (__dirname, self, refreshCache, templateEngine) {
    console.log("template engine in web initializer: "+ JSON.stringify(templateEngine));
    fileRouteInit.fileInitializer(self);
    if(templateEngine.engine === "ejs"){
        ejsRouteInit.initialize(self, refreshCache, __dirname);
    }

};

