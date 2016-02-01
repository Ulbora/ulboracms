// initialize jade template engine
var tmplEngUtil = require('../../utils/tmplEngUtil');
exports.initialize = function (__dirname, self, templateEngine) {
    if (templateEngine.engine === 'jade') {
        self.app.set('view engine', 'jade');
        self.app.set("views", __dirname + "/");
        console.log("Template Engine is: " + templateEngine.engine);
    }
};