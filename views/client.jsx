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
                "contents": event.target.value,
                "last": event.target.value[event.target.value.length-1]
              };
    this.props.onContChange(item);
  },
  hanleKeyUp: function(event) {
    this.props.onKeyUp(event,this.props.p.key);
  },
  render: function(){
    var value = this.props.p.contents;
    return <Textarea className="heading-edit" value={value} onChange={this.handleChange}
                      ref="input" onKeyUp={this.hanleKeyUp} />;
  }
});

var ContPart = React.createClass({
  handleChange: function(event) {
    var item = {"key": this.props.p.key,
                "contents": event.target.value,
                "last": event.target.value[event.target.value.length-1]};
    this.props.onContChange(item);
  },
  hanleKeyUp: function(event) {
    this.props.onKeyUp(event,this.props.p.key);
  },
  render: function(){
    var value = this.props.p.contents;
    return <Textarea className="part-edit" value={value} onChange={this.handleChange}
                      ref="input" onKeyUp={this.hanleKeyUp} />;
  }
});

var Parts = React.createClass({
  render : function() {
    var onContChange = this.props.onContChange;
    var onKeyUp = this.props.onKeyUp;
      return (
        <div id="edition-div">{
          this.props.parts.map(function(p){
          if (p.contents === null) {
            return <span id={"anchor"+p.key} ref={p.key}
                         className="layer-anchor"></span>;
          } else if (p.heading) {
            return <ContHeading key={p.key} ref={'child'+ p.key} p={p} onContChange={onContChange} 
                                onKeyUp={onKeyUp} />;
          } else {
            return <ContPart key={p.key} ref={'child'+ p.key} p={p} onContChange={onContChange} 
                              onKeyUp={onKeyUp} />;
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
      parts: this.props.parts,
      partFocus: null,
      deletedParts:[]
    };
  },
  itemChange: function(partFocus, parts, item){
    var focusKey = item.key;
    for (var i=0; i<parts.length; i++) {
      if (parts[i].key === item.key) {
        if(item.last !== "\n"){
          parts[i].contents = item.contents;
          break;
        }
        else{
          if(i === parts.length-1){
            var newAnchorKey = partKey.after(parts[i].key);
            var addAnchor = { "key": newAnchorKey,
                              "layer": parts[i].layer,
                              "contents": null,
                              "heading": null};
            parts.push(addAnchor);
            focusKey = partKey.after(newAnchorKey);
            var addPart = { "key": focusKey,
                            "layer": addAnchor.layer,
                            "contents": "",
                            "heading": null};
            parts.push(addPart);
          }
          else{
            var beforeNew = parts.slice(0,i+1);
            var afterNew = parts.slice(i+1,parts.length);
            var newKeys = partKey.between(parts[i].key, parts[i+1].key, 2);

            var newAnchorKey = newKeys[0];
            var addAnchor = { "key": newAnchorKey,
                              "layer": parts[i].layer,
                              "contents": null,
                              "heading": null};    

            focusKey = newKeys[1];
            var addPart = { "key": focusKey,
                            "layer": addAnchor.layer,
                            "contents": "",
                            "heading": null};
            
            beforeNew.push(addAnchor);  
            beforeNew.push(addPart);
            parts = beforeNew.concat(afterNew);
          }
        }
            
      }
    }
    return { "parts": parts,
             "focusKey": focusKey};    
  },
  handleFocus: function(key) {
        var parent = this.refs.parent;
        var child = parent.refs['child' + key];
        if (!child) return;
        var input = child.refs.input;
        input.getDOMNode().focus();
  },
  handleContChange: function(item) {
    var newChange = this.itemChange(this.state.partFocus, this.state.parts, item);
    var newParts = newChange.parts;
    var newFocus = newChange.focusKey;
    this.setState({
        saveState: false,
        parts: newParts,
        partFocus: newFocus
      });
  },
  hanleKeyUp: function(event, key) {
    var oldParts = this.state.parts;
    var newParts = this.state.parts;
    var newFocus = key;
    var newdeletedParts = this.state.deletedParts;
    var lastkey = oldParts.length-1;
    if (event.keyCode === 8 && event.target.value === "") {      
      if (key === oldParts[lastkey].key){
        newdeletedParts.push(key);
        newdeletedParts.push(oldParts[lastkey-1]);
        newParts = oldParts.slice(0,lastkey-1);
        newFocus = oldParts[lastkey-2].key;
      }
      else{
        var delpart =0;
        for (var i=0; i<=lastkey; i++) {
            if (oldParts[i].key === key) {
              delpart = i;
              break;
            }
        }
        newdeletedParts.push(key);
        newFocus = oldParts[delpart-2].key;
        var beforeParts = oldParts.slice(0,delpart);
        var afterParts = oldParts.slice(delpart+1,lastkey+1);
        newParts = beforeParts.concat(afterParts);     
      }
    }
    this.setState({
        saveState: false,
        parts: newParts,
        partFocus: newFocus,
        deletedParts: newdeletedParts
      });
  },
  componentDidUpdate: function(){
    this.handleFocus(this.state.partFocus);
  },
  handleClick: function() {
    // var parent = this.refs.parent;
    // var child = parent.refs['child' + key];
    // if (!child) return;
    // var input = child.refs.input;
    // input.getDOMNode().focus();
    // var newFocus
    // this.setState({
    //     partFocus: newFocus
    //   });
    var changedParts = [];
    alert("ins");
    if(!this.state.saveState){
      alert("in");
      var initParts = this.props.initParts;
      var parts = this.state.parts;
      //Find part[i]
      for(var i=0; i<parts.length; i++){
        alert("Begin "+i);
        var found = false;
        //Begin to find in initParts
        for(var j=0; j<initParts.length; j++){
          //Fix the initPart j
          if(parts[i].key === initParts[j].key){
            found = true;
            alert("Find "+i);
            //if not equal
            if(parts[i].contents!== initParts[j].contents){//Maybe heading will be change?
              var part = {"key": parts[i].key,
                          "contents": parts[i].contents};
              changedParts.push(part);
              alert("Add "+JSON.stringify(changedParts));                       
            }              
          }
          //alert("Finish match comparison");
          continue;
        }
        //Finish find of part[i]
        alert(found);
        if(!found){
          var part = {"key": parts[i].key,
                      "contents": parts[i].contents};
          changedParts.push(part);
        }      
      }
    }
    alert("Final "+ JSON.stringify(changedParts) );
  },
  handleTest: function() {
    alert("cd");
  },
  render: function() {
    return (
      <div>
        <SaveBtn onClick={this.handleClick} />
        <Button onClick={this.handleTest}>Hi</Button>
        <Parts ref="parent" id="partext" parts={this.state.parts} onKeyUp={this.hanleKeyUp} 
                            onContChange={this.handleContChange} />
        <p>{JSON.stringify(this.state.partFocus)}</p>
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
              <EditorContents layerId={this.props.layerId} parts={this.props.parts}  initParts={this.props.initParts}/>
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
                              initParts={this.state.initParts}
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
