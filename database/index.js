var Promise = require("promise"),
    DbAdapter = require("./db-stream-adapter");

/**
 * Class through which all database interactions should happen.
 * @param {knex} [connection] - A knex object representing a database connection
 */
module.exports = Db = function Db(connection){
  if (!connection) connection = require("./connect");
  this.db = connection;
};


/**
 * Insert a book in the database and create the 
 * @return {Promise} a promise that will be resolved with the book Id
 */
Db.prototype.addBook = function (book) {
  return this.db("book").insert({
    "name" : book.name
  }).then(function(bookIds){
    // Return an id instead of an array of 1 id
    return bookIds[0];
  });
};

/**
 * Insert a layer in the database
 * @private
 * @param layer {Layer}
 * @param originalLayerId - The layer from which this one will be copied
 */
Db.prototype.addLayer = function (layer, originalLayer) {
  return this.db("layer").insert({
    "name"    : layer.name,
    "parent"    : originalLayer ? originalLayer.id : null,
    "book"    : layer.book || originalLayer.book
  });
};

/**
 * Get all the books in the database
 */
Db.prototype.getBooks = function() {
  return this.db("book");
};

/**
 * Get a list of all layers that are in a book
 * @return a promise that resolves with an array of layers
 */
Db.prototype.getLayers = function (bookId) {
  return this.db("layer").where("book", bookId);
};

/**
 * @return a promise that is resolved with a list of chapters in the book
 */
Db.prototype.getChapters = function (layerId) {
  return this.db("part")
              .where("layer", layerId)
              .whereNotNull("heading");
};

/**
 * Insert parts in the database. Deletes the chapter in which the first part is
 * @param partsStream - A stream of parts, the first one indicates the chapter
 * @param layerId - The id of the layer in which the chapter is
 */
Db.prototype.addChapter = function (partsStream, layerId) {
  var self = this;
  return new Promise(function (resolve, reject) {
    var num = 0, // Number of parts remaining
        finished = false;

    var inserted = function inserted() {
      num--;
      if (num === 0 && finished) resolve(true);
    };
    var end = function end(){
      finished = true;
      if (num === 0) resolve(true);
    };
    
    partsStream.on("data", function(part){
      num++;
      self.db("part").insert({
        "key"     : part.key,
        "layer"   : part.layer || layerId,
        "contents": part.contents,
        "heading" : part.heading
      })
      .then(inserted)
      .catch(reject);
    });
    partsStream.on("error", reject);
    partsStream.on("close", resolve); 
    partsStream.on("end", resolve); 
  });
};


/**
 * @private
 */
Db.prototype._partsInChapter = function(chapterKey) {
  return this.db("part")
             .where("key", '>=', chapterKey)
             .where("key", '<', function(){
              this.select("key").from("part")
                  .where("key", '>', chapterKey)
                  .where("heading", "is not", null)
                  .orderBy("key")
                  .union(function(){
                    this.from("part").max("key");
                  })
                  .limit(1);
             });
};

/**
 * Get a stream of all parts with a key such that
 * key >= firstPartKey
 * and key < (the key of the next chapter)
 */
Db.prototype.getPartsInChapter = function(firstPartKey) {
  return this._partsInChapter(firstPartKey)
              .select(["key", "heading", "contents"])
              .pipe(new DbAdapter);
}

Db.prototype.removeChapter = function (chapterKey) {
  return this._partsInChapter(chapterKey).del();
};
