#### 27.3.6.4 Schema Object

The `Schema` object represents a database schema. You can obtain an instance of `Schema` by calling the `Session` object's `getSchema()` method; you can also obtain a list of all available databases by calling `getSchemas()`.

Schema supports the methods listed here:

* `existsInDatabase()`: Returns `true` if the schema exists, otherwise `false`.

* `getTable(String name)`: Returns the `Table` having the specified *`name`*.

* `getTables()`: Returns a list of tables (`Table` objects) existing within this `Schema`.

* `getName()`: Returns the name of the `Schema` (a `String`).

* `getName()`: Returns the `Schema` itself.

* `getSession()`: Returns the `Session` object corresponding to the current session.
