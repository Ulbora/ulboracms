//categorySchema
var mongoose = require('mongoose');

var categorySchema = new mongoose.Schema({
    name: {type: String, required: true, trim: true},
    language: {type: mongoose.Schema.ObjectId, required: true, ref: "Language"}
});
module.exports = categorySchema;
    