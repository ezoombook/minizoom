/**
 * @author Ophir LOJKINE
 * Definition of Part and PartKeys methods
 */

/**
 * @constructor
 * Represents a part (a paragraph) of a layer.
 * @argument key {PartKey|string}
 * @argument heading {string} [heading=null] - The heading level if the part is a heading, or null
 * @argument contents {string} [contents=""]
 */
function Part(key, heading, contents) {
  this.key = (key instanceof PartKey) ? key : new PartKey(key);
  if (heading != null) this.setHeading(heading);
  if (contents != null) this.setContents(contents);
} 
/**
 * @param {string} contents
 */
Part.prototype.setContents = function setContents(contents) {
  this.contents = (contents || "").toString();
}
/**
 * Add text contents to the part
 * @param {string} text
 */
Part.prototype.addContents = function addContents(text) {
  this.contents = (this.contents || "") + text;
}
/**
 * Set the heading level of the part
 * @method
 */
Part.prototype.setHeading = function (headingLevel) {
  headingLevel = parseInt(headingLevel) || 1;
  this.heading = headingLevel;
}

/**
 * Serializes the part as a string, that can then be decoded with
 * Part.fromString()
 */
Part.prototype.toString = function() {
  return JSON.stringify(this);
}

/**
 * Return a new part from a string exported by part.toString()
 */
Part.fromString = function(str) {
  var obj = JSON.parse(str);
  var key = new PartKey(obj.key.number, obj.key.uid);
  return new Part(key, obj.heading, obj.contents);
}
exports.Part = Part;

/**
 * Represents the key (the identifier) of a part.
 * Keys allow to compare different layers and to order the parts
 * inside a layer.
 * @constructor
 */
function PartKey(number, uid) {
  this.number = +number || 0;
  this.uid    = uid     || Date.now();
}
exports.PartKey = PartKey; 
/**
 * Parse a string to a PartKey
 * The string should be recognized by the regexp ^\d+\.\d+-.*
 * @param {String}
 * @throws Error Invalid partKey string
 * @return {PartKey}
 */
PartKey.parse = function(str) {
  var parsed = str.split('-', 2);
  var number = parseNum(parsed[0]);
  if (number === null) throw new Error("Invalid PartKey: invalid number");
  var uid    = parsed[1]; 
  return new PartKey(number, uid);
};

/**
 * Given two keys, generate a new PartKey such that 
 * key1 < newKey < key2
 * @param {PartKey} key1
 * @param {PartKey} key2
 * @return {PartKey}
 */
PartKey.betweenTwo = function (key1, key2) {
  var newUid;
  if (key1.number === key2.number) {
    //Generate an uid that is between uid1 and uid2
    var uid1 = "" + key1.uid,
        uid2 = "" + key2.uid;
    var i=0;
    while (i < uid2.length &&
           Math.abs(uid1.charCodeAt(i) - uid2.charCodeAt(i)) < 2) i++;
    var lastChar = (i < uid1.length && i < uid2.length)
      ? String.fromCharCode((uid1.charCodeAt(i)+uid2.charCodeAt(i))/2)
      : '_';
    newUid = uid1.slice(0,i) + lastChar;
  }
  var newNumber = (key1.number + key2.number) / 2;
  return new PartKey(newNumber, newUid);
};

/**
 * Given two keys and a number of keys to generate,
 * returns an sorted array of keys between the two keys.
 * @param {PartKey} key1
 * @param {PartKey} key2
 * @param {number}  [number=2] number of keys to generate
 * @return {PartKeys[]}
 */
PartKey.between = function (key1, key2, number) {
  var intervals = (parseInt(number) || 1) + 1;
  var keys = [];
  var delta = (key2.number - key1.number)/intervals;
  if (delta === 0) throw new Error("Not supported"); // TODO ?
  var i = key1.number + delta;
  for (var j=0; j<number; j++) {
    keys.push(new PartKey(i));
    i += delta;
  }
  return keys;
}

/**
 * Create a new PartKey such that key < newKey
 * @param key [PartKey]
 * @return newKey
 */
PartKey.after = function (key) {
  return new PartKey(key.number + 1<<4);
};

PartKey.prototype.toString = function(){
  return formatNum(this.number) + '-' + this.uid;
};

/**
 * Format a number to a 16-characters string:
 * 8 hex digits, a dot, and 7 more hex digits
 * @private
 */
function formatNum(num) {
  var intpart = Math.floor(num).toString(16);
  while(intpart.length < 8) intpart = "0" + intpart;
  intpart = intpart.slice(-8);

  var floatpart = Math.floor((num - Math.floor(num)) * (1<<28)).toString(16);
  while(floatpart.length < 7) floatpart = '0' + floatpart;
  floatpart = floatpart.slice(0, 8);

  return intpart  + '.' + floatpart;
}

/**
 * Converts a number formatted by formatNum to a number.
 * @see {@link formatNum}
 */
function parseNum(numStr) {
  var parts     = numStr.split('.', 2),
      p1 = parts[0] || '0';
      p2 = parts[1] || '0';
  while(p2.length < 7) p2 += '0';
  var intpart   = parseInt(p1, 16) || 0;
  var floatpart = parseInt(p2, 16) || 0;
  return intpart + floatpart / (1<<28);
}
