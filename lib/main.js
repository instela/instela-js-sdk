"use strict";

/**
 * Module dependencies.
 */

var extend = require('lodash/fp/extend'),
    request = require('superagent');

var oauth = require('./oauth.js'),
    user = require('./user.js'),
    message = require('./message.js');


/**
 * Module constructor.
 */

function Instela(config) {
    this.init(config);
}

/**
 * Module init.
 */

Instela.prototype.init = function (config) {

    //Specify module default config here
    var defaults = {
        endpoint: 'https://api.instela.com/'
    };

    //override config defaults if specified
    this.config = extend(defaults, config);
};


Instela.prototype.SetConfig = function (config) {
    this.config = extend(this.config, config);
};

/**
 * OAuth Client
 *
 * @api public
 */
Instela.prototype.OAuthClient = function () {
    return oauth.init(this);
};


/**
 * User Client
 *
 * @api public
 */
Instela.prototype.UserClient = function () {
    return user.init(this);
};

/**
 * User Client
 *
 * @api public
 */
Instela.prototype.MessageClient = function () {
    return message.init(this);
};

/**
 * Example function to get config
 */
Instela.prototype.getConfig = function () {
    return this.config;
};

Instela.prototype.callApi = function (api, operation, params, callback) {

    var addUrlParam = function (url, param, value) {
        // Using a positive lookahead (?=\=) to find the
        // given parameter, preceded by a ? or &, and followed
        // by a = with a value after than (using a non-greedy selector)
        // and then followed by a & or the end of the string
        var val = new RegExp('(\\?|\\&)' + param + '=.*?(?=(&|$))'),
            parts = url.toString().split('#'),
            url = parts[0],
            hash = parts[1],
            qstring = /\?.+$/,
            newURL = url;

        // Check if the parameter exists
        if (val.test(url)) {
            // if it does, replace it, using the captured group
            // to determine & or ? at the beginning
            newURL = url.replace(val, '$1' + param + '=' + value);
        }
        else if (qstring.test(url)) {
            // otherwise, if there is a query string at all
            // add the param to the end of it
            newURL = url + '&' + param + '=' + value;
        }
        else {
            // if there's no query string, add one
            newURL = url + '?' + param + '=' + value;
        }

        if (hash) {
            newURL += '#' + hash;
        }

        return newURL;
    };

    var operation = api.operations[operation];
    var method = operation.http.method,
        path = operation.http.requestUri;


    path = path.replace(/({\w.})/g, function (match, contents, offset, s) {
            var paramName = contents.replace('{', '').replace('}', '');
            return params[paramName];
        }
    );


    var url = this.config.endpoint + api.metadata.endpointPrefix + path;

    var requestBody = {};

    operation.parameters.forEach(function (parameter) {
        if (typeof params[parameter.name] !== 'undefined') {
            if (parameter.location === 'body') {
                requestBody[parameter.name] = params[parameter.name];
            }

            if (parameter.location === "query") {
                url = addUrlParam(url, parameter.name, params[parameter.name]);
            }
        }
    });

    var req = request(method, url).set('Accept', 'application/json');

    var auth_header = 'Authorization';
    if (typeof params.token !== 'undefined') {
        req.set(auth_header, 'Bearer ' + params.token.access_token);
    }

    if (typeof this.config.token !== 'undefined') {
        req.set(auth_header, 'Bearer ' + this.config.token.access_token);
    }

    req
        .send(requestBody)
        .end(function (err, res) {
            if (!err) {
                if (typeof res.headers["location"] !== 'undefined') {
                    var locationRequest = request('GET', res.headers["location"].replace('http://', 'https://'));

                    if (typeof params.token !== 'undefined') {
                        locationRequest.set('Authorization', 'Bearer ' + params.access_token);
                    }

                    return locationRequest.end(function (err, res) {
                        callback(null, res.body);
                    });
                }

                return callback(null, res.body);
            }
            return callback(err);
        });
};


/**
 * Export default singleton.
 *
 * @api public
 */
module.exports = new Instela();
