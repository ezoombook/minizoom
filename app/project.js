'use strict';

var path        = require('path');
var url         = require('url');
var React       = require('react');
var dbAPI       = new (require("../database"));
var Books     = require("../views/books.jsx");

exports.list = function renderBooks(req, res) {
  var path = url.parse(req.url).pathname;
  var bookId = req.params.bookId;
  var layerId = req.params.layerId;
  var initialState = {
    path: path,
    layerId: layerId,
    bookId: bookId,
    books: [],
    chapters: [],
    layers: [],
    parts: []
  };
  dbAPI.getBooks().then(function(book){
    initialState.books = book;
    return dbAPI.getChapters(layerId);
  }).then(function(chap) {
    initialState.chapters = chap;
    return dbAPI.getLayers(bookId);
  }).then(function(layers){
    initialState.layers = layers;
    return dbAPI.getPartsInLayer(layerId);
  }).then(function(parts){
    initialState.parts = parts;
    var books = React.createElement(Books, {initialState: initialState});
    res.send("<!doctype html>\n" + 
        React.renderToString(books) +
        "<script>initialState = "+JSON.stringify(initialState)+"</script>"
    );
  });
};