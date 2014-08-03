//articleTextSchema
var mongoose = require('mongoose');

var articleTextSchema = new mongoose.Schema({
    text: {type: Buffer, required: true},
    active: {type: Boolean, default: false},
    version: Number,
    article: {type: mongoose.Schema.ObjectId, required: true, ref: "Article"}
});
module.exports = articleTextSchema;

