#### 27.3.6.7 Row Object

A `Row` object models a row in a result set. `Row` provides the methods listed here:

* `getField(String name)`: Returns the value of the first field named *`name`*. You can retrieve the name using `getColumnLabel()`.

* `getLength()`: Returns the number of fields in the row.

In addition, the API provides the following convenience mechanisms for looking up a column value in a given row:

* *`Row` object property lookup*: The column name can be used directly as an object property as long as it is a legal JavaScript identifier.

  Example: `row.my_column`.

* *`Row` object key lookup*: The column name, quoted, can be used as a key name.

  Example: `row['my_column']`.

* *`Row` object index lookup*: A valid column index can be used to look up the column value.

  Example: `row[2]`.
