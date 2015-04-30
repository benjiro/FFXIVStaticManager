var utils = require('./utils');
var Loot = require('./../models/user');
var app = require('./../app');
var request = require('supertest');
var async = require('async');

describe('Post requests on /loot endpoint', function() {

  beforeEach(function(done) {
    request(app)
    .post('/user')
    .send('username=Ben&password=test&name=Benjamin')
    .expect(200, done);
  });

  it('Returns a 400 with no arguments' , function(done) {
    request(app)
    .post('/auth')
    .send('username=Ben&password=test')
    .expect(200)
    .end(function(err, res) {
      request(app)
      .post('/loot')
      .set('Authorization', 'bearer ' + res.body.token)
      .send('')
      .expect('Content-Type', /json/)
      .expect(/"message":"Loot validation failed"/)
      .expect(400, done);
    });
  });

  it('Returns a 400 with invalid arguments' , function(done) {
    request(app)
    .post('/auth')
    .send('username=Ben&password=test')
    .expect(200)
    .end(function(err, res) {
      request(app)
      .post('/loot')
      .set('Authorization', 'bearer ' + res.body.token)
      .send('playerName=dsfdsf')
      .expect('Content-Type', /json/)
      .expect(/"message":"Loot validation failed"/)
      .expect(400, done);
    });
  });

  it('Returns a 200 with valid arguments' , function(done) {
    request(app)
    .post('/auth')
    .send('username=Ben&password=test')
    .expect(200)
    .end(function(err, res) {
      request(app)
      .post('/loot')
      .set('Authorization', 'bearer ' + res.body.token)
      .send('playerName=test&allocatedBy=test&itemName=test&bossName=test&type=test&itemID=2321&turn=10')
      .expect('Content-Type', /json/)
      .expect(/"message":"Loot item created"/)
      .expect(200, done);
    });
  });
});

describe('Get requests on /loot endpoint', function() {

  it('Returns a 200 with empty json response', function(done) {
    request(app)
    .get('/loot')
    .expect(200)
    .expect('Content-Type', /json/)
    .expect('[]', done)
  });

});
