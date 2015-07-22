'use strict';

var profile = require('./profile');
var groups = require('./groups');
var users = require('./users');
var authority = require('./authority');

module.exports = function(api) {
	api.route('/profile')
		.patch(profile.patch);
	api.route('/groups')
		.post(groups.post)
        .patch(groups.patch)
        .delete(groups.delete);
	api.route('/users/:userId')
		.get(users.get);
	api.route('authority/group/:groupId/:userId')
		.get(authority.group);
 // api.get("/layers", dbResponse(["bookId"], "getLayers"))
 //  .get("/chapters", dbResponse(["layerId"], "getChapters"))
 //  .get("/books", dbResponse([], "getBooks"))
 //  .get("/parts", function(req, res){
 //    // This API function is special, it does not return a single json
 //    // response, but several stringified parts, sperated by two new lines "\n\n"
 //    var layerId    = parseInt(req.query.layerId);
 //    var chapterKey = "" + req.query.chapterKey;
 //    var stream = dbAPI.getPartsInChapter(layerId, chapterKey);
 //    stream.on("data", function(part){
 //      res.write(part.toString() + "\n\n");
 //    });
 //    stream.on("end", function(){res.end()});
 //  })
 //  //.get("/users/:userId/projects", dbResponse(["userId"], "getUserProjects"))
 //  //.get("/users/:userId/books", dbResponse(["userId"], "getUserBooks"))
 //  //.get("/users/:userId/groups", dbResponse(["userId"], "getUserGroups"))
 //  .post("/parts/:layerId", function(req, res, next){
 //    var changedParts = req.body.changedParts;
 //    var addedParts = req.body.addedParts;
 //    var deletedParts = req.body.deletedParts;
 //    console.log(deletedParts);
 //    dbAPI.changeParts(addedParts, changedParts, deletedParts, req.params.layerId);
 //  })
 //  .post("/layers/:layerId", function(req, res, next){
 //    var newLayer = {"name": req.body.newLayerName,
 //                    "book": req.body.book};
 //    var originalLayerId = parseInt(req.params.layerId);
 //    var originalLayer = {"id": originalLayerId};
 //    var newLayerId = 0;
 //    dbAPI.addLayer(newLayer, originalLayer).then(function(layerId) {
 //      newLayerId = layerId;
 //      return dbAPI.getPartsInLayer(originalLayerId);
 //    }).then(function(parts) {
 //      dbAPI.insertPartsToNewlayer(parts,newLayerId);
 //    }).then(function() {
 //      var newURL = '/book/'+req.body.book+'/'+newLayerId;
 //      res.send(newURL);
 //    });      
 //  });
	
}