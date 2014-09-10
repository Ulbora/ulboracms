//tagSchema
var mongoose = require('mongoose');

var tagSchema = new mongoose.Schema({
    keyWords: {type: String, required: true, trim: true},
    //link: {type: String, required: true, trim: true},
    article: {type: mongoose.Schema.ObjectId, required: true, ref: "Article"}
});
module.exports = tagSchema;


