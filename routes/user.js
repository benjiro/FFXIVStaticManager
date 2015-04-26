var jwt = require('jsonwebtoken');
var config = require('./../config/settings');
var User = require('./../models/user');

exports.authenticate = function(req, res) {
  User
  .findOne({username: req.body.username})
  .select('name username password role').exec(function(err, user) {
    if (err) { throw err; }

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User not found.'
      });
    } else if (user) {
      user.comparePassword(req.body.password, function(valid) {
        if (!valid) {
          res.status(401).json({
            success: false,
            message: 'Wrong password'
          });
        } else {
          var token = jwt.sign({
            name: user.name,
            role: user.role,
            username: user.username
          }, config.secret, {
            expiresInMinutes: 1440
          });

          res.json({
            success: true,
            message: 'authenticated',
            token: token
          });
        }
      });
    }
  });
};

exports.verify = function(req, res, next) {
  var token = req.headers['authorization'];
  var part = token.split(' ');

  if (token) {
    jwt.verify(part[1], config.secret, function(err, code) {
      if (err) {
        res.status(403).send({
          success: false,
          message: 'Failed to authenticate token.'
        });
      } else {
        req.decoded = code;
        next();
      }
    });
  } else {
    res.status(403).send({
      success: false,
      message: 'No token provided'
    });
  }
};

exports.create = function(req, res) {
  var user = new User();

  user.name = req.body.name;
  user.username = req.body.username;
  user.password = req.body.password;

  user.save(function(err) {
    if (err) {
      if (err.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'Username exists'
        });
      }
      return res.status(400).json({
        success: false,
        message: 'Invalid arguments'
      });
    }
    return res.json({
      success: true,
      message: 'User created!'
    });
  });
};

exports.all = function(req, res) {
  User.find({}, function(err, users) {
    if (err) { res.status(400).send(err); }
    res.json(users);
  });
};

exports.findById = function(req, res) {
  User.findById(req.params.id, function(err, user) {
    if (err) { return res.status(400).send(err); }
    res.json(user);
  });
};

exports.update = function(req, res) {
  User.findById(req.params.id, function(err, user) {
    if (req.body.name) { user.name = req.body.name; }
    if (req.body.username) { user.username = req.body.username; }
    if (req.body.passport) { user.password = req.body.password; }

    user.save(function(err) {
      if (err) { res.status(400).send(err); }
      res.json({
        message: 'User updated!'
      });
    });
  });
};

exports.delete = function(req, res) {
  User.remove({
    _id: req.params.id
  }, function(err, post) {
    if (err) return { res.status(400).send(err); }
    res.json({
      message: 'User deleted!'
    });
  });
};

exports.me = function(req, res) {
  res.send(req.decoded);
};
