//contentService


var service = require('./service');
var manager = require('../managers/manager');
var contentManager = require('../managers/contentManager');



/**
 * 
 * @param req
    *      
 * @param res
    *      
 */
exports.getArticle = function (req, res){
  
};


/**
 * 
 * @param req
    *      
 * @param res
    *      
 */
exports.getProduct = function (req, res){
  
};


/**
 * 
 * @param req
    *      
 * @param res
    *      
 */
exports.getContentList = function (req, res){
   if (req.is('application/json')) {
        var reqBody = req.body;
        var bodyJson = JSON.stringify(reqBody);
        console.log("body: " + bodyJson);
        service.authenticatePassave(req, res, function(creds) {
            console.log("in auth callback");
            contentManager.getContentList(reqBody, creds, function(result) {
                res.send(result);
            });
        });
    } else {
        res.status(415);
        res.send({success: false});
    }
};



