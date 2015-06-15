'use strict';


var React       = require('react');
var superagent  = require('superagent');
var bootstrap   = require('react-bootstrap');

var Grid = bootstrap.Grid,
    Row = bootstrap.Row,
    Col = bootstrap.Col,
    Panel = bootstrap.Panel,
    Input = bootstrap.Input,
    Button = bootstrap.Button;

var SignupPanel = React.createClass({
  getInitialState: function() {
        return {
            email:"",
            username: "",
            password: "",
            confirmPwe: ""
        };
  },
  handleMailChange: function(event) {
        this.setState({ email: event.target.value });
  },
  handleNameChange: function(event) {
        this.setState({ username: event.target.value });
  },
  handlePwdChange: function(event) {
        this.setState({ password: event.target.value });
  },
  handlePwdConfirm: function(event) {
        this.setState({ confirmPwe: event.target.value});
  },
  handleClick : function(){
    var email = this.state.email;
    var username = this.state.username;
    var password = this.state.password;
    var confirmPwe = this.state.confirmPwe;
    var completed = true;
    if(email === ""){
      completed = false;
      alert("Please enter Email");
    }
    if(username === ""){
      completed = false;
      alert("Please enter Username");
    }
    if(password === ""){
      completed = false;
      alert ("Please enter Password");
    }
    if(password !== confirmPwe){
      completed = false;
      alert ("Please Enter the same Password");
    }
    if(completed){
      var xhr = new XMLHttpRequest;
      xhr.open("POST", "/signup");
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      var data = {"email": email,
                  "username": username,
                  "password": password};
      xhr.send(JSON.stringify(data));
      // xhr.onreadystatechange = function() {
      //   if (xhr.readyState==4 && xhr.status==200) {
      //     console.log (xhr.response);
      //  }
      // }
    }
  },
  render: function() {
    return(
      <Panel header='eZoomBook Register'>
        <Input type='text' placeholder='Email' value={this.state.email} onChange={this.handleMailChange} />
        <Input type='text' placeholder='Username' value={this.state.username} onChange={this.handleNameChange} />
        <Input type='text' placeholder='Password' value={this.state.password} onChange={this.handlePwdChange} />
        <Input type='text' placeholder='Confirm Password' value={this.state.confirmPwe} onChange={this.handlePwdConfirm} />
        <Button className='loginbutton' onClick={this.handleClick}>Register</Button>
        <p>Mail {this.state.email}</p>
        <p>Name {this.state.username}</p>
        <p>Pwd {this.state.password}</p>
        <p>ComPwd {this.state.confirmPwe}</p>
      </Panel>
      );
  }
});

var MainGrid = React.createClass({
  render : function() {
    var message = this.props.message[0];
    console.log(message);
    return (
      <div className="loginpage">
        <Grid>
          <Row className="loginpanel">
            <Col md={4}></Col>
            <Col md={4}><SignupPanel /></Col>
            <Col md={4}>{message}</Col>
          </Row>
        </Grid>
      </div>
    );
  }
});

var Signup = React.createClass({
  getInitialState: function() {
    return this.props.initialState;
  },
  render: function() {
    console.log("RENDER");
    var contents = <MainGrid message={this.state.message}/>;
    return (
      <html>
        <head>
          <link rel="stylesheet" href="/assets/style.css" />
          <script src="../assets/signup.js" />
          <meta charSet="utf8" />
          <title>Register</title>
        </head>
        {contents}
      </html>
    );
  }
});

module.exports = Signup;

if (typeof window === 'object') {
  var signup; // golbal application variable
  window.onload = function() {
    // initialState has been set before (sent as a payload by the server)
    signup = React.createElement(Signup, {initialState:initialState});
    React.render(signup, document);
  }
}