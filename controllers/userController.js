let User = require('../models/user');
var bcrypt = require('bcryptjs');
var config = require('../config/database');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


let userController = {


getUserById : function(id, callback){
  User.findById(id, callback);
},

getUserByUsername : function(username, callback){
  var query = {username: username}
  User.findOne(query, callback);
},

addUser : function(newUser, callback){
  //Encrypt the password
  bcrypt.genSalt(10, function(err, salt){
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if(err) throw err;
      newUser.password = hash;
      //save new user to DB
      newUser.save(callback);
    });
  });
},

comparePassword : function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if(err) throw err;
    callback(null, isMatch);
  });
}
}

module.exports = userController;