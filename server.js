'use strict';

var path        = require('path');
var url         = require('url');
var express     = require('express');
var React       = require('react');
var browserify  = require('browserify');
var reactify    = require('reactify');
var nodejsx     = require('node-jsx').install();
var App         = require('./client.jsx');
var data        = require('./data');

var development = process.env.NODE_ENV !== 'production';

function renderApp(req, res, next) {
  var path = url.parse(req.url).pathname;
  var initialState = {
    path: path,
    chapters: data.chapters(),
    layers: data.layers(),
    parts: data.parts()
  }
  var app = React.createElement(App, {
      initialState: initialState
  });
  res.send("<!doctype html>\n" + 
      React.renderToString(app) +
      "<script>initialState = "+JSON.stringify(initialState)+"</script>"
  );
}

var api = express()
  .get('/users/:username', function(req, res) {
    var username = req.params.username;
    res.send({
      username: username,
      name: username.charAt(0).toUpperCase() + username.slice(1)
    });
  });

var app = express();

if (development) {
  app.get('/assets/bundle.js', function(req, res) {
      res.writeHead(200, {"Content-Type":"text/javascript"});
      browserify('./client.jsx', {
        debug: true,
      })
      .transform(reactify)
      .bundle()
      .pipe(res)
      .end();
  });
}

app
  .use('/assets', express.static(path.join(__dirname, 'assets')))
  .use('/api', api)
  .use(renderApp)
  .listen(3000, function() {
    console.log('Point your browser at http://localhost:3000');
  });
