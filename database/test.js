var testDb = require("./connect");

function setUp() {
  return testDb
    .raw("CREATE DATABASE IF NOT EXISTS test_ezoombook") 
    .then(function(){
      testDb.raw("USE test_ezoombook");
    });
}

function tearDown(){
  return testDb.raw("DROP DATABASE test_ezoombook");
}

exports["test schema creation"] = function() {
  require("./create_schema").createSchema(testDb);
};

if (module == require.main) {
  setUp().then(function(){
    require('test').run(exports).then(tearDown);
  });
}
