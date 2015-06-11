'use strict';

var path        = require('path');
var url         = require('url');
var React       = require('react');
var Signup     = require("../views/signup.jsx");
var passport = require('passport');
var dbAPI       = new (require("../database"));

exports.renderSignup = function renderSignup(req, res) {
  if(!req.isAuthenticated()) {
	var initialState = {
    //errorMessage: "",
    message: req.flash('signupMessage')
    };
    var signup = React.createElement(Signup, {initialState: initialState});
      res.send("<!doctype html>\n" + 
          React.renderToString(signup) +
          "<script>initialState = "+JSON.stringify(initialState)+"</script>"
      );
  } else { 
    res.redirect('/workspace');
  }
}

exports.postSignup = passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    });