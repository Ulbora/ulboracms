//initialize web interface
var fs = require('fs');
var contentController = require('../controllers/contentController');
var angularJsRouteInitializer = require('./routes/angularJsRouteInitializer');
var fileRouteInitializer = require('./routes/fileRouteInitializer');
var webRouteInitializer = require('./routes/webRouteInitializer');
exports.initialize = function (__dirname, self, cacheControlUtility, templateEngine) {
    console.log("template engine in web initializer: " + JSON.stringify(templateEngine));
    fileRouteInitializer.fileInitializer(self);    
    angularJsRouteInitializer.initializePartials(self);
    webRouteInitializer.initialize(self, cacheControlUtility, __dirname);   

};

