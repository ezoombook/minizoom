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

var LoginPanel = React.createClass({
  getInitialState: function() {
        return {
            email: "",
            password: ""
        };
  },
  handleChange: function(event) {
        this.setState({ email: event.target.value });
  },
  handlePwdChange: function(event) {
        this.setState({ password: event.target.value });
  },
  handleClick : function(){
    var email = this.state.email;
    var password = this.state.password;
    if(email === "" || password === ""){
      alert ("Please Enter Email and Password");
    }else{
      var xhr = new XMLHttpRequest;
      xhr.open("POST", "/login");
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      var data = {"email": email,
                  "password": password};
      xhr.send(JSON.stringify(data));
      xhr.onreadystatechange = function() {
        if (xhr.readyState==4 && xhr.status==200) {
          console.log (xhr.response);
          window.onload = function() {
            console.log ("INTO");
            // initialState has been set before (sent as a payload by the server)
            var newPage = React.createElement(xhr.response);
            console.log ("render");
            React.render(newPage, document);
          }
          //var newPage = React.createElement(xhr.response);
          //React.render(xhr.response);
       }
      }
    }
  },
  render: function() {
    return(
      <Panel header='eZoomBook Login'>
        <Input type='email' placeholder='Email' value={this.state.email} onChange={this.handleChange} />
        <Input type='text' placeholder='Password' value={this.state.password} onChange={this.handlePwdChange} />
        <Button className='loginbutton' onClick={this.handleClick}>Login</Button>
      </Panel>
      );
  }
});

var LoginError = React.createClass({
  render: function() {
    var message = this.props.message;
    if(message.length > 0){
      console.log("IN");
      return(
        <h1> {message}[0] </h1>
      );
    } else {
      return(
        <h1></h1>
      );
    }
  }
});

var MainGrid = React.createClass({
  render : function() {
    var message = this.props.message;
    console.log(message);
      return (
        <div className="loginpage">
          <Grid>
            <LoginError message={message} />
            <Row className="loginpanel">
              <Col md={4}></Col>
              <Col md={4}><LoginPanel /></Col>
              <Col md={4}></Col>            
            </Row>
          </Grid>
       </div>
      );
  }
});

var Login = React.createClass({
  getInitialState: function() {
    return this.props.initialState;
  },

  render: function() {
    var contents = <MainGrid  message={this.state.message} />;
    return (
      <html>
        <head>
          <link rel="stylesheet" href="/assets/style.css" />
          <script src="../assets/login.js" />
          <meta charSet="utf8" />
          <title>Login</title>
        </head>
        {contents}
      </html>
    );
  }
});

module.exports = Login;

if (typeof window === 'object') {
  var login; // golbal application variable
  window.onload = function() {
    // initialState has been set before (sent as a payload by the server)
    login = React.createElement(Login, {initialState:initialState});
    React.render(login, document);
  }
}