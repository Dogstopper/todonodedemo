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

  url: 'mongodb://localhost:27017/todoapp'
};

module.exports = config;
