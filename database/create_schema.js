function booksTable(knex) {
  knex.schema.dropTableIfExists("book");
  knex.schema.createTable("book", function (table) {
    table.increments("id").notNullable();
    table.string("name");
  });
}

function layersTable(knex) {
  knex.schema.dropTableIfExists("layer");
  knex.schema.createTable("layer", function (table) {
    table.increments("id").notNullable();
    table.string("name");
    // The book to which the layer belongs
    tabe.integert("book").references("id").inTable("book");
    // The layer from which this one has been copied
    tabe.integert("base").references("id").inTable("layer");
    table.primary(["layer", "key"]);
  });
  
}

function partsTable(knex) {
  knex.schema.dropTableIfExists("part");
  knex.schema.createTable("part", function (table) {
    // The key identifies a part in a book
    // If two parts have the same key, they match
    // and should be displayed side by side
    table.string("key").notNullable();
    // The layer to which the part belongs
    table.string("layer").references("id").inTable("layer");
    // The contents of the part, or NULL if the part is an anchor
    table.text("contents");
    // The level of heading of the part, or NULL if the part
    // is not a header
    table.integer("heading");

    table.primary(["layer", "key"]);
  });
}

exports.createSchema = function(knex) {
  knex = knex || require("./connect");
  booksTable(knex);
  layersTable(knex);
  partsTable(knex);
}
