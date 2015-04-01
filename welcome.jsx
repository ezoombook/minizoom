'use strict';


var React       = require('react');
var superagent  = require('superagent');
var bootstrap   = require('react-bootstrap');

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
            <Navbar fixedTop> 
              <Nav>
              <NavItem eventKey={1} href='/'>eZoomBook</NavItem>
              <NavItem eventKey={2} href='#'>Books</NavItem>
              <DropdownButton eventKey={3} title='Help!'>
                  <MenuItem eventKey='1'>Tutorial</MenuItem>
                  <MenuItem eventKey='2'>FAQ</MenuItem>
                  <MenuItem eventKey='3'>Contact us</MenuItem>
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
              return <h3 key={book.id}>{book.name}</h3>;
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
      <div>
        <NavWelcome />
        <Grid className="booklist">

          <Row>
            <Col md={8}><h1>Books</h1></Col>
            <Col md={4}><NewBookBtn/></Col>
          </Row>
          <Row>
            <Col md={4}>
              <Books books={this.props.books} />
            </Col>
          </Row>

        </Grid>
      </div>
    );
  }
});

var App = React.createClass({
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