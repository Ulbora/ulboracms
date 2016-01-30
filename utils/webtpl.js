var db = require('../db/db');
exports.getDefaultTemplate = function (callback) {
    var Template = db.getTemplate();
    Template.findOne({defaultTemplate: true}, function (err, results) {
        var t = {
            name: "default",
            angularTemplate: false
        };
        console.log("found template set to default: " + JSON.stringify(results));
        if (!err && (results !== undefined && results !== null)) {
            t.name = results.name;
            t.angularTemplate = results.angularTemplate;
            callback(t);
        } else {
            callback(t);
        }
    });
};
