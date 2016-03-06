//mongoDB files
var conf = require('../configuration');
var mongoose = require('mongoose');
//var mongoConnectString = "mongodb://localhost/ulboracms";
var mongoConnectString = "mongodb://";//localhost/ulboracms";
//this is specific to RedHat's OpenShift 
if (process.env.DOCKER_MONGODB_NAME && process.env.DOCKER_MONGODB_USERNAME) {
    mongoConnectString += (process.env.DOCKER_MONGODB_USERNAME + ":" +
            process.env.DOCKER_MONGODB_PASSWORD + "@" +
            process.env.DOCKER_MONGODB_HOST + ':' +
            process.env.DOCKER_MONGODB_PORT + '/' +
            process.env.DOCKER_MONGODB_NAME);
    //this is specific to a Docker self contained containers
} else if (process.env.DOCKER_MONGODB_NAME) {
    mongoConnectString += (conf.HOST + "/" + process.env.DOCKER_MONGODB_NAME);
    //this is specific to a Docker data containers
} else if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
    mongoConnectString = (process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
            process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
            process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
            process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
            process.env.OPENSHIFT_APP_NAME);
} else if (process.env.ULBORA_CMS_DATABASE_NAME && process.env.ULBORA_CMS_DATABASE_USERNAME) {
    // the database information is set in system variables and uses authentication
    mongoConnectString = (process.env.ULBORA_CMS_DATABASE_USERNAME + ":" +
            process.env.ULBORA_CMS_DATABASE_PASSWORD + "@" +
            process.env.ULBORA_CMS_DATABASE_HOST + ':' +
            process.env.ULBORA_CMS_DATABASE_PORT + '/' +
            process.env.ULBORA_CMS_DATABASE_NAME);

} else if (process.env.ULBORA_CMS_DATABASE_NAME) {
    mongoConnectString += (conf.ULBORA_CMS_DATABASE_HOST + "/" + conf.ULBORA_CMS_DATABASE_NAME);
}else if(process.env.MONGO_PORT_27017_TCP_ADDR){
    //this is the default database
    mongoConnectString += (process.env.MONGO_PORT_27017_TCP_ADDR + "/" + process.env.DOCKER_ULBORACMS_DATABASE_NAME);
}else {
    //this is the default database
    mongoConnectString += (conf.HOST + "/" + conf.DATABASE_NAME);
}
//---------add other mongoDB configuration blocks here----------------
//
//
//
//--------------------------------------------------------------------



//mongoose.connect('mongodb://localhost/blogpost');
mongoose.connect(mongoConnectString);

var manager = require('../managers/manager');


var accessLevelSchema = require('../databaseSchema/accessLevelSchema');
var addonsSchema = require('../databaseSchema/addonsSchema');
var articleLocationSchema = require('../databaseSchema/articleLocationSchema');
var articleSchema = require('../databaseSchema/articleSchema');
var commentSchema = require('../databaseSchema/commentSchema');
var articleTextSchema = require('../databaseSchema/articleTextSchema');
var categorySchema = require('../databaseSchema/categorySchema');
var configurationSchema = require('../databaseSchema/configurationSchema');
var databaseVersionSchema = require('../databaseSchema/databaseVersionSchema');
var downloadableFileSchema = require('../databaseSchema/downloadableFileSchema');
var feedSchema = require('../databaseSchema/feedSchema');
var frontPageSchema = require('../databaseSchema/frontPageSchema');
var languageSchema = require('../databaseSchema/languageSchema');
var linkSchema = require('../databaseSchema/linkSchema');
var locationSchema = require('../databaseSchema/locationSchema');
var mediaSchema = require('../databaseSchema/mediaSchema');
var productLocationSchema = require('../databaseSchema/productLocationSchema');
var productPriceSchema = require('../databaseSchema/productPriceSchema');
var productSchema = require('../databaseSchema/productSchema');
var roleSchema = require('../databaseSchema/roleSchema');
var ruleDeclarationSchema = require('../databaseSchema/ruleDeclarationSchema');
var sectionSchema = require('../databaseSchema/sectionSchema');
var tagSchema = require('../databaseSchema/tagSchema');
var userSchema = require('../databaseSchema/userSchema');
var workflowRuleSchema = require('../databaseSchema/workflowRuleSchema');
var templateSchema = require('../databaseSchema/templateSchema');
var mailServerSchema = require('../databaseSchema/mailServerSchema');
var templateEngineSchema = require('../databaseSchema/templateEngineSchema');



var AccessLevel = mongoose.model('AccessLevel', accessLevelSchema);
var Addons = mongoose.model('Addons', addonsSchema);
var Location = mongoose.model('Location', locationSchema);
var Language = mongoose.model('Language', languageSchema);
var Category = mongoose.model('Category', categorySchema);
var Section = mongoose.model('Section', sectionSchema);
var Role = mongoose.model('Role', roleSchema);
var Link = mongoose.model('Link', linkSchema);
var Feed = mongoose.model('Feed', feedSchema);
var Configuration = mongoose.model('Configuration', configurationSchema);
var DatabaseVersion = mongoose.model('DatabaseVersion', databaseVersionSchema);
var Media = mongoose.model('Media', mediaSchema);
var RuleDeclaration = mongoose.model('RuleDeclaration', ruleDeclarationSchema);
var WorkflowRule = mongoose.model('WorkflowRule', workflowRuleSchema);
var User = mongoose.model('User', userSchema);
var Article = mongoose.model('Article', articleSchema);
var ArticleText = mongoose.model('ArticleText', articleTextSchema);
var Comment = mongoose.model('Comment', commentSchema);
var ArticleLocation = mongoose.model('ArticleLocation', articleLocationSchema);
var Tag = mongoose.model('Tag', tagSchema);
var FrontPage = mongoose.model('FrontPage', frontPageSchema);
var Product = mongoose.model('Product', productSchema);
var ProductLocation = mongoose.model('ProductLocation', productLocationSchema);
var ProductPrice = mongoose.model('ProductPrice', productPriceSchema);
var DownloadableFile = mongoose.model('DownloadableFile', downloadableFileSchema);
var Template = mongoose.model('Template', templateSchema);
var MailServer = mongoose.model('MailServer', mailServerSchema);
var TemplateEngine = mongoose.model('TemplateEngine', templateEngineSchema);


exports.getAccessLevel = function () {
    return AccessLevel;
};
exports.getAddons = function () {
    return Addons;
};
exports.getLocation = function () {
    return Location;
};
exports.getLanguage = function () {
    return Language;
};
exports.getCategory = function () {
    return Category;
};
exports.getSection = function () {
    return Section;
};
exports.getRole = function () {
    return Role;
};
exports.getLink = function () {
    return Link;
};
exports.getFeed = function () {
    return Feed;
};
exports.getConfiguration = function () {
    return Configuration;
};
exports.getDatabaseVersion = function () {
    return DatabaseVersion;
};
exports.getMedia = function () {
    return Media;
};
exports.getRuleDeclaration = function () {
    return RuleDeclaration;
};
exports.getWorkflowRule = function () {
    return WorkflowRule;
};
exports.getUser = function () {
    return User;
};
exports.getArticle = function () {
    return Article;
};
exports.getArticleText = function () {
    return ArticleText;
};
exports.getComment = function () {
    return Comment;
};
exports.getArticleLocation = function () {
    return ArticleLocation;
};
exports.getTag = function () {
    return Tag;
};
exports.getFrontPage = function () {
    return FrontPage;
};
exports.getProduct = function () {
    return Product;
};
exports.getProductLocation = function () {
    return ProductLocation;
};
exports.getProductPrice = function () {
    return ProductPrice;
};
exports.getDownloadableFile = function () {
    return DownloadableFile;
};
exports.getTemplate = function () {
    return Template;
};
exports.getMailServer = function () {
    return MailServer;
};
exports.getTemplateEngine = function () {
    return TemplateEngine;
};

//initialize the mongoDB database with needed records required for startup
exports.initializeMongoDb = function () {
    //check if databaseVersion record is set
    initializeDatabaseVersion();
};

initializeDatabaseVersion = function () {
    DatabaseVersion.find({}, function (err, results) {
        if (err) {
            console.log("databaseVersion Error:" + err);
        } else {
            console.log("DatabaseVersion:" + JSON.stringify(results));
            if (results.length === 0) {
                var versionRecord = {
                    version: "1.0.0"
                };
                var dbVer = new DatabaseVersion(versionRecord);
                dbVer.save(function (err) {
                    if (err) {
                        console.log("databaseVersion save error: " + err);
                    } else {
                        //check if roles are in database
                        initializeRoles();
                    }
                });
            } else {
                //check if roles are in database
                initializeRoles();
            }
        }
    });
};

initializeRoles = function () {
    //check if roles are in database
    Role.find({}, function (err, results) {
        if (err) {
            console.log("Role Error:" + err);
        } else {
            console.log("Role:" + JSON.stringify(results));
            if (results.length === 0) {
                var superAdminRecord = {
                    name: manager.ROLE_SUPER_ADMIN
                };
                var adminRecord = {
                    name: manager.ROLE_ADMIN
                };
                var authorRecord = {
                    name: manager.ROLE_AUTHOR
                };
                var userRecord = {
                    name: manager.ROLE_USER
                };
                var role = new Role(superAdminRecord);
                role.save(function (err) {
                    if (err) {
                        console.log("super admin role save error: " + err);
                    } else {
                        role = new Role(adminRecord);
                        role.save(function (err) {
                            if (err) {
                                console.log("admin role save error: " + err);
                            } else {
                                role = new Role(authorRecord);
                                role.save(function (err) {
                                    if (err) {
                                        console.log("author role save error: " + err);
                                    } else {
                                        role = new Role(userRecord);
                                        role.save(function (err) {
                                            if (err) {
                                                console.log("user role save error: " + err);
                                            } else {
                                                //check if default users are in database
                                                initializeDefaultUsers();
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            } else {
                //check if default users are in database
                initializeDefaultUsers();
            }
        }
    });
};

initializeDefaultUsers = function () {
    //check if default users are in database
    Role.findOne({name: manager.ROLE_SUPER_ADMIN}, function (err, roleResults) {
        if (err) {
            console.log("lookup super admin role error:" + err);
        } else {
            console.log("role:" + JSON.stringify(roleResults));
            var superAdmimRole = roleResults.toObject();
            User.find({}, function (err, results) {
                if (err) {
                    console.log("user Error:" + err);
                } else {
                    console.log("user:" + JSON.stringify(results));
                    if (results.length === 0) {
                        var hashedPw = manager.hashPasswordSync("admin", "admin");
                        var adminUserRecord = {
                            username: "admin",
                            password: hashedPw,
                            enabled: true,
                            emailAddress: "admin@ulboracms.com",
                            firstName: "super",
                            lastName: "administrator",
                            role: superAdmimRole
                        };
                        var u = new User(adminUserRecord);
                        u.save(function (err) {
                            if (err) {
                                console.log("super admin user save error: " + err);
                            } else {
                                //check if accessLevel or in database
                                initializeAccessLevels();
                            }
                        });

                    } else {
                        //check if accessLevel or in database
                        initializeAccessLevels();
                    }
                }
            });
        }
    });
};

initializeAccessLevels = function () {
    //check if accessLevel or in database
    AccessLevel.find({}, function (err, results) {
        if (err) {
            console.log("accessLevels Error:" + err);
        } else {
            console.log("accessLevels:" + JSON.stringify(results));
            if (results.length === 0) {
                var publicAccessLevelRecord = {
                    name: manager.ACCESS_LEVEL_PUBLIC
                };
                var userAccessLevelRecord = {
                    name: manager.ACCESS_LEVEL_USER
                };
                var acc = new AccessLevel(publicAccessLevelRecord);
                acc.save(function (err) {
                    if (err) {
                        console.log("public accessLevels save error: " + err);
                    } else {
                        acc = new AccessLevel(userAccessLevelRecord);
                        acc.save(function (err) {
                            if (err) {
                                console.log("user accessLevels save error: " + err);
                            } else {
                                //check if english language is in database
                                initializeLanguage();
                            }
                        });
                    }
                });
            } else {
                //check if english language is in database
                initializeLanguage();
            }
        }
    });
};

initializeLanguage = function () {
    //check if english language is in database
    Language.find({}, function (err, results) {
        if (err) {
            console.log("language Error:" + err);
        } else {
            console.log("language:" + JSON.stringify(results));
            if (results.length === 0) {
                var englishLanguageRecord = {
                    name: "English US",
                    defaultLanguage: true,
                    code: "en-us"
                };
                var spanishLanguageRecord = {
                    name: "Spanish Puerto Rico",
                    defaultLanguage: false,
                    code: "es-pr"
                };
                var lan = new Language(englishLanguageRecord);
                lan.save(function (err) {
                    if (err) {
                        console.log("english language save error: " + err);
                    } else {
                        lan = new Language(spanishLanguageRecord);
                        lan.save(function (err) {
                            if (err) {
                                console.log("spanish language save error: " + err);
                            } else {
                                //initial template
                                initializeTemplate();
                            }
                        });
                    }
                });
            } else {
                //initial template
                initializeTemplate();
            }
        }
    });
};


initializeTemplate = function () {
    //check if in database
    Template.find({}, function (err, results) {
        if (err) {
            console.log("template Error:" + err);
        } else {
            console.log("template:" + JSON.stringify(results));
            if (results.length === 0) {
                var templateRecord = {
                    name: "default",
                    defaultTemplate: true,
                    angularTemplate: false
                };
                var tmp = new Template(templateRecord);
                tmp.save(function (err) {
                    if (err) {
                        console.log("template save error: " + err);
                    } else {
                        var template2Record = {
                            name: "BlogPost",
                            defaultTemplate: false
                        };
                        var tmp2 = new Template(template2Record);
                        tmp2.save(function (err) {
                            var template3Record = {
                                name: "CleanBlog",
                                defaultTemplate: false
                            };
                            var tmp3 = new Template(template3Record);
                            tmp3.save(function (err) {
                                if (err) {
                                    console.log("template3 save error: " + err);
                                } else {
                                    //rules declaration
                                    initializeRulesDeclaration();
                                }
                            });
                        });
                    }
                });
            } else {
                //rules declaration
                initializeRulesDeclaration();
            }
        }
    });
};


initializeRulesDeclaration = function () {
    //check if in database
    RuleDeclaration.find({}, function (err, results) {
        if (err) {
            console.log("rules Error:" + err);
        } else {
            console.log("rules:" + JSON.stringify(results));
            if (results.length === 0) {
                var ruleDeclarationRecord = {
                    name: manager.REQUIRE_PUBLISH_APPROVAL_RULE_NAME,
                    ruleKey: manager.REQUIRE_PUBLISH_APPROVAL_RULE_KEY
                };

                var rule = new RuleDeclaration(ruleDeclarationRecord);
                console.log("rules obj:" + JSON.stringify(ruleDeclarationRecord));
                rule.save(function (err) {
                    if (err) {
                        console.log("rule save error: " + err);
                    } else {
                        //mail server
                        initializeMailServer();
                    }
                });
            } else {
                //mail server
                initializeMailServer();
            }
        }
    });
};



initializeMailServer = function () {
    //check if in database
    MailServer.find({}, function (err, results) {
        if (err) {
            console.log("mail server Error:" + err);
        } else {
            console.log("mail server:" + JSON.stringify(results));
            if (results.length === 0) {
                var mserv = {
                    smtpHost: null,
                    smtpPort: null,
                    username: null,
                    password: null,
                    authMethod: null,
                    tls: null
                };

                var mserver = new MailServer(mserv);
                console.log("mail server:" + JSON.stringify(mserv));
                mserver.save(function (err) {
                    if (err) {
                        console.log("mail server save error: " + err);
                    } else {
                        initialSections();
                    }
                });
            } else {
                initialSections();
            }
        }
    });
};

initialSections = function () {
    //check if is in database
    Language.findOne({code: "en-us"}, function (lanErr, lan) {
        if (!lanErr && lan !== undefined && lan !== null) {
            Section.find({}, function (err, results) {
                if (err) {
                    console.log("section Error:" + err);
                } else {
                    console.log("sections:" + JSON.stringify(results));
                    if (results.length === 0) {

                        var secVal = {
                            name: null,
                            language: null
                        };
                        secVal.name = "About";
                        secVal.language = lan._id;

                        var sec = new Section(secVal);
                        console.log("section:" + JSON.stringify(secVal));
                        sec.save();


                        secVal.name = "Contacts";
                        sec = new Section(secVal);
                        console.log("section:" + JSON.stringify(secVal));
                        sec.save();

                        secVal.name = "MainPage";
                        sec = new Section(secVal);
                        console.log("section:" + JSON.stringify(secVal));
                        sec.save();

                        secVal.name = "News";
                        sec = new Section(secVal);
                        console.log("section:" + JSON.stringify(secVal));
                        sec.save();

                        initialCategories();

                    } else {
                        initialCategories();
                    }
                }
            });
        }
    });
};


initialCategories = function () {
    //check if is in database
    Language.findOne({code: "en-us"}, function (lanErr, lan) {
        if (!lanErr && lan !== undefined && lan !== null) {
            Category.find({}, function (err, results) {
                if (err) {
                    console.log("category Error:" + err);
                } else {
                    console.log("catagory:" + JSON.stringify(results));
                    if (results.length === 0) {

                        var catVal = {
                            name: null,
                            language: null
                        };
                        catVal.name = "News";
                        catVal.language = lan._id;

                        var cat = new Category(catVal);
                        console.log("category:" + JSON.stringify(catVal));
                        cat.save();


                        catVal.name = "NewsFlash";
                        cat = new Category(catVal);
                        console.log("category:" + JSON.stringify(catVal));
                        cat.save();


                        initialLocations();

                    } else {
                        initialLocations();
                    }
                }
            });
        }
    });
};


initialLocations = function () {
    //check if is in database
    // Location.findOne({code: "en-us"}, function (lanErr, lan) {
    //if (!lanErr && lan !== undefined && lan !== null) {
    Location.find({}, function (err, results) {
        if (err) {
            console.log("Location Error:" + err);
        } else {
            console.log("Location:" + JSON.stringify(results));
            if (results.length === 0) {

                var locVal = {
                    name: null
                };
                locVal.name = "Center";

                var loc = new Location(locVal);
                console.log("Location:" + JSON.stringify(locVal));
                loc.save();


                locVal.name = "Right";
                loc = new Location(locVal);
                console.log("Location:" + JSON.stringify(locVal));
                loc.save();

                locVal.name = "Left";
                loc = new Location(locVal);
                console.log("Location:" + JSON.stringify(locVal));
                loc.save();

                locVal.name = "TopMenu";
                locVal.menu = true;
                loc = new Location(locVal);
                console.log("Location:" + JSON.stringify(locVal));
                loc.save();

                initializeTemplateEngine();

            } else {
                initializeTemplateEngine();
            }
        }
    });
    //}
    //});
};

initializeTemplateEngine = function () {
    //check if in database
    TemplateEngine.find({}, function (err, results) {
        if (err) {
            console.log("template Engine Error:" + err);
        } else {
            console.log("template  Engine:" + JSON.stringify(results));
            if (results.length === 0) {
                var templateEngineRecord = {
                    name: "EJS",
                    defaultEngine: false,
                    engine: "ejs",
                    ext: "ejs"
                };
                var tmpEng = new TemplateEngine(templateEngineRecord);
                tmpEng.save(function (err) {
                    if (err) {
                        console.log("template Engine save error: " + err);
                    } else {
                        var template2Record = {
                            name: "Handlebars (hbs)",
                            defaultEngine: true,
                            engine: "hbs",
                            ext: "hbs"
                        };
                        var tmpEng2 = new TemplateEngine(template2Record);
                        tmpEng2.save(function (err) {
                            if (err) {
                                console.log("template Engine 2 save error: " + err);
                            } else {
                                var template3Record = {
                                    name: "Jade",
                                    defaultEngine: false,
                                    engine: "jade",
                                    ext: "jade"
                                };
                                var tmpEng3 = new TemplateEngine(template3Record);
                                tmpEng3.save(function (err) {
                                    if (err) {
                                        console.log("template Engine 3 save error: " + err);
                                    } else {
                                        //rules declaration
                                        //initializeRulesDeclaration();
                                    }
                                });
                            }
                        });
                    }
                });
            } else {
                //rules declaration
                //initializeRulesDeclaration();
            }
        }
    });
};
