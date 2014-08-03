//locationSchema
var mongoose = require('mongoose');

var locationSchema = new mongoose.Schema({
    name: {type: String, required: true, trim: true}
});
module.exports = locationSchema;
    