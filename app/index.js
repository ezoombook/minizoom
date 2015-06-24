'use strict';

var homepage = require('./homepage');
var login = require('./login');
var workspace = require('./workspace');
var signup = require('./signup');
var profile = require('./profile');
var logout = require('./logout');
var books = require('./books');
var projects = require('./projects');
var groups = require('./groups');

module.exports = function(app, passport) {
	app.get('/', homepage.renderHomePage);
	app.get('/workspace', workspace.renderWorkspace);
	app.get('/login', login.renderLogin);
	app.post('/login', login.postLogin);
	app.get('/signup', signup.renderSignup);
	app.post('/signup', signup.postSignup);
	app.get('/profile',isLoggedIn, profile.renderProfile);
	app.get('/logout', logout.logout);
	app.get('/groups/add', groups.addGroup);
	app.get('/groups/:groupId', groups.getGroup);
	//app.get('/books', books.list);
	//app.get('/projects', projects.list);
}

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
