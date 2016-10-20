'use strict';

var express = require('express');
var transaction = require('./transaction');
var auth = require('../auth/auth.service');

var router = express.Router();

router.post('/send-contact-email', function (req, res) {
  transaction.sendContactEmail(req.body.name, req.body.email,
    req.body.subject, req.body.message, function (err) {
      res.writeHead(200, {
        'Content-Type': 'application/text',
        result: err ? 'Error' : 'Success',
        'Access-Control-Allow-Origin': '*' });
      return err ?
        res.end('Message failed to send. Please try again.') :
        res.end('Message successfully sent!');
    });
});

module.exports = router;
