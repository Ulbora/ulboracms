var refreshCache = false;

exports.refresh = function(){
    refreshCache = true;
};


exports.refreshed = function(){
    refreshCache = false;
};

exports.needsRefresh = function(){
    return refreshCache;
};