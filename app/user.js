var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');
var dbAPI = new (require("../database"));

var index = function(req, res, next) {
   if(!req.isAuthenticated()) {
      res.redirect('/signin');
   } else {
      var user = req.user;
      if(user !== undefined) {
         user = user.toJSON();
      }
      res.render('index');
   }
};