'use strict';

var dbAPI = new (require("../../database"));
var bcrypt = require('bcrypt');


exports.patch = function patchProfile(req, res) {
	console.log("IN api/profile");
	var id = req.body.id;
	var username = req.body.username;
	var pwdChange = req.body.pwdChange;
	var password = req.body.password;
	if(pwdChange){
	  bcrypt.genSalt(10, function(err, salt) {
        if(err){
            console.log("ERROR SALT"+err);
        } else {
				bcrypt.hash(password, salt, function(err, pswHash) {
                  	if(err){
                    	console.log("ERROR HASH"+err);
                  	} else {
                   		 dbAPI.updateUser(id, username, pswHash).then(function(users){
                   		 	var newURL = '/workspace';
                    		res.send(newURL);
                    	});
					}
				})
		}
	  })
	} else {
		dbAPI.updateUser(id, username, password).then(function(users){
                var newURL = '/workspace';
                res.send(newURL);
        });
	}
	
}