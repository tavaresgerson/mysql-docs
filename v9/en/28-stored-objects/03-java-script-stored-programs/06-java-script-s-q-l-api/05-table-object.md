#### 27.3.6.5 Table Object

The `Table` object represents a database table

* `existsInDatabase()`: Returns `true` if the table exists in the current database, otherwise `false`.

* `count()`: Returns the number of rows in this table if it exists in the current database, otherwise throws an error.

* `isView()`: Returns `true` if the table is a view, otherwise `false`.

  See also Section 27.6, “Using Views”, for further information about database views in MySQL.

* `getName()`: Returns the name of the `Table` (a `String`).

* `getName()`: Returns the `Schema` in which this table resides.

* `getSession()`: Returns the `Session` object corresponding to the current session.
