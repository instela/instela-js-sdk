var api = require('../api/oauth.js');

function OAuth(config) {
    this.init(config);
}

OAuth.prototype.init = function (client) {
    this.client = client;

    return this;
};

OAuth.prototype.GetAccessToken = function (params, callback) {
    this.client.callApi(api, 'GetAccessToken', params, callback);
};

module.exports = new OAuth();
