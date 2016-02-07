//initialize web interface
//var db = require('../db/db');
var fs = require('fs');
//var refreshRssCache = false;
//var cashedPages = [];
var contentController = require('../controllers/contentController');
//var webTemplateUtility = require('../utils/webTemplateUtility');
var angular = require('./angularJsInitializer');
var fileRouteInitializer = require('./routes/fileRouteInitializer');
var ejsRouteInitializer = require('./routes/ejsRouteInitializer');
exports.initialize = function (__dirname, self, cacheControlUtility, templateEngine) {
    console.log("template engine in web initializer: "+ JSON.stringify(templateEngine));
    fileRouteInitializer.fileInitializer(self);    
    if(templateEngine.engine === "ejs"){
        ejsRouteInitializer.initialize(self, cacheControlUtility, __dirname);
    }

};

