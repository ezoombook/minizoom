'use strict';

var path        = require('path');
var url         = require('url');
var React       = require('react');
var Home     = require('../views/homepage.jsx');
var passport = require('passport');

exports.renderHomePage = function rederHome(req, res) {
	var home = React.createElement(Home);
	if(!req.isAuthenticated()) {
      res.send("<!doctype html>\n" + 
        React.renderToString(home)
    	);
    } else {
      res.redirect('/workspace');
	}
}