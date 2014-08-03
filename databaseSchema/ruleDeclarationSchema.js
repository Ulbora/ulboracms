//rulesDeclarationSchema
var mongoose = require('mongoose');

var ruleDeclarationSchema = new mongoose.Schema({
    name: {type: String, required: true, trim: true},
    ruleKey: {type: Number, required: true}
});
module.exports = ruleDeclarationSchema;


