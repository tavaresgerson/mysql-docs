#### 15.7.8.7 RESET PERSIST Statement

```
RESET PERSIST [[IF EXISTS] system_var_name]
```

[`RESET PERSIST`](reset-persist.html "15.7.8.7 RESET PERSIST Statement") removes persisted
global system variable settings from the
`mysqld-auto.cnf` option file in the data
directory. Removing a persisted system variable causes the
variable no longer to be initialized from
`mysqld-auto.cnf` at server startup. For more
information about persisting system variables and the
`mysqld-auto.cnf` file, see
[Section 7.1.9.3, “Persisted System Variables”](persisted-system-variables.html "7.1.9.3 Persisted System Variables").

The privileges required for [`RESET
PERSIST`](reset-persist.html "15.7.8.7 RESET PERSIST Statement") depend on the type of system variable to be
removed:

* For dynamic system variables, this statement requires the
  [`SYSTEM_VARIABLES_ADMIN`](privileges-provided.html#priv_system-variables-admin)
  privilege (or the deprecated
  [`SUPER`](privileges-provided.html#priv_super) privilege).

* For read-only system variables, this statement requires the
  [`SYSTEM_VARIABLES_ADMIN`](privileges-provided.html#priv_system-variables-admin) and
  [`PERSIST_RO_VARIABLES_ADMIN`](privileges-provided.html#priv_persist-ro-variables-admin)
  privileges.

See [Section 7.1.9.1, “System Variable Privileges”](system-variable-privileges.html "7.1.9.1 System Variable Privileges").

Depending on whether the variable name and `IF
EXISTS` clauses are present, the
[`RESET PERSIST`](reset-persist.html "15.7.8.7 RESET PERSIST Statement") statement has these
forms:

* To remove all persisted variables from
  `mysqld-auto.cnf`, use
  [`RESET PERSIST`](reset-persist.html "15.7.8.7 RESET PERSIST Statement") without naming
  any system variable:

  ```
  RESET PERSIST;
  ```

  You must have privileges for removing both dynamic and
  read-only system variables if
  `mysqld-auto.cnf` contains both kinds of
  variables.

* To remove a specific persisted variable from
  `mysqld-auto.cnf`, name it in the
  statement:

  ```
  RESET PERSIST system_var_name;
  ```

  This includes plugin system variables, even if the plugin is
  not currently installed. If the variable is not present in
  the file, an error occurs.

* To remove a specific persisted variable from
  `mysqld-auto.cnf`, but produce a warning
  rather than an error if the variable is not present in the
  file, add an `IF EXISTS` clause to the
  previous syntax:

  ```
  RESET PERSIST IF EXISTS system_var_name;
  ```

[`RESET PERSIST`](reset-persist.html "15.7.8.7 RESET PERSIST Statement") is not affected by
the value of the
[`persisted_globals_load`](server-system-variables.html#sysvar_persisted_globals_load) system
variable.

[`RESET PERSIST`](reset-persist.html "15.7.8.7 RESET PERSIST Statement") affects the
contents of the Performance Schema
[`persisted_variables`](performance-schema-persisted-variables-table.html "29.12.14.2 Performance Schema persisted_variables Table") table because
the table contents correspond to the contents of the
`mysqld-auto.cnf` file. On the other hand,
because [`RESET PERSIST`](reset-persist.html "15.7.8.7 RESET PERSIST Statement") does not
change variable values, it has no effect on the contents of the
Performance Schema [`variables_info`](performance-schema-variables-info-table.html "29.12.14.3 Performance Schema variables_info Table")
table until the server is restarted.

For information about [`RESET`](reset.html "15.7.8.6 RESET Statement")
statement variants that clear the state of other server
operations, see [Section 15.7.8.6, “RESET Statement”](reset.html "15.7.8.6 RESET Statement").