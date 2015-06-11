'use strict';


var React       = require('react');
var superagent  = require('superagent');
var bootstrap = require('react-bootstrap');

var Navbar = bootstrap.Navbar,
    MenuItem = bootstrap.MenuItem,
    Nav = bootstrap.Nav,
    NavItem = bootstrap.NavItem,
    Glyphicon = bootstrap.Glyphicon,
    DropdownButton = bootstrap.DropdownButton;

var NavTop = React.createClass({
  getInitialState: function() {
    return this.props.user;
  },
  render : function() {
    return (
            <Navbar brand='eZoomBook' fixedTop inverse toggleNavKey={0}> 
              <Nav>
              <NavItem eventKey={1} href='/'>Projects</NavItem>
              <NavItem eventKey={2} href='/books'>Books</NavItem>
              <DropdownButton eventKey={3} title='Help!'>
                <MenuItem eventKey='1'>Tutorial</MenuItem>
                <MenuItem eventKey='2'>FAQ</MenuItem>
                <MenuItem eventKey='3'>Contact Us</MenuItem>
              </DropdownButton>
              </Nav>
              <Nav right>
              <NavItem eventKey={4} href='/workspace'><Glyphicon glyph='user'/> {this.props.user.name}</NavItem>
              <NavItem eventKey={5} href='/mail'><Glyphicon glyph='envelope'/></NavItem>
              <NavItem eventKey={6} href='/profile'><Glyphicon glyph='cog'/></NavItem>
              <NavItem eventKey={7} href='/logout'><Glyphicon glyph='off'/></NavItem>
              </Nav>
            </Navbar>
      )
  }
});

module.exports = NavTop;