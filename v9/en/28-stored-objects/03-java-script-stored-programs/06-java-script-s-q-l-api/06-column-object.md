#### 27.3.6.6 Column Object

The `Column` object represents the column metadata in a result set. `Column` has the methods listed here:

* `getFractionalDigits()`: Gets the fractional digits of the column value, if applicable. Returns an integer.

* `getLength()` Retrieves the length of the column, as an integer.

* `getCharacterSetName()`: Retrieves the name of the character set used by the column.

  See Chapter 12, *Character Sets, Collations, Unicode*, for more information about MySQL character sets and collations.

* `getCollationName()` Retrieves the name of the character set collation used by the column.

  See Chapter 12, *Character Sets, Collations, Unicode*, for more information about MySQL character sets and collations.

* `getColumnLabel()`: Returns a string value representing the column alias, or the column name if no alias is defined.

* `getColumnName()`: Returns a string value representing the column name.

* `getSchemaName()`: Gets the name of the schema in which the column is defined.

* `String getTableLabel()`: Retrieves the alias for the table in which the column occurs.

* `getTableName()`: Gets the name of the table in which the column occurs.

* `getType()`: Retrieves the column's type (a `Type` object).

* `isNumberSigned()`: Indicates whether a numeric column is signed (`true` if it is signed).

* `isPadded()`: If `true`, padding is used for the column value.

All of the methods just listed return strings unless otherwise indicated.
