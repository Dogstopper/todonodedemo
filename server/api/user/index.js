'use strict';

var express = require('express');
var controller = require('./user.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

// GET users
router.get('/', auth.hasRole('user'), controller.me);
router.get('/:id', auth.hasRole('user'), controller.other);

// Account Management
router.post('/password/forgot', controller.sendPasswordReset); // No authentication required
router.post('/password/reset', controller.resetPassword);      // No authentication required
router.post('/password/change', auth.hasRole('user'), controller.changePassword);
router.post('/logout', auth.hasRole('user'), controller.logout);

module.exports = router;
