'use strict';

var path        = require('path');
var url         = require('url');
var express     = require('express');
var React       = require('react');
var browserify  = require('browserify');
var reactify    = require('reactify');
var nodejsx     = require('node-jsx').install();
var routes = require('./routes');
var client = require('./routes/client');
var book = require('./routes/book');
var importer    = require('./import/html');
var dbAPI       = new (require("./database"));

var development = process.env.NODE_ENV !== 'production';

var app = express();

function dbResponse(params, dbAPIMethod) {
  return function(req, res) {
    var ids = params.map(function(p){return parseInt(req.query[p])});
    if (ids.some(isNaN)) throw "Invalid non-integer parameter";
    dbAPI[dbAPIMethod].apply(dbAPI, ids).then(function(results){
      res.send(results);
    })
    .catch(function(err){
      res.send("Database error");
    });
  }
}

var api = express()
  .get("/layers", dbResponse(["bookId"], "getLayers"))
  // .post("/newlayers/:layerId", function(req, res, next){
  //   dbAPI.addLayer(layer, originalLayer)
  // })
  .get("/chapters", dbResponse(["layerId"], "getChapters"))
  .get("/books", dbResponse([], "getBooks"))
  .get("/parts", function(req, res){
    // This API function is special, it does not return a single json
    // response, but several stringified parts, sperated by two new lines "\n\n"
    var layerId    = parseInt(req.query.layerId);
    var chapterKey = "" + req.query.chapterKey;
    var stream = dbAPI.getPartsInChapter(layerId, chapterKey);
    stream.on("data", function(part){
      res.write(part.toString() + "\n\n");
    });
    stream.on("end", function(){res.end()});
  })
  .post("/parts/:layerId", function(req, res, next){
    // var partsStream = req.pipe(importer.HTMLToParts()).pipe(importer.KeyCorrector());

    // dbAPI.addChapter(partsStream, req.params.layerId)
    //   .then(function(r) {
    //     res.end({success:true});
    //     next();
    //   },
    //   function error(err) {
    //     console.log("Error while saving parts", err);
    //     res.end({success:false, error:err});
    //     next();
    //   });
  
  });

if (development) {
  app.get('/assets/bundle.js', function(req, res) {
      res.writeHead(200, {"Content-Type":"text/javascript"});
      browserify('./views/client.jsx', {
        debug: true,
      })
      .transform(reactify)
      .bundle()
      .pipe(res);
  });
}


app
  .use('/assets', express.static(path.join(__dirname, 'assets')))
  .use('/api', api)
  .use('/book/:bookId/:layerId', client.edit)
  .use('/books',book.list)
  .use('/', routes.index)
  .listen(3000, function() {
    console.log('Point your browser at http://localhost:3000');
  });
