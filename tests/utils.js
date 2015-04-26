var config = require('../config/settings');
var mongoose = require('mongoose');

process.env.NODE_ENV = 'test';

beforeEach(function(done) {
  function clearDB() {
    for (var i in mongoose.connection.collections) {
      mongoose.connection.collections[i].remove(function() {});
    }
    done();
  }

  if (mongoose.connection.readyState === 0) {
    mongoose.connect(config.db, function(err) {
      if (err) { throw err; }
      clearDB();
    });
  } else {
    clearDB();
  }
});

afterEach(function(done) {
  mongoose.models = {};
  mongoose.modelSchemas = {};
  done();
});

after(function(done) {
  mongoose.disconnect();
  done();
});
