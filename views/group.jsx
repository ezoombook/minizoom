'use strict';


var React       = require('react');
var superagent  = require('superagent');
var bootstrap   = require('react-bootstrap');
var Navtop = require("../views/navtop.jsx");
var SearchUser = require("../views/searchuser.jsx");

var Grid = bootstrap.Grid,
    Row = bootstrap.Row,
    Col = bootstrap.Col,
    Panel = bootstrap.Panel,
    Input = bootstrap.Input,
    Button = bootstrap.Button,
    OverlayTrigger = bootstrap.OverlayTrigger,
    Popover = bootstrap.Popover;

var ChooseManager = React.createClass({
  handleChange: function(event) {
    this.props.onChange(event.target.value);
  },
  render: function() {
    var members = this.props.members;
    var manager = this.props.manager;
    var rows = [];
    for(var i=0; i<members.length; i++) {
          rows.push(<option key={members[i]} value={members[i]}>{members[i]}</option>);
    }
    if (manager)
      return (
       <Input type='select' defaultValue={manager} label='Select Manager' onChange={this.handleChange}>
        <option value='none' > -- No Manager -- </option>
          {rows}
      </Input>
      );
    else 
      return (
       <Input type='select' label='Select Manager' onChange={this.handleChange}>
        <option value='none' selected className="default-option"> -- No Manager -- </option>
          {rows}
      </Input>
      );
  }
});

var GroupPanel = React.createClass({  
  render: function() {
    var members = this.props.members;
    var title = ( <h1>Group</h1> );
    if(this.props.status === 'creator')
      return (
      <Panel header={title}>
        <Input type='text' label='Group Name' placeholder='Name' value={this.props.name} onChange={this.props.handleNameChange} />
        <ChooseManager members={this.props.members} onChange={this.props.handleManager} manager={this.props.manager} />
        <Button className='loginbutton' onClick={this.props.handleClick}>Register</Button>
        <Button className='loginbutton' onClick={this.props.handleDelete}>Delete this group</Button>
      </Panel>
      );
    else if(this.props.status === 'manager')
      return (
        <Panel header={title}>
        <Input type='text' label='Group Name' placeholder='Name' value={this.props.name} />
        <Input type='text' label='Group Creator' placeholder='Creator' value={this.props.creator} />
        <Input type='text' label='Group Manager' placeholder='Manager' value={this.props.manager} />
        <Button className='loginbutton' onClick={this.props.handleClick}>Register</Button>
      </Panel>
      );
    else
      return (
        <Panel header={title}>
        <Input type='text' label='Group Name' placeholder='Name' value={this.props.name} />
        <Input type='text' label='Group Creator' placeholder='Creator' value={this.props.creator} />
        <Input type='text' label='Group Manager' placeholder='Manager' value={this.props.manager} />
        </Panel>
      );
  }
});

var MembersPanel = React.createClass({
  handleClick: function(event){
    console.log("CLICK"+event.target.value);
    this.props.onClick(event.target.value);
  },
  handleChange: function(newMember){
    this.props.handleAddMembers(newMember);
  }, 
  render: function() {
    var members = this.props.members;
    var rows = [];
    if(this.props.status === 'member'){
      console.log("IN");
      for(var i=0; i<members.length; i++) {       
          rows.push(
                  <Button className='loginbutton' value={members[i]}>{members[i]}</Button>);
      }
      return(
        <Panel header='Member List'>
            {rows}
        </Panel>
      );
    }
    else{
      for(var i=0; i<members.length; i++) {       
          rows.push(<OverlayTrigger trigger='hover' placement='bottom' key={members[i]}
                              overlay={<Popover title='Click to delete the member'>{members[i]}</Popover>}>
                  <Button className='loginbutton' value={members[i]} onClick={this.handleClick}>{members[i]}</Button>
              </OverlayTrigger>);
      }
      return (       
        <Panel header='Members' >
        <SearchUser addedUsers={this.props.members} type='Add Members' users={this.props.users} onChange={this.handleChange} />
        <p>Member List</p>
            {rows}
        </Panel> );
    }
  }  
});

var MainGrid = React.createClass({
  getInitialState: function() {
        return {
            name: this.props.name,
            members: this.props.members,
            newMembers: [],
            delMembers: [],
            manager: this.props.manager
        };
  },
  handleNameChange: function(event) {
      this.setState({ name: event.target.value });
  },
  handleAddMembers: function(newMember) {
      var found = false;
      var oldNewMembers = this.state.newMembers;
      for(var i=0; i<this.props.oldMembers.length; i++){
        if(newMember === this.props.oldMembers[i])
          found = true;
        if(!found) continue;
      }
      if(!found)
        this.setState({newMembers: oldNewMembers.concat(newMember)});
      var oldList = this.state.members;
      var newList =  oldList.concat(newMember);
      this.setState({ members: newList});
  },
  handleDelMembers: function(delMember) {
      var members = this.state.members;
      if (delMember === this.state.manager) {
        console.log("You delete the manager");
        this.setState({ manager: "none"});
      }
      var found = false;
      var oldDelMembers = this.state.delMembers;
      for(var i=0; i<this.props.oldMembers.length; i++){
        if(delMember === this.props.oldMembers[i])
          found = true;
        if(!found) continue;
      }
      if(found)
        this.setState({delMembers: oldDelMembers.concat(delMember)});
      for(var i=0; i<members.length; i++){
        console.log(members[i]);
        if (delMember === members[i]) {
          members.splice(i, 1);
          break;
        }
      }
      this.setState({ members: members});
  },
  handleManager: function(value) {
      this.setState({ manager: value });
  },
  handleClick : function(){
    var id = this.props.group.id;
    var name = this.state.name;
    var members = this.state.members;
    var newMembers = this.state.newMembers;
    var delMembers = this.state.delMembers;
    var manager = this.state.manager;    
    var completed = true;
    if(name === ""){
      completed = false;
      console.log("Please enter Group Name");
    }
    if(members.length === 0){
      completed = false;
      console.log("Please enter Members");
    }
    if(completed){
      var xhr = new XMLHttpRequest;
      xhr.open("PATCH", "/api/groups");
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      var data = {"id": id,
                  "name": name,
                  "newMembers": newMembers,
                  "delMembers": delMembers,
                  "manager": manager};
      xhr.send(JSON.stringify(data));
      xhr.onreadystatechange = function() {
        if (xhr.readyState==4 && xhr.status==200) {
          window.location = xhr.response;
       }
      }
    }
  },
  handleDelete : function(){
    var id = this.props.group.id;
      var xhr = new XMLHttpRequest;
      xhr.open("DELETE", "/api/groups");
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      var data = {"id": id};
      xhr.send(JSON.stringify(data));
      xhr.onreadystatechange = function() {
        if (xhr.readyState==4 && xhr.status==200) {
          window.location = xhr.response;
       }
      }
  },
  render : function() {
    if(this.props.status === 'no right')
      return (<h2>You have no right to see the information of this group.</h2>);
    else
      return (
      <div className="loginpage">
        {React.createElement(Navtop,{user:this.props.user})}
        <Grid>
          <Row className="loginpanel">
            <Col md={2}></Col>
            <Col md={4}><GroupPanel user={this.props.user} users={this.props.users}
                          status={this.props.status} creator={this.props.creator.email}
                          name={this.state.name} members={this.state.members}
                          manager={this.state.manager} 
                          handleNameChange={this.handleNameChange}
                          handleManager={this.handleManager}
                          handleClick={this.handleClick} 
                          handleDelete={this.handleDelete} /></Col>
            <Col md={4}><MembersPanel members={this.state.members}
                          users={this.props.users} status={this.props.status}
                          handleAddMembers={this.handleAddMembers}
                          onClick={this.handleDelMembers} />
            </Col>
            <Col md={2}></Col>
          </Row>
        </Grid>
      </div>
    );
  }
});

var Group = React.createClass({
  getInitialState: function() {
    return this.props.initialState;
  },
  render: function() {
    var contents = <MainGrid  user={this.state.user}
                              users={this.state.users}
                              manager={this.state.manager}
                              creator={this.state.creator}
                              name={this.state.group.name}
                              oldMembers={this.state.oldMembers}
                              members={this.state.groupMembers}
                              status={this.state.status} 
                              group={this.state.group} />;
    return (
      <html>
        <head>
          <link rel="stylesheet" href="/assets/style.css" />
          <script src="../assets/group.js" />
          <meta charSet="utf8" />
          <title>Group</title>
        </head>
        {contents}
      </html>
    );
  }
});

module.exports = Group;

if (typeof window === 'object') {
  var group; // golbal application variable
  window.onload = function() {
    // initialState has been set before (sent as a payload by the server)
    group = React.createElement(Group, {initialState:initialState});
    React.render(group, document);
  }
}