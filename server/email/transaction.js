'use strict';

var config = require('../config/environment');
var nodemailer = require('nodemailer');

/**
 * Transporter to use for sending emails.
 */
var transporter = nodemailer.createTransport(config.transporter);

var sendEmail = function (to, from, subject, text, callback) {
  var mailOptions = {
    from: from,
    to: to,
    subject: subject,
    html: text
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      return callback(error);
    }

    console.log('Message sent: ' + info);
    return callback(null, info);
  });
};

module.exports = {
  sendContactEmail: function (name, email, subject, message, callback) {
    sendEmail(config.mailOptions.ourEmail, email, subject,
      'Name: ' + name + '<br>Email:' + email + '<br><br>' + message,
      function (err) {
        return callback(err);
      }
    );
  },

  sendPasswordReset: function (email, url) {
    sendEmail(email, config.mailOptions.ourEmail, config.mailOptions.passResetSubject, url,
    function (err) {
      return callback(err);
    });
  }
};
