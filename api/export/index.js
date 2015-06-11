/**
 * Collection of stream transforms
 * for exporting a stream of parts
 */

var util = require("util"),
    Transform = require("stream").Transform;

/**
 * Stream transform that transforms a stream of parts to a stream of DOM nodes
 * @constructor
 */
var DOMTransform = exports.DOMTransform = function DOMTransform(options) {
  if (!(this instanceof DOMTransform))
    return new DOMTransform(options);

  Transform.call(this, options);
  this._writableState.objectMode = true;
  this._readableState.objectMode = true;
}
util.inherits(DOMTransform, Transform);

DOMTransform.prototype._transform = function(part, encoding, cb){
  var tagName = "p";
  if (part.heading < 6) tagName = "h" + part.heading;
  else if (!part.content) tagName = "span";
  var el = document.createElement(tagName);

  if (part.key) el.setAttribute("data-key", part.key.toString());
  if (part.contents) el.textContent = part.contents;
  else el.className = "layer-anchor";

  this.push(el);
  cb();
}
