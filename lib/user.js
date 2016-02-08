var api = require('../api/users.json');

function User(config) {
    this.init(config);
}

User.prototype.init = function (client) {
    this.client = client;

    return this;
};


User.prototype.GetUser = function (params, callback) {
    this.client.callApi(api, 'GetUser', params, callback);
};

User.prototype.CreateUser = function (params, callback) {
    this.client.callApi(api, 'CreateUser', params, callback);
};

User.prototype.ModifyUser = function (params, callback) {
    this.client.callApi(api, 'ModifyUser', params, callback);
};

module.exports = new User();
