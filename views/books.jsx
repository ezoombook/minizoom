'use strict';


var React       = require('react');
var superagent  = require('superagent');
var bootstrap   = require('react-bootstrap');
var client      = require("./client.jsx");

var Grid = bootstrap.Grid,
    Row = bootstrap.Row,
    Col = bootstrap.Col,
    Panel = bootstrap.Panel,
    Button = bootstrap.Button,
    Navbar = bootstrap.Navbar,
    Nav = bootstrap.Nav,
    NavItem = bootstrap.NavItem,
    DropdownButton = bootstrap.DropdownButton,
    MenuItem = bootstrap.MenuItem;

var NavWelcome = React.createClass({
  render : function() {
    return (
            <Navbar fixedTop inverse toggleNavKey={0}> 
              <Nav>
              <NavItem eventKey={1} href='/'>eZoomBook</NavItem>
              <NavItem eventKey={2} href='/books'>Books</NavItem>
              <DropdownButton eventKey={3} title='Help!'>
                <MenuItem eventKey='1'>Tutorial</MenuItem>
                <MenuItem eventKey='2'>FAQ</MenuItem>
                <MenuItem eventKey='3'>Contact Us</MenuItem>
              </DropdownButton>
              </Nav>
            </Navbar>
      )
  }
});

var Books = React.createClass({
  render : function() {
    return (
      <div>
        {
          this.props.books.map(function(book){
              return <Col md={4} className="bookblock"><h3 key={book.id} ><a href={'/book/'+book.id+'/1'}>{book.name}</a></h3></Col>;
          })
        }
      </div>
      );
  }
});

var NewBookBtn = React.createClass({
  render: function() {
    return <Button href='/books/new'
                   bsSize="large" bsStyle="primary" block>Add Books</Button> ;
  }
});

var MainGrid = React.createClass({
  render : function() {
    return (
      <div className="userpage">
        <NavWelcome />
        <Grid className="booklist">
          <Row>
            <Col md={8}><h1>Books</h1></Col>
            <Col md={2}></Col>
            <Col md={2} className="newbook_btn"><NewBookBtn/></Col>
          </Row>
          <Row className="bookblock-container">
              <Books books={this.props.books} />
          </Row>
        </Grid>
      </div>
    );
  }
});

var Welcome = React.createClass({
  getInitialState: function() {
    return this.props.initialState;
  },

  render: function() {
    var contents = <MainGrid books={this.state.books}/>;
    return (
      <html>
        <head>
          <link rel="stylesheet" href="/assets/style.css" />
          <script src="/assets/bundle.js" />
          <meta charSet="utf8" />
          <title>HomeMinizoom</title>
        </head>
        {contents}
      </html>
    );
  }
});

module.exports = Welcome;

if (typeof window === 'object') {
  var app; // golbal application variable
  window.onload = function() {
    // initialState has been set before (sent as a payload by the server)
    app = React.createElement(Welcome, {initialState:initialState});
    React.render(app, document);
  }
}