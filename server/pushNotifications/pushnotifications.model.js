'use strict';

var mongoose = require('mongoose');

var pushNotificationSchema = mongoose.Schema({
  user: { type: String, ref: 'User' },
  ios: Boolean,
  deviceToken: String,
  enabled: Boolean,
  production: Boolean,
  badgeNumber: Number
});

var PushNotification = mongoose.model('PushNotification', pushNotificationSchema);
module.exports = PushNotification;
