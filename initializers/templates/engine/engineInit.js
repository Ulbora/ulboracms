var ejsInitializer = require('../engines/ejsInit');
var hbsInitializer = require('../engines/hbsInit');
var jadeInitializer = require('../engines/jadeInit');
exports.initialize = function (__dirname, self, templateEngine) {
    if (templateEngine !== undefined && templateEngine != null) {
        ejsInitializer.initialize(__dirname, self, templateEngine);
        hbsInitializer.initialize(__dirname, self, templateEngine);
        jadeInitializer.initialize(__dirname, self, templateEngine);
    }else{
        hbsInitializer.initialize(__dirname, self, templateEngine);
    }

};
