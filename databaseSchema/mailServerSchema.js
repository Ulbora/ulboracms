//mailServerSchema
var mongoose = require('mongoose');
var mailServerSchema = new mongoose.Schema({
    smtpHost: {type: String, required: false, trim: true},
    smtpPort: {type: String, required: false, trim: true},
    secure: {type: Boolean, default: false},
    username: {type: String, required: false, trim: true},
    password: {type: String, required: false, trim: true},
    ignoreTLS: {type: Boolean, default: true},
    debug: {type: Boolean, default: false},
    authMethod: {type: String, required: false, trim: true},
    tls: {type: String, required: false, trim: true}
});

module.exports = mailServerSchema;

