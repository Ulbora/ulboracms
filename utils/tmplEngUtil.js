var db = require('../db/db');
exports.getDefaultTemplateEngine = function (callback) {
    var TemplateEngine = db.getTemplateEngine();
    TemplateEngine.findOne({defaultEngine: true}, function (err, results) {
        var t = {
            engine: "",
            ext: ""
        };
        console.log("found template set to default: " + JSON.stringify(results));
        if (!err && (results !== undefined && results !== null)) {
            t.engine = results.engine;
            t.ext = results.ext;
            callback(t);
        } else {
            callback(t);
        }
    });
};
