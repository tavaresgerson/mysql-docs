#### 29.12.14.2 Performance Schema persisted\_variables Table

The [`persisted_variables`](performance-schema-persisted-variables-table.html "29.12.14.2 Performance Schema persisted_variables Table") table
provides an SQL interface to the
`mysqld-auto.cnf` file that stores
persisted global system variable settings, enabling the file
contents to be inspected at runtime using
[`SELECT`](select.html "15.2.13 SELECT Statement") statements. Variables
are persisted using
[`SET
PERSIST`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment") or `PERSIST_ONLY`
statements; see [Section 15.7.6.1, “SET Syntax for Variable Assignment”](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment"). The table
contains a row for each persisted system variable in the file.
Variables not persisted do not appear in the table.

The
[`SENSITIVE_VARIABLES_OBSERVER`](privileges-provided.html#priv_sensitive-variables-observer)
privilege is required to view the values of sensitive system
variables in this table.

For information about persisted system variables, see
[Section 7.1.9.3, “Persisted System Variables”](persisted-system-variables.html "7.1.9.3 Persisted System Variables").

Suppose that `mysqld-auto.cnf` looks like
this (slightly reformatted):

```
{
  "Version": 1,
  "mysql_server": {
    "max_connections": {
      "Value": "1000",
      "Metadata": {
        "Timestamp": 1.519921706e+15,
        "User": "root",
        "Host": "localhost"
      }
    },
    "autocommit": {
      "Value": "ON",
      "Metadata": {
        "Timestamp": 1.519921707e+15,
        "User": "root",
        "Host": "localhost"
      }
    }
  }
}
```

Then [`persisted_variables`](performance-schema-persisted-variables-table.html "29.12.14.2 Performance Schema persisted_variables Table") has
these contents:

```
mysql> SELECT * FROM performance_schema.persisted_variables;
+-----------------+----------------+
| VARIABLE_NAME   | VARIABLE_VALUE |
+-----------------+----------------+
| autocommit      | ON             |
| max_connections | 1000           |
+-----------------+----------------+
```

The [`persisted_variables`](performance-schema-persisted-variables-table.html "29.12.14.2 Performance Schema persisted_variables Table") table has
these columns:

* `VARIABLE_NAME`

  The variable name listed in
  `mysqld-auto.cnf`.

* `VARIABLE_VALUE`

  The value listed for the variable in
  `mysqld-auto.cnf`.

[`persisted_variables`](performance-schema-persisted-variables-table.html "29.12.14.2 Performance Schema persisted_variables Table") has these
indexes:

* Primary key on (`VARIABLE_NAME`)

[`TRUNCATE TABLE`](truncate-table.html "15.1.42 TRUNCATE TABLE Statement") is not permitted
for the [`persisted_variables`](performance-schema-persisted-variables-table.html "29.12.14.2 Performance Schema persisted_variables Table")
table.