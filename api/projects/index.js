'use strict';

var dbAPI = new (require("../../database"));

exports.post = function creatGroup(req, res) {
	console.log("IN api/groups");
	var id = 0;
	var creator = req.body.creator;
	var name = req.body.name;
	var members = req.body.members;
	var manager = req.body.manager;
	var guests = req.body.guests;

	if(manager !== ""){
		dbAPI.getUserByMail(manager).then(function(manager){
			console.log("manager  "+manager[0].id)
			manager = manager[0].id;
		});
	} else {
		manager = null;
	}

	console.log("creator  "+creator);
	console.log("name  "+name);

	dbAPI.addGroup(name, creator, manager).then(function(id){
		console.log("groupId  "+id);
		id = id;
		for(var i=0; i<members.length; i++){
			dbAPI.getUserByMail(members[i]).then(function(member){
				dbAPI.addGroupMember(id, member[0].id).then(function(group){
					console.log("add member"+member[0].id);
				})
			})
		}
		if(guests !== []) {
			for(var i=0; i<guests.length; i++){
				dbAPI.getUserByMail(guests[i]).then(function(guest){
					dbAPI.addGroupGuest(id, guest[0].id).then(function(group){
						console.log("add guest"+ guest[0].id);
					})
				})
			}
		} 
		var newURL = '/workspace';
    	res.send(newURL);
	});
}