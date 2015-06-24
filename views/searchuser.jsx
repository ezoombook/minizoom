'use strict';


var React       = require('react');
var superagent  = require('superagent');
var bootstrap = require('react-bootstrap');

var Input = bootstrap.Input;


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
    var addedUsers = this.props.addedUsers;
    var filterText = this.props.filterText;
    return ( 
      <Input type='select' onChange={this.handleChange}>
          <option disabled selected> -- Select An User -- </option>
            { users.map(function(user) {
                var added =  false;
                for(var i=0; i<addedUsers.length; i++){
                    if(user.email === addedUsers[i])
                    added = true;
                }
                if ((user.name.indexOf(filterText) !== -1) && !added)
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
    this.props.onChange(value);
  },
  render: function(){
    return (
        <div>
            <SearchBar filterText={this.state.filterText} type={this.props.type} onChange={this.onSearchChange} />
            <UserTable filterText={this.state.filterText} users={this.props.users} addedUsers={this.props.addedUsers} onChange={this.onSelectChange} />
        </div>);
  }

});

module.exports = SearchUser;