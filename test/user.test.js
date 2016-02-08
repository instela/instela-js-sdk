var
    expect = require('chai').expect,
    Instela = require('../lib/main.js');
var UserClient = Instela.UserClient();
var OAuthClient = Instela.OAuthClient();


var generateRandom = function () {
    return Math.floor((Math.random() * 1000000) + 1);
};


describe('instela user client', function (done) {

    it('gets user', function (done) {
        this.setTimeout(15000);

        UserClient.GetUser({
            'id': 1
        }, function (error, data) {
            if (error) {
                return done(error);
            }

            expect(data.id).to.equals(1);
            expect(data.username).to.equals("wondrous");
            return done();
        });
    });

    it('create user', function (done) {
        this.setTimeout(15000);

        var username = "test" + generateRandom();
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
            expect(data.member_since !== null).to.equals(true);
            user_id = data.id;
            OAuthClient.GetAccessToken({
                'username': email,
                'password': password
            }, function (error, data) {
                if (error) {
                    return done(error);
                }
                expect(data.access_token !== null).to.equals(true);
                expect(data.refresh_token !== null).to.equals(true);
                return UserClient.ModifyUser({
                    token: {
                        access_token: data.access_token
                    },
                    id: user_id,
                    username: username
                }, function (error, data) {
                    if (error) {
                        return done(error);
                    }
                    expect(data.username).to.equals(username);
                    return done();
                });
            });
        });
    });
});