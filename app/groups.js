'use strict';

var dbAPI       = new (require("../database"));
var React       = require('react');
var NewGroup = require("../views/newgroup.jsx");
var Group = require("../views/group.jsx");

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

exports.getGroup = function getGroup(req, res) {
	if(!req.isAuthenticated()) {
		console.log("Please Login");
		res.redirect('/');
	} else {
		var groupId = req.params.groupId;
		var user = req.user; 
		var initialState = {
			user: user,
			users: [],
			group: [],
			groupMembers: {},
			status: ""
		};
		dbAPI.getUsers().then(function(users){
			for(var i=0; i<users.length; i++){
				if (users[i].id === user.id){
					users.splice(i, 1);		
					break;
				}
			}
			initialState.users = users;
			return dbAPI.getGroup(groupId);
		}).then(function(group){
			initialState.group = group[0];
			return dbAPI.getGroupMembers(groupId);
		}).then(function(groupMembers){
			initialState.groupMembers = groupMembers;
			if (user.id === initialState.group.creator)
				initialState.status = "creator";
			else if (user.id === initialState.group.manager)
				initialState.status = "manager";
			else {
				for(var i=0; i<groupMembers.length; i++){
					if (user.id === groupMembers){
						initialState.status = "member";
						break;
					}
				}
				initialState.status = "no right";
			}
			console.log(initialState);				 
			var group = React.createElement(Group, {initialState: initialState});
    		res.send("<!doctype html>\n" + 
        			React.renderToString(group) +
        			"<script>initialState = "+JSON.stringify(initialState)+"</script>"
    		);
		})
	}
}