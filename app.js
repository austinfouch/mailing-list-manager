var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ex_session = require('express-session');
var NodeGeocoder = require('node-geocoder');

var options = {
 provider: 'google',
 // Optional depending on the providers
 httpAdapter: 'https', // Default
 apiKey: 'AIzaSyDQNg_S_N4P0TIfAZI7biP-WbFvCXj_gV0', // for Mapquest, OpenCage, Google Premier
 formatter: null         // 'gpx', 'string', ...
};

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var geocoder = NodeGeocoder(options);
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var url = "mongodb://localhost:27017/final";
var contacts;
// Connect to the db
MongoClient.connect(url, function(err, db) {
 
  if(err == null) {
    console.log("Connected to mongodb server");
    contacts = db.collection('contacts');
  } else {
    console.log("Not connected!");
  }
});

app.use(function(req, res, next) {
  req.db = contacts;
  req.geo = geocoder;
  next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
