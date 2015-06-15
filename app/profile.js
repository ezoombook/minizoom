'use strict';

var path        = require('path');
var url         = require('url');
var React       = require('react');
var Profile     = require("../views/profile.jsx");
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');
var dbAPI       = new (require("../database"));

exports.renderProfile = function renderProfile(req, res) {
	var initialState = {
    //errorMessage: "",
    user: req.user
    };
    var profile = React.createElement(Profile, {initialState: initialState});
      res.send("<!doctype html>\n" + 
          React.renderToString(profile) +
          "<script>initialState = "+JSON.stringify(initialState)+"</script>"
      );
}
