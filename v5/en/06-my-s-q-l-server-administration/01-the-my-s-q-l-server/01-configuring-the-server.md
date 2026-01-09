### 5.1.1 Configuring the Server

The MySQL server, [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"), has many command options and system variables that can be set at startup to configure its operation. To determine the default command option and system variable values used by the server, execute this command:

```sql
$> mysqld --verbose --help
```

The command produces a list of all [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") options and configurable system variables. Its output includes the default option and variable values and looks something like this:

```sql
abort-slave-event-count           0
allow-suspicious-udfs             FALSE
archive                           ON
auto-increment-increment          1
auto-increment-offset             1
autocommit                        TRUE
automatic-sp-privileges           TRUE
avoid-temporal-upgrade            FALSE
back-log                          80
basedir                           /home/jon/bin/mysql-5.7/
...
tmpdir                            /tmp
transaction-alloc-block-size      8192
transaction-isolation             REPEATABLE-READ
transaction-prealloc-size         4096
transaction-read-only             FALSE
transaction-write-set-extraction  OFF
updatable-views-with-limit        YES
validate-user-plugins             TRUE
verbose                           TRUE
wait-timeout                      28800
```

To see the current system variable values actually used by the server as it runs, connect to it and execute this statement:

```sql
mysql> SHOW VARIABLES;
```

To see some statistical and status indicators for a running server, execute this statement:

```sql
mysql> SHOW STATUS;
```

System variable and status information also is available using the [**mysqladmin**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") command:

```sql
$> mysqladmin variables
$> mysqladmin extended-status
```

For a full description of all command options, system variables, and status variables, see these sections:

* [Section 5.1.6, “Server Command Options”](server-options.html "5.1.6 Server Command Options")
* [Section 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables")
* [Section 5.1.9, “Server Status Variables”](server-status-variables.html "5.1.9 Server Status Variables")

More detailed monitoring information is available from the Performance Schema; see [Chapter 25, *MySQL Performance Schema*](performance-schema.html "Chapter 25 MySQL Performance Schema"). In addition, the MySQL `sys` schema is a set of objects that provides convenient access to data collected by the Performance Schema; see [Chapter 26, *MySQL sys Schema*](sys-schema.html "Chapter 26 MySQL sys Schema").

MySQL uses algorithms that are very scalable, so you can usually run with very little memory. However, normally better performance results from giving MySQL more memory.

When tuning a MySQL server, the two most important variables to configure are [`key_buffer_size`](server-system-variables.html#sysvar_key_buffer_size) and [`table_open_cache`](server-system-variables.html#sysvar_table_open_cache). You should first feel confident that you have these set appropriately before trying to change any other variables.

The following examples indicate some typical variable values for different runtime configurations.

* If you have at least 1-2GB of memory and many tables and want maximum performance with a moderate number of clients, use something like this:

  ```sql
  $> mysqld_safe --key_buffer_size=384M --table_open_cache=4000 \
             --sort_buffer_size=4M --read_buffer_size=1M &
  ```

* If you have only 256MB of memory and only a few tables, but you still do a lot of sorting, you can use something like this:

  ```sql
  $> mysqld_safe --key_buffer_size=64M --sort_buffer_size=1M
  ```

  If there are very many simultaneous connections, swapping problems may occur unless [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") has been configured to use very little memory for each connection. [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") performs better if you have enough memory for all connections.

* With little memory and lots of connections, use something like this:

  ```sql
  $> mysqld_safe --key_buffer_size=512K --sort_buffer_size=100K \
             --read_buffer_size=100K &
  ```

  Or even this:

  ```sql
  $> mysqld_safe --key_buffer_size=512K --sort_buffer_size=16K \
             --table_open_cache=32 --read_buffer_size=8K \
             --net_buffer_length=1K &
  ```

If you are performing `GROUP BY` or `ORDER BY` operations on tables that are much larger than your available memory, increase the value of [`read_rnd_buffer_size`](server-system-variables.html#sysvar_read_rnd_buffer_size) to speed up the reading of rows following sorting operations.

If you specify an option on the command line for [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") or [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script"), it remains in effect only for that invocation of the server. To use the option every time the server runs, put it in an option file. See [Section 4.2.2.2, “Using Option Files”](option-files.html "4.2.2.2 Using Option Files").
