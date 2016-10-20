'use strict';

var apn = require('apn');
var PushNotification = require('./pushnotifications.model');
var PushNotificationEvent = require('./pushnotifications.event');

var productionOptions = {
  production: true,
  cert: 'aps-cert.pem',
  key: 'aps-key.pem'
};
var productionApnConnection = new apn.Connection(productionOptions);

var sandboxOptions = {
  production: false,
  cert: 'cert.pem',
  key: 'key.pem'
};
var sandboxApnConnection = new apn.Connection(sandboxOptions);

function sendNewPassdownNotification(user, senderName) {
  PushNotification.find({ user: user._id }, function (err, devices) {
    if (err || !devices) {
      return;
    }

    devices.forEach(function (device) {
      if (device.ios && device.enabled) {
        console.log('Sending Notification');

        var note = new apn.Notification();
        note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
        note.badge = device.badgeNumber + 1;
        note.sound = 'default';
        note.alert = senderName + ' sent you a new PassDown!';
        note.category = 'PASSDOWN_CATEGORY';

        var userDevice = new apn.Device(device.deviceToken);
        if (device.production === undefined ||
            device.production === true) {
          productionApnConnection.pushNotification(note, userDevice);
        } else {
          sandboxApnConnection.pushNotification(note, userDevice);
        }
      }
    });
  });
}

function sendNewFriendRequestNotification(userId) {
  PushNotification.find({ user: userId }, function (err, devices) {
    if (err || !devices) {
      return;
    }

    devices.forEach(function (device) {
      if (device.ios && device.enabled) {
        console.log('Sending Notification');

        var note = new apn.Notification();
        note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
        note.badge = device.badgeNumber + 1;
        note.sound = 'default';
        note.alert = 'Someone wants to add you as a connection!';
        note.category = 'FRIEND_CATEGORY';

        var userDevice = new apn.Device(device.deviceToken);
        if (device.production === undefined ||
            device.production === true) {
          productionApnConnection.pushNotification(note, userDevice);
        } else {
          sandboxApnConnection.pushNotification(note, userDevice);
        }
      }
    });
  });
}

// Push notifications should never have to be reliable. And they should
// not have to be syncronous with anything ever.
exports.setup = function () {
  PushNotificationEvent.on('newPassdown', function (user, senderName) {
    sendNewPassdownNotification(user, senderName);
  });
  
  PushNotificationEvent.on('connectionRequest', function(userBId) {
    sendNewFriendRequestNotification(userBId);
  });
};
