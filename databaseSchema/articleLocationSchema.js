//articleLocationSchema
var mongoose = require('mongoose');

var articleLocationSchema = new mongoose.Schema({
    article: {type: mongoose.Schema.ObjectId, required: true, ref: "Article"},
    location: {type: mongoose.Schema.ObjectId, required: true, ref: "Location"}
});
module.exports = articleLocationSchema;
    