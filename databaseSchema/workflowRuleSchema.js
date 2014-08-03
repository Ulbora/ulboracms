//workflowRuleSchema
var mongoose = require('mongoose');

var workflowRuleSchema = new mongoose.Schema({
    active: {type: Boolean, default: false},
    desc: {type: String, required: true, trim: true},
    name: {type: String, required: true, trim: true},
    user: {type: mongoose.Schema.ObjectId, required: true, ref: "User"},
    ruleDeclaration: {type: mongoose.Schema.ObjectId, required: true, ref: "RuleDeclaration"}
});
module.export = workflowRuleSchema;



