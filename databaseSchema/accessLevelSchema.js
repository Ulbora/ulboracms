//accessLevelSchema
var mongoose = require('mongoose');
var accessLevelSchema = new mongoose.Schema({
    name: {type: String, required: true, trim: true}
});

module.exports = accessLevelSchema;

