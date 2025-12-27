#### 29.12.14.3 Performance Schema variables\_info Table

The `variables_info` table shows, for each system variable, the source from which it was most recently set, and its range of values.

The `variables_info` table has these columns:

* `VARIABLE_NAME`

  The variable name.

* `VARIABLE_SOURCE`

  The source from which the variable was most recently set:

  + `COMMAND_LINE`

    The variable was set on the command line.

  + `COMPILED`

    The variable has its compiled-in default value. `COMPILED` is the value used for variables not set any other way.

  + `DYNAMIC`

    The variable was set at runtime. This includes variables set within files specified using the `init_file` system variable.

  + `EXPLICIT`

    The variable was set from an option file named with the `--defaults-file` option.

  + `EXTRA`

    The variable was set from an option file named with the `--defaults-extra-file` option.

  + `GLOBAL`

    The variable was set from a global option file. This includes option files not covered by `EXPLICIT`, `EXTRA`, `LOGIN`, `PERSISTED`, `SERVER`, or `USER`.

  + `LOGIN`

    The variable was set from a user-specific login path file (`~/.mylogin.cnf`).

  + `PERSISTED`

    The variable was set from a server-specific `mysqld-auto.cnf` option file. No row has this value if the server was started with `persisted_globals_load` disabled.

  + `SERVER`

    The variable was set from a server-specific `$MYSQL_HOME/my.cnf` option file. For details about how `MYSQL_HOME` is set, see Section 6.2.2.2, “Using Option Files”.

  + `USER`

    The variable was set from a user-specific `~/.my.cnf` option file.

* `VARIABLE_PATH`

  If the variable was set from an option file, `VARIABLE_PATH` is the path name of that file. Otherwise, the value is the empty string.

* `MIN_VALUE`

  The minimum permitted value for the variable. For a variable whose type is not numeric, this is always 0.

  This column is deprecated, and subject to removal in a future release; instead, use the `MIN_VALUE` column of the `variables_metadata` table to obtain this information.

* `MAX_VALUE`

  The maximum permitted value for the variable. For a variable whose type is not numeric, this is always 0.

  This column is deprecated, and subject to removal in a future release; instead, use the `MAX_VALUE` column of the `variables_metadata` table to obtain this information.

* `SET_TIME`

  The time at which the variable was most recently set. The default is the time at which the server initialized global system variables during startup.

* `SET_USER`, `SET_HOST`

  The user name and host name of the client user that most recently set the variable. If a client connects as `user17` from host `host34.example.com` using the account `'user17'@'%.example.com`, `SET_USER` and `SET_HOST` are `user17` and `host34.example.com`, respectively. For proxy user connections, these values correspond to the external (proxy) user, not the proxied user against which privilege checking is performed. The default for each column is the empty string, indicating that the variable has not been set since server startup.

The `variables_info` table has no indexes.

`TRUNCATE TABLE` is not permitted for the `variables_info` table.

If a variable with a `VARIABLE_SOURCE` value other than `DYNAMIC` is set at runtime, `VARIABLE_SOURCE` becomes `DYNAMIC` and `VARIABLE_PATH` becomes the empty string.

A system variable that has only a session value (such as `debug_sync`) cannot be set at startup or persisted. For session-only system variables, `VARIABLE_SOURCE` can be only `COMPILED` or `DYNAMIC`.

If a system variable has an unexpected `VARIABLE_SOURCE` value, consider your server startup method. For example, **mysqld\_safe** reads option files and passes certain options it finds there as part of the command line that it uses to start **mysqld**. Consequently, some system variables that you set in option files might display in `variables_info` as `COMMAND_LINE`, rather than as `GLOBAL` or `SERVER` as you might otherwise expect.

Some sample queries that use the `variables_info` table, with representative output:

* Display variables set on the command line:

  ```
  mysql> SELECT VARIABLE_NAME
         FROM performance_schema.variables_info
         WHERE VARIABLE_SOURCE = 'COMMAND_LINE'
         ORDER BY VARIABLE_NAME;
  +---------------+
  | VARIABLE_NAME |
  +---------------+
  | basedir       |
  | datadir       |
  | log_error     |
  | pid_file      |
  | plugin_dir    |
  | port          |
  +---------------+
  ```

* Display variables set from persistent storage:

  ```
  mysql> SELECT VARIABLE_NAME
         FROM performance_schema.variables_info
         WHERE VARIABLE_SOURCE = 'PERSISTED'
         ORDER BY VARIABLE_NAME;
  +--------------------------+
  | VARIABLE_NAME            |
  +--------------------------+
  | event_scheduler          |
  | max_connections          |
  | validate_password.policy |
  +--------------------------+
  ```

* Join `variables_info` with the `global_variables` table to display the current values of persisted variables, together with their range of values:

  ```
  mysql> SELECT
           VI.VARIABLE_NAME, GV.VARIABLE_VALUE,
           VI.MIN_VALUE,VI.MAX_VALUE
         FROM performance_schema.variables_info AS VI
           INNER JOIN performance_schema.global_variables AS GV
           USING(VARIABLE_NAME)
         WHERE VI.VARIABLE_SOURCE = 'PERSISTED'
         ORDER BY VARIABLE_NAME;
  +--------------------------+----------------+-----------+-----------+
  | VARIABLE_NAME            | VARIABLE_VALUE | MIN_VALUE | MAX_VALUE |
  +--------------------------+----------------+-----------+-----------+
  | event_scheduler          | ON             | 0         | 0         |
  | max_connections          | 200            | 1         | 100000    |
  | validate_password.policy | STRONG         | 0         | 0         |
  +--------------------------+----------------+-----------+-----------+
  ```
