### 7.1.9 Using System Variables

The MySQL server maintains many system variables that configure its operation.  Section 7.1.8, “Server System Variables”, describes the meaning of these variables. Each system variable has a default value. System variables can be set at server startup using options on the command line or in an option file. Most of them can be changed dynamically while the server is running by means of the `SET` statement, which enables you to modify operation of the server without having to stop and restart it. You can also use system variable values in expressions.

Many system variables are built in. System variables may also be installed by server plugins or components:

* System variables implemented by a server plugin are exposed when the plugin is installed and have names that begin with the plugin name. For example, the `audit_log` plugin implements a system variable named `audit_log_policy`.
* System variables implemented by a component are exposed when the component is installed and have names that begin with a component-specific prefix. For example, the `log_filter_dragnet` error log filter component implements a system variable named `log_error_filter_rules`, the full name of which is `dragnet.log_error_filter_rules`. To refer to this variable, use the full name.

There are two scopes in which system variables exist. Global variables affect the overall operation of the server. Session variables affect its operation for individual client connections. A given system variable can have both a global and a session value. Global and session system variables are related as follows:

* When the server starts, it initializes each global variable to its default value. These defaults can be changed by options specified on the command line or in an option file. (See Section 6.2.2, “Specifying Program Options”.)
* The server also maintains a set of session variables for each client that connects. The client's session variables are initialized at connect time using the current values of the corresponding global variables. For example, a client's SQL mode is controlled by the session `sql_mode` value, which is initialized when the client connects to the value of the global  `sql_mode` value.

  For some system variables, the session value is not initialized from the corresponding global value; if so, that is indicated in the variable description.

System variable values can be set globally at server startup by using options on the command line or in an option file. At startup, the syntax for system variables is the same as for command options, so within variable names, dashes and underscores may be used interchangeably. For example, `--general_log=ON` and `--general-log=ON` are equivalent.

When you use a startup option to set a variable that takes a numeric value, the value can be given with a suffix of `K`, `M`, `G`, `T`, `P`, or `E` (either uppercase or lowercase) to indicate a multiplier of 1024, 10242, 10243, 10244, 10245, or 10246; that is, units of kilobytes, megabytes, gigabytes, terabytes, petabytes, or ettabytes, respectively. Thus, the following command starts the server with a sort buffer size of 256 kilobytes and a maximum packet size of one gigabyte:

```
mysqld --sort-buffer-size=256K --max-allowed-packet=1G
```

Within an option file, those variables are set like this:

```
[mysqld]
sort_buffer_size=256K
max_allowed_packet=1G
```

The lettercase of suffix letters does not matter; `256K` and `256k` are equivalent, as are `1G` and `1g`.

To restrict the maximum value to which a system variable can be set at runtime with the `SET` statement, specify this maximum by using an option of the form `--maximum-var_name=value` at server startup. For example, to prevent the value of `sort_buffer_size` from being increased to more than 32MB at runtime, use the option `--maximum-sort-buffer-size=32M`.

Many system variables are dynamic and can be changed at runtime by using the `SET` statement. For a list, see Section 7.1.9.2, “Dynamic System Variables”. To change a system variable with `SET`, refer to it by name, optionally preceded by a modifier. At runtime, system variable names must be written using underscores, not dashes. The following examples briefly illustrate this syntax:

* Set a global system variable:

  ```
  SET GLOBAL max_connections = 1000;
  SET @@GLOBAL.max_connections = 1000;
  ```
* Persist a global system variable to the `mysqld-auto.cnf` file (and set the runtime value):

  ```
  SET PERSIST max_connections = 1000;
  SET @@PERSIST.max_connections = 1000;
  ```
* Persist a global system variable to the `mysqld-auto.cnf` file (without setting the runtime value):

  ```
  SET PERSIST_ONLY back_log = 1000;
  SET @@PERSIST_ONLY.back_log = 1000;
  ```
* Set a session system variable:

  ```
  SET SESSION sql_mode = 'TRADITIONAL';
  SET @@SESSION.sql_mode = 'TRADITIONAL';
  SET @@sql_mode = 'TRADITIONAL';
  ```

For complete details about `SET` syntax, see  Section 15.7.6.1, “SET Syntax for Variable Assignment”. For a description of the privilege requirements for setting and persisting system variables, see  Section 7.1.9.1, “System Variable Privileges”

Suffixes for specifying a value multiplier can be used when setting a variable at server startup, but not to set the value with `SET` at runtime. On the other hand, with `SET` you can assign a variable's value using an expression, which is not true when you set a variable at server startup. For example, the first of the following lines is legal at server startup, but the second is not:

```
$> mysql --max_allowed_packet=16M
$> mysql --max_allowed_packet=16*1024*1024
```

Conversely, the second of the following lines is legal at runtime, but the first is not:

```
mysql> SET GLOBAL max_allowed_packet=16M;
mysql> SET GLOBAL max_allowed_packet=16*1024*1024;
```

To display system variable names and values, use the `SHOW VARIABLES` statement:

```
mysql> SHOW VARIABLES;
+-------------------------------------------------------+----------------------+
| Variable_name                                         | Value                |
+-------------------------------------------------------+----------------------+
| activate_all_roles_on_login                           | OFF                  |
| admin_address                                         |                      |
| admin_port                                            | 33062                |
| admin_ssl_ca                                          |                      |
| admin_ssl_capath                                      |                      |
| admin_ssl_cert                                        |                      |
| admin_ssl_cipher                                      |                      |
| admin_ssl_crl                                         |                      |
| admin_ssl_crlpath                                     |                      |
| admin_ssl_key                                         |                      |
| admin_tls_ciphersuites                                |                      |
| admin_tls_version                                     | TLSv1.2,TLSv1.3      |
| authentication_policy                                 | *,,                  |
| auto_generate_certs                                   | ON                   |
| auto_increment_increment                              | 1                    |
| auto_increment_offset                                 | 1                    |
| autocommit                                            | ON                   |
| automatic_sp_privileges                               | ON                   |

...

| version                                               | 8.4.0                |
| version_comment                                       | Source distribution  |
| version_compile_machine                               | x86_64               |
| version_compile_os                                    | Linux                |
| version_compile_zlib                                  | 1.2.13               |
| wait_timeout                                          | 28800                |
| warning_count                                         | 0                    |
| windowing_use_high_precision                          | ON                   |
| xa_detach_on_prepare                                  | ON                   |
+-------------------------------------------------------+----------------------+
```

With a `LIKE` clause, the statement displays only those variables that match the pattern. To obtain a specific variable name, use a `LIKE` clause as shown:

```
SHOW VARIABLES LIKE 'max_join_size';
SHOW SESSION VARIABLES LIKE 'max_join_size';
```

To get a list of variables whose name match a pattern, use the `%` wildcard character in a `LIKE` clause:

```
SHOW VARIABLES LIKE '%size%';
SHOW GLOBAL VARIABLES LIKE '%size%';
```

Wildcard characters can be used in any position within the pattern to be matched. Strictly speaking, because `_` is a wildcard that matches any single character, you should escape it as `_` to match it literally. In practice, this is rarely necessary.

For  `SHOW VARIABLES`, if you specify neither `GLOBAL` nor `SESSION`, MySQL returns `SESSION` values.

The reason for requiring the `GLOBAL` keyword when setting `GLOBAL`-only variables but not when retrieving them is to prevent problems in the future:

* Were a `SESSION` variable to be removed that has the same name as a `GLOBAL` variable, a client with privileges sufficient to modify global variables might accidentally change the `GLOBAL` variable rather than just the `SESSION` variable for its own session.
* Were a `SESSION` variable to be added with the same name as a `GLOBAL` variable, a client that intends to change the `GLOBAL` variable might find only its own `SESSION` variable changed.
