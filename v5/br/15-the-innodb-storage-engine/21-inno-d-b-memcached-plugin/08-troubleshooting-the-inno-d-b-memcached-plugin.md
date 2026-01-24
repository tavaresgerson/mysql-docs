### 14.21.8 Troubleshooting the InnoDB memcached Plugin

This section describes issues that you may encounter when using the `InnoDB` **memcached** plugin.

* If you encounter the following error in the MySQL error log, the server might fail to start:

  failed to set rlimit for open files. Try running as root or requesting smaller maxconns value.

  The error message is from the **memcached** daemon. One solution is to raise the OS limit for the number of open files. The commands for checking and increasing the open file limit varies by operating system. This example shows commands for Linux and macOS:

  ```sql
  # Linux
  $> ulimit -n
  1024
  $> ulimit -n 4096
  $> ulimit -n
  4096

  # macOS
  $> ulimit -n
  256
  $> ulimit -n 4096
  $> ulimit -n
  4096
  ```

  The other solution is to reduce the number of concurrent connections permitted for the **memcached** daemon. To do so, encode the `-c` **memcached** option in the `daemon_memcached_option` configuration parameter in the MySQL configuration file. The `-c` option has a default value of 1024.

  ```sql
  [mysqld]
  ...
  loose-daemon_memcached_option='-c 64'
  ```

* To troubleshoot problems where the **memcached** daemon is unable to store or retrieve `InnoDB` table data, encode the `-vvv` **memcached** option in the `daemon_memcached_option` configuration parameter in the MySQL configuration file. Examine the MySQL error log for debug output related to **memcached** operations.

  ```sql
  [mysqld]
  ...
  loose-daemon_memcached_option='-vvv'
  ```

* If columns specified to hold **memcached** values are the wrong data type, such as a numeric type instead of a string type, attempts to store key-value pairs fail with no specific error code or message.

* If the `daemon_memcached` plugin causes MySQL server startup issues, you can temporarily disable the `daemon_memcached` plugin while troubleshooting by adding this line under the `[mysqld]` group in the MySQL configuration file:

  ```sql
  daemon_memcached=OFF
  ```

  For example, if you run the `INSTALL PLUGIN` statement before running the `innodb_memcached_config.sql` configuration script to set up the necessary database and tables, the server might unexpectedly exit and fail to start. The server could also fail to start if you incorrectly configure an entry in the `innodb_memcache.containers` table.

  To uninstall the **memcached** plugin for a MySQL instance, issue the following statement:

  ```sql
  mysql> UNINSTALL PLUGIN daemon_memcached;
  ```

* If you run more than one instance of MySQL on the same machine with the `daemon_memcached` plugin enabled in each instance, use the `daemon_memcached_option` configuration parameter to specify a unique **memcached** port for each `daemon_memcached` plugin.

* If an SQL statement cannot find the `InnoDB` table or finds no data in the table, but **memcached** API calls retrieve the expected data, you may be missing an entry for the `InnoDB` table in the `innodb_memcache.containers` table, or you may have not switched to the correct `InnoDB` table by issuing a `get` or `set` request using `@@table_id` notation. This problem could also occur if you change an existing entry in the `innodb_memcache.containers` table without restarting the MySQL server afterward. The free-form storage mechanism is flexible enough that your requests to store or retrieve a multi-column value such as `col1|col2|col3` may still work, even if the daemon is using the `test.demo_test` table which stores values in a single column.

* When defining your own `InnoDB` table for use with the `daemon_memcached` plugin, and columns in the table are defined as `NOT NULL`, ensure that values are supplied for the `NOT NULL` columns when inserting a record for the table into the `innodb_memcache.containers` table. If the `INSERT` statement for the `innodb_memcache.containers` record contains fewer delimited values than there are mapped columns, unfilled columns are set to `NULL`. Attempting to insert a `NULL` value into a `NOT NULL` column causes the `INSERT` to fail, which may only become evident after you reinitialize the `daemon_memcached` plugin to apply changes to the `innodb_memcache.containers` table.

* If `cas_column` and `expire_time_column` fields of the `innodb_memcached.containers` table are set to `NULL`, the following error is returned when attempting to load the **memcached** plugin:

  ```sql
  InnoDB_Memcached: column 6 in the entry for config table 'containers' in
  database 'innodb_memcache' has an invalid NULL value.
  ```

  The **memcached** plugin rejects usage of `NULL` in the `cas_column` and `expire_time_column` columns. Set the value of these columns to `0` when the columns are unused.

* As the length of the **memcached** key and values increase, you might encounter size and length limits.

  + When the key exceeds 250 bytes, **memcached** operations return an error. This is currently a fixed limit within **memcached**.

  + `InnoDB` table limits may be encountered if values exceed 768 bytes in size, 3072 bytes in size, or half of the `innodb_page_size` value. These limits primarily apply if you intend to create an index on a value column to run report-generating queries on that column using SQL. See Section 14.23, “InnoDB Limits” for details.

  + The maximum size for the key-value combination is 1 MB.
* If you share configuration files across MySQL servers of different versions, using the latest configuration options for the `daemon_memcached` plugin could cause startup errors on older MySQL versions. To avoid compatibility problems, use the `loose` prefix with option names. For example, use `loose-daemon_memcached_option='-c 64'` instead of `daemon_memcached_option='-c 64'`.

* There is no restriction or check in place to validate character set settings. **memcached** stores and retrieves keys and values in bytes and is therefore not character set-sensitive. However, you must ensure that the **memcached** client and the MySQL table use the same character set.

* **memcached** connections are blocked from accessing tables that contain an indexed virtual column. Accessing an indexed virtual column requires a callback to the server, but a **memcached** connection does not have access to the server code.
