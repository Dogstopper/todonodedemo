'use strict';

// Load strategies
var LocalStrategy = require('passport-local').Strategy;
var TokenStrategy = require('passport-token-auth').Strategy;

// Load the needed services
var controller = require('./passport.controller');

module.exports = function (passport) {

  // ============================================================================
  // PASSPORT SESSION SETUP =====================================================
  // ============================================================================

  // We need to be able to (de)serialize our user model into and out of a session
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    controller.getUserById(id, done);
  });

  // ============================================================================
  // ACCESS TOKEN LOGIN =========================================================
  // ============================================================================

  passport.use('api-token', new TokenStrategy(
        function (token, done) {
          controller.getUserByAccessToken(token, done);
        }
    ));

  // ============================================================================
  // API SIGNUP =================================================================
  // ============================================================================

  passport.use('api-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: false
  },
    function (email, password, done) {
      controller.createUserWithEmail(email, password, done);
    }));

  // ============================================================================
  // API LOGIN ==================================================================
  // ============================================================================

  passport.use('api-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: false
  }, 
    function (email, password, done) {
      controller.getUserByLocalEmail(email, password, done);
    })); 
};
