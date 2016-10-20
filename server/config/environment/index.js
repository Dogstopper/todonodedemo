'use strict';

var config = {
  // List of user roles. Later ones include permissions of earlier ones in the list
  userRoles: ['public', 'guest', 'waitlist', 'user', 'admin'],

  // List of authentication types (other than local). Should have id, secret, etc. below
  // authTypes: ['linkedin', 'google', 'facebook'],

  //api versions
  api: {
    latest: '1.0.0',
    versions: ['1.0.0']
  },

  mailOptions: {
    ourEmail: process.env.OUR_EMAIL || 'contact@wru.life',
    passResetSubject: 'Compass Password Reset',
    contactFormSubject: 'CONTACT FORM REQUEST',
    betaFormSubject: 'BETA ACCESS REQUEST'
  },

  mailchimpOptions: {
    clientID: '234483109740',
    clientSecret: 'e7000d9fead1704c5a4cfbf9f87afee3',
    apiKey: '176be00b71c02c86170d212ba1bfeed8-us13'
  },

  url: 'mongodb://localhost:27017/todoapp'
};

module.exports = config;
