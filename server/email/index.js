'use strict';

var express = require('express');
var listmanager = require('./listmanager');
var transaction = require('./transaction');
var auth = require('../auth/auth.service');

var router = express.Router();

// POST emails
router.post('/subscribe-beta-user', function (req, res) {
  listmanager.subscribeBetaUser(req.body.email, function (err) {
    res.writeHead(err ? 400 : 200, {
      'Content-Type': 'application/text',
      result: err ? 'Error' : 'Success'
    });

    return err ?
      res.end('An error occured :( Please email us at contact@passdown.life') :
      res.end('Request sent!');
  });
});

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

router.post('/unsubscribe-beta-user', auth.hasRole('admin'), function (req, res) {
  listmanager.unsubscribe(req.body.email, function (err) {
    res.writeHead(err ? 400 : 200, {
      'Content-Type': 'application/text',
      result: err ? 'Error' : 'Success'
    });

    return err ?
      res.end('An error occured :( Please email us at contact@passdown.life') :
      res.end('Request sent!');
  });
});

module.exports = router;
