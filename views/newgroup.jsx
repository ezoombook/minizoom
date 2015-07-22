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
    var rows = [];
    for(var i=0; i<members.length; i++) {
          rows.push(<option key={members[i]} value={members[i]}>{members[i]}</option>);
    }
    return (
       <Input type='select' label='Select Manager' onChange={this.handleChange}>
        <option value='none' selected className="default-option"> -- No Manager -- </option>
          {rows}
      </Input>
    );
  }
});

var NewGroupPanel = React.createClass({ 
  render: function() {
    var members = this.props.members;
    var title = ( <h1>New Group</h1> );
    return (
      <Panel header={title}>
        <Input type='text' label='Group Name' placeholder='Name' value={this.props.name} onChange={this.props.handleNameChange} />
        <ChooseManager members={this.props.members} onChange={this.props.handleManager} />
        <Button className='loginbutton' onClick={this.props.handleClick}>Register</Button>
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
});

var MainGrid = React.createClass({
  getInitialState: function() {
        return {
            name:"",
            members: [],
            manager: ""
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
                  "manager": manager};
      xhr.send(JSON.stringify(data));
      xhr.onreadystatechange = function() {
        if (xhr.readyState==4 && xhr.status==200) {
          window.location = xhr.response;
       }
      }
    }
  },
  render : function() {
    return (
      <div className="loginpage">
        {React.createElement(Navtop,{user:this.props.user})}
        <Grid>
          <Row className="loginpanel">
            <Col md={2}></Col>
            <Col md={4}><NewGroupPanel user={this.props.user} users={this.props.users} 
                          name={this.state.name} members={this.state.members}
                          manager={this.state.manager} 
                          handleNameChange={this.handleNameChange}                          
                          handleManager={this.handleManager}
                          handleClick={this.handleClick} /></Col>
            <Col md={4}><MembersPanel members={this.state.members} onClick={this.handleDelMembers}
                          handleAddMembers={this.handleAddMembers} 
                          users={this.props.users}  /></Col>
            <Col md={2}></Col>
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
//Can be used for the creation of a new project

  // handleAddGuests: function(newGuest) {
  //     var oldList = this.state.guests;
  //     var members = this.state.members;
  //     var inMemebers = false;
  //     for(var i=0; i<members.length; i++) {
  //       if (newGuest === members[i])
  //         inMemebers = true;
  //     }
  //     if (inMemebers) {
  //       console.log('Already a Member');
  //     } else {
  //       var newList =  oldList.concat(newGuest);
  //       this.setState({ guests: newList});
  //     }      
  // },
  // handleDelGuests: function(delGuest) {
  //     var guests = this.state.guests;
  //     for(var i=0; i<guests.length; i++){
  //       console.log(guests[i]);
  //       if (delGuest === guests[i]) {
  //         guests.splice(i, 1);
  //         break;
  //       }
  //     }
  //     this.setState({ guests: guests});
  // },

  // var AddGuests = React.createClass({
//   handleChange: function(newGuest){
//     this.props.onChange(newGuest);
//   },
//   handleClick: function(event){
//     //console.log("CLICK"+event);
//     this.props.onClick(event.target.value);
//   },   
//   render: function() {
//     var guests = this.props.guests;
//     var rows = [];
//     for(var i=0; i<guests.length; i++) {       
//           rows.push(<OverlayTrigger trigger='hover' placement='bottom' key={guests[i]}
//                               overlay={<Popover title='Click to delete the guest'>{guests[i]}</Popover>}>
//                   <Button className='loginbutton' value={guests[i]} onClick={this.handleClick}>{guests[i]}</Button>
//               </OverlayTrigger>
//               );
//     }
//     //var title = ( <h3><strong> Guest-List </strong></h3> );
//     return ( 
//       <div>
//         <SearchUser addedUsers={this.props.guests} type='Add Guests' users={this.props.users} onChange={this.handleChange} />
//         <Panel header='Guest-List' >
//             {rows}
//         </Panel>   
//       </div>);
//   }
// });
