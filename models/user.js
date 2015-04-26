var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;
var SALT_WORKIN_FACTOR = 10;

var userSchema  = new Schema({
  name: String,
  role: {type: String, default: 'User'},
  username: {type: String, required: true, index: {unique: true}},
  password: {type: String, required: true, select: false}
});

userSchema.pre('save', function(next) {
  var user = this;

  if (!user.isModified('password')) { return next(); }

  bcrypt.genSalt(SALT_WORKIN_FACTOR, function(err, salt) {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(password, cb) {
  bcrypt.compare(password, this.password, function(err, valid) {
    return cb(valid);
  });
};

module.exports = mongoose.model('User', userSchema);
