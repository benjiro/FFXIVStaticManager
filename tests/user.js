var utils = require('./utils');
var User = require('./../models/user');
var app = require('./../app');
var request = require('supertest');
var async = require('async');

describe('Post requests on /user endpoint', function() {

  beforeEach(function(done) {
    request(app)
      .post('/user')
      .send('username=Ben123&password=test&name=Benjamin')
      .expect(200, done);
  });

  it('Returns a 400 with invalid arguments', function(done) {
    request(app)
      .post('/user')
      .send('')
      .expect(400, done);
  });

  it('Returns a json message with invalid arguments', function(done) {
    request(app)
      .post('/user')
      .send('')
      .expect('Content-Type', /json/)
      .expect(/"success":false/)
      .expect(/"message":"Invalid arguments"/, done);
  });

  it('Returns a username exists already if username is in database', function(done) {
    request(app)
      .post('/user')
      .send('username=Ben123&password=test&name=Benjamin')
      .expect(400)
      .expect('Content-Type', /json/)
      .expect(/"success":false/)
      .expect(/"message":"Username exists"/, done);
  });

  it('Creates a new user account and returns status 200', function(done) {
    request(app)
      .post('/user')
      .send('username=Ben&password=test&name=Benjamin')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(/"success":true/)
      .expect(/"message":"User created!"/, done);
  });

});

describe('Get requests on /user endpoint', function() {

  it('Returns a empty json array', function(done) {
    request(app)
      .get('/user')
      .expect(200)
      .expect('Content-Type', /json/, done);
  });

  it('Returns json of user all users', function(done) {
    async.series([
      function(cb) {
        request(app)
          .post('/user')
          .send('username=Ben&password=test&name=Benjamin')
          .expect(200, cb);
      },
      function(cb) {
        request(app)
          .post('/user')
          .send('username=Ben1&password=test&name=Benjamin')
          .expect(200, cb);
      },
      function(cb) {
        request(app)
          .post('/user')
          .send('username=Ben2&password=test&name=Benjamin')
          .expect(200, cb);
      },
      function(cb) {
        request(app)
          .get('/user')
          .expect(200)
          .expect('Content-Type', /json/)
          .expect(/"username":"Ben"/)
          .expect(/"username":"Ben1"/)
          .expect(/"username":"Ben2"/, cb);
      }
    ], done);
  });

  it('Returns user from given id', function(done) {
    async.series([
      function(cb) {
        request(app)
          .post('/user')
          .send('username=Ben&password=test&name=Benjamin')
          .expect(200, cb);
      },
      function(cb) {
        request(app)
          .get('/user')
          .expect(200)
          .end(function(err, res) {
            request(app)
              .get('/user/' + res.body[0]._id)
              .expect(200)
              .expect('Content-Type', /json/)
              .expect(/"username":"Ben"/, cb);
          });
      }
    ], done);
  });

  it('Returns a 400 if user doesn\'t exists', function(done) {
    request(app)
      .get('/user/INVALID')
      .expect(400, done);
  });

});

describe('Put request on /user/:id endpoint', function() {

  it('Returns a 403 if no token is present', function(done) {
    request(app)
      .put('/user/invalid')
      .send('username=change')
      .expect(403)
      .expect('Content-Type', /json/)
      .expect(/"success":false/)
      .expect(/"message":"No token provided"/, done);
  });

  it('Returns 403 invalid token', function(done) {
    request(app)
      .put('/user/invalid')
      .set('Authorization', 'dafdfsfs')
      .send('username=change')
      .expect(403)
      .expect('Content-Type', /json/)
      .expect(/"success":false/)
      .expect(/"message":"Failed to authenticate token."/, done);
  });

  it('Returns 200 if update is successful', function(done) {
    var id = '';
    async.series([
      function(cb) {
        request(app)
          .post('/user')
          .send('username=Ben&password=test')
          .expect(200, cb);
      },
      function(cb) {
        request(app)
          .get('/user')
          .expect(200, function(err, res) {
            id = res.body[0]._id;
            cb();
          });
      },
      function(cb) {
        request(app)
          .post('/auth')
          .send('username=Ben&password=test')
          .expect(200)
          .end(function(err, res) {
            request(app)
              .put('/user/' + id)
              .set('Authorization', 'bearer ' + res.body.token)
              .send('name=John')
              .expect(200)
              .expect('Content-Type', /json/)
              .expect(/"message":"User updated!"/, cb);
          });
      }
    ], done);
  });

});

describe('Delete request on /user/:id endpoint', function() {

  it('Returns a 403 if no token is present', function(done) {
    request(app)
      .delete('/user/invalid')
      .expect(403)
      .expect('Content-Type', /json/)
      .expect(/"success":false/)
      .expect(/"message":"No token provided"/, done);
  });

  it('Returns 403 invalid token', function(done) {
    request(app)
      .delete('/user/invalid')
      .set('Authorization', 'dafdfsfs')
      .expect(403)
      .expect('Content-Type', /json/)
      .expect(/"success":false/)
      .expect(/"message":"Failed to authenticate token."/, done);
  });

  it('Returns 200 if update is successful', function(done) {
    var id = '';
    async.series([
      function(cb) {
        request(app)
          .post('/user')
          .send('username=Ben&password=test')
          .expect(200, cb);
      },
      function(cb) {
        request(app)
          .get('/user')
          .expect(200, function(err, res) {
            id = res.body[0]._id;
            cb();
          });
      },
      function(cb) {
        request(app)
          .post('/auth')
          .send('username=Ben&password=test')
          .expect(200)
          .end(function(err, res) {
            request(app)
              .delete('/user/' + id)
              .set('Authorization', 'bearer ' + res.body.token)
              .expect(200)
              .expect('Content-Type', /json/)
              .expect(/"message":"User deleted!"/, cb);
          });
      }
    ], done);
  });

});

describe('Post requests on /auth endpoint', function() {

  it('returns a 401 if username doesn\'t exist', function(done) {
    request(app)
      .post('/auth')
      .send('username=Ben&password=test')
      .expect(401)
      .expect('Content-Type', /json/)
      .expect(/"message":"User not found."/)
      .expect(/"success":false/, done);
  });

  it('returns a 401 if password is wrong', function(done) {
    async.series([
      function(cb) {
        request(app)
          .post('/user')
          .send('username=Ben&password=test&name=Benjamin')
          .expect(200, cb);
      },
      function(cb) {
        request(app)
          .post('/auth')
          .send('username=Ben&password=test1')
          .expect(401)
          .expect('Content-Type', /json/)
          .expect(/"message":"Wrong password"/)
          .expect(/"success":false/, done);
      }
    ], done);
  });

  it('returns a 200 if user credentials are correct', function(done) {
    async.series([
      function(cb) {
        request(app)
          .post('/user')
          .send('username=Ben&password=test&name=Benjamin')
          .expect(200, cb);
      },
      function(cb) {
        request(app)
          .post('/auth')
          .send('username=Ben&password=test')
          .expect(200)
          .expect('Content-Type', /json/)
          .expect(/"message":"authenticated"/)
          .expect(/"token"/)
          .expect(/"success":true/, done);
      }
    ], done);
  });

});
