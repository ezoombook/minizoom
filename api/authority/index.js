'use strict';

var dbAPI = new (require("../../database"));


exports.group = function group(req, res) {
	console.log("IN api/authority/group");
	var groupId = req.params.groupId;
	var userId = req.params.userId;
	dbAPI.getGroup(groupId).then(function(group){
		var group = group[0];
		var creator = group.creator;
		var manager = group.manager;
		if (userId === creator)
			return res.send("creator");
		if (userId === manager)
			return res.send("manager");
		dbAPI.getMemberGroups(userId).then(function(groups){
			for(var i=0; i<groups.length; i++){
				if (groupId === groups[i].id){
					return res.send("member");
					//break;
				}
			}
		return res.send("no right");
		})

	})
}