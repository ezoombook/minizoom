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
        successRedirect : '/workspace', 
        failureRedirect : '/login', 
        failureFlash : true 
  });


// exports.postLogin = passport.authenticate('local-login', function(req, res) {
//     // If this function gets called, authentication was successful.
//     // `req.user` contains the authenticated user.
//     res.redirect('/workspace');
//   }
// );