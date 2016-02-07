var ejsInitializer = require('../engines/ejsInitializer');
var hbsInitializer = require('../engines/hbsInitializer');
var jadeInitializer = require('../engines/jadeInitializer');
exports.initialize = function (__dirname, self, templateEngine) {
    if (templateEngine !== undefined && templateEngine !== null) {
        ejsInitializer.initialize(__dirname, self, templateEngine);
        hbsInitializer.initialize(__dirname, self, templateEngine);
        jadeInitializer.initialize(__dirname, self, templateEngine);
    }else{
        hbsInitializer.initialize(__dirname, self, templateEngine);
    }

};
