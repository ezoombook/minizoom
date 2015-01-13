//This is a nodeunit test
var Promise = require("promise");
var testDb = require('./connect');

exports.setUp = function setUp(callback) {
  return testDb
    .raw("USE test_ezoombook") 
    .then(function(){callback()});
}

exports.tearDown = function tearDown(callback){
  return Promise.all([
          testDb.raw("DELETE FROM part"),
          testDb.raw("DELETE FROM layer"),
          testDb.raw("DELETE FROM book")
          ]).then(function(){callback()})
}

exports["test database"] = function(test) {
    test.expect(7); // Number of assertions
    var bookId, layerId;
    var dbAPI = new (require("./index"))(testDb);
    dbAPI.addBook({
      name: "**test**"
    })
    .then(function(id){
      bookId = id;
      test.notEqual(bookId, null, "addBook returns the id of the book")

      return dbAPI.addLayer({
        "name": "layer 1: µ-summary",
        "book": bookId
      })
    })
    .then(function(id) {
      layerId = id;
      return dbAPI.getLayers(bookId);
    })
    .then(function(layers){
      test.strictEqual(layers.length, 1, "getLayers: number of layers");
      test.strictEqual(layers[0].name, "layer 1: µ-summary", "getLayers: name");
    })
    .then(function(){
      var partsStream = new (require("stream").PassThrough);
      partsStream._writableState.objectMode = true;
      partsStream._readableState.objectMode = true;

      partsStream.write({
        key: "11",
        contents: "Hello"
      });
      partsStream.write({
        key: "12",
        contents: "Chap II",
        heading: 1
      });
      partsStream.end();
      return dbAPI.addChapter(partsStream, layerId);
    })
    .then(function(){
      return dbAPI.getChapters(layerId);
    })
    .then(function(chapters){
      test.strictEqual(chapters.length, 1, "getChapters: number of chapters");
      test.strictEqual(chapters[0].heading, 1, "getChapters: heading");
      test.strictEqual(chapters[0].contents, "Chap II", "getChapters: contents");
    })
    .then(function(){
     var stream = dbAPI.getPartsInChapter(layerId, "11");
     return new Promise(function (accept, reject) {
      stream.on("end", accept);
      stream.on("data", function(part){
        test.equal(part.contents, "Hello", "The right part is streamed");
      });
     });
    })
    .done(
        test.done.bind(test),
        function(err){
          test.ok(false, err);
          test.done();
        }
    );
};

if (module == require.main) {
  require("nodeunit").reporters.default.run([__filename]);
}
