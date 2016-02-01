var ejsInitializer = require('./ejsInitializer');
var hbsInitializer = require('./hbsInitializer');
var jadeInitializer = require('./jadeInitializer');
exports.initialize = function (__dirname, self, templateEngine) {
    if (templateEngine !== undefined && templateEngine != null) {
        ejsInitializer.initialize(__dirname, self, templateEngine);
        hbsInitializer.initialize(__dirname, self, templateEngine);
        jadeInitializer.initialize(__dirname, self, templateEngine);
    }else{
        hbsInitializer.initialize(__dirname, self, templateEngine);
    }

};
