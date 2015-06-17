'use strict';

var dbAPI = new (require("../../database"));


exports.get = function creatGroup(req, res) {
	console.log("IN api/users");
	var userId = req.params.userId;
	//console.log(userId);
	dbAPI.getUserById(userId).then(function(user){
		//console.log(user);
		res.send(user[0]);
	});
}