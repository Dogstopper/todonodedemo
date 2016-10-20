'use strict';

var Events = require('events');

var eventEmitter = new Events.EventEmitter();
module.exports = eventEmitter;
