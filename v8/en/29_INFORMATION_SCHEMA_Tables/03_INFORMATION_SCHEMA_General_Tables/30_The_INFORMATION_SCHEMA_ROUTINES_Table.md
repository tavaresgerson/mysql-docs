### 28.3.30 The INFORMATION\_SCHEMA ROUTINES Table

The [`ROUTINES`](information-schema-routines-table.html "28.3.30 The INFORMATION_SCHEMA ROUTINES Table") table provides
information about stored routines (stored procedures and stored
functions). The [`ROUTINES`](information-schema-routines-table.html "28.3.30 The INFORMATION_SCHEMA ROUTINES Table") table does
not include built-in (native) functions or loadable functions.

The [`ROUTINES`](information-schema-routines-table.html "28.3.30 The INFORMATION_SCHEMA ROUTINES Table") table has these columns:

* `SPECIFIC_NAME`

  The name of the routine.

* `ROUTINE_CATALOG`

  The name of the catalog to which the routine belongs. This
  value is always `def`.

* `ROUTINE_SCHEMA`

  The name of the schema (database) to which the routine
  belongs.

* `ROUTINE_NAME`

  The name of the routine.

* `ROUTINE_TYPE`

  `PROCEDURE` for stored procedures,
  `FUNCTION` for stored functions.

* `DATA_TYPE`

  If the routine is a stored function, the return value data
  type. If the routine is a stored procedure, this value is
  empty.

  The `DATA_TYPE` value is the type name only
  with no other information. The
  `DTD_IDENTIFIER` value contains the type name
  and possibly other information such as the precision or
  length.

* `CHARACTER_MAXIMUM_LENGTH`

  For stored function string return values, the maximum length
  in characters. If the routine is a stored procedure, this
  value is `NULL`.

* `CHARACTER_OCTET_LENGTH`

  For stored function string return values, the maximum length
  in bytes. If the routine is a stored procedure, this value is
  `NULL`.

* `NUMERIC_PRECISION`

  For stored function numeric return values, the numeric
  precision. If the routine is a stored procedure, this value is
  `NULL`.

* `NUMERIC_SCALE`

  For stored function numeric return values, the numeric scale.
  If the routine is a stored procedure, this value is
  `NULL`.

* `DATETIME_PRECISION`

  For stored function temporal return values, the fractional
  seconds precision. If the routine is a stored procedure, this
  value is `NULL`.

* `CHARACTER_SET_NAME`

  For stored function character string return values, the
  character set name. If the routine is a stored procedure, this
  value is `NULL`.

* `COLLATION_NAME`

  For stored function character string return values, the
  collation name. If the routine is a stored procedure, this
  value is `NULL`.

* `DTD_IDENTIFIER`

  If the routine is a stored function, the return value data
  type. If the routine is a stored procedure, this value is
  empty.

  The `DATA_TYPE` value is the type name only
  with no other information. The
  `DTD_IDENTIFIER` value contains the type name
  and possibly other information such as the precision or
  length.

* `ROUTINE_BODY`

  The language used for the routine definition. This value is
  always `SQL`.

* `ROUTINE_DEFINITION`

  The text of the SQL statement executed by the routine.

* `EXTERNAL_NAME`

  This value is always `NULL`.

* `EXTERNAL_LANGUAGE`

  The language of the stored routine. The value is read from the
  `external_language` column of the
  `mysql.routines` data dictionary table.

* `PARAMETER_STYLE`

  This value is always `SQL`.

* `IS_DETERMINISTIC`

  `YES` or `NO`, depending on
  whether the routine is defined with the
  `DETERMINISTIC` characteristic.

* `SQL_DATA_ACCESS`

  The data access characteristic for the routine. The value is
  one of `CONTAINS SQL`, `NO
  SQL`, `READS SQL DATA`, or
  `MODIFIES SQL DATA`.

* `SQL_PATH`

  This value is always `NULL`.

* `SECURITY_TYPE`

  The routine `SQL SECURITY` characteristic.
  The value is one of `DEFINER` or
  `INVOKER`.

* `CREATED`

  The date and time when the routine was created. This is a
  [`TIMESTAMP`](datetime.html "13.2.2 The DATE, DATETIME, and TIMESTAMP Types") value.

* `LAST_ALTERED`

  The date and time when the routine was last modified. This is
  a [`TIMESTAMP`](datetime.html "13.2.2 The DATE, DATETIME, and TIMESTAMP Types") value. If the
  routine has not been modified since its creation, this value
  is the same as the `CREATED` value.

* `SQL_MODE`

  The SQL mode in effect when the routine was created or
  altered, and under which the routine executes. For the
  permitted values, see [Section 7.1.11, “Server SQL Modes”](sql-mode.html "7.1.11 Server SQL Modes").

* `ROUTINE_COMMENT`

  The text of the comment, if the routine has one. If not, this
  value is empty.

* `DEFINER`

  The account named in the `DEFINER` clause
  (often the user who created the routine), in
  `'user_name'@'host_name'`
  format.

* `CHARACTER_SET_CLIENT`

  The session value of the
  [`character_set_client`](server-system-variables.html#sysvar_character_set_client) system
  variable when the routine was created.

* `COLLATION_CONNECTION`

  The session value of the
  [`collation_connection`](server-system-variables.html#sysvar_collation_connection) system
  variable when the routine was created.

* `DATABASE_COLLATION`

  The collation of the database with which the routine is
  associated.

#### Notes

* To see information about a routine, you must be the user named
  as the routine `DEFINER`, have the
  [`SHOW_ROUTINE`](privileges-provided.html#priv_show-routine) privilege, have
  the [`SELECT`](privileges-provided.html#priv_select) privilege at the
  global level, or have the [`CREATE
  ROUTINE`](privileges-provided.html#priv_create-routine), [`ALTER
  ROUTINE`](privileges-provided.html#priv_alter-routine), or [`EXECUTE`](privileges-provided.html#priv_execute)
  privilege granted at a scope that includes the routine. The
  `ROUTINE_DEFINITION` column is
  `NULL` if you have only
  [`CREATE ROUTINE`](privileges-provided.html#priv_create-routine),
  [`ALTER ROUTINE`](privileges-provided.html#priv_alter-routine), or
  [`EXECUTE`](privileges-provided.html#priv_execute).

* Information about stored function return values is also
  available in the [`PARAMETERS`](information-schema-parameters-table.html "28.3.20 The INFORMATION_SCHEMA PARAMETERS Table")
  table. The return value row for a stored function can be
  identified as the row that has an
  `ORDINAL_POSITION` value of 0.