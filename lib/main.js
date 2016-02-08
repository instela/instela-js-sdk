"use strict";

/**
 * Module dependencies.
 */

var path = require('path'), extend = require('lodash/fp/extend'),
    request = require('superagent');

var oauth = require('./oauth.js'),
    user = require('./user.js'),
    message = require('./message.js');


/**
 * Module constructor.
 */

function Instela(config) {
    this.init(config);

    this.addUrlParam = function (url, param, value) {
        var a = document.createElement('a'), regex = /(?:\?|&amp;|&)+([^=]+)(?:=([^&]*))*/gi;
        var params = {}, match, str = [];
        a.href = url;
        while (match = regex.exec(a.search))
            if (encodeURIComponent(param) != match[1])
                str.push(match[1] + (match[2] ? "=" + match[2] : ""));
        str.push(encodeURIComponent(param) + (value ? "=" + encodeURIComponent(value) : ""));
        a.search = str.join("&");
        return a.href;
    }
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
                url = this.addUrlParam(url, parameter.name, params[parameter.name]);
            }
        }
    });

    var req = request(method, url).set('Accept', 'application/json');

    if (typeof params.token !== 'undefined') {
        req.set('Authorization', 'Bearer ' + params.token.access_token);
    }

    req.send(requestBody);
    req.end(function (err, res) {
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
