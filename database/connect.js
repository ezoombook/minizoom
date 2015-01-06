var fs = require("fs");

var connectionFile = __dirname + "/connection_string.txt";
var connectionStr = fs.readFileSync(connectionFile, "utf8"); 

module.exports = require('knex')({
  client: 'mysql',
  connection: connectionStr
});

