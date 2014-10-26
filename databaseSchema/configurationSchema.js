//configurationSchema
var mongoose = require('mongoose');

var configurationSchema = new mongoose.Schema({
    siteName: {type: String, required: true, trim: true},
    siteDesc: {type: String, required: true, trim: true}, 
    domainName: {type: String, required: false, trim: true},
    registrationEmailActivationSubject: {type: String, required: true, trim: true},
    registrationEmailActivationTitle: {type: String, required: true, trim: true},
    registrationEmailActivationGreeting: {type: String, required: true, trim: true},
    registrationEmailActivationMessage: {type: String, required: true, trim: true},    
    registrationEmailActivationUrl: {type: String, required: true, trim: true},  
    registrationEmailActivationFromEmailAddress: {type: String, required: true, trim: true}, 
    registrationEmailWelcomeSubject: {type: String, required: true, trim: true},
    registrationEmailWelcomeTitle: {type: String, required: true, trim: true},
    registrationEmailWelcomeGreeting: {type: String, required: true, trim: true},
    registrationEmailWelcomeMessage: {type: String, required: true, trim: true},    
    registrationEmailWelcomeUrl: {type: String, required: true, trim: true},    
    registrationEmailWelcomeFromEmailAddress: {type: String, required: true, trim: true},
    resetPasswordEmailSubject: {type: String, required: true, trim: true},
    resetPasswordEmailTitle: {type: String, required: true, trim: true},
    resetPasswordEmailGreeting: {type: String, required: true, trim: true},
    resetPasswordEmailMessage: {type: String, required: true, trim: true},    
    resetPasswordEmailUrl: {type: String, required: true, trim: true},   
    resetPasswordEmailFromEmailAddress: {type: String, required: true, trim: true},
    language: {type: mongoose.Schema.ObjectId, required: true, ref: "Language"}
});
module.exports = configurationSchema;


