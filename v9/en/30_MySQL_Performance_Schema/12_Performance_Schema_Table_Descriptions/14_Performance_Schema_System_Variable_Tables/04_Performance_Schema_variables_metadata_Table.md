#### 29.12.14.4 Performance Schema variables\_metadata Table

The [`variables_metadata`](performance-schema-variables-metadata-table.html "29.12.14.4 Performance Schema variables_metadata Table") table
shows, for each server system variable, its name, scope, type,
range of values (where applicable), and description.

The [`variables_metadata`](performance-schema-variables-metadata-table.html "29.12.14.4 Performance Schema variables_metadata Table") table
contains these columns:

* `VARIABLE_NAME`

  The variable name.

* `VARIABLE_SCOPE`

  The variable's scope; this is one of the values
  listed here:

  + `GLOBAL`

    The variable is global-only.

  + `SESSION`

    The variable can have global or session scope.

  + SESSION\_ONLY

    The variable is session-only.

* `DATA_TYPE`

  The variable's type; this is one of the following
  values:

  + `Integer`

    An integer.

  + `Numeric`

    A decimal value.

  + `String`

    A string.

  + `Enumeration`

    An enumeration.

  + `Boolean`

    A boolean true or false value.

  + `Set`

    A set of values.

  Possible values for variables of non-numeric types are
  often shown in the text of the
  `DOCUMENTATION` column; otherwise, see
  the variable's description in the Manual.

* `MIN_VALUE`

  The minimum permitted value for the variable. For a
  variable that is not numeric, this is always an empty
  string.

  This column is intended to replace the
  [`variables_info`](performance-schema-variables-info-table.html "29.12.14.3 Performance Schema variables_info Table") table'
  `MAX_VALUE` column, which has been
  deprecated.

* `MAX_VALUE`

  The maximum permitted value for the variable. For a
  variable that is not numeric, this is always an empty
  string.

  This column is intended to replace the
  [`variables_info`](performance-schema-variables-info-table.html "29.12.14.3 Performance Schema variables_info Table") table'
  `MAX_VALUE` column, which has been
  deprecated.

* `DOCUMENTATION`

  A description of the variable; this is the same text as
  found in the output of [**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server")
  `--help`
  [`--verbose`](server-options.html#option_mysqld_verbose).

The [`variables_metadata`](performance-schema-variables-metadata-table.html "29.12.14.4 Performance Schema variables_metadata Table") table has
no indexes.

This table is read-only. The only DML statements allowed are
[`SELECT`](select.html "15.2.13 SELECT Statement") and
[`TABLE`](table.html "15.2.16 TABLE Statement"); DDL statements including
[`TRUNCATE TABLE`](truncate-table.html "15.1.42 TRUNCATE TABLE Statement") are not
permitted.

The three queries using the
[`variables_metadata`](performance-schema-variables-metadata-table.html "29.12.14.4 Performance Schema variables_metadata Table") table shown in
the following example provide information about the
[`binlog_row_image`](replication-options-binary-log.html#sysvar_binlog_row_image),
[`innodb_doublewrite_batch_size`](innodb-parameters.html#sysvar_innodb_doublewrite_batch_size),
and [`secure_file_priv`](server-system-variables.html#sysvar_secure_file_priv) system
variables:

```
mysql> SELECT * FROM variables_metadata WHERE VARIABLE_NAME='binlog_row_image'\G
*************************** 1. row ***************************
 VARIABLE_NAME: binlog_row_image
VARIABLE_SCOPE: SESSION
     DATA_TYPE: Enumeration
     MIN_VALUE:
     MAX_VALUE:
 DOCUMENTATION: Controls whether rows should be logged in 'FULL', 'NOBLOB' or
'MINIMAL' formats. 'FULL', means that all columns in the before and after image
are logged. 'NOBLOB', means that mysqld avoids logging blob columns whenever
possible (e.g. blob column was not changed or is not part of primary key).
'MINIMAL', means that a PK equivalent (PK columns or full row if there is no PK
in the table) is logged in the before image, and only changed columns are logged
in the after image. (Default: FULL).
1 row in set (0.01 sec)

mysql> SELECT * FROM variables_metadata WHERE VARIABLE_NAME='innodb_doublewrite_batch_size'\G
*************************** 1. row ***************************
 VARIABLE_NAME: innodb_doublewrite_batch_size
VARIABLE_SCOPE: GLOBAL
     DATA_TYPE: Integer
     MIN_VALUE: 0
     MAX_VALUE: 256
 DOCUMENTATION: Number of double write pages to write in a batch
1 row in set (0.00 sec)

mysql> SELECT * FROM variables_metadata WHERE VARIABLE_NAME='secure_file_priv'\G
*************************** 1. row ***************************
 VARIABLE_NAME: secure_file_priv
VARIABLE_SCOPE: GLOBAL
     DATA_TYPE: String
     MIN_VALUE:
     MAX_VALUE:
 DOCUMENTATION: Limit LOAD DATA, SELECT ... OUTFILE, and LOAD_FILE() to files within specified directory
1 row in set (0.01 sec)
```

This table does not show the current values of system
variables; this information is provided by the Performance
Schema [`global_variables`](performance-schema-system-variable-tables.html "29.12.14 Performance Schema System Variable Tables") and
[`session_variables`](performance-schema-system-variable-tables.html "29.12.14 Performance Schema System Variable Tables") tables.