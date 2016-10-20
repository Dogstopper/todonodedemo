'use strict';

 var User = require('./user.model');
 
 /**
 * Returns the current user in serialized form.
 * @param {Request} Contains user
 * @param {Response}
 * @returns {Response}
 */
exports.me = function (req, res) {
  return res.status(200).json(req.user.serializeSelf());
};

/**
 * Returns the specified user in serialized form. (Remove access token, pass, etc.)
 * @param {Request}
 * @param {Response}
 * @returns {Response}
 */
exports.other = function(req, res) {
  User.findOne({ '_id': req.params.id }, function(err, user) {
    if (err) return next(err);

    return res.status(200).json(user.serializeOther());
  });
};



var Emailer = require('../../email/transaction');
/**
 * Logs a user out by clearing the access token.
 * @param {Request} HTTP Request
 * @param {Response} HTTP Response
 * @returns {Response}
 */
exports.logout = function (req, res, next) {
  // Grab the user, or fail
  var user = req.user;
  if (!req.user) {
    return res.status(401).json({
      message: 'Users not logged in cannot log out'
    });
  }

  // Clear the access token and save the model
  user.accessToken = null;
  user.save(function (err) {
    if (err) {
      return next(err);
    }

    return res.status(200).json({});
  });
};

/**
 * Sends a password reset email
 * @param {Request} Contains the email to reset.
 * @param {Response}
 * @returns {Response}
 */
exports.sendPasswordReset = function (req, res, next) {
  if (!req.body.email) {
    return res.status(422).json({
      message: 'Need the email of user to reset'
    });
  }

  User.findOne({ 'local.email': req.body.email }, function (err, user) {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(422).json({
        message: 'Invalid email requested'
      });
    }

    user.resetToken.token = user.createAccessToken();
    user.resetToken.resetAt = Date.now();
    user.save(function (err) {
      if (err) {
        return next(err);
      }

      var url = 'com.plutoniumapps.docviewz://resetpass?e=' + req.body.email +
        '&c=' + user.resetToken.token;
      Emailer.sendPasswordReset(req.body.email, url);

      res.status(200).json({});
    });
  });
};

/**
 * After verifying the reset token is correct, set the user's password to a new one.
 * @param {Request} Contains the email, reset token, and the new password.
 * @param {Response}
 */
exports.resetPassword = function (req, res, next) {
  var email = req.body.email;
  var token = req.body.token;
  var newPassword = req.body.newPassword;

  User.findOne({ 'local.email': email }, function (err, user) {
    if (err) {
      next(err);
    }

    if (!user) {
      return res.status(422).json({
        message: 'Invalid email requested or bad token'
      });
    }

    if (token === user.resetToken.token) {
      user.local.password = user.hashPassword(newPassword);
      user.accessToken = null;
      user.resetToken = null;
      user.save(function (err) {
        if (err) {
          return res.status(500).json({
            message: 'DB error'
          });
        }

        return res.status(200).json({});
      });
    } else {
      return res.status(403).json({
        message: 'Tried to reset an account without authorization.'
      });
    }
  });
};

exports.changePassword = function (req, res) {
  console.log(req.body);
  var newPassword = req.body.newPassword;
  req.user.local.password = req.user.hashPassword(newPassword);
  req.user.save(function (err) {
    if (err) {
      return res.status(500).json({});
    }
    return res.status(200).json({});
  });
};