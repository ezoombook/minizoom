'use strict';

var path        = require('path');
var url         = require('url');
var React       = require('react');
var dbAPI       = new (require("../database"));
var Projects     = require("../views/projects.jsx");

exports.list = function renderProjects(req, res) {
  var path = url.parse(req.url).pathname;
  var initialState = {
    path: path,
    projects: []
  };
  dbAPI.getBooks().then(function(books){
    initialState.books = book;
    var projects = React.createElement(Projects, {initialState: initialState});
    res.send("<!doctype html>\n" + 
        React.renderToString(projects) +
        "<script>initialState = "+JSON.stringify(initialState)+"</script>"
    );
  });
}