var PartKey = require("./index.js").PartKey;

var strings = ["00000000.00000000-123", "1.1-hello", "2.2-world"];
var orderedParts = strings.map(function(s){return PartKey.parse(s)});


exports["test that order is preserved"] = function(assert) {
  assert.deepEqual(orderedParts, orderedParts.sort(),
      "order of objects generated from strings");
  var p1 = new PartKey(1);
  var p2 = new PartKey(2);
  assert.deepEqual(orderedParts, orderedParts.sort(),
      "order of objects generated from integers");
} 

exports['test new part between two parts'] = function(assert) {
  function testKeys(k1, k2) {
    var p1 = PartKey.parse(k1);
    var p3 = PartKey.parse(k2);
    var p2 = PartKey.between(p1, p3);
    assert.ok(p1 < p2 && p2 < p3, p1 + " < " + p2 + " < " + p3);
  }
  testKeys("0-01", "0-02");
  testKeys("0.01-01", "4-002");
}

if (module == require.main) {
  require('test').run(exports);
}
