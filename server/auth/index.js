'use strict';

var express = require('express');
var config = require('../config/environment');
var authService = require('./auth.service');

var router = express.Router();

router

// =====================================
// LOGIN API ===========================
// =====================================
  .post('/login', function (req, res, next) {
    req.passport.authenticate('api-login', function (err, user, info) {
      // Handle errors
      if (err) return res.status(500).json(err);
      if (!user) return res.status(401).json(info);

      // Pass back needed data
      return res.status(200).json({ accessToken: user.accessToken, role: user.role });
    })(req, res, next);
  })
    
// =====================================
// SIGNUP API ==========================
// =====================================

  .post('/signup', function (req, res, next) {
    req.passport.authenticate('api-signup', function (err, user, info) {
      // If there was an error, return a 500 error
      if (err) return res.status(500).json(err);

      // If the user doesn't exist, return a 401 error
      if (!user) return res.status(401).json(info);

      res.status(200).json({ success: true });
    })(req, res, next);
  });

module.exports = router;
