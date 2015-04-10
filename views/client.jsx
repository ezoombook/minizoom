'use strict';


var React       = require('react');
var superagent  = require('superagent');
var bootstrap = require('react-bootstrap');

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
    Input = bootstrap.Input;

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

var NewLayerModal = React.createClass({
  render : function(){
  return(
  <Modal {...this.props} bsStyle='primary' title='Add Layer' animation={false}>
    <div className='modal-body'>
      You will create a new layer from Layer: {this.props.name}
      <br/>
      <br/>
      <Input type='text' label='New Layer Name' placeholder='Enter name' />
    </div>
    <div className='modal-footer'>
      <Button>Create</Button>
    </div>
  </Modal>
  );
}
});

var NewLayerTrigger = React.createClass({
  render : function() {
    return (
      <div className='modal-container'>
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
      <Panel>
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

var EditorContents = React.createClass({
  render: function(){
    return <div></div>
  }
});

var NewParts = React.createClass({       
    render : function() {
      return (
        <div>{
          this.props.parts.map(function(p){
          if (!p.contents) {
            return <span id={"anchor"+p.key}
                         data-key={p.key}
                          className="layer-anchor"></span>;
          } else if (p.heading) {
            return <Input type='text' bsSize="large" data-key={p.key} id={p.contents} defaultValue={p.contents} />;
          } else {
            return <Input type='textarea' bsSize="small" data-key={p.key} defaultValue={p.contents} />;
          }
          })
        }
        </div>
      );
    }

});

var Parts = React.createClass({
  handleChange: function handleChange(evt) {
      app.partsFromHTML(evt.target.value);
  },

  handleKeyDown: function(evt){
    //Delete anchor if necessary
    if (evt.keyCode === 8) { // Backspace
      var sel = document.getSelection();
      if (sel.focusOffset === sel.anchorOffset &&
          sel.focusOffset === 0 &&
          sel.anchorNode === sel.focusNode) {
        //Nothing selected, caret at the beginning of a paragraph
        var prev = sel.anchorNode.previousSibling ||
                   sel.anchorNode.parentNode.previousSibling;
        if (prev.className === "layer-anchor") {
          //The anchor should be deleted
          prev.parentNode.removeChild(prev);
          evt.preventDefault();
        }
      }
    }
  },

  handleKeyPress: function(evt){
    //Add anchor when necessary
    if (evt.which === 13) {//enter
      var sel = document.getSelection();
      if (sel.focusOffset === sel.anchorOffset &&
          sel.anchorNode === sel.focusNode) {  
        var node = sel.anchorNode;
        if(node.nodeType === node.TEXT_NODE) node = node.parentElement;
        if (node.nodeName === "P") {
          var anchor = document.createElement("span");
          if(node.previousElementSibling.nodeName === "P") {
            var key1 = +node.dataset.key;
            var key2 = +node.previousElementSibling.dataset.key;
            if (key1 && key2) {
              if (key1 === key2) {
                var nextKey = +node.nextElementSibling.dataset.key;
                if (nextKey > key1) {
                  key1 = (nextKey + key1)/2;
                  node.dataset.key = key1;
                }
              }
              var newKey = (key1 + key2)/2;
              anchor.dataset.key = newKey;
              anchor.className = "layer-anchor";
              anchor.id = "anchor" + newKey;
              node.parentElement.insertBefore(anchor, node);
            } 
          }
        }
      }
    }
  },

  render : function() {
    return <div contentEditable
                id="main-edition-div"
                onKeyDown={this.handleKeyDown}
                onKeyUp={this.handleKeyPress}>
      {
        this.props.parts.map(function(p){
          if (!p.contents) {
            return <span id={"anchor"+p.key}
                         data-key={p.key}
                          className="layer-anchor"></span>
          } else if (p.heading) {
            return <h2 data-key={p.key} id={p.contents}>
                        {p.contents}
                    </h2>
          } else {
            return <p data-key={p.key} >{p.contents}</p>
          }
        })
      }
          </div>;
  },

  changed: function(){
    console.log(app);
  }
});


var SaveBtn = React.createClass({
  handleClick: function() {
    var htmlParts = document.getElementById("main-edition-div").innerHTML;
    var xhr = new XMLHttpRequest;
    xhr.open("POST", "/api/parts/"+this.props.layerId);
    xhr.send(htmlParts);
  },
  render: function() {
    return <Button onClick={this.handleClick}
                    bsSize="large" bsStyle="primary" block>Save</Button> ;
  }
});

var NewSaveBtn = React.createClass({
  render: function() {
    return <Button bsSize="large" bsStyle="primary" block>New Save</Button> ;
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
              return <li key={chap.key}><a
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
            <Col md={4}>
              <Parts parts={this.props.parts} />
            </Col>
            <Col md={4}>
              <NewParts parts={this.props.parts} />
            </Col>
            <Col md={2}>
              <SaveBtn layerId={this.props.layerId} />
              <NewSaveBtn layerId={this.props.layerId} />
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
