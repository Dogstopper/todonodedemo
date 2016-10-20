'use strict';

var PushNotificationDevice = require('./pushnotifications.model');

exports.registerAPNDevice = function (req, res, next) {
  var user = req.user;
  var deviceToken = req.param('deviceToken');
  var productionBuild = req.param('release') === '1' || req.param('release') === 'undefined';

  PushNotificationDevice.findOne({ deviceToken: deviceToken }, function (err, device) {
    if (err) {
      return next(err);
    }

    if (!device) {
      device = new PushNotificationDevice();
    }

    device.user = user._id;
    device.deviceToken = deviceToken;
    device.ios = true;
    device.enabled = true;
    device.production = productionBuild;
    device.save(function (err) {
      if (err) {
        return next(err);
      }

      return res.status(200).json({});
    });
  });
};

exports.clearBadgeToken = function (req, res, next) {
  PushNotificationDevice.find({ user: req.user._id }, function (err, devices) {
    if (err) {
      return next(err);
    }

    devices.forEach(function (device) {
      device.badgeNumber = 0;
      device.save();
    });
    
    res.status(200).json({});
  });
};

// Admin functions

