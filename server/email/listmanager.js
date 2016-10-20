'use strict';

var config = require('../config/environment');
var mcapi = require('mailchimp-api');

var mc = new mcapi.Mailchimp(config.mailchimpOptions.apiKey);

var subscribeToList = function (listId, email, callback) {
  mc.lists.subscribe({ id: listId, email: { email: email } },
    function (data) {
      return callback(null, data);
    },

    function (error) {
      console.log(error);
      return callback(error);
    });
};

var unsubscribeFromList = function (listId, email, callback) {
  mc.lists.unsubscribe({ id: listId, email: { email: email } },
    function (data) {
      return callback(null, data);
    },

    function (error) {
      return callback(error);
    });
};

module.exports = {
  subscribeBetaUser: function (email, callback) {
    subscribeToList('940d8e8260', email, function (err) {
      return callback(err);
    });
  },
  
  unsubscribeBetaUser: function (email, callback) {
    unsubscribeFromList('940d8e8260', email, function(err) {
      return callback(err);
    });
  }
};
