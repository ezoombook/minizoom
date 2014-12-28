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
              return <li key={layer.key}>{layer.title}</li>;
          })
        }
        </ul>
      </Panel>
      );
  }
});

var Parts = React.createClass({
  render : function() {
    return (
      <Row>
      {
        this.props.parts.map(function(part){
         return (
           <Col key={part.key}>
            <textarea
                  className={part.type}
                  value={part.contents}
                  onChange={this.changed}
                  />

              <Button bsSize="xsmall">Extra small button</Button>
          </Col>)
        }.bind(this))
      }
      </Row>
      );
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

console.log(React.version);

if (typeof window === 'object') {
  var app; // golbal application variable
  window.onload = function() {
    // initialState has been set before (sent as a payload by the server)
    app = React.createElement(App, {initialState:initialState});
    React.render(app, document);
  }
}
