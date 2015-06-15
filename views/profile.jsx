'use strict';


var React       = require('react');
var superagent  = require('superagent');
var bootstrap   = require('react-bootstrap');
var Navtop = require("../views/navtop.jsx");

var Grid = bootstrap.Grid,
    Row = bootstrap.Row,
    Col = bootstrap.Col,
    Panel = bootstrap.Panel,
    Input = bootstrap.Input,
    Button = bootstrap.Button;

var LoginPanel = React.createClass({
  getInitialState: function() {
        return {
            username: this.props.user.name,
            password: "",
            confirmPwe: ""
        };
  },
  handleChange: function(event) {
        this.setState({ username: event.target.value });
  },
  handlePwdChange: function(event) {
        this.setState({ password: event.target.value });
  },
  handlePwdConfirm: function(event) {
        this.setState({ confirmPwe: event.target.value});
  },
  handleClick : function(){
    var username = this.state.username;
    var password = this.state.password;
    var confirmPwe = this.state.confirmPwe;
    if(username === "")
      alert ("Please Enter Username");
    if(password !== confirmPwe)
      alert ("Please Enter the same Password");
    if(username !== this.props.user.name || password !== "")
      console.log("IN xhr");
      var xhr = new XMLHttpRequest;
      xhr.open("PATCH", "/api/profile");
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      if (password === "")
        password = this.props.user.password;
      var data = {"id": this.props.user.id,
                  "username": username,
                  "password": password};
      xhr.send(JSON.stringify(data));
      xhr.onreadystatechange = function() {
        if (xhr.readyState==4 && xhr.status==200) {
          window.location = xhr.response;
       }
      }
    },
  render: function() {
    return(
      <Panel header='Your Profile'>
        <Input type='text' label='New Username' placeholder='Username' value={this.state.username} onChange={this.handleChange} />
        <Input type='text' label='New Password' placeholder='Password' value={this.state.password} onChange={this.handlePwdChange} />
        <Input type='text' label='Confirm Password' placeholder='Password' value={this.state.confirmPwe} onChange={this.handlePwdConfirm} />
        <Button className='loginbutton' onClick={this.handleClick}>Change my profile</Button>
        <p>Name {this.state.username}</p>
        <p>Pwd {this.state.password}</p>
      </Panel>
      );
  }
});

var MainGrid = React.createClass({
  render : function() {
    return (
      <div className="profilepage">
        {React.createElement(Navtop,{user:this.props.user})}
        <Grid>
            <Row className="loginpanel">
              <Col md={3}></Col>
              <Col md={6}><LoginPanel user={this.props.user} /></Col>
              <Col md={3}></Col>            
            </Row>
          </Grid>
      </div>
    );
  }
});

var Profile = React.createClass({
  getInitialState: function() {
    return this.props.initialState;
  },

  render: function() {
    var contents = <MainGrid  user={this.state.user} />;
    return (
      <html>
        <head>
          <link rel="stylesheet" href="/assets/style.css" />
          <script src="../assets/profile.js" />
          <meta charSet="utf8" />
          <title>Your Profile</title>
        </head>
        {contents}
      </html>
    );
  }
});

module.exports = Profile;

if (typeof window === 'object') {
  var profile; // golbal application variable
  window.onload = function() {
    // initialState has been set before (sent as a payload by the server)
    profile = React.createElement(Profile, {initialState: initialState});
    React.render(profile, document);
  }
}