//accessLevelSchema
var mongoose = require('mongoose');
var templateEngineSchema = new mongoose.Schema({
    name: {type: String, required: true, trim: true},
    defaultEngine: {type: Boolean, default: false},
    engine: {type: String, required: true, trim: true},
    ext: {type: String, required: true, trim: true}
        
});

module.exports = templateEngineSchema;

