var importer = require("./html");
var stream = require("stream");
var ezpart   = require("../parts");

var HTMLToParts = importer.HTMLToParts;

var test_data = [
  {name: "full",
   html: "<h1>Hello</h1><span data-key='00' />world<p>...</p>",
   parts: [
      {heading:1, contents:"Hello"},
      {key: 0},
      {contents:'world'},
      {contents:'...'}
     ]},
   {name: "Unclosed tag",
   html: "<p>Hello",
   parts: [
      {contents:"Hello"}
      ]
   },
   {name: "Invalid xml",
   html: "<this tag is never closed data-key='99.9' >lol",
   parts: [
      {key: 99.9},
      {contents:"lol"}
      ]
   }

];

exports["test html to parts parsing"] = function(assert, done) {
   test_data.forEach(function(data, dataNum){
      var partNum = 0;
      var partsStream = new importer.HTMLToParts;
      partsStream.write(data.html);
      partsStream.end();

      partsStream.on("data", function(part){
         var expected = data.parts[partNum];
         for (var i in expected) {
            if (i === "key") {
               assert.equal(part[i].number,
                  new ezpart.PartKey(expected[i]).number,
                  data.name + '[' + partNum + "].key");
            } else {
               assert.equal(part[i], expected[i],
                  data.name + '[' + partNum + "]." + i);
            }
         }
         partNum ++;
      });

      partsStream.on("end", function(){
        assert.equal(partNum, data.parts.length,
           data.name + ": Correct number of parts");
        if(dataNum === test_data.length-1) done();
      });
   });
};

function testKeyTranformer(keyTransformer) {
   return (function(assert, done) {
      test_data.forEach(function(data, dataNum){
         var partsStream = new importer.HTMLToParts;
         var curKey = new ezpart.PartKey(0);
         var orderedStream = new keyTransformer({
            firstKey: curKey
         });
         partsStream.pipe(orderedStream);
         partsStream.write(data.html);
         partsStream.end();

         orderedStream.on("data", function(part){
            assert.ok(part.key > curKey, part.key + " > " + curKey);
            curKey = part.key;
         });

         if(dataNum === test_data.length-1) partsStream.on("end", done);
      });
   });
}

exports["test keys correction"] = testKeyTranformer(importer.KeyCorrector);
exports["test keys generation"] = testKeyTranformer(importer.KeyGenerator);

if (module === require.main) {
   require("test").run(exports);
}


