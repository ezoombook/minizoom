# eZoomBook
This project is an attempt to create an eZoomBook platform based of different
principles than the original one built in Scala.

## Principles
This platform uses the principle of multi-layer books, called eZoomBooks.

A layer is just a version of the book, and all the layers have anchors, that
allow us to display them side-by-side.

When a book is imported, a new layer is created. Then all layers are created
by copying an existing layer. The modifications should preserve anchors as
much as possible, so that the platform can keep track of the correspondences
between two layers.

No distinction is made between an eZoomBook and a book. 

## Technical choices
### Programming languages
 * Javascript (es5, commented using the JSdoc syntax)
 * JSX (for the user interface)

### Database
Only one relational database. Knex is used to abstract SQL queries.
The goal is to keep all database related functions in the same submodule, in
order to make it as easy as possible to change database later.

### Main dependencies
 * knex for database management
 * browserify for client-side code

## Code organisation
The server manages streams of parts (paragraphs), that it saves to the database,
or sends to the client.

The client manages the edition of a list of parts, and sends it back to the server.
"Managing the edition" should not be more difficult then just letting the user
change the text, and trying to guess where new parts have to be created, and when
old parts should be reused.

## Organisation of the code
As much code as possible should be kept in separate modules.

Code for managing individual parts goes to `parts`.

Code for managing the stream of parts goes to `import`.

Code that interacts with the database goes to `database`.
