'use strict';

var path        = require('path');
var url         = require('url');
var passport = require('passport');

exports.logout = function logout(req, res) {
	req.logout();
    res.redirect('/');
}
