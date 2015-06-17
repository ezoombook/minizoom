'use strict';

var express  = require('express');
var app      = express();
var api      = express();

var path        = require('path');
var url         = require('url');
var React       = require('react');
var nodejsx = require('node-jsx').install({extension: '.jsx'});
var superagent  = require('superagent');

var browserify  = require('browserify');
var reactify    = require('reactify');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var passport = require('passport');
var session = require('express-session');
var flash    = require('connect-flash');
var dbAPI    = new (require("./database"));

var development = process.env.NODE_ENV !== 'production';;
require('./config/passport')(passport, dbAPI);


api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: true }));
require('./api')(api);

//app.use(favicon());
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
//app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(session({ secret: 'iloveZoomBook', saveUninitialized: true, resave: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use('/api' ,api);
require('./app')(app, passport);


if (development) {
  app.get('/assets/workspace.js', function(req, res) {
      res.writeHead(200, {"Content-Type":"text/javascript"});
      browserify('./views/workspace.jsx', {
        debug: true,
      })
      .transform(reactify)
      .bundle()
      .pipe(res);
  });
  app.get('/assets/login.js', function(req, res) {
      res.writeHead(200, {"Content-Type":"text/javascript"});
      browserify('./views/login.jsx', {
        debug: true,
      })
      .transform(reactify)
      .bundle()
      .pipe(res);
  });
  app.get('/assets/signup.js', function(req, res) {
      res.writeHead(200, {"Content-Type":"text/javascript"});
      browserify('./views/signup.jsx', {
        debug: true,
      })
      .transform(reactify)
      .bundle()
      .pipe(res);
  });
  app.get('/assets/profile.js', function(req, res) {
      res.writeHead(200, {"Content-Type":"text/javascript"});
      browserify('./views/profile.jsx', {
        debug: true,
      })
      .transform(reactify)
      .bundle()
      .pipe(res);
  });
  app.get('/assets/newgroup.js', function(req, res) {
      res.writeHead(200, {"Content-Type":"text/javascript"});
      browserify('./views/newgroup.jsx', {
        debug: true,
      })
      .transform(reactify)
      .bundle()
      .pipe(res);
  });
}

app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.listen(3000, function() {
    console.log('Point your browser at http://localhost:3000');
  });
