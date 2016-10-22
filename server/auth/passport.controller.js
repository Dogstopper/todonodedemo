'use strict';

var uuid = require('node-uuid');
var User = require('../api/user/user.model');
var config  = require('../config/environment');

exports.createUserWithEmail = function (email, password, callback) {
  User.findOne({ 'local.email': email }, function (err, user) {
    if (err) return callback(err);

    // Check if the username already exists
    if (user) {
      return callback(null, false, {
        message: 'Email already exists'
      });
    } else {

      // Create a new user
      var newUser = new User();

      // Set the auth variables
      newUser.email          = email;
      newUser.local.email    = email;
      newUser.local.password = newUser.hashPassword(password);
      newUser._id            = uuid.v4();
      newUser.role           = config.userRoles[3];

      // Generate an access token
      newUser.accessToken    = newUser.createAccessToken();

      // Save the user object
      newUser.save(function (err) {
        if (err) {
          throw err;
        }

        return callback(null, newUser);
      });
    }
  });
};

// ==================================================================
// GET USER STRATEGIES ==============================================
// ==================================================================

exports.getUserById = function (id, callback) {
  User.findById(id, function (err, user) {
    return callback(err, user);
  });
};

exports.getUserByAccessToken = function (token, callback) {
  console.log('accessToken: ' + token);
  User.findOne({ accessToken: token }, function (err, user) {
    return callback(err, user);
  });
};

exports.getUserByLocalEmail = function (email, password, callback) {
  User.findOne({ 'local.email': email }, function (err, user) {
    // Return first if there are any errors
    if (err) {
      return callback(err);
    }

    // If no user is found, return the message
    if (!user) {
      return callback(null, false, {
        message: 'No user found!'
      });
    }

    // If the user is found but the passowrd is wrong
    if (!user.validPassword(password)) {
      return callback(null, false, {
        message: 'Invalid Username or Password'
      });
    }

    // Otherwise, everything works!
    // Generate an access token
    user.accessToken = user.createAccessToken();
    user.save(function (err) {
      if (err) {
        callback(err);
      } else {
        callback(null, user);
      }
    });
  });
}; 
