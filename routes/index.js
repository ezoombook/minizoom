'use strict';

var path        = require('path');
var url         = require('url');
var React       = require('react');
var Home     = require("../views/homepage.jsx");

exports.index = function rederHome(req, res) {
    var home = React.createElement(Home);
    res.send("<!doctype html>\n" + 
        React.renderToString(home)
    );
}