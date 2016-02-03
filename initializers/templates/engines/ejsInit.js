// initialize jade template engine
var tmplEngUtil = require('../../../utils/tmplEngUtil');
exports.initialize = function (__dirname, self, templateEngine) {
    if (templateEngine.engine === 'ejs') {
        self.app.set('view engine', 'ejs');
        self.app.set("views", __dirname + "/public");
        console.log("Template Engine is: " + templateEngine.engine);
    }
};