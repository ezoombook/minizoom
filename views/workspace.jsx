'use strict';


var React       = require('react');
var superagent  = require('superagent');
var bootstrap = require('react-bootstrap');
var Textarea = require('react-textarea-autosize');
var Navtop = require("../views/navtop.jsx");

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
    TabPane = bootstrap.TabPane,
    Table = bootstrap.Table;

var NewProjectModal = React.createClass({
  render : function(){
  return(
  <Modal {...this.props} bsStyle='primary' title='Add Layer' animation={false}>
    <div className='modal-body'>
      Create a new project from
      <br/>
      <br/>
    </div>
    <div className='modal-footer'>
      <Button><a href='/projects'>An Existing Project</a></Button>
      <Button><a href='/books'>A Book</a></Button>
    </div>
  </Modal>
  );
}
});

var NewProjectTrigger = React.createClass({
  render : function() {
    if (this.props.user.status ===1){
      return (
      <div className='modal-trig'>
        <ModalTrigger modal={<NewProjectModal />}>
          <Glyphicon glyph='plus'/>
        </ModalTrigger>
      </div>
    );
    }else{
      return(<Alert bsStyle='warning'> You do not have right to create a new project.</Alert>);
      
    }    
  }
});

var TableProjects = React.createClass({
  render: function() {
    var creatorProjects = this.props.creatorProjects;
    var managerProjects = this.props.managerProjects;
    var memberProjects = this.props.memberProjects;
    var user = this.props.user;
    return (
    <Table striped condensed hover className="work-table">
    <thead>
      <tr>
        <th>Project Name</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {creatorProjects.map(function(creatorProject){
        return <tr key={creatorProject.id}>
            <td>
              <a href={'/projects/'+creatorProject.id}>{creatorProject.name}</a>
            </td>
            <td>
              <a href={'/projects/'+creatorProject.id+'/settings'}><Glyphicon glyph='cog'/></a>
            </td>
          </tr>;
        })
      }
      {managerProjects.map(function(managerProject){
        return <tr key={managerProject.id}>
            <td>
              <a href={'/projects/'+managerProject.id}>{managerProject.name}</a>
            </td>
            <td>
              <a href={'/projects/'+managerProject.id+'/settings/users'}><Glyphicon glyph='user'/></a>
            </td>
          </tr>;
        })
      }
      {memberProjects.map(function(memberProject){
        return <tr key={memberProject.id}>
            <td>
              <a href={'/projects/'+memberProject.id}>{memberProject.name}</a>
            </td>
            <td>
              <a href={'/projects/'+memberProject.id+'/infos'}><Glyphicon glyph='info-sign'/></a>
            </td>
          </tr>;
        })
      }
      <tr>
      <td>Create a new project</td>
      <td><NewProjectTrigger user={user}/></td>
      </tr>
    </tbody>
    </Table>
    );
  }
});

var TableBooks = React.createClass({
  render: function() {
    var creatorBooks = this.props.creatorBooks;
    var managerBooks = this.props.managerBooks;
    var user = this.props.user;
    return(
    <Table striped condensed hover className="work-table">
    <thead>
      <tr>
        <th>Book Name</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {creatorBooks.map(function(creatorBook){
        return <tr key={creatorBook.id}>
            <td>
              <a href={'/books/'+creatorBook.id}>{creatorBook.name}</a>
            </td>
            <td>
              <a href={'/books/'+creatorBook.id+'/settings'}><Glyphicon glyph='cog'/></a>
            </td>
          </tr>;
        })
      }
      {managerBooks.map(function(managerBook){
        return <tr key={managerBook.id}>
            <td>
              <a href={'/books/'+managerBook.id}>{managerBook.name}</a>
            </td>
            <td>
              <a href={'/books/'+managerBook.id+'/infos'}><Glyphicon glyph='user'/></a>
            </td>
          </tr>;
        })
      }
      <tr>
      <td>{user.name}</td>
      <td>{user.status}</td>
      </tr>
    </tbody>
    </Table>);
  }
});

var TableGroups = React.createClass({
  render: function() {
    var creatorGroups = this.props.creatorGroups;
    var managerGroups = this.props.managerGroups;
    var memberGroups = this.props.memberGroups;
    var user = this.props.user;
    return(
    <Table striped condensed hover className="work-table">
    <thead>
      <tr>
        <th>Group Name</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {creatorGroups.map(function(creatorGroup){
        return <tr key={creatorGroup.id}>
            <td>
              <a href={'/groups/'+creatorGroup.id}>{creatorGroup.name}</a>
            </td>
            <td>
              <a href={'/groups/'+creatorGroup.id+'/settings'}><Glyphicon glyph='cog'/></a>
            </td>
          </tr>;
        })
      }
      {managerGroups.map(function(managerGroup){
        return <tr key={managerGroup.id}>
            <td>
              <a href={'/groups/'+managerGroup.id}>{managerGroup.name}</a>
            </td>
            <td>
              <a href={'/groups/'+managerGroup.id+'/infos'}><Glyphicon glyph='user'/></a>
            </td>
          </tr>;
        })
      }
      {memberGroups.map(function(memberGroup){
        return <tr key={memberGroup.id}>
            <td>
              <a href={'/groups/'+memberGroup.id}>{memberGroup.name}</a>
            </td>
            <td>
              <a href={'/groups/'+memberGroup.id+'/infos'}><Glyphicon glyph='info-sign'/></a>
            </td>
          </tr>;
        })
      }
      <tr>
      <td>{user.name}</td>
      <td>{user.status}</td>
      </tr>
    </tbody>
    </Table>);
  }
});

var WorkTabArea = React.createClass({
  render: function() {
    var creatorProjects = this.props.creatorProjects;
    var managerProjects = this.props.managerProjects;
    var memberProjects = this.props.memberProjects;
    var creatorBooks = this.props.creatorBooks;
    var managerBooks = this.props.managerBooks;
    var creatorGroups = this.props.creatorGroups;
    var managerGroups = this.props.managerGroups;
    var memberGroups = this.props.memberGroups;
    var user = this.props.user;
    return (
      <TabbedArea className="work-tab" defaultActiveKey={1} animation={false}>
        <TabPane eventKey={1} className="work-tab-item" tab='Projects'>
          <TableProjects creatorProjects={creatorProjects}
                              managerProjects={managerProjects}
                              memberProjects={memberProjects} 
                              user={user} />
        </TabPane>
        <TabPane eventKey={2} className="work-tab-item" tab='Books'>
          <TableBooks creatorBooks={creatorBooks}
                              managerBooks={managerBooks} 
                              user={user} />
        </TabPane>
        <TabPane eventKey={3} className="work-tab-item" tab='Groups'>
          <TableGroups creatorGroups={creatorGroups}
                              managerGroups={managerGroups}
                              memberGroups={memberGroups}
                              user={user} />
        </TabPane>
      </TabbedArea>
    );
  }
});

var MainGrid = React.createClass({
  render : function() {
    return (
      <div className="workspacepage">
        {React.createElement(Navtop,{user:this.props.user})}
        <Grid>
        <WorkTabArea creatorGroups={this.props.creatorGroups}
                              managerGroups={this.props.managerGroups}
                              memberGroups={this.props.memberGroups}
                              creatorProjects={this.props.creatorProjects}
                              managerProjects={this.props.managerProjects}
                              memberProjects={this.props.memberProjects}
                              creatorBooks={this.props.creatorBooks}
                              managerBooks={this.props.managerBooks}
                              user={this.props.user} />
        </Grid>
      </div>
    );
  }
});

var Workspace = React.createClass({
  getInitialState: function() {
    return this.props.initialState;
  },

  render: function() {
    var contents = <MainGrid  creatorGroups={this.state.creatorGroups}
                              managerGroups={this.state.managerGroups}
                              memberGroups={this.state.memberGroups}
                              creatorProjects={this.state.creatorProjects}
                              managerProjects={this.state.managerProjects}
                              memberProjects={this.state.memberProjects}
                              creatorBooks={this.state.creatorBooks}
                              managerBooks={this.state.managerBooks} 
                              user={this.state.user} />;
    return (
      <html>
        <head>
          <link rel="stylesheet" href="/assets/style.css" />
          <script src="/assets/workspace.js" />
          <meta charSet="utf8" />
          <title>Workspace</title>
        </head>
        {contents}
      </html>
    );
  }
});

module.exports = Workspace;

if (typeof window === 'object') {
  var workspace; // global application variable
  window.onload = function() {
    // initialState has been set before (sent as a payload by the server)
    workspace = React.createElement(Workspace, {initialState:initialState});
    React.render(workspace, document);
  }
}