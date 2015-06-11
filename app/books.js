'use strict';

var path        = require('path');
var url         = require('url');
var React       = require('react');
var dbAPI       = new (require("../database"));
var Books     = require("../views/books.jsx");

exports.list = function renderBooks(req, res) {
  var path = url.parse(req.url).pathname;
  var initialState = {
    path: path,
    books: []
  };
  dbAPI.getBooks().then(function(books){
    initialState.books = book;
    var books = React.createElement(Books, {initialState: initialState});
    res.send("<!doctype html>\n" + 
        React.renderToString(books) +
        "<script>initialState = "+JSON.stringify(initialState)+"</script>"
    );
  });
};