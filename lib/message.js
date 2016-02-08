var api = require('../api/messages.js');

function Message(config) {
    this.init(config);
}

Message.prototype.init = function (client) {
    this.client = client;

    return this;
};


Message.prototype.GetThreadList = function (params, callback) {
    this.client.callApi(api, 'GetThreadList', params, callback);
};

Message.prototype.GetThread = function (params, callback) {
    this.client.callApi(api, 'GetThread', params, callback);
};

Message.prototype.CreateUser = function (params, callback) {
    this.client.callApi(api, 'GetThread', params, callback);
};

Message.prototype.SendMessage = function (params, callback) {
    this.client.callApi(api, 'SendMessage', params, callback);
};

module.exports = new Message();
