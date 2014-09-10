//configurationSchema
var mongoose = require('mongoose');

var configurationSchema = new mongoose.Schema({
    siteName: {type: String, required: true, trim: true},
    siteDesc: {type: String, required: true, trim: true}, 
    domainName: {type: String, required: false, trim: true},
    registrationEmailActivationSubject: {type: String, required: false, trim: true},
    registrationEmailActivationTitle: {type: String, required: false, trim: true},
    registrationEmailActivationGreeting: {type: String, required: false, trim: true},
    registrationEmailActivationMessage: {type: String, required: false, trim: true},    
    registrationEmailActivationUrl: {type: String, required: false, trim: true},    
    registrationEmailWelcomeSubject: {type: String, required: false, trim: true},
    registrationEmailWelcomeTitle: {type: String, required: false, trim: true},
    registrationEmailWelcomeGreeting: {type: String, required: false, trim: true},
    registrationEmailWelcomeMessage: {type: String, required: false, trim: true},    
    registrationEmailWelcomeUrl: {type: String, required: false, trim: true},    
    resetPasswordEmailSubject: {type: String, required: false, trim: true},
    resetPasswordEmailTitle: {type: String, required: false, trim: true},
    resetPasswordEmailGreeting: {type: String, required: false, trim: true},
    resetPasswordEmailMessage: {type: String, required: false, trim: true},    
    resetPasswordEmailUrl: {type: String, required: false, trim: true},   
    language: {type: mongoose.Schema.ObjectId, required: true, ref: "Language"}
});
module.exports = configurationSchema;


