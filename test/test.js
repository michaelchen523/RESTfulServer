var superagent = require('superagent');
var chai = require('chai');
var expect = chai.expect;
    should = chai.should();
var app = require('../src/server.js');
var shortid = require('shortid');
var mocha = require('mocha');

describe('Testing', function() {
    var id;
    id = shortid.generate();
    //Testing the POST function of server
    it('can successfully create a new thing', function(done) {
        superagent.post('127.0.0.1:3000/thing')
            .send({
                'id': id,
                'name': "Michael"
            })
            .end(function(err, res) {
                console.log(res.body);
                expect(err).to.eql(null);
                expect(res.body).to.not.be.eql(null);
                expect(res.body[0].id).to.be.eql(id);

                done();
            })
    });

    //Testing the GET function of server
    it('can successfully get a note', function(done) {
        superagent.get('http://localhost:3000/thing/' + id)
            .end(function(err, res) {
                expect(res.body[0].id).to.be.eql(id);
                expect(res.body[0].name).to.be.eql('Michael');

                done();
            })
    });

    it('can successfully update a thing', function(done) {
        superagent.put('http://localhost:3000/thing')
            .send({
                'id': id,
                'name': 'Michael'
            })
            .end(function(err, res) {
                expect(res.body[0].updated.id).to.be.eql(id);
                expect(res.body[0].updated.name).to.be.eql('Michael');

                done();
            })
    });

    it('can succesfully delete a thing', function(done) {
        superagent.del('http://127.0.0.1:3000/thing/' + id)
            .end(function(err, res) {
                expect(err).to.eql(null);
                expect(res.body.status).to.eql(204);

                done();
            })
    })
});

describe('Invalid Testing', function() {
    var id;

    id = shortid.generate();
    console.log(id);
    //Testing unsuccesful posts
    it('will fail if id is not a string', function(done) {
        superagent.post('127.0.0.1:3000/thing')
            .send({
                'id': 123,
                'name': 'Josh'
            })
            .end(function(err, res) {
                expect(res.text).to.eql('no valid ID provided');
                done();
            })
    });

    it("will test against the validation schema", function(done) {
        superagent.post('127.0.0.1:3000/thing')
            .send({
                "id": id
            })
            .end(function(err, res) {
                expect(res.body.status).to.eql(400);
                done();
            })
    })
});