'use strict';


var React       = require('react');
var superagent  = require('superagent');
var bootstrap = require('react-bootstrap');
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
    Alert = bootstrap.Alert;

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

// var myAltr = React.createClass({
//   render : function(){
//     return(
//       <Alert bsStyle='danger'>
//         <h4>No</h4>
//       </Alert>
//       );
//   }
// });

var NewLayerModal = React.createClass({
  getInitialState: function() {
        return {
            value: ""
        };
  },
  onChange: function(event) {
        this.setState({ value: event.target.value });
  },
  createLayer : function(){
    name = this.state.value;
    if(name === ""){
      alert ("Please Enter the Name of the new Layer");
    }
    alert (name);
  },
  render : function(){
  return(
  <Modal {...this.props} bsStyle='primary' title='Add Layer' animation={false}>
    <div className='modal-body'>
      You will create a new layer from layer {this.props.name}
      <br/>
      <br/>
      <Input type='text' label='New Layer Name' placeholder='Enter name' 
              value={this.state.value} onChange={this.onChange} />
    </div>
    <div className='modal-footer'>
      <Button onClick={this.createLayer}>Create</Button>
    </div>
  </Modal>
  );
}
});

var NewLayerTrigger = React.createClass({
  render : function() {
    return (
      <div className='modal-trig'>
        <ModalTrigger modal={<NewLayerModal name={this.props.name}/>}>
          <Glyphicon glyph='camera'/>
        </ModalTrigger>
      </div>
    );
  }
});

var Layers = React.createClass({
  render : function() {
    return (
      <Panel id="layer-panel">
        <h4>eZoomLayers</h4>
        <ul>
        {
          this.props.layers.map(function(layer){
              return <li key={layer.id}><NewLayerTrigger name={layer.name}/> {layer.name} </li>;
          })
        }
        </ul>        
      </Panel>
      );
  }
});

var ContHeading = React.createClass({
  handleChange: function(event) {
    var item = {"key": this.props.p.key,
                "contents": event.target.value};
    this.props.onContChange(item);
  },
  render: function(){
    return <Input type='text' className="heading-edit" defaultValue={this.props.p.contents} onChange={this.handleChange} />;
  }
});

var ContPart = React.createClass({
  handleChange: function(event) {
    var item = {"key": this.props.p.key,
                "contents": event.target.value};
    this.props.onContChange(item);
  },
  render: function(){
    return <Textarea className="part-edit" defaultValue={this.props.p.contents} onChange={this.handleChange} />;
  }
});

var Parts = React.createClass({
  render : function() {
    var onContChange = this.props.onContChange;
      return (
        <div id="edition-div">{
          this.props.parts.map(function(p){
          if (!p.contents) {
            return <span id={"anchor"+p.key}
                         data-key={p.key}
                         className="layer-anchor"></span>;
          } else if (p.heading) {
            return <ContHeading key={p.key} p={p} onContChange={onContChange}/>;
          } else {
            return <ContPart key={p.key} p={p} onContChange={onContChange}/>;
          }
          })
        }
        </div>
      );
    }
});

var SaveBtn = React.createClass({
  render: function() {
    return <Button className="save_btn" onClick={this.props.onClick}
                     bsStyle="primary" block>Save</Button> ;
  }
});

var EditorContents = React.createClass({
  getInitialState: function(){
    return {
      saveState: true,
      parts: this.props.parts
    };
  },
  itemChange: function(parts, item){
    for (var i=0; i<parts.length; i++) {
      if (parts[i].key === item.key) {
          parts[i].contents = item.contents;
          break;
      }
    }
    return JSON.parse(parts);
    //return item;    
  },
  handleContChange: function(item) {
    var newParts = this.itemChange(this.state.parts, item);
    this.setState({
        saveState: false,
        parts: newParts
      });
  },
  handleClick: function() {
    alert("Changed Saved: "+this.state.saveState+JSON.stringify(this.state.parts));
  },
  render: function() {
    return (
      <div>
        <SaveBtn onClick={this.handleClick} />
        <Parts parts={this.state.parts} onContChange={this.handleContChange}/>
        <p>{JSON.stringify(this.state.parts)}</p>
      </div>
      );
  }
});

var Chapters = React.createClass({
  render : function() {
    return (
        <nav>
          <h2>Chapters</h2>
          <ol>
          {
            this.props.chapters.map(function(chap){
              return <li key={chap.key} className="panel-list"><a
                      href={'#'+chap.contents}
                      onClick={this.props.goTo}
                    >
                      {chap.contents}
                    </a></li>
            }.bind(this))
          }
          </ol>
        </nav>
      );
  }
});

var MainGrid = React.createClass({
  render : function() {
    return (
      <div className="editpage">
        <NavWelcome />
        <Grid>
          <Row className="app-columns">
            <Col md={2}>
              <Layers layers={this.props.layers}/>
            </Col>
            <Col md={2}>
            </Col>
            <Col md={4}>
              <EditorContents layerId={this.props.layerId} parts={this.props.parts} />
            </Col>
            <Col md={2}>
            </Col>
            <Col md={2}>
              <Chapters chapters={this.props.chapters} />
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
    var contents = <MainGrid layers={this.state.layers}
                              parts={this.state.parts}
                              chapters={this.state.chapters}
                              layerId={this.state.layerId} />;
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

module.exports = App;

if (typeof window === 'object') {
  var app; // global application variable
  window.onload = function() {
    // initialState has been set before (sent as a payload by the server)
    app = React.createElement(App, {initialState:initialState});
    React.render(app, document);
  }
}
