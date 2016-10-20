'use strict';

// Setup all the tools we'll need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 3000;
var mongoose = require('mongoose');
var passport = require('passport');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var favicon = require('serve-favicon');

var config = require('./server/config/environment');

// Configuration ===============================================================
mongoose.connect(config.url);

require('./server/auth/passport')(passport); // Pass passport for configuration
app.use(function (req, res, next) {
  req.passport = passport;
  next();
});

// app.use(favicon(__dirname + '/www/images/favicon.ico'));
app.use(express.static('www'));

app.use(morgan('dev')); // Log every request to the console
app.use(cookieParser()); // Read cookies (needed for auth)
app.use(bodyParser.json({limit: '500mb'}));
app.use(bodyParser.urlencoded({limit: '500mb', extended: true}));

// Required for passport
app.use(passport.initialize());

// Routes ======================================================================
require('./server/routes')(app);

app.get('/', function (req, res) {
  res.status(200).render('./www/index.html');
});

app.get('/heartbeat', function (req, res) {
  res.status(200).end();
});

app.use(function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({ error: err });
});

// Launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
