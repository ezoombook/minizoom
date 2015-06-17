'use strict';

var path        = require('path');
var url         = require('url');
var React       = require('react');
var dbAPI       = new (require("../database"));
var Workspace     = require("../views/workspace.jsx");

exports.renderWorkspace = function renderWorkspace(req, res, next) {
  if(!req.isAuthenticated()) {
    res.redirect('/');
  } else {
  var path = url.parse(req.url).pathname;
  var user = req.user;
  var userId = user.id;
  var initialState = {
    path: path,
    userId: userId,    
    user: user,
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

  dbAPI.getCreatorGroups(userId).then(function(creatorGroups){
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
    initialState.managerProjects.concat(managerProjects);
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
}