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

	if(manager !== 'none'){
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

exports.patch = function patchGroup(req, res) {
	var id = req.body.id;
	var name = req.body.name;
	var newMembers = req.body.newMembers;
	var delMembers = req.body.delMembers;
	var manager = req.body.manager;
	var managerId = 0;

	if(manager !== 'none'){
		dbAPI.getUserByMail(manager).then(function(manager){
			managerId = manager[0].id;
			console.log("managerId  "+managerId);
			dbAPI.updateGroup(id, name, managerId).then(function(group){
				for(var i=0; i<newMembers.length; i++){
					dbAPI.getUserByMail(newMembers[i]).then(function(member){
						dbAPI.addGroupMember(id, member[0].id).then(function(group){
							console.log("add member"+member[0].id);
						})
					})
				}
				for(var i=0; i<delMembers.length; i++){
					dbAPI.getUserByMail(delMembers[i]).then(function(member){
						dbAPI.delGroupMember(id, member[0].id).then(function(group){
							console.log("delete member"+member[0].id);
						})
					})
				}
				var newURL = '/workspace';
    			res.send(newURL);
			});
		});
	} else {
		managerId = null;
		dbAPI.updateGroup(id, name, managerId).then(function(group){
							for(var i=0; i<newMembers.length; i++){
					dbAPI.getUserByMail(newMembers[i]).then(function(member){
						dbAPI.addGroupMember(id, member[0].id).then(function(group){
							console.log("add member"+member[0].id);
						})
					})
				}
				for(var i=0; i<delMembers.length; i++){
					dbAPI.getUserByMail(delMembers[i]).then(function(member){
						dbAPI.delGroupMember(id, member[0].id).then(function(group){
							console.log("delete member"+member[0].id);
						})
					})
				}
			var newURL = '/workspace';
    		res.send(newURL);
		});
	}
}

exports.delete = function deleteGroup(req, res) {
	var id = req.body.id;
	dbAPI.deleteGroupMembers(id).then(function(group){
		return dbAPI.deleteGroup(id);
	}).then(function(groups){
		console.log("delete group "+id);
	});
	
	var newURL = '/workspace';
    res.send(newURL);
}