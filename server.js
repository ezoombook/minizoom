'use strict';

var path        = require('path');
var url         = require('url');
var express     = require('express');
var React       = require('react');
var browserify  = require('browserify');
var reactify    = require('reactify');
var nodejsx     = require('node-jsx').install();
var superagent  = require('superagent');

var routes = require('./routes');
var workspace = require('./routes/workspace');
var project = require('./routes/project');
var book = require('./routes/book');

//var importer    = require('./import/html');
//var dbAPI       = new (require("./database"));
//var parts = require('./parts');
// var bodyParser = require('body-parser');
// var util = require('util');
// var JSONStream = require('JSONStream');

// var development = process.env.NODE_ENV !== 'production';

var app = express();

// function dbResponse(params, dbAPIMethod) {
//   return function(req, res) {
//     var ids = params.map(function(p){return parseInt(req.query[p])});
//     if (ids.some(isNaN)) throw "Invalid non-integer parameter";
//     dbAPI[dbAPIMethod].apply(dbAPI, ids).then(function(results){
//       res.send(results);
//     })
//     .catch(function(err){
//       res.send("Database error");
//     });
//   }
// }

var api = express()
//   .use(bodyParser.json())
//   .use(bodyParser.urlencoded({ extended: true }))
//   .get("/layers", dbResponse(["bookId"], "getLayers"))
//   .get("/chapters", dbResponse(["layerId"], "getChapters"))
//   .get("/books", dbResponse([], "getBooks"))
//   .get("/parts", function(req, res){
//     // This API function is special, it does not return a single json
//     // response, but several stringified parts, sperated by two new lines "\n\n"
//     var layerId    = parseInt(req.query.layerId);
//     var chapterKey = "" + req.query.chapterKey;
//     var stream = dbAPI.getPartsInChapter(layerId, chapterKey);
//     stream.on("data", function(part){
//       res.write(part.toString() + "\n\n");
//     });
//     stream.on("end", function(){res.end()});
//   })
//   //.get("/users/:userId/projects", dbResponse(["userId"], "getUserProjects"))
//   //.get("/users/:userId/books", dbResponse(["userId"], "getUserBooks"))
//   //.get("/users/:userId/groups", dbResponse(["userId"], "getUserGroups"))
//   .post("/parts/:layerId", function(req, res, next){
//     var changedParts = req.body.changedParts;
//     var addedParts = req.body.addedParts;
//     var deletedParts = req.body.deletedParts;
//     console.log(deletedParts);
//     dbAPI.changeParts(addedParts, changedParts, deletedParts, req.params.layerId);
//   })
//   .post("/layers/:layerId", function(req, res, next){
//     var newLayer = {"name": req.body.newLayerName,
//                     "book": req.body.book};
//     var originalLayerId = parseInt(req.params.layerId);
//     var originalLayer = {"id": originalLayerId};
//     var newLayerId = 0;
//     dbAPI.addLayer(newLayer, originalLayer).then(function(layerId) {
//       newLayerId = layerId;
//       return dbAPI.getPartsInLayer(originalLayerId);
//     }).then(function(parts) {
//       dbAPI.insertPartsToNewlayer(parts,newLayerId);
//     }).then(function() {
//       var newURL = '/book/'+req.body.book+'/'+newLayerId;
//       res.send(newURL);
//     });      
//   });

// if (development) {
//   app.get('/assets/bundle.js', function(req, res) {
//       res.writeHead(200, {"Content-Type":"text/javascript"});
//       browserify('./views/client.jsx', {
//         debug: true,
//       })
//       .transform(reactify)
//       .bundle()
//       .pipe(res);
//   });
// }


app
  .use('/assets', express.static(path.join(__dirname, 'assets')))
  .use('/api', api)
  //.use('/book/:bookId/:layerId', client.edit)
  .use('/books',book.list)
  .use('/projects',project.list)
  .use('/workspace/:userId', workspace.workspace)
  .use('/', routes.index)
  .listen(3000, function() {
    console.log('Point your browser at http://localhost:3000');
  });
