var fs = require("fs");

connectionFile = __dirname + "/connection-string-" +
                  ((process.env.NODE_ENV === 'production') ? "prod" : "dev") +
                  ".json";

module.exports = require('knex')(
  JSON.parse(fs.readFileSync(connectionFile, "utf8")) 
);
