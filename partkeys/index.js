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

/**
 * Parse a string to a PartKey
 * The string should be recognized by the regexp ^\d+\.\d+-.*
 * @param {String}
 * @throws Error Invalid partKey string
 * @return {PartKey}
 */
PartKey.parse = function(str) {
  var parsed = str.split('-', 2);
  var number = parseFloat(parsed[0]);
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
PartKey.between = function (key1, key2) {
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
 * Format a number to a 17-characters string:
 * 8 hex digits, a dot, and 8 more hex digits
 * @private
 */
function formatNum(num) {
  var intpart = Math.floor(num).toString(16);
  while(intpart.length < 8) intpart = "0" + intpart;
  intpart = intpart.slice(-8);

  var floatpart = Math.floor((num - Math.floor(num)) * 1e8).toString(16);
  while(floatpart.length < 8) floatpart = floatpart + '0';
  floatpart = floatpart.slice(0, 8);

  return intpart  + '.' + floatpart;
}

module.exports = PartKey;
