'use strict';

var path        = require('path');
var url         = require('url');
var React       = require('react');
var dbAPI       = new (require("../database"));
var App     = require("../views/client.jsx");

exports.edit = function renderApp(req, res, next) {
  var path = url.parse(req.url).pathname;
  var bookId = req.params.bookId;
  var layerId = req.params.layerId;
  var initialState = {
    path: path,
    layerId: layerId,
    bookId: bookId,
    chapters: [],
    layers: [],
    parts: [],
    initParts: []
  };
  dbAPI.getChapters(layerId).then(function(chap) {
    initialState.chapters = chap;
    return dbAPI.getLayers(bookId);
  }).then(function(layers){
    initialState.layers = layers;
    return dbAPI.getPartsInLayer(layerId);
  }).then(function(parts){
    initialState.parts = parts;
    initialState.initParts = parts;
    var app = React.createElement(App, {initialState: initialState});
    res.send("<!doctype html>\n" + 
        React.renderToString(app) +
        "<script>initialState = "+JSON.stringify(initialState)+"</script>"
    );
  });
}