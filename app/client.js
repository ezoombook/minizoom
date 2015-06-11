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
    layerName: "",
    chapters: [],
    layers: [],
    originParts: [],
    parts: [],
    parentLayerId: 0,
    parentLayerName: "",
    parentChapters: [],
    parentParts: []
  };
  dbAPI.getLayer(layerId).then(function(layer) {
    initialState.layerName = layer[0].name;
    initialState.parentLayerId = layer[0].parent;
    return dbAPI.getChapters(layerId);
  }).then(function(chap) {
    initialState.chapters = chap;
    return dbAPI.getLayers(bookId);
  }).then(function(layers) {
    initialState.layers = layers;
    return dbAPI.getPartsInLayer(layerId);
  }).then(function(parts) {
    initialState.parts = parts;
    initialState.originParts = parts;
    return dbAPI.getLayer(initialState.parentLayerId);
  }).then(function(parentLayer) {
    if(parentLayer[0])
      initialState.parentLayerName = parentLayer[0].name;
    return dbAPI.getChapters(initialState.parentLayerId);
  }).then(function(parentChap){
    initialState.parentChapters = parentChap;
    return dbAPI.getPartsInLayer(initialState.parentLayerId);
  }).then(function(parentParts) {
    initialState.parentParts = parentParts;
    var app = React.createElement(App, {initialState: initialState});
    res.send("<!doctype html>\n" + 
        React.renderToString(app) +
        "<script>initialState = "+JSON.stringify(initialState)+"</script>"
    );
  });
}