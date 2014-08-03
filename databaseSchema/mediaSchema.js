//mediaSchema
var mongoose = require('mongoose');

var mediaSchema = new mongoose.Schema({
    name: {type: String, required: true, trim: true},
    extension: {type: String, required: true, trim: true},
    fileSize: {type: Number, required: true},
    fileData: {type: Buffer, required: true},
    articleId: String,
    productId: String
});
module.exports = mediaSchema;



