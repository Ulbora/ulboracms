//downloadableFileSchema
var mongoose = require('mongoose');

var downloadableFileSchema = new mongoose.Schema({
    name: {type: String, required: true, trim: true},
    dateEntered: {type: Date, default: Date.now},
    extension: {type: String, required: true, trim: true},
    fileSize: {type: Number, required: true},
    fileData: {type: Buffer, required: true},
    downloadCount: {type: Number, default: 0},
    version: {type: String, required: true, trim: true},
    product: {type: mongoose.Schema.ObjectId, required: true, ref: "Product"}
});
module.exports = downloadableFileSchema;


