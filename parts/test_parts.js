var Part = require("./index.js").Part;

exports["test serialization/deserialization"] = function(assert) {
  var p1 = new Part("12", "hello", 1);
  var p2 = Part.fromString(p1.toString());
  assert.strictEqual(p1.contents, p2.contents, "contents");
  assert.strictEqual(p1.heading, p2.heading, "heading");
  assert.strictEqual(p1.key.number, p2.key.number, "key.number");
};

if (module == require.main) {
  require('test').run(exports);
}
