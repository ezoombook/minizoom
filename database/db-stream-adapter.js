var util = require("util"),
    Transform = require("stream").Transform,
    partsApi  = require("../parts"),
    PartKey   = partsApi.PartKey,
    Part      = partsApi.Part;
/**
 * Stream transform that transforms a stream that comes out of
 * the database to a stream of parts
 * @constructor
 */
var DbAdapter = module.exports = function DbAdapter(options) {
  if (!(this instanceof DbAdapter))
    return new DbAdapter(options);

  Transform.call(this, options);
  this._writableState.objectMode = true;
  this._readableState.objectMode = true;
}
util.inherits(DbAdapter, Transform);

/**
 * Creates Part objects
 */
DbAdapter.prototype._transform = function(rawPart, encoding, cb) {
  var part = new Part(rawPart.key, rawPart.heading, rawPart.contents);
  this.push(part);
  cb();
}
