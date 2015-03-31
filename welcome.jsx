'use strict';


var React       = require('react');
var superagent  = require('superagent');
var bootstrap = require('react-bootstrap');

var PageHeader = bootstrap.PageHeader,
    Grid = bootstrap.Grid,
    Row = bootstrap.Row,
    Col = bootstrap.Col,
    Button = bootstrap.Button,
    Nav = bootstrap.Navbar;

var Nav = React.createClass({
	render : function() {
		return (
            <Nav fixedTop> 
              <NavItem eventKey={1} href='#'>eZoomBook</NavItem>
              <NavItem eventKey={2} href='#'>Books</NavItem>
              <DropdownButton eventKey={3} title='Help!'>
                  <MenuItem eventKey='1'>Tutorial</MenuItem>
                  <MenuItem eventKey='2'>FAQ</MenuItem>
                  <MenuItem eventKey='3'>Contact us</MenuItem>
              </DropdownButton>
            </Nav>

			)
	}
})

//List of books
var Books = React.createClass({
  render : function() {
    return
        <div book>
          {this.props.books.map(function(book){
              return 
                    <h3>{book.name}</h3>  
              })  
          }      
        </div>;
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
        <Nav>
        <Grid>
          <Row>
            <Col md={8}><h1>Books</h1></Col>
            <Col md={4}>{NewBookBtn}</Col>
          </Row>
          <Row className="book-list">
            <Col md={4}>
              <Books books={this.props.books} />
            </Col>
          </Row>
        </Grid>
    );
  }
});

var Welcome = React.createClass({
  getInitialState: function() {
    return this.props.initialState;
  },
  render: function() {
    var contents = <MainGrid books={this.state.books}>;
    return (
      <html>
        <head>
          <link rel="stylesheet" href="/assets/style.css" />
          <script src="/assets/bundle.js" />
          <meta charSet="utf8" />
          <title>WelcomeToMinizoom</title>
        </head>
        {contents}
      </html>
    );
  }
});

module.exports = Welcome;
