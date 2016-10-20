'use strict';

// Load the modules we'll need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var uuid     = require('node-uuid');
var config   = require('../../config/environment/');

var userSchema = mongoose.Schema({

  _id: String,
  accessToken: String,
  role: { type: String, default: 'guest', enum: config.userRoles },
  email: String,

  profile: {
    name: {
      givenName: String,
      lastName: String,
      fullName: String
    }
  },

  local: {
    email: String,
    password: String
  }
});

// METHODS

// TODO: Add authentication functions

userSchema.methods.serializeSelf = function () {
  var _this = this;
  return {
    accessToken: _this.accessToken,
    email: _this.email,
    profile: _this.profile
  };
};

userSchema.methods.serializeOther = function () {
  var _this =  this;
  return {
    id: _this._id,
    email: _this.email,
    profile: _this.profile
  };
};

userSchema.methods.hashPassword = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(4), null);
};

userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.local.password);
};

userSchema.methods.createAccessToken = function () {
  return uuid.v4();
};

var User = mongoose.model('User', userSchema);
module.exports = User;









