var path = require('path')
    , Instela = require('../lib/main.js')
    , expect = require('chai').expect;


describe('instela', function (done) {

    it('should load as a module', function (done) {
        expect(Instela).to.exist;
        done();
    });
});
