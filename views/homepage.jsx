'use strict';


var React       = require('react');
var superagent  = require('superagent');
var bootstrap   = require('react-bootstrap');

var Grid = bootstrap.Grid,
    Row = bootstrap.Row,
    Col = bootstrap.Col,
    Button = bootstrap.Button;

var SigninBtn = React.createClass({
  render: function() {
    return <Button href='/login'
                   bsSize="large" bsStyle="primary" block>Login</Button>;
  }
});

var SignupBtn = React.createClass({
  render: function() {
    return <Button href='/signup'
                   bsSize="large" bsStyle="primary" block>Register</Button>;
  }
});

var MainGrid = React.createClass({
  render : function() {
    return (
      <div className="homepage">
        <Grid>
          <Row className="signform">
            <Col md={6}><h1>eZoomBook</h1></Col>
            <Col md={2}></Col>
            <Col md={2} className="signform_btn"><SigninBtn/></Col>
          </Row>
          <Row>
            <Col md={6}><h1><small>Read as YOU Want</small></h1></Col>
            <Col md={2}></Col>
            <Col md={2} className="signform_btn"><SignupBtn/></Col>
          </Row>

        </Grid>
      </div>
    );
  }
});

var Home = React.createClass({
  render: function() {
    var contents = <MainGrid/>;
    return (
      <html>
        <head>
          <link rel="stylesheet" href="/assets/style.css" />
          <meta charSet="utf8" />
          <title>HomeMinizoom</title>
        </head>
        {contents}
      </html>
    );
  }
});

module.exports = Home;

// if (typeof window === 'object') {
//   var app; // golbal application variable
//   window.onload = function() {
//     // initialState has been set before (sent as a payload by the server)
//     app = React.createElement(Home, {initialState:initialState});
//     React.render(app, document);
//   }
// }