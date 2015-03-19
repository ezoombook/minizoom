var sax = require("sax");
var stream = require("stream");
var util = require('util');
var Transform = require('stream').Transform;
var parts = require("../parts"),
    Part = parts.Part,
    PartKey = parts.PartKey;


/**
 * A stream transform that transforms a byte stream of html UTF8 text
 * to an object stream of parts.
 * The keys of the parts might not be correct (some parts might not have keys
 * and keys might not be in increasing order).
 * Use the KeyCorrector transform to correct the keys.
 * @extends stream.Transform
 */
var HTMLToParts = exports.HTMLToParts = function HTMLToParts(options) {
  if (!(this instanceof HTMLToParts))
    return new HTMLToParts(options);

  Transform.call(this, options);
  this._writableState.objectMode = false;
  this._readableState.objectMode = true;

  //Initialize the parser state
  this._curPart = null; // Object containing the part currently being parsed
  this._skipping = false; // Indecate whether the text currently being decoded should be ignored

  this.saxStream = sax.createStream();
  var self = this;
  
  this.saxStream.on("opentag", function(tag) {
    self.opentag(tag);
  });

  this.saxStream.on("text", function(text) {
    self.addText(text);
  });

  this.saxStream.on("closetag", function(tagName){
    self.closetag(tagName);
  });

  this.saxStream.on("error", function(tagName){
    // clear the error
    this._parser.error = null
    this._parser.resume()
  });

  this.saxStream.on("end", function(){
    self.closePart();
  });
}
util.inherits(HTMLToParts, Transform);

HTMLToParts.prototype._transform = function(chunk, encoding, cb) {
  this.saxStream.write(chunk, encoding);
  cb();
};

HTMLToParts.prototype._flush = function(cb) {
  this.saxStream.end();
  cb();
};

HTMLToParts.prototype.newPart = function newPart(key, heading) {
  this.closePart();
  this._curPart = new Part(key, heading, null);
};

/**
 * Add contents to the currently opened part
 * Create a new one if no part is currently opened.
 */
HTMLToParts.prototype.addText = function(text) {
  if (this._curPart === null) this.newPart();
  this._curPart.addContents(text);
}

HTMLToParts.prototype.closePart = function closePart() {
  if(this._curPart !== null)
    this.push(this._curPart);
  this._curPart = null;
};

HTMLToParts.tagTypes = {
  BLOCK:1, // Start a new part, closing the one that is eventually opened
  BREAK:2, // End the opened part
  SKIP:3,  // Skip all the contents until a new part is started
};

HTMLToParts.prototype.tagType = function(tagName) {
  return ({
    "P": 1, "DIV": 1, "PRE": 1,
    "H1": 1, "H2": 1, "H3": 1, "H4": 1,"H5": 1, "H6":1,
    "BR": 2, "HR": 2,
    "SCRIPT": 3, "TITLE": 3, "STYLE": 3
  })[tagName];
}

/**
 * To be called when a new tag is opened
 * @private
 * @param {{name:string, attributes:Object}} tag
 */
HTMLToParts.prototype.opentag = function(tag) {
  this._skipping = false;
  var key = tag.attributes["DATA-KEY"];
  switch (this.tagType(tag.name)) {
    case HTMLToParts.tagTypes.BLOCK:
      // the beginning of a paragraph
      var matchHeading = tag.name.match(/^H([1-6])$/);
      this.newPart(key, matchHeading ? matchHeading[1] : null); 
      return;
    case HTMLToParts.tagTypes.BREAK:
      this.closePart();
      return;
    case HTMLToParts.tagTypes.SKIP:
      this._skipping = true;
      return;
   default:
    if (key) {
      // an anchor
      this.newPart(key);
      this.closePart();
    }
  }
};

/** Close the currently opened tag
 */
HTMLToParts.prototype.closetag = function(tagName) {
  this._skipping = false;
  if (this.tagType(tagName) === HTMLToParts.tagTypes.BLOCK) {
    this.closePart();
  }
}


/**
 * Stream transform that transforms a stream of parts with eventually bad keys
 * to a stream of parts that all have a valid key, in increasing order
 * @constructor
 */
var KeyCorrector = exports.KeyCorrector = function KeyCorrector(options) {
  if (!(this instanceof KeyCorrector))
    return new KeyCorrector(options);

  Transform.call(this, options);
  this._writableState.objectMode = true;
  this._readableState.objectMode = true;

  options = options || {};
  this._buffer = [];
  this._lastKey = options.firstKey || new PartKey(0);
}
util.inherits(KeyCorrector, Transform);

KeyCorrector.prototype._transform = function(part, encoding, cb){
  if (part.key.number > this._lastKey.number) {
    var keys = PartKey.between(this._lastKey, part.key, this._buffer.length);
    for (var i=0; i<this._buffer.length; i++) {
      this._buffer[i].key = keys[i];
      this.push(this._buffer[i]);
    }
    this.push(part);
    this._lastKey = part.key;
    this._buffer = [];
  } else {
    this._buffer.push(part);
  }
  cb();
}

KeyCorrector.prototype._flush = function(cb){
  for (var i=0; i<this._buffer.length; i++) {
    var part = this._buffer[i];
    part.key = PartKey.after(this._lastKey);
    this.push(part);
    this._lastKey = part.key;
  }
  cb();
}

/**
 * Stream transform that adds keys in increasing order to a parts stream
 * @constructor
 */
var KeyGenerator = exports.KeyGenerator = function KeyGenerator(options) {
  if (!(this instanceof KeyGenerator))
    return new KeyGenerator(options);

  Transform.call(this, options);
  this._writableState.objectMode = true;
  this._readableState.objectMode = true;

  this._lastKey = options.firstKey || new PartKey(0);
}
util.inherits(KeyGenerator, Transform);

KeyGenerator.prototype._transform = function(part, encoding, cb){
  part.key = PartKey.after(this._lastKey);
  this._lastKey = part.key;
  this.push(part);
  cb();
}
