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
  handleClick : function(){
    var name = this.state.value;
    if(name === ""){
      alert ("Please Enter the Name of the new Layer");
    }else{
      var xhr = new XMLHttpRequest;
      xhr.open("POST", "/api/layers/"+this.props.layerId);
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      var data = {"newLayerName": name,
                  "book": this.props.book};
      xhr.send(JSON.stringify(data));
      xhr.onreadystatechange = function() {
        if (xhr.readyState==4 && xhr.status==200) {
          window.location = xhr.response;
        }
      }
    }
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
      <Button onClick={this.handleClick} >Create</Button>
    </div>
  </Modal>
  );
}
});

var NewLayerTrigger = React.createClass({
  render : function() {
    return (
      <div className='modal-trig'>
        <ModalTrigger modal={<NewLayerModal name={this.props.name} layerId={this.props.layerId} book={this.props.book} />}>
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
              return  <li key={layer.id}>
                        <NewLayerTrigger name={layer.name} layerId={layer.id} book={layer.book} />
                        <a href={'/book/'+layer.book+'/'+layer.id}>{layer.name}</a> 
                      </li>;
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
    var newPosition = [];
    var newContents = [];
    var n = 0;
    for (var i=0; i<parts.length; i++) {      
      if (parts[i].key === item.key) {
        n = i;
        break;
      }
    }
    for(var j=0; j<item.contents.length; j++) {
      if(item.contents[j] === "\n"){
        newPosition.push(j);
      }
    }
    if(newPosition.length !== 0){
      newContents.push(item.contents.slice(0,newPosition[0]));
      for(var j=1; j<newPosition.length; j++) {
        var newcontents = item.contents.slice( newPosition[j-1]+1, newPosition[j] );
        newContents.push(newcontents);
      }
      var lastposition = newPosition[newPosition.length-1];
      var newcontents = item.contents.slice( lastposition+1, item.contents.length);
      newContents.push(newcontents);
      parts[n].contents = newContents[0];
      var addNew = parts.slice(0,n+2);
      var afterNew = parts.slice(n+2,parts.length);
      var i = 1;
      while(parts[n+2*i].contents === null && i<newContents.length) { //Insert part entre two existing anchors
          focusKey = partKey.betweenTwo(partKey.parse(parts[n+2*i-1].key), partKey.parse(parts[n+2*i].key));
          var addPart = { "key": focusKey.toString(),
                          "layer": parts[n].layer,
                          "contents": newContents[i],
                          "heading": null};
          addNew.push(addPart);
          i++;
      }
      if(i<newContents.length){ //Still have new parts to insert
        var newKeys = partKey.between(partKey.parse(parts[n+2*i-1].key),partKey.parse(parts[n+2*i].key),2*(newContents.length-i));
        for(var j=i; j<newContents.length; j++) { //Insert new panrts and new anchors
          focusKey = newKeys[2*i-2];
          var addPart = { "key": focusKey.toString(),
                          "layer": parts[n].layer,
                          "contents": newContents[j],
                          "heading": null};
          addNew.push(addPart);
          var newAnchorKey = newKeys[2*i-1];
          var addAnchor = { "key": newAnchorKey.toString(),
                            "layer": parts[n].layer,
                            "contents": null,
                            "heading": null}; 
          addNew.push(addAnchor);
        }
      }      
      parts = addNew.concat(afterNew);
    }else{
      parts[n].contents = item.contents;
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
    if (event.keyCode === 8) {
      if(event.target.value === ""){
          var delpart =0;
          for (var i=0; i<oldParts.length; i++) {
            if (oldParts[i].key === key) {
              delpart = i;
              break;
            }
          }
          newdeletedParts.push(key);
          //If the anchor doesn't exist in origin parts, remove it from parts
          var initParts = this.props.initParts;
          var found = false;
          for(var i=0; i<initParts.length; i++){
            if(initParts[i].key !== oldParts[delpart-1].key) continue;
            found = true;
          }
          newFocus = oldParts[delpart-2].key;
          var beforeParts = oldParts.slice(0,delpart);
          var afterParts = oldParts.slice(delpart+1,oldParts.length);
          if(!found){
            beforeParts = oldParts.slice(0,delpart-1);
          }            
          newParts = beforeParts.concat(afterParts);                
       }
      //else{
      //   var sel = document.getSelection();
      //   alert(sel);
      //   if (sel.focusOffset === sel.anchorOffset &&
      //     sel.focusOffset === 0 &&
      //     sel.anchorNode === sel.focusNode){
      //             for (var i=0; i<=lastkey; i++) {
      //     if (oldParts[i].key === key) {
      //       newFocus = oldParts[i-2].key;
      //       break;
      //     }
      //   }
      //   }

      // }      
    //}
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
  handleChangedParts: function(){
    var changedParts = [];
    var addedParts = [];
    if(!this.state.saveState){
      var initParts = this.props.initParts;
      var parts = this.state.parts;
      //Find part[i]
      for(var i=0; i<parts.length; i++){
        var found = false;
        //Begin to find in initParts
        for(var j=0; j<initParts.length; j++){
          //Fix the initPart j
          if(parts[i].key === initParts[j].key ){
            found = true;
            //if not equal
            if(parts[i].contents!== initParts[j].contents){//Maybe heading will be change?
              var part = {"key": parts[i].key,
                          "contents": parts[i].contents};
              changedParts.push(part);                       
            }              
          }
          continue;
        }
        //Finish find of part[i]
        if(!found){
          var part = {"key": parts[i].key,
                      "contents": parts[i].contents};
          addedParts.push(part);
        }      
      }
    }
    return ({"changedParts": changedParts,
              "addedParts": addedParts});
  },
  handleDeletedParts: function(){
    var initParts = this.props.initParts;
    var deletedParts = this.state.deletedParts;
    var noParts = [];
    if(this.state.deletedParts.length !== 0){
      for(var i=0; i<deletedParts.length; i++){
        var found = false;
        for(var j=0; j<initParts.length; j++){
          if(deletedParts[i] === initParts[j].key){
            found = true;
          }
        }
        if(found) continue;
        noParts.push(i);         
      }
      for(var i=0; i<noParts.length; i++) {
        deletedParts.splice(noParts[i]-i, 1);
      }
    }
    return deletedParts;
  },
  handleClick: function() {
    var xhr = new XMLHttpRequest;
    xhr.open("POST", "/api/parts/"+this.props.layerId);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    var data = {  "changedParts": this.handleChangedParts().changedParts,
                  "addedParts": this.handleChangedParts().addedParts,
                  "deletedParts": this.handleDeletedParts()};
    xhr.send(JSON.stringify(data));
  },
  render: function() {
    return (
      <div className="panel-parts" >
        <h2>{this.props.layerName}</h2>
        <SaveBtn onClick={this.handleClick} />        
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
              <Layers layers={this.props.layers} layerId={this.props.layerId} />
            </Col>
            <Col md={4}>
              <EditorContents layerId={this.props.parentLayerId} parts={this.props.parentParts} layerName={this.props.parentLayerName} />
            </Col>
            <Col md={4}>
              <EditorContents layerId={this.props.layerId} parts={this.props.parts} 
                      initParts={this.props.parentParts} layerName={this.props.layerName} />
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
    var contents = <MainGrid  layers={this.state.layers}
                              parts={this.state.parts}
                              parentParts={this.state.parentParts}
                              chapters={this.state.chapters}
                              layerId={this.state.layerId}
                              parentLayerId={this.state.parentLayerId}
                              layerName={this.state.layerName}
                              parentLayerName={this.state.parentLayerName} />;
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
