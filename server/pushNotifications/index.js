'use strict';

var express = require('express');
var controller = require('./pushnotifications.controller');
var auth = require('../auth/auth.service');

require('./pushnotification.apn.service').setup();

var router = express.Router();

// =====================================
// Push Notifications Endpoints ========
// =====================================

router.post('/register-apn-device', auth.hasRole('user'), controller.registerAPNDevice);
router.post('/clear-badge-token', auth.hasRole('user'), controller.clearBadgeToken);

module.exports = router;
