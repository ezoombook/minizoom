/**
 * Class through which all database interactions should happen.
 * @param {knex} [connection] - A knex object representing a database connection
 */
module.exports = Db = function Db(connection){
  if (!connection) connection = require("./connect");
  this.db = connection;
};


/**
 * Insert a book in the database
 * @return {Promise} a promise that will be resolved with the book Id
 */
Db.prototype.addBook = function (book) {
  return this.db("book").insert({
    "name" : book.name
  });
};

/**
 * Insert a layer in the database
 * @private
 * @param layer {Layer}
 * @param originalLayerId - The layer from which this one will be copied
 */
Db.prototype.addLayer = function (layer, originalLayerId) {
  return this.db("layer").insert({
    "name"    : layer.name,
    "base"    : originalLayerId
  });
};

/**
 * Insert a part in the database
 */
Db.prototype.addPart = function (part, layerId) {
  return this.db("part").insert({
    "key"     : part.key,
    "layer"   : layerId,
    "contents": part.contents,
    "heading" : part.heading
  });
};


