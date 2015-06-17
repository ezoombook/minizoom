'use strict';

var dbAPI       = new (require("../database"));
var React       = require('react');
var NewGroup = require("../views/newgroup.jsx");

exports.addGroup = function addGroup(req, res) {
	if(!req.isAuthenticated()) {
		console.log("Please Login");
		res.redirect('/');
	} else {
		var user = req.user;
		if(user.status === 2) {
			console.log("Oops! You don't have right to creat a group :(");
			res.redirect('/workspace');
		} else {
			var initialState = {
				user: user,
				users: []
			};
			dbAPI.getUsers().then(function(users){
				for(var i=0; i<users.length; i++){
					if (users[i].id === user.id){
						users.splice(i, 1);
						break;
					}
				}
				initialState.users = users;
				var newgroup = React.createElement(NewGroup, {initialState: initialState});
				res.send("<!doctype html>\n" + 
        			React.renderToString(newgroup) +
       	 			"<script>initialState = "+JSON.stringify(initialState)+"</script>"
    			);
			});
		}
	}
}