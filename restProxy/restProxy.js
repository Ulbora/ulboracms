//rest client
var Client = require('node-rest-client').Client;

//client = new Client();

exports.doPost = function (json, callback) {
    console.log("proxy post: " + JSON.stringify(json));
    var returnVal = {
        success: false,
        message: "",
        jsonResponse: null
    };

    var client = null;
    if (json.basicAuth) {
        var options_auth = {
            user: json.username,
            password: json.password
        };
        client = new Client(options_auth);
    } else {
        client = new Client();
    }
    var args = {
        data: json.jsonRequest,
        headers: {"Content-Type": "application/json"},
        requestConfig: {
            timeout: 2000
        },
        responseConfig: {
            timeout: 2000 //response timeout
        }
    };

    console.log("proxy post url: " + json.url);
    console.log("proxy post request: " + JSON.stringify(json.jsonRequest));
    try {
        var reqRtn = client.post(json.url, args, function (data, res) {
            // parsed response body as js object
            console.log("data: " + data);
            // raw response
            //console.log("response: "+ JSON.stringify(response));
            returnVal.success = true;
            returnVal.jsonResponse = data;
            callback(returnVal);
        });
        reqRtn.on('requestTimeout', function (req) {
            console.log("request has expired");
            req.abort();
            callback(returnVal);
        });
        reqRtn.on('responseTimeout', function (res) {
            console.log("response has expired");
            callback(returnVal);
        });
        reqRtn.on('error', function (err) {
            console.log('request error', err);
            callback(returnVal);
        });

    } catch (err) {
        console.log("proxy exception: " + err);
        callback(returnVal);
    }

};

exports.doPut = function (json, callback) {
    console.log("proxy put: " + JSON.stringify(json));
    var returnVal = {
        success: false,
        message: "",
        jsonResponse: null
    };

    var client = null;
    if (json.basicAuth) {
        var options_auth = {
            user: json.username,
            password: json.password
        };
        client = new Client(options_auth);
    } else {
        client = new Client();
    }
    var args = {
        data: json.jsonRequest,
        headers: {"Content-Type": "application/json"},
        requestConfig: {
            timeout: 2000
        },
        responseConfig: {
            timeout: 2000 //response timeout
        }
    };

    console.log("proxy put url: " + json.url);
    console.log("proxy put request: " + json.jsonRequest);
    try {
        var reqRtn = client.put(json.url, args, function (data, res) {
            // parsed response body as js object
            console.log("data: " + data);
            // raw response
            //console.log("response: "+ JSON.stringify(response));
            returnVal.success = true;
            returnVal.jsonResponse = data;
            callback(returnVal);
        });
        reqRtn.on('requestTimeout', function (req) {
            console.log("request has expired");
            req.abort();
            callback(returnVal);
        });
        reqRtn.on('responseTimeout', function (res) {
            console.log("response has expired");
            callback(returnVal);
        });
        reqRtn.on('error', function (err) {
            console.log('request error', err);
            callback(returnVal);
        });
    } catch (err) {
        console.log("proxy exception: " + err);
        callback(returnVal);
    }
};

exports.doGet = function (json, callback) {
    console.log("proxy get: " + JSON.stringify(json));
    var returnVal = {
        success: false,
        message: "",
        jsonResponse: null
    };
    var queryParameters = json.queryParameters;
    var pathParameters = json.pathParameters;
    var arguments = "";
    if (queryParameters !== undefined && queryParameters !== null && queryParameters.length > 0) {
        var moreParams = false;
        arguments += "?";
        for (var cnt = 0; cnt < queryParameters.length; cnt++) {
            if (moreParams) {
                arguments += "&";
            }
            var name = queryParameters[cnt].name;
            var val = queryParameters[cnt].value;
            arguments += (name + "=" + val);
            moreParams = true;
        }
    } else if (pathParameters !== undefined && pathParameters !== null && pathParameters.length > 0) {
        for (var cnt = 0; cnt < pathParameters.length; cnt++) {
            arguments += ("/" + pathParameters[cnt]);
        }
    }
    var url = json.url + arguments;
    var client = null;
    if (json.basicAuth) {
        var options_auth = {
            user: json.username,
            password: json.password
        };
        client = new Client(options_auth);
    } else {
        client = new Client();
    }

    var args = {
        requestConfig: {
            timeout: 2000
        },
        responseConfig: {
            timeout: 2000 //response timeout
        }
    };
    console.log("proxy get url: " + url);
    try {
        var reqRtn = client.get(url, args, function (data, res) {
            // parsed response body as js object
            console.log("data: " + data);
            // raw response
            //console.log("response: "+ JSON.stringify(response));
            returnVal.success = true;
            returnVal.jsonResponse = data;
            callback(returnVal);
        });
        reqRtn.on('requestTimeout', function (req) {
            console.log("request has expired");
            req.abort();
            callback(returnVal);
        });
        reqRtn.on('responseTimeout', function (res) {
            console.log("response has expired");
            callback(returnVal);
        });
        reqRtn.on('error', function (err) {
            console.log('request error', err);
            callback(returnVal);
        });
    } catch (err) {
        console.log("proxy exception: " + err);
        callback(returnVal);
    }
};

exports.doDelete = function (json, callback) {
    console.log("proxy delete: " + JSON.stringify(json));
    var returnVal = {
        success: false,
        message: "",
        jsonResponse: null
    };
    var queryParameters = json.queryParameters;
    var pathParameters = json.pathParameters;
    var arguments = "";
    if (queryParameters !== undefined && queryParameters !== null && queryParameters.length > 0) {
        var moreParams = false;
        arguments += "?";
        for (var cnt = 0; cnt < queryParameters.length; cnt++) {
            if (moreParams) {
                arguments += "&";
            }
            var name = queryParameters[cnt].name;
            var val = queryParameters[cnt].value;
            arguments += (name + "=" + val);
            moreParams = true;
        }
    } else if (pathParameters !== undefined && pathParameters !== null && pathParameters.length > 0) {
        for (var cnt = 0; cnt < pathParameters.length; cnt++) {
            arguments += ("/" + pathParameters[cnt]);
        }
    }
    var url = json.url + arguments;
    var client = null;
    if (json.basicAuth) {
        var options_auth = {
            user: json.username,
            password: json.password
        };
        client = new Client(options_auth);
    } else {
        client = new Client();
    }
    var args = {
        requestConfig: {
            timeout: 2000
        },
        responseConfig: {
            timeout: 2000 //response timeout
        }
    };
    console.log("proxy delete url: " + url);
    try {
        var reqRtn = client.delete(url, args, function (data, res) {
            // parsed response body as js object
            console.log("data: " + data);
            // raw response
            //console.log("response: "+ JSON.stringify(response));
            returnVal.success = true;
            returnVal.jsonResponse = data;
            callback(returnVal);
            reqRtn.on('requestTimeout', function (req) {
                console.log("request has expired");
                req.abort();
                callback(returnVal);
            });
            reqRtn.on('responseTimeout', function (res) {
                console.log("response has expired");
                callback(returnVal);
            });
            reqRtn.on('error', function (err) {
                console.log('request error', err);
                callback(returnVal);
            });
        });
    } catch (err) {
        console.log("proxy exception: " + err);
        callback(returnVal);
    }
};

