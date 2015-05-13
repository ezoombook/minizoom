'use strict';


var React       = require('react');
var superagent  = require('superagent');
var bootstrap = require('react-bootstrap');
var partKey = require('../parts').PartKey; 
var Textarea = require('react-textarea-autosize');

var Grid = bootstrap.Grid,
    Row = bootstrap.Row,
    Col = bootstrap.Col,
    Panel = bootstrap.Panel,
    Button = bootstrap.Button,
    Navbar = bootstrap.Navbar,
    Nav = bootstrap.Nav,
    NavItem = bootstrap.NavItem,
    DropdownButton = bootstrap.DropdownButton,
    MenuItem = bootstrap.MenuItem,
    Modal = bootstrap.Modal,
    ModalTrigger = bootstrap.ModalTrigger,
    Glyphicon = bootstrap.Glyphicon,
    Input = bootstrap.Input,
    Alert = bootstrap.Alert,
    TabbedArea = bootstrap.TabbedArea,
    TabPane = bootstrap.TabPane;

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

var TabChoice = React.createClass({
  getInitialState: function() {
    return {
      key: 1
    };
  },

  handleSelect: function(key) {
    alert('selected ' + key);
    this.setState({key: key});
  },

  render: function() {
    return (
      <TabbedArea activeKey={this.state.key} onSelect={this.handleSelect}>
        <TabPane eventKey={1} tab='Project'>TabPane 1 content</TabPane>
        <TabPane eventKey={2} tab='Book'>TabPane 2 content</TabPane>
        <TabPane eventKey={2} tab='Group'>TabPane 3 content</TabPane>
      </TabbedArea>
      )
  }
});

var MainGrid = React.createClass({
  render : function() {
    return (
      <div className="editpage">
        <NavWelcome />
        <Grid>
          <TabChoice/>
        </Grid>
      </div>
    );
  }
});

var Workspace = React.createClass({
  render: function() {
    var contents = <MainGrid/>;
    return (
      <html>
        <head>
          <link rel="stylesheet" href="/assets/style.css" />
          <script src="/assets/bundle.js" />
          <meta charSet="utf8" />
          <title>Minizoom</title>
        </head>
        {contents}
      </html>
    );
  }
});

module.exports = Workspace;