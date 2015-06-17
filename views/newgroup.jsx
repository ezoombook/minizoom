'use strict';


var React       = require('react');
var superagent  = require('superagent');
var bootstrap   = require('react-bootstrap');
var Navtop = require("../views/navtop.jsx");
var Textarea = require('react-textarea-autosize');

var Grid = bootstrap.Grid,
    Row = bootstrap.Row,
    Col = bootstrap.Col,
    Panel = bootstrap.Panel,
    Input = bootstrap.Input,
    Button = bootstrap.Button,
    OverlayTrigger = bootstrap.OverlayTrigger,
    Popover = bootstrap.Popover;

var SearchBar = React.createClass({
  handleChange: function(event) {
    this.props.onChange(event.target.value);
  },
  render: function() {
    return ( 
      <Input type='text' label={this.props.type} placeholder='Search user name' value={this.props.filterText} onChange={this.handleChange} />
    );
  }
});

var UserTable = React.createClass({
  handleChange: function(event) {
    console.log("IN UserTable");
    console.log(event.target.value);
    this.props.onChange(event.target.value);
  },
  render: function() {
    var users = this.props.users;
    var filterText = this.props.filterText;
    return ( 
      <Input type='select' onChange={this.handleChange}>
          <option disabled selected> -- Select An User -- </option>
            { users.map(function(user) {
                if (user.name.indexOf(filterText) !== -1)
                    return <option key={user.id} value={user.email}>{user.email}</option>;
              })
            }
      </Input>
    );
  }
});

var SearchUser = React.createClass({
  getInitialState: function(){
    return{
      filterText: ""
    };    
  },
  onSearchChange: function(value){
    this.setState({ filterText: value });
  },
  onSelectChange: function(value){
    console.log("IN onSelectChange");
    console.log(value);
    var exist = false;
    var addedUsers = this.props.addedUsers;
    for(var i=0; i<addedUsers.length; i++){
      if(value === addedUsers[i])
        exist = true;
    }
    if(!exist){
      this.props.onChange(value);
    }
    else
      console.log("Already added");
  },
  render: function(){
    return (
        <div>
            <SearchBar filterText={this.state.filterText} type={this.props.type} onChange={this.onSearchChange} />
            <UserTable filterText={this.state.filterText} users={this.props.users} onChange={this.onSelectChange} />
        </div>);
  }

});

var AddMembers = React.createClass({
  handleChange: function(newMember){
    this.props.onChange(newMember);
  },
  handleClick: function(event){
    console.log("CLICK"+event.target.value);
    this.props.onClick(event.target.value);
  },   
  render: function() {
    var members = this.props.members;
    var rows = [];
    for(var i=0; i<members.length; i++) {       
          rows.push(<OverlayTrigger trigger='hover' placement='bottom' key={members[i]}
                              overlay={<Popover title='Click to delete the member'>{members[i]}</Popover>}>
                  <Button className='loginbutton' value={members[i]} onClick={this.handleClick}>{members[i]}</Button>
              </OverlayTrigger>);
    }
    //var title = ( <strong>Member-List</strong> );
    return ( 
      <div>
        <SearchUser addedUsers={this.props.members} type='Add Members' users={this.props.users} onChange={this.handleChange} />
        <Panel header='Member-List' >
            {rows}
        </Panel>  
      </div>);
  }
});

var ChooseManager = React.createClass({
  handleChange: function(event) {
    this.props.onChange(event.target.value);
  },
  render: function() {
    var members = this.props.members;
    var rows = [];
    for(var i=0; i<members.length; i++) {
          rows.push(<option key={members[i]} value={members[i]}>{members[i]}</option>);
    }
    return (
       <Input type='select' label='Select Manager' onChange={this.handleChange}>
        <option value='0' disabled selected className="default-option"> -- Select A Member -- </option>
          {rows}
      </Input>
    );
  }
});

var AddGuests = React.createClass({
  handleChange: function(newGuest){
    this.props.onChange(newGuest);
  },
  handleClick: function(event){
    //console.log("CLICK"+event);
    this.props.onClick(event.target.value);
  },   
  render: function() {
    var guests = this.props.guests;
    var rows = [];
    for(var i=0; i<guests.length; i++) {       
          rows.push(<OverlayTrigger trigger='hover' placement='bottom' key={guests[i]}
                              overlay={<Popover title='Click to delete the guest'>{guests[i]}</Popover>}>
                  <Button className='loginbutton' value={guests[i]} onClick={this.handleClick}>{guests[i]}</Button>
              </OverlayTrigger>
              );
    }
    //var title = ( <h3><strong> Guest-List </strong></h3> );
    return ( 
      <div>
        <SearchUser addedUsers={this.props.guests} type='Add Guests' users={this.props.users} onChange={this.handleChange} />
        <Panel header='Guest-List' >
            {rows}
        </Panel>   
      </div>);
  }
});

var NewGroupPanel = React.createClass({
  getInitialState: function() {
        return {
            name:"",
            members: [],
            manager: "",
            guests: []
        };
  },
  handleNameChange: function(event) {
      this.setState({ name: event.target.value });
  },
  handleAddMembers: function(newMember) {
      var oldList = this.state.members;
      var newList =  oldList.concat(newMember);
      this.setState({ members: newList});
  },
  handleDelMembers: function(delMember) {
      var members = this.state.members;
      if (delMember === this.state.manager) {
        console.log("You delete the manager");
        this.setState({ manager: ""});
      }
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
  handleAddGuests: function(newGuest) {
      var oldList = this.state.guests;
      var members = this.state.members;
      var inMemebers = false;
      for(var i=0; i<members.length; i++) {
        if (newGuest === members[i])
          inMemebers = true;
      }
      if (inMemebers) {
        console.log('Already a Member');
      } else {
        var newList =  oldList.concat(newGuest);
        this.setState({ guests: newList});
      }      
  },
  handleDelGuests: function(delGuest) {
      var guests = this.state.guests;
      for(var i=0; i<guests.length; i++){
        console.log(guests[i]);
        if (delGuest === guests[i]) {
          guests.splice(i, 1);
          break;
        }
      }
      this.setState({ guests: guests});
  },
  handleClick : function(){
    var name = this.state.name;
    var members = this.state.members;
    var manager = this.state.manager;
    var guests = this.state.guests;
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
      xhr.open("POST", "/api/groups");
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      var data = {"name": name,
                  "creator": this.props.user.id,
                  "members": members,
                  "manager": manager,
                  "guests": guests};
      xhr.send(JSON.stringify(data));
      xhr.onreadystatechange = function() {
        if (xhr.readyState==4 && xhr.status==200) {
          window.location = xhr.response;
       }
      }
    }
  },
  render: function() {
    var members = this.state.members;
    var title = ( <h1>New Group</h1> );
            // <AddGuests guests={this.state.guests} users={this.props.users} onChange={this.handleAddGuests} 
            //         onClick={this.handleDelGuests} />
    return (
      <Panel header={title}>
        <Input type='text' label='Group Name' placeholder='Name' value={this.state.name} onChange={this.handleNameChange} />
        <AddMembers members={this.state.members} users={this.props.users} onChange={this.handleAddMembers} 
                    onClick={this.handleDelMembers} />
        <ChooseManager members={this.state.members} onChange={this.handleManager} getUser={this.getUser} />
        <Button className='loginbutton' onClick={this.handleClick}>Register</Button>
      </Panel>
    );
  }
});

var MainGrid = React.createClass({
  render : function() {
    return (
      <div className="loginpage">
        {React.createElement(Navtop,{user:this.props.user})}
        <Grid>
          <Row className="loginpanel">
            <Col md={4}></Col>
            <Col md={4}><NewGroupPanel user={this.props.user} users={this.props.users} /></Col>
            <Col md={4}></Col>
          </Row>
        </Grid>
      </div>
    );
  }
});

var Newgroup = React.createClass({
  getInitialState: function() {
    return this.props.initialState;
  },
  render: function() {
    var contents = <MainGrid  user={this.state.user}
                              users={this.state.users} />;
    return (
      <html>
        <head>
          <link rel="stylesheet" href="/assets/style.css" />
          <script src="../assets/newgroup.js" />
          <meta charSet="utf8" />
          <title>New Group</title>
        </head>
        {contents}
      </html>
    );
  }
});

module.exports = Newgroup;

if (typeof window === 'object') {
  var newgroup; // golbal application variable
  window.onload = function() {
    // initialState has been set before (sent as a payload by the server)
    newgroup = React.createElement(Newgroup, {initialState:initialState});
    React.render(newgroup, document);
  }
}