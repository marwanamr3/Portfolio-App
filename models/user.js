var mongoose = require('mongoose');
var config = require('../config/database');
// User Schema
var UserSchema = mongoose.Schema({
  name: {
    type: String
  },
  description: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

var User = module.exports = mongoose.model('User', UserSchema);

