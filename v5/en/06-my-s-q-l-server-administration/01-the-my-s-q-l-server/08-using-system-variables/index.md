### 5.1.8 Using System Variables

[5.1.8.1 System Variable Privileges](system-variable-privileges.html)

[5.1.8.2 Dynamic System Variables](dynamic-system-variables.html)

[5.1.8.3 Structured System Variables](structured-system-variables.html)

The MySQL server maintains many system variables that configure its operation. [Section 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables"), describes the meaning of these variables. Each system variable has a default value. System variables can be set at server startup using options on the command line or in an option file. Most of them can be changed dynamically while the server is running by means of the [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment") statement, which enables you to modify operation of the server without having to stop and restart it. You can also use system variable values in expressions.

Many system variables are built in. System variables implemented by a server plugin are exposed when the plugin is installed and have names that begin with the plugin name. For example, the `audit_log` plugin implements a system variable named [`audit_log_policy`](audit-log-reference.html#sysvar_audit_log_policy).

There are two scopes in which system variables exist. Global variables affect the overall operation of the server. Session variables affect its operation for individual client connections. A given system variable can have both a global and a session value. Global and session system variables are related as follows:

* When the server starts, it initializes each global variable to its default value. These defaults can be changed by options specified on the command line or in an option file. (See [Section 4.2.2, “Specifying Program Options”](program-options.html "4.2.2 Specifying Program Options").)

* The server also maintains a set of session variables for each client that connects. The client's session variables are initialized at connect time using the current values of the corresponding global variables. For example, a client's SQL mode is controlled by the session [`sql_mode`](server-system-variables.html#sysvar_sql_mode) value, which is initialized when the client connects to the value of the global [`sql_mode`](server-system-variables.html#sysvar_sql_mode) value.

  For some system variables, the session value is not initialized from the corresponding global value; if so, that is indicated in the variable description.

System variable values can be set globally at server startup by using options on the command line or in an option file. At startup, the syntax for system variables is the same as for command options, so within variable names, dashes and underscores may be used interchangeably. For example, [`--general_log=ON`](server-system-variables.html#sysvar_general_log) and [`--general-log=ON`](server-system-variables.html#sysvar_general_log) are equivalent.

When you use a startup option to set a variable that takes a numeric value, the value can be given with a suffix of `K`, `M`, or `G` (either uppercase or lowercase) to indicate a multiplier of 1024, 10242 or 10243; that is, units of kilobytes, megabytes, or gigabytes, respectively. Thus, the following command starts the server with an `InnoDB` log file size of 16 megabytes and a maximum packet size of one gigabyte:

```sql
mysqld --innodb-log-file-size=16M --max-allowed-packet=1G
```

Within an option file, those variables are set like this:

```sql
[mysqld]
innodb_log_file_size=16M
max_allowed_packet=1G
```

The lettercase of suffix letters does not matter; `16M` and `16m` are equivalent, as are `1G` and `1g`.

To restrict the maximum value to which a system variable can be set at runtime with the [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment") statement, specify this maximum by using an option of the form `--maximum-var_name=value` at server startup. For example, to prevent the value of [`innodb_log_file_size`](innodb-parameters.html#sysvar_innodb_log_file_size) from being increased to more than 32MB at runtime, use the option `--maximum-innodb-log-file-size=32M`.

Many system variables are dynamic and can be changed at runtime by using the [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment") statement. For a list, see [Section 5.1.8.2, “Dynamic System Variables”](dynamic-system-variables.html "5.1.8.2 Dynamic System Variables"). To change a system variable with [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment"), refer to it by name, optionally preceded by a modifier. At runtime, system variable names must be written using underscores, not dashes. The following examples briefly illustrate this syntax:

* Set a global system variable:

  ```sql
  SET GLOBAL max_connections = 1000;
  SET @@GLOBAL.max_connections = 1000;
  ```

* Set a session system variable:

  ```sql
  SET SESSION sql_mode = 'TRADITIONAL';
  SET @@SESSION.sql_mode = 'TRADITIONAL';
  SET @@sql_mode = 'TRADITIONAL';
  ```

For complete details about [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment") syntax, see [Section 13.7.4.1, “SET Syntax for Variable Assignment”](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment"). For a description of the privilege requirements for setting system variables, see [Section 5.1.8.1, “System Variable Privileges”](system-variable-privileges.html "5.1.8.1 System Variable Privileges")

Suffixes for specifying a value multiplier can be used when setting a variable at server startup, but not to set the value with [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment") at runtime. On the other hand, with [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment") you can assign a variable's value using an expression, which is not true when you set a variable at server startup. For example, the first of the following lines is legal at server startup, but the second is not:

```sql
$> mysql --max_allowed_packet=16M
$> mysql --max_allowed_packet=16*1024*1024
```

Conversely, the second of the following lines is legal at runtime, but the first is not:

```sql
mysql> SET GLOBAL max_allowed_packet=16M;
mysql> SET GLOBAL max_allowed_packet=16*1024*1024;
```

To display system variable names and values, use the [`SHOW VARIABLES`](show-variables.html "13.7.5.39 SHOW VARIABLES Statement") statement:

```sql
mysql> SHOW VARIABLES;
+---------------------------------+-----------------------------------+
| Variable_name                   | Value                             |
+---------------------------------+-----------------------------------+
| auto_increment_increment        | 1                                 |
| auto_increment_offset           | 1                                 |
| automatic_sp_privileges         | ON                                |
| back_log                        | 50                                |
| basedir                         | /home/mysql/                      |
| binlog_cache_size               | 32768                             |
| bulk_insert_buffer_size         | 8388608                           |
| character_set_client            | utf8                              |
| character_set_connection        | utf8                              |
| character_set_database          | latin1                            |
| character_set_filesystem        | binary                            |
| character_set_results           | utf8                              |
| character_set_server            | latin1                            |
| character_set_system            | utf8                              |
| character_sets_dir              | /home/mysql/share/mysql/charsets/ |
| collation_connection            | utf8_general_ci                   |
| collation_database              | latin1_swedish_ci                 |
| collation_server                | latin1_swedish_ci                 |
...
| innodb_autoextend_increment     | 8                                 |
| innodb_buffer_pool_size         | 8388608                           |
| innodb_checksums                | ON                                |
| innodb_commit_concurrency       | 0                                 |
| innodb_concurrency_tickets      | 500                               |
| innodb_data_file_path           | ibdata1:10M:autoextend            |
| innodb_data_home_dir            |                                   |
...
| version                         | 5.7.18-log                        |
| version_comment                 | Source distribution               |
| version_compile_machine         | i686                              |
| version_compile_os              | suse-linux                        |
| wait_timeout                    | 28800                             |
+---------------------------------+-----------------------------------+
```

With a [`LIKE`](string-comparison-functions.html#operator_like) clause, the statement displays only those variables that match the pattern. To obtain a specific variable name, use a [`LIKE`](string-comparison-functions.html#operator_like) clause as shown:

```sql
SHOW VARIABLES LIKE 'max_join_size';
SHOW SESSION VARIABLES LIKE 'max_join_size';
```

To get a list of variables whose name match a pattern, use the `%` wildcard character in a [`LIKE`](string-comparison-functions.html#operator_like) clause:

```sql
SHOW VARIABLES LIKE '%size%';
SHOW GLOBAL VARIABLES LIKE '%size%';
```

Wildcard characters can be used in any position within the pattern to be matched. Strictly speaking, because `_` is a wildcard that matches any single character, you should escape it as `\_` to match it literally. In practice, this is rarely necessary.

For [`SHOW VARIABLES`](show-variables.html "13.7.5.39 SHOW VARIABLES Statement"), if you specify neither `GLOBAL` nor `SESSION`, MySQL returns `SESSION` values.

The reason for requiring the `GLOBAL` keyword when setting `GLOBAL`-only variables but not when retrieving them is to prevent problems in the future:

* Were a `SESSION` variable to be removed that has the same name as a `GLOBAL` variable, a client with privileges sufficient to modify global variables might accidentally change the `GLOBAL` variable rather than just the `SESSION` variable for its own session.

* Were a `SESSION` variable to be added with the same name as a `GLOBAL` variable, a client that intends to change the `GLOBAL` variable might find only its own `SESSION` variable changed.
