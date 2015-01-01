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

exports["test with sample input"] = function(assert, done) {
   test_data.forEach(function(data, dataNum){
      var partNum = 0;
      var input = new stream.PassThrough();
      var partsStream = input.pipe(new importer.HTMLToParts);

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
        if(dataNum === test_data.length) done();
      });

      input.write(data.html);
      input.end();
   });
};

if (module === require.main) {
   require("test").run(exports);
}


