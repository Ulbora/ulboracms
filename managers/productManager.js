//productManager


var db = require('../db/db');
var manager = require('../managers/manager');

/**
 * 
 * @param json
 *      
 */
exports.create = function (json, callback) {
    var returnVal = {
        success: false,
        message: ""
    };
    var isOk = manager.securityCheck(json);
    if (isOk) {
        var Location = db.getLocation();
        Location.find({}, null, {sort: {name: 1}}, function (locErr, locationlist) {
            if (locErr) {
                returnVal.message = "save failed";
                console.log("location error: " + locErr);
                callback(returnVal);
            } else {
                console.log("locationlist=" + locationlist);
                if (json.accessLevel !== undefined && json.accessLevel !== null) {
                    manager.validateAccessLevel(json.accessLevel, function (validAccessLevel) {
                        if (validAccessLevel) {
                            //no need to validate user already done at this point
                            //validate cat
                            if (json.category !== undefined && json.category !== null) {
                                manager.validateCategory(json.category, function (validCategory) {
                                    if (validCategory) {
                                        //no need to validate user already done at this point 
                                        //validate sec
                                        if (json.section !== undefined && json.section !== null) {
                                            manager.validateSection(json.section, function (validSection) {
                                                if (validSection) {
                                                    //no need to validate user already done at this point 
                                                    //validate lan
                                                    if (json.language !== undefined && json.language !== null) {
                                                        manager.validateLanguage(json.language, function (validLanguage) {
                                                            if (validLanguage) {
                                                                //no need to validate user already done at this point 
                                                                console.log("locationList:" + json.locationList);
                                                                var locIds = json.locationList.toString();
                                                                var locList = null;
                                                                if (locIds !== undefined && locIds !== null) {
                                                                    locList = locIds.split(",");
                                                                }
                                                                console.log("article locations=" + locList);
                                                                delete json.locationList;
                                                                var Product = db.getProduct();
                                                                var prod = new Product(json);
                                                                prod.save(function (prodErr) {
                                                                    if (prodErr) {
                                                                        returnVal.message = "save failed";
                                                                        console.log("product save error: " + prodErr);
                                                                        callback(returnVal);
                                                                    } else {
                                                                        // validate location
                                                                        if (locList !== undefined && locList !== null) {
                                                                            console.log("in location check");
                                                                            for (var locCnt = 0; locCnt < locList.length; locCnt++) {
                                                                                console.log("in location for loop");
                                                                                var loc = locList[locCnt];
                                                                                console.log("location to save=" + loc);
                                                                                if (loc !== undefined && loc !== null) {
                                                                                    for (var locListCnt = 0; locListCnt < locationlist.length; locListCnt++) {
                                                                                        console.log("locations the same:" + (loc === locationlist[locListCnt]._id.toString()))
                                                                                        if (loc === locationlist[locListCnt]._id.toString()) {
                                                                                            console.log("in location for save");
                                                                                            saveProductLocation(loc, prod._id);
                                                                                            break;
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }

                                                                        }
                                                                        returnVal.success = true;
                                                                        callback(returnVal);
                                                                    }
                                                                });
                                                            } else {
                                                                returnVal.message = "bad language";
                                                                callback(returnVal);
                                                            }
                                                        });
                                                    } else {
                                                        returnVal.message = "bad language";
                                                        callback(returnVal);
                                                    }
                                                } else {
                                                    returnVal.message = "bad section";
                                                    callback(returnVal);
                                                }
                                            });
                                        } else {
                                            returnVal.message = "bad section";
                                            callback(returnVal);
                                        }
                                    } else {
                                        returnVal.message = "bad Category";
                                        callback(returnVal);
                                    }
                                });
                            } else {
                                returnVal.message = "bad category";
                                callback(returnVal);
                            }
                        } else {
                            returnVal.message = "bad access level";
                            callback(returnVal);
                        }
                    });
                } else {
                    returnVal.message = "bad access level";
                    callback(returnVal);
                }
            }
        });
    } else {
        callback(returnVal);
    }
};


/**
 * 
 * @param json
 *      
 */
exports.update = function (json, callback) {
    var returnVal = {
        success: false,
        message: ""
    };

    var isOk = manager.securityCheck(json);
    if (isOk) {
        var Location = db.getLocation();
        Location.find({}, null, {sort: {name: 1}}, function (locErr, locationlist) {
            if (locErr) {
                returnVal.message = "save failed";
                console.log("location error: " + locErr);
                callback(returnVal);
            } else {
                console.log("locationlist=" + locationlist);
                if (json.accessLevel !== undefined && json.accessLevel !== null) {
                    manager.validateAccessLevel(json.accessLevel, function (validAccessLevel) {
                        if (validAccessLevel) {
                            //no need to validate user already done at this point
                            //validate cat
                            if (json.category !== undefined && json.category !== null) {
                                manager.validateCategory(json.category, function (validCategory) {
                                    if (validCategory) {
                                        //no need to validate user already done at this point 
                                        //validate sec
                                        if (json.section !== undefined && json.section !== null) {
                                            manager.validateSection(json.section, function (validSection) {
                                                if (validSection) {
                                                    //no need to validate user already done at this point 
                                                    //validate lan
                                                    if (json.language !== undefined && json.language !== null) {
                                                        manager.validateLanguage(json.language, function (validLanguage) {
                                                            if (validLanguage) {
                                                                //no need to validate user already done at this point 
                                                                console.log("locationList:" + json.locationList);
                                                                var locIds = json.locationList.toString();
                                                                var locList = null;
                                                                if (locIds !== undefined && locIds !== null) {
                                                                    locList = locIds.split(",");
                                                                }
                                                                console.log("article locations=" + locList);
                                                                delete json.locationList;

                                                                // var tag = json.tag;
                                                                // delete json.tag;
                                                                var Product = db.getProduct();
                                                                Product.findById(json.id, function (prodErr, prod) {
                                                                    if (prodErr) {
                                                                        returnVal.message = "save failed";
                                                                        console.log("product save error: " + prodErr);
                                                                        callback(returnVal);
                                                                    } else {
                                                                        if (prod !== undefined && prod !== null) {
                                                                            prod.name = json.name;
                                                                            prod.desc = json.desc;
                                                                            prod.metaAuthorName = json.metaAuthorName;
                                                                            prod.metaDesc = json.metaDesc;
                                                                            prod.metaKeyWords = json.metaKeyWords;
                                                                            prod.metaRobotKeyWords = json.metaRobotKeyWords;
                                                                            //prod.modifiedDate = new Date();
                                                                            prod.published = json.published;
                                                                            prod.externalLink = json.externalLink;
                                                                            prod.imageLocation = json.imageLocation;
                                                                            prod.promoVideoLink = json.promoVideoLink;
                                                                            prod.currencyCode = json.currencyCode;
                                                                            prod.price = json.price;
                                                                            prod.accessLevel = json.accessLevel;
                                                                            prod.category = json.category;
                                                                            prod.section = json.section;
                                                                            prod.language = json.language;
                                                                            prod.save(function (prodUpdateErr) {
                                                                                if (prodUpdateErr) {
                                                                                    returnVal.message = "update failed";
                                                                                    console.log("product update error: " + prodUpdateErr);
                                                                                    callback(returnVal);
                                                                                } else {
                                                                                    // make a call to delete all art locations===========
                                                                                    // validate location
                                                                                    deleteProductLocations(prod._id, function () {
                                                                                        if (locList !== undefined && locList !== null) {
                                                                                            console.log("in location check");
                                                                                            for (var locCnt = 0; locCnt < locList.length; locCnt++) {
                                                                                                console.log("in location for loop");
                                                                                                var loc = locList[locCnt];
                                                                                                console.log("location to save=" + loc);
                                                                                                if (loc !== undefined && loc !== null) {
                                                                                                    for (var locListCnt = 0; locListCnt < locationlist.length; locListCnt++) {
                                                                                                        console.log("locations the same:" + (loc === locationlist[locListCnt]._id.toString()))
                                                                                                        if (loc === locationlist[locListCnt]._id.toString()) {
                                                                                                            console.log("in location for save");
                                                                                                            saveProductLocation(loc, prod._id);
                                                                                                            break;
                                                                                                        }
                                                                                                    }

                                                                                                }
                                                                                            }

                                                                                        }
                                                                                        returnVal.success = true;
                                                                                        callback(returnVal);
                                                                                    });
                                                                                }
                                                                            });
                                                                        } else {
                                                                            returnVal.message = "bad product";
                                                                            callback(returnVal);
                                                                        }
                                                                    }
                                                                });
                                                            } else {
                                                                returnVal.message = "bad language";
                                                                callback(returnVal);
                                                            }
                                                        });
                                                    } else {
                                                        returnVal.message = "bad language";
                                                        callback(returnVal);
                                                    }
                                                } else {
                                                    returnVal.message = "bad section";
                                                    callback(returnVal);
                                                }
                                            });
                                        } else {
                                            returnVal.message = "bad section";
                                            callback(returnVal);
                                        }
                                    } else {
                                        returnVal.message = "bad Category";
                                        callback(returnVal);
                                    }
                                });
                            } else {
                                returnVal.message = "bad category";
                                callback(returnVal);
                            }
                        } else {
                            returnVal.message = "bad access level";
                            callback(returnVal);
                        }
                    });
                } else {
                    returnVal.message = "bad access level";
                    callback(returnVal);
                }
            }
        });
    } else {
        callback(returnVal);
    }
};


/**
 * 
 * @param id
 *      
 */
exports.delete = function (id, callback) {
// it is important to delete all mongodb documents related to this product before deleting the product
    var returnVal = {
        success: false,
        message: ""
    };
    var isOk = manager.securityCheck(id);
    if (isOk) {
        console.log("id: " + id);
        var Product = db.getProduct();
        Product.findById(id, function(artErr, results) {
            if (!artErr && results !== undefined && results !== null) {
                deleteProductLocations(id, null);                
                results.remove();
                returnVal.success = true;
                callback(returnVal);
            } else {
                returnVal.message = "bad product";
                callback(returnVal);
            }
        });
    } else {
        returnVal.message = "bad product";
        callback(returnVal);
    }
};


/**
 * 
 * @param id
 *      
 */
exports.get = function (id, callback) {
    var isOk = manager.securityCheck(id);
    if (isOk) {
        var Product = db.getProduct();
        Product.findById(id, function (prodErr, results) {
            console.log("found product: " + JSON.stringify(results));
            if (prodErr) {
                callback({});
            } else {
                if (results !== undefined && results !== null) {
                    var ProductLocation = db.getProductLocation();
                    ProductLocation.find({product: results._id}, function (prodLocErr, prodLocResults) {
                        if (prodLocErr) {
                            callback({});
                        } else {
                            if (prodLocResults !== undefined && prodLocResults !== null) {
                                var p = results.toObject();
                                var prodLocList = [];
                                for (var prodLocCnt = 0; prodLocCnt < prodLocResults.length; prodLocCnt++) {
                                    prodLocList.push(prodLocResults[prodLocCnt].location);
                                }
                                p.productLocationList = prodLocList;
                                callback(p);
                            } else {
                                callback({});
                            }
                        }

                    });

                } else {
                    callback({});
                }
            }
        });
    } else {
        callback({});
    }

};


/**
 * 
 * @param json
 *      
 */
exports.list = function (callback) {
    var returnVal = [];
    var Language = db.getLanguage();
    Language.find({}, null, {sort: {name: 1}}, function (lanErr, lanList) {
        if (lanErr) {
            callback({});
        } else {
            if (lanList !== undefined && lanList !== null) {
                var Product = db.getProduct();
                Product.find({}, null, {sort: {title: 1}}, function (prodErr, results) {
                    console.log("found products list: " + JSON.stringify(results));
                    if (prodErr) {
                        callback({});
                    } else {
                        if (results !== undefined && results !== null) {
                            for (var cnt = 0; cnt < results.length; cnt++) {
                                var p = results[cnt];
                                for (var lanCnt = 0; lanCnt < lanList.length; lanCnt++) {
                                    var l = lanList[lanCnt];
                                    if (p.language.toString() === l._id.toString()) {
                                        var a = {
                                            "_id": p._id,
                                            "name": p.name,
                                            "desc": p.desc,
                                            "language": l.name
                                        };
                                        returnVal.push(a);
                                        break;
                                    }
                                }
                            }
                            callback(returnVal);
                        } else {
                            callback({});
                        }
                    }
                });
            } else {
                callback({});
            }
        }

    });

};



saveProductLocation = function (loc, prod) {
    var ProductLocation = db.getProductLocation();
    var prodLoc = {
        "product": null,
        "location": null
    };
    prodLoc.product = prod;
    prodLoc.location = loc;
    var productLocation = new ProductLocation(prodLoc);
    productLocation.save(function (err) {
        if (err) {
            console.log("product location save error: " + err);
        }
    });
};


deleteProductLocations = function (prod, callback) {
    var ProductLocation = db.getProductLocation();
    ProductLocation.find({product: prod}, function (prodLocErr, prodLocResults) {
        if (!prodLocErr && (prodLocResults !== undefined && prodLocResults !== null)) {
            for (var cnt = 0; cnt < prodLocResults.length; cnt++) {
                var prodLoc = prodLocResults[cnt];
                prodLoc.remove();
            }
            if (callback !== undefined && callback !== null) {
                callback();
            }
        } else {
            if (callback !== undefined && callback !== null) {
                callback();
            }
        }
    });
};

