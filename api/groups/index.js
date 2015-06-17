'use strict';

var dbAPI = new (require("../../database"));

exports.post = function creatGroup(req, res) {
	console.log("IN api/groups");
	var id = 0;
	var creator = req.body.creator;
	var name = req.body.name;
	var members = req.body.members;
	var manager = req.body.manager;
	var managerId = 0;

	if(manager !== ""){
		dbAPI.getUserByMail(manager).then(function(manager){
			managerId = manager[0].id;
			console.log("managerId  "+managerId);
			dbAPI.addGroup(name, creator, managerId).then(function(id){
				console.log("groupId  "+id);
				id = id;
				for(var i=0; i<members.length; i++){
					dbAPI.getUserByMail(members[i]).then(function(member){
						dbAPI.addGroupMember(id, member[0].id).then(function(group){
							console.log("add member"+member[0].id);
						})
					})
				}
				var newURL = '/workspace';
    			res.send(newURL);
			});
		});
	} else {
		managerId = null;
		dbAPI.addGroup(name, creator, managerId).then(function(id){
			console.log("groupId  "+id);
			id = id;
			for(var i=0; i<members.length; i++){
				dbAPI.getUserByMail(members[i]).then(function(member){
					dbAPI.addGroupMember(id, member[0].id).then(function(group){
						console.log("add member"+member[0].id);
					})
				})
			}
			var newURL = '/workspace';
    		res.send(newURL);
		});
	}
}