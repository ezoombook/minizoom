'use strict';


var React       = require('react');
var superagent  = require('superagent');
var bootstrap = require('react-bootstrap');

var PageHeader = bootstrap.PageHeader,
    Grid = bootstrap.Grid,
    Row = bootstrap.Row,
    Col = bootstrap.Col;

var Layers = React.createClass({
  render : function() {
    return (
        <h2>eZoomLayers</h2>
      );
  }
});

var Parts = React.createClass({
  render : function() {
    return (
        <h2>parts</h2>
      );
  }
});


var Chapters = React.createClass({
  render : function() {
    return (
        <h2>Chapters</h2>
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
  render: function() {
    var contents = this.props.loading
                  ? "Loading..."
                  : <MainGrid layers={this.props.layers}
                              parts={this.props.parts}
                              chapters={this.props.chapters}/>;
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

if (typeof window !== 'undefined') {
  window.onload = function() {
    var app = React.createComponent(App, {loading:true});
    React.renderComponent(app, document);
  }
}
