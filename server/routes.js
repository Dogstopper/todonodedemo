'use strict';

var express = require('express');

module.exports = function (app) {
  var routerV1 = express.Router();

  // Insert routes below

  routerV1.use('/user', require('./api/user'));
  routerV1.use('/todo', require('./api/todo'));
  routerV1.use('/auth', require('./auth'));

  app.use('/api/v1', routerV1);
};
