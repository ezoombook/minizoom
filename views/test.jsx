'use strict';


var React       = require('react');
var superagent  = require('superagent');
var bootstrap   = require('react-bootstrap');

var Button = bootstrap.Button;

var Test = React.createClass({
 handleClick : function(){
    console.log("IN");
  },
 render: function() {
    return (
      <html>
        <head>
          <link rel="stylesheet" href="/assets/style.css" />
          <script src="../assets/bundle.js" />
          <meta charSet="utf8" />
          <title>Login</title>
        </head>
        <Button onClick={this.handleClick}>Login</Button>
      </html>
    );
  }
});

module.exports = Test;

if (typeof window === 'object') {
  var test; // golbal application variable
  window.onload = function() {
    // initialState has been set before (sent as a payload by the server)
    test = React.createElement(Test, {initialState:initialState});
    React.render(test, document);
  }
}