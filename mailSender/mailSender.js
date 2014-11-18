//email sender
var nodemailer = require('nodemailer');
var db = require('../db/db');
var manager = require('../managers/manager');


exports.sendActivationEmail = function (username, toEmail, code) {
    var Language = db.getLanguage();
    Language.findOne({defaultLanguage: true}, function (lanErr, lanResults) {
        console.log("found language set to default: " + JSON.stringify(lanResults));
        if (!lanErr && (lanResults !== undefined && lanResults !== null)) {
            var Configuration = db.getConfiguration();
            Configuration.findOne({language: lanResults._id}, function (confErr, confResults) {
                console.log("found existing configuration: " + JSON.stringify(confResults));
                if (!confErr && (confResults !== undefined && confResults !== null)) {
                    createTransport(function (transporter) {
                        var mailOptions = {
                            from: confResults.registrationEmailActivationFromEmailAddress, // sender address
                            to: toEmail, // list of receivers
                            subject: confResults.registrationEmailActivationSubject, // Subject line
                            text: confResults.registrationEmailActivationMessage + " " + confResults.registrationEmailActivationUrl + "?username="+ username + "&code=" + code, // plaintext body
                            html: '' // html body
                        };
                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.log("email error message:" + error);
                            } else {
                                console.log('Message sent: ' + info.response);
                            }
                        });

                    });
                }
            });
        }
    });

};



exports.sendResetPasswordEmail = function (toEmail, password) {
    var Language = db.getLanguage();
    Language.findOne({defaultLanguage: true}, function (lanErr, lanResults) {
        console.log("found language set to default: " + JSON.stringify(lanResults));
        if (!lanErr && (lanResults !== undefined && lanResults !== null)) {
            var Configuration = db.getConfiguration();
            Configuration.findOne({language: lanResults._id}, function (confErr, confResults) {
                console.log("found existing configuration: " + JSON.stringify(confResults));
                if (!confErr && (confResults !== undefined && confResults !== null)) {
                    createTransport(function (transporter) {
                        var mailOptions = {
                            from: confResults.resetPasswordEmailFromEmailAddress, // sender address
                            to: toEmail, // list of receivers
                            subject: confResults.resetPasswordEmailSubject, // Subject line
                            text: confResults.resetPasswordEmailMessage + " new password: "+ password , // plaintext body
                            html: '' // html body
                        };
                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.log("email error message:" + error);
                            } else {
                                console.log('Message sent: ' + info.response);
                            }
                        });

                    });
                }
            });
        }
    });

};


createTransport = function (callback) {
    var MailServer = db.getMailServer();
    MailServer.find({}, function (err, results) {
        console.log("found mail server: " + JSON.stringify(results));
        if (!err && (results !== undefined && results !== null && results.length > 0)) {
            var m = results[0].toObject();
            m.password = manager.aes256Decrypt(m.password);
            var tpOpt = {
                host: m.smtpHost, // hostname
                secureConnection: m.secure, // TLS requires secureConnection to be false
                port: m.smtpPort, // port for secure SMTP
                debug: m.debug,
                auth: {
                    user: m.username,
                    pass: m.password
                },
                tls: {
                    rejectUnauthorized: false
                }
            };
            console.log("mail server options: " + JSON.stringify(tpOpt));
            var transport = nodemailer.createTransport(tpOpt);

            callback(transport);
        } else {
            callback(null);
        }
    });
};

