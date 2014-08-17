//imageService

var imageManager = require('../managers/imageManager');

/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
exports.get = function(req, res) {
    var id = req.params.id;
    if (id !== null && id !== undefined) {
        imageManager.get(id, function(imageData, ext) {
            if (ext !== null) {
                res.set('Content-Type', 'image/' + ext);
                res.send(imageData);
            } else {
                res.send(imageData);
            }

        });
    } else {
        res.send({});
    }
};



