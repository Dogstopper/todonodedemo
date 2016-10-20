'use strict';

var compose = require('composable-middleware');
var config = require('../config/environment');
var passport = require('./passport');

/**
 * Decide if user is properly authenticated. If so, we will attach
 * the user object. Otherwise, will return a 401 HTTP error.
 */
function getAuthenticatedUser() {
  return compose()

    // Validate the authentication token and move to header
    .use(function (req, res, next) {
      if (req.query && req.query.hasOwnProperty('access_token')) {
        req.headers.authorization = req.query.access_token;
        delete req.query.access_token;
      }

      if (req.body && req.body.hasOwnProperty('accessToken')) {
        req.headers.authorization = req.body.accessToken;
        delete req.body.accessToken;
      }

      next();
    })

    // Attach user object if available. Otherwise, return a 401
    .use(function (req, res, next) {

      if (req.headers) {
        req.passport.authenticate('api-token', function (err, user, info) {

          // Handle errors
          if (err) return next(err);
          if (!user) return res.status(401).json(info);

          // Attach the user to the req object and keep going
          req.user = user;
          next();

        })(req, res, next);

      } else {
        next();
      }
    });
}

/**
 * Checks if the user role meets the minimum requirements of the route
 */
function hasRole(roleRequired) {
  console.log(roleRequired);
  if (!roleRequired) {
    throw new Error('Required role needs to be set');
  }

  return compose()
    .use(getAuthenticatedUser())
    .use(function meetsRequirements(req, res, next) {
      if (config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(roleRequired)) {
        next();
      } else {
        res.status(403).json({
          message: 'Not authorized for this action.' });
      }
    });
}

exports.getAuthenticatedUser = getAuthenticatedUser;
exports.hasRole = hasRole;
