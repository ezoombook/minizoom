'use strict';

var path        = require('path');
var url         = require('url');
var React       = require('react');
var dbAPI       = new (require("../database"));
var Workspace     = require("../views/workspace.jsx");

exports.worklist = function renderWorkspace(req, res, next) {
  var path = url.parse(req.url).pathname;
  var userId = req.params.userId;
  var initialState = {
    path: path,
    userId: userId,    
    user: {},
    creatorGroups: [],
    managerGroups: [],
    memberGroups: [],
    creatorProjects: [],
    managerProjects: [],
    memberProjects: [],
    creatorBooks: [],
    managerBooks: [],
    userMessages: []
  };

  dbAPI.getUser(userId).then(function(user){
  	initialState.user = user[0];
  	return dbAPI.getCreatorGroups(userId);
  }).then(function(creatorGroups){
  	initialState.creatorGroups = creatorGroups;
  	return dbAPI.getCreatorProjects(userId);
  }).then(function(creatorProjects){
  	initialState.creatorProjects = creatorProjects;
  	return dbAPI.getCreatorBooks(userId);
  }).then(function(creatorBooks){
  	initialState.creatorBooks = creatorBooks;
  	return dbAPI.getManagerGroups(userId);
  }).then(function(managerGroups){
  	initialState.managerGroups = managerGroups;
  	return dbAPI.getGroupProjects(managerGroups);
  }).then(function(managerProjects){
  	initialState.managerProjects = managerProjects;
  	return dbAPI.getMemberGroups(userId);
  }).then(function(memberGroups){  		
  	initialState.memberGroups = memberGroups;
  	return dbAPI.getGroupProjects(memberGroups);
  }).then(function(memberProjects){  		
  	initialState.memberProjects = memberProjects;
  	return dbAPI.getManagerProjects(userId);
  }).then(function(managerProjects){
  	initialState.managerProjects.push(managerProjects);
  	return dbAPI.getManagerBooks(userId);
  }).then(function(managerBooks){
  	initialState.managerBooks = managerBooks;	
  	var workspace = React.createElement(Workspace, {initialState: initialState});
    res.send("<!doctype html>\n" + 
        React.renderToString(workspace) +
        "<script>initialState = "+JSON.stringify(initialState)+"</script>"
    );
  });
}