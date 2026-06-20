### 1.7.2 MySQL Differences from Standard SQL

We try to make MySQL Server follow the ANSI SQL standard and the
ODBC SQL standard, but MySQL Server performs operations
differently in some cases:

* There are several differences between the MySQL and standard
  SQL privilege systems. For example, in MySQL, privileges for
  a table are not automatically revoked when you delete a
  table. You must explicitly issue a
  [`REVOKE`](revoke.html "15.7.1.8 REVOKE Statement") statement to revoke
  privileges for a table. For more information, see
  [Section 15.7.1.8, “REVOKE Statement”](revoke.html "15.7.1.8 REVOKE Statement").

* The [`CAST()`](cast-functions.html#function_cast) function does not
  support cast to [`REAL`](floating-point-types.html "13.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE") or
  [`BIGINT`](integer-types.html "13.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"). See
  [Section 14.10, “Cast Functions and Operators”](cast-functions.html "14.10 Cast Functions and Operators").