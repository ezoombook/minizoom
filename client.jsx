'use strict';


var React       = require('react');
var superagent  = require('superagent');
var bootstrap = require('react-bootstrap');

var PageHeader = bootstrap.PageHeader,
    Grid = bootstrap.Grid,
    Row = bootstrap.Row,
    Col = bootstrap.Col,
    Panel = bootstrap.Panel,
    Button = bootstrap.Button;

var Layers = React.createClass({
  render : function() {
    return (
      <Panel>
        <h4>eZoomLayers</h4>
        <ul>
        {
          this.props.layers.map(function(layer){
              return <li key={layer.id}>{layer.name}</li>;
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
            return <h2 data-key={p.key}>{p.contents}</h2>
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
        <Grid>
          <Row className="app-columns">
            <Col md={2}>
              <Layers layers={this.props.layers}/>
            </Col>
            <Col md={8}>
              <Parts parts={this.props.parts} />
            </Col>
            <Col md={2}>
              <Chapters chapters={this.props.chapters} />
            </Col>
          </Row>
        </Grid>
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
                              chapters={this.state.chapters}/>;
    return (
      <html>
        <head>
          <link rel="stylesheet" href="/assets/style.css" />
          <script src="/assets/bundle.js" />
          <meta charSet="utf8" />
          <title>Minizoom</title>
        </head>
        <PageHeader>Minizoom</PageHeader>
        {contents}
      </html>
    );
  }
});

module.exports = App;

if (typeof window === 'object') {
  var app; // golbal application variable
  window.onload = function() {
    // initialState has been set before (sent as a payload by the server)
    app = React.createElement(App, {initialState:initialState});
    React.render(app, document);
  }
}
