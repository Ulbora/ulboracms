//frontPageSchema
var mongoose = require('mongoose');

var frontPageSchema = new mongoose.Schema({
    shortOrder: {type: Number, default: 0},
    article: {type: mongoose.Schema.ObjectId, required: true, ref: "Article"}
});
module.exports = frontPageSchema;


