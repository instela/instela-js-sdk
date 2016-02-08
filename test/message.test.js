var
    expect = require('chai').expect,
    Instela = require('../lib/main.js');
var UserClient = Instela.UserClient();
var OAuthClient = Instela.OAuthClient();
var MessageClient = Instela.MessageClient();


var generateRandom = function () {
    return Math.floor((Math.random() * 1000000) + 1);
};


describe('instela message client', function (done) {

    it('sends message and gets it', function (done) {
        var email = "test" + generateRandom() + "@instela.com";
        var password = 'test_password';
        var user_id = null;

        UserClient.CreateUser({
            'email': email,
            'password': password,
            'realname': 'hasan huseyin'
        }, function (error, data) {
            if (error) {
                return done(error);
            }

            expect(data.id !== null).to.equals(true);
            expect(data.username).to.equals(null);
            user_id = data.id;

            OAuthClient.GetAccessToken({
                'username': email,
                'password': password
            }, function (error, token) {
                if (error) {
                    return done(error);
                }

                expect(token.access_token != null).to.equals(true);

                MessageClient.SendMessage({
                    'receiver': user_id,
                    'message': 'test',
                    'token': token
                }, function (error, data) {

                    if (error) {
                        return done(error);
                    }
                    expect(data.id !== null).to.equals(true);

                    MessageClient.GetThreadList({
                        'token': token
                    }, function (error, threadlist) {
                        if (error) {
                            return done(error);
                        }

                        expect(typeof threadlist.threads[0].messages[0].sender.id !== 'undefined').to.equals(true);
                        expect(typeof threadlist.threads[0].messages[0].receiver.id !== 'undefined').to.equals(true);

                        MessageClient.GetThread({
                            u1: threadlist.threads[0].messages[0].sender.id,
                            u2: threadlist.threads[0].messages[0].receiver.id,
                            token: token
                        }, function (error, thread) {
                            expect(thread.messages.length).to.equals(1);
                            return done();
                        });
                    });

                });
            });
        });
    });
});