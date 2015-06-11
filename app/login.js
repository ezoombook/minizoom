'use strict';

var path        = require('path');
var url         = require('url');
var React       = require('react');
var Login     = require("../views/login.jsx");
var passport = require('passport');
var dbAPI       = new (require("../database"));

exports.renderLogin = function renderLogin(req, res) {
  if(!req.isAuthenticated()) {
    var initialState = {
    //errorMessage: "",
    message: req.flash('loginMessage')
    };
    var login = React.createElement(Login, {initialState: initialState});
      res.send("<!doctype html>\n" + 
          React.renderToString(login) +
          "<script>initialState = "+JSON.stringify(initialState)+"</script>"
      );
    } else { 
      res.redirect('/workspace');
  }
  
}

exports.postLogin = passport.authenticate('local-login', {
        successRedirect : '/workspace', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the login page if there is an error
        failureFlash : true // allow flash messages
});