'use strict';

var path        = require('path');
var url         = require('url');
var React       = require('react');
var dbAPI       = new (require("../database"));
var Workspace     = require("../views/workspace.jsx");

exports.work = function renderApp(req, res, next) {
    var workspace = React.createElement(Workspace);
    res.send("<!doctype html>\n" + 
        React.renderToString(workspace)
    );
}