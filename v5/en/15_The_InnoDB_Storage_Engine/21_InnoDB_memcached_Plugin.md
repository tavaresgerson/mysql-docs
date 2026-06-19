## 14.21 InnoDB memcached Plugin

The `InnoDB` **memcached** plugin (`daemon_memcached`) provides an integrated **memcached** daemon that automatically stores and retrieves data from `InnoDB` tables, turning the MySQL server into a fast “key-value store”. Instead of formulating queries in SQL, you can use simple `get`, `set`, and `incr` operations that avoid the performance overhead associated with SQL parsing and constructing a query optimization plan. You can also access the same `InnoDB` tables through SQL for convenience, complex queries, bulk operations, and other strengths of traditional database software.

This “NoSQL-style” interface uses the **memcached** API to speed up database operations, letting `InnoDB` handle memory caching using its buffer pool mechanism. Data modified through **memcached** operations such as `add`, `set`, and `incr` are stored to disk, in `InnoDB` tables. The combination of **memcached** simplicity and `InnoDB` reliability and consistency provides users with the best of both worlds, as explained in Section 14.21.1, “Benefits of the InnoDB memcached Plugin”. For an architectural overview, see Section 14.21.2, “InnoDB memcached Architecture”.


### 14.21.1 Benefits of the InnoDB memcached Plugin

This section outlines advantages the `daemon_memcached` plugin. The combination of `InnoDB` tables and **memcached** offers advantages over using either by themselves.

* Direct access to the `InnoDB` storage engine avoids the parsing and planning overhead of SQL.

* Running **memcached** in the same process space as the MySQL server avoids the network overhead of passing requests back and forth.

* Data written using the **memcached** protocol is transparently written to an `InnoDB` table, without going through the MySQL SQL layer. You can control frequency of writes to achieve higher raw performance when updating non-critical data.

* Data requested through the **memcached** protocol is transparently queried from an `InnoDB` table, without going through the MySQL SQL layer.

* Subsequent requests for the same data is served from the `InnoDB` buffer pool. The buffer pool handles the in-memory caching. You can tune performance of data-intensive operations using `InnoDB` configuration options.

* Data can be unstructured or structured, depending on the type of application. You can create a new table for data, or use existing tables.

* `InnoDB` can handle composing and decomposing multiple column values into a single **memcached** item value, reducing the amount of string parsing and concatenation required in your application. For example, you can store the string value `2|4|6|8` in the **memcached** cache, and have `InnoDB` split the value based on a separator character, then store the result in four numeric columns.

* The transfer between memory and disk is handled automatically, simplifying application logic.

* Data is stored in a MySQL database to protect against crashes, outages, and corruption.

* You can access the underlying `InnoDB` table through SQL for reporting, analysis, ad hoc queries, bulk loading, multi-step transactional computations, set operations such as union and intersection, and other operations suited to the expressiveness and flexibility of SQL.

* You can ensure high availability by using the `daemon_memcached` plugin on a source server in combination with MySQL replication.

* The integration of **memcached** with MySQL provides a way to make in-memory data persistent, so you can use it for more significant kinds of data. You can use more `add`, `incr`, and similar write operations in your application without concern that data could be lost. You can stop and start the **memcached** server without losing updates made to cached data. To guard against unexpected outages, you can take advantage of `InnoDB` crash recovery, replication, and backup capabilities.

* The way `InnoDB` does fast primary key lookups is a natural fit for **memcached** single-item queries. The direct, low-level database access path used by the `daemon_memcached` plugin is much more efficient for key-value lookups than equivalent SQL queries.

* The serialization features of **memcached**, which can turn complex data structures, binary files, or even code blocks into storeable strings, offer a simple way to get such objects into a database.

* Because you can access the underlying data through SQL, you can produce reports, search or update across multiple keys, and call functions such as `AVG()` and `MAX()` on **memcached** data. All of these operations are expensive or complicated using **memcached** by itself.

* You do not need to manually load data into **memcached** at startup. As particular keys are requested by an application, values are retrieved from the database automatically, and cached in memory using the `InnoDB` buffer pool.

* Because **memcached** consumes relatively little CPU, and its memory footprint is easy to control, it can run comfortably alongside a MySQL instance on the same system.

* Because data consistency is enforced by mechanisms used for regular `InnoDB` tables, you do not have to worry about stale **memcached** data or fallback logic to query the database in the case of a missing key.


### 14.21.2 InnoDB memcached Architecture

The `InnoDB` **memcached** plugin implements **memcached** as a MySQL plugin daemon that accesses the `InnoDB` storage engine directly, bypassing the MySQL SQL layer.

The following diagram illustrates how an application accesses data through the `daemon_memcached` plugin, compared with SQL.

**Figure 14.4 MySQL Server with Integrated memcached Server**

![Shows an application accessing data in the InnoDB storage engine using both SQL and the memcached protocol. Using SQL, the application accesses data through the MySQL Server and Handler API. Using the memcached protocol, the application bypasses the MySQL Server, accessing data through the memcached plugin and InnoDB API. The memcached plugin is comprised of the innodb_memcache interface and optional local cache.](images/innodb_memcached2.png)

Features of the `daemon_memcached` plugin:

* **memcached** as a daemon plugin of `mysqld`. Both `mysqld` and **memcached** run in the same process space, with very low latency access to data.

* Direct access to `InnoDB` tables, bypassing the SQL parser, the optimizer, and even the Handler API layer.

* Standard **memcached** protocols, including the text-based protocol and the binary protocol. The `daemon_memcached` plugin passes all 55 compatibility tests of the **memcapable** command.

* Multi-column support. You can map multiple columns into the “value” part of the key-value store, with column values delimited by a user-specified separator character.

* By default, the **memcached** protocol is used to read and write data directly to `InnoDB`, letting MySQL manage in-memory caching using the `InnoDB` buffer pool. The default settings represent a combination of high reliability and the fewest surprises for database applications. For example, default settings avoid uncommitted data on the database side, or stale data returned for **memcached** `get` requests.

* Advanced users can configure the system as a traditional **memcached** server, with all data cached only in the **memcached** engine (memory caching), or use a combination of the “**memcached** engine” (memory caching) and the `InnoDB` **memcached** engine (`InnoDB` as back-end persistent storage).

* Control over how often data is passed back and forth between `InnoDB` and **memcached** operations through the `innodb_api_bk_commit_interval`, `daemon_memcached_r_batch_size`, and `daemon_memcached_w_batch_size` configuration options. Batch size options default to a value of 1 for maximum reliability.

* The ability to specify **memcached** options through the `daemon_memcached_option` configuration parameter. For example, you can change the port that **memcached** listens on, reduce the maximum number of simultaneous connections, change the maximum memory size for a key-value pair, or enable debugging messages for the error log.

* The `innodb_api_trx_level` configuration option controls the transaction isolation level on queries processed by **memcached**. Although **memcached** has no concept of transactions, you can use this option to control how soon **memcached** sees changes caused by SQL statements issued on the table used by the **daemon\_memcached** plugin. By default, `innodb_api_trx_level` is set to `READ UNCOMMITTED`.

* The `innodb_api_enable_mdl` option can be used to lock the table at the MySQL level, so that the mapped table cannot be dropped or altered by DDL through the SQL interface. Without the lock, the table can be dropped from the MySQL layer, but kept in `InnoDB` storage until **memcached** or some other user stops using it. “MDL” stands for “metadata locking”.


### 14.21.3 Setting Up the InnoDB memcached Plugin

This section describes how to set up the `daemon_memcached` plugin on a MySQL server. Because the **memcached** daemon is tightly integrated with the MySQL server to avoid network traffic and minimize latency, you perform this process on each MySQL instance that uses this feature.

Note

Before setting up the `daemon_memcached` plugin, consult Section 14.21.4, “Security Considerations for the InnoDB memcached Plugin” to understand the security procedures required to prevent unauthorized access.

#### Prerequisites

* The `daemon_memcached` plugin is only supported on Linux, Solaris, and macOS platforms. Other operating systems are not supported.

* When building MySQL from source, you must build with `-DWITH_INNODB_MEMCACHED=ON`. This build option generates two shared libraries in the MySQL plugin directory (`plugin_dir`) that are required to run the `daemon_memcached` plugin:

  + `libmemcached.so`: the **memcached** daemon plugin to MySQL.

  + `innodb_engine.so`: an `InnoDB` API plugin to **memcached**.

* `libevent` must be installed.

  + If you did not build MySQL from source, the `libevent` library is not included in your installation. Use the installation method for your operating system to install `libevent` 1.4.12 or later. For example, depending on the operating system, you might use `apt-get`, `yum`, or `port install`. For example, on Ubuntu Linux, use:

    ```sql
    sudo apt-get install libevent-dev
    ```

  + If you installed MySQL from a source code release, `libevent` 1.4.12 is bundled with the package and is located at the top level of the MySQL source code directory. If you use the bundled version of `libevent`, no action is required. If you want to use a local system version of `libevent`, you must build MySQL with the `-DWITH_LIBEVENT` build option set to `system` or `yes`.

#### Installing and Configuring the InnoDB memcached Plugin

1. Configure the `daemon_memcached` plugin so it can interact with `InnoDB` tables by running the `innodb_memcached_config.sql` configuration script, which is located in `MYSQL_HOME/share`. This script installs the `innodb_memcache` database with three required tables (`cache_policies`, `config_options`, and `containers`). It also installs the `demo_test` sample table in the `test` database.

   ```sql
   mysql> source MYSQL_HOME/share/innodb_memcached_config.sql
   ```

   Running the `innodb_memcached_config.sql` script is a one-time operation. The tables remain in place if you later uninstall and re-install the `daemon_memcached` plugin.

   ```sql
   mysql> USE innodb_memcache;
   mysql> SHOW TABLES;
   +---------------------------+
   | Tables_in_innodb_memcache |
   +---------------------------+
   | cache_policies            |
   | config_options            |
   | containers                |
   +---------------------------+

   mysql> USE test;
   mysql> SHOW TABLES;
   +----------------+
   | Tables_in_test |
   +----------------+
   | demo_test      |
   +----------------+
   ```

   Of these tables, the `innodb_memcache.containers` table is the most important. Entries in the `containers` table provide a mapping to `InnoDB` table columns. Each `InnoDB` table used with the `daemon_memcached` plugin requires an entry in the `containers` table.

   The `innodb_memcached_config.sql` script inserts a single entry in the `containers` table that provides a mapping for the `demo_test` table. It also inserts a single row of data into the `demo_test` table. This data allows you to immediately verify the installation after the setup is completed.

   ```sql
   mysql> SELECT * FROM innodb_memcache.containers\G
   *************************** 1. row ***************************
                     name: aaa
                db_schema: test
                 db_table: demo_test
              key_columns: c1
            value_columns: c2
                    flags: c3
               cas_column: c4
       expire_time_column: c5
   unique_idx_name_on_key: PRIMARY

   mysql> SELECT * FROM test.demo_test;
   +----+------------------+------+------+------+
   | c1 | c2               | c3   | c4   | c5   |
   +----+------------------+------+------+------+
   | AA | HELLO, HELLO     |    8 |    0 |    0 |
   +----+------------------+------+------+------+
   ```

   For more information about `innodb_memcache` tables and the `demo_test` sample table, see Section 14.21.7, “InnoDB memcached Plugin Internals”.

2. Activate the `daemon_memcached` plugin by running the `INSTALL PLUGIN` statement:

   ```sql
   mysql> INSTALL PLUGIN daemon_memcached soname "libmemcached.so";
   ```

   Once the plugin is installed, it is automatically activated each time the MySQL server is restarted.

#### Verifying the InnoDB and memcached Setup

To verify the `daemon_memcached` plugin setup, use a **telnet** session to issue **memcached** commands. By default, the **memcached** daemon listens on port 11211.

1. Retrieve data from the `test.demo_test` table. The single row of data in the `demo_test` table has a key value of `AA`.

   ```sql
   telnet localhost 11211
   Trying 127.0.0.1...
   Connected to localhost.
   Escape character is '^]'.
   get AA
   VALUE AA 8 12
   HELLO, HELLO
   END
   ```

2. Insert data using a `set` command.

   ```sql
   set BB 10 0 16
   GOODBYE, GOODBYE
   STORED
   ```

   where:

   * `set` is the command to store a value
   * `BB` is the key
   * `10` is a flag for the operation; ignored by **memcached** but may be used by the client to indicate any type of information; specify `0` if unused

   * `0` is the expiration time (TTL); specify `0` if unused

   * `16` is the length of the supplied value block in bytes

   * `GOODBYE, GOODBYE` is the value that is stored

3. Verify that the data inserted is stored in MySQL by connecting to the MySQL server and querying the `test.demo_test` table.

   ```sql
   mysql> SELECT * FROM test.demo_test;
   +----+------------------+------+------+------+
   | c1 | c2               | c3   | c4   | c5   |
   +----+------------------+------+------+------+
   | AA | HELLO, HELLO     |    8 |    0 |    0 |
   | BB | GOODBYE, GOODBYE |   10 |    1 |    0 |
   +----+------------------+------+------+------+
   ```

4. Return to the telnet session and retrieve the data that you inserted earlier using key `BB`.

   ```sql
   get BB
   VALUE BB 10 16
   GOODBYE, GOODBYE
   END
   quit
   ```

If you shut down the MySQL server, which also shuts off the integrated **memcached** server, further attempts to access the **memcached** data fail with a connection error. Normally, the **memcached** data also disappears at this point, and you would require application logic to load the data back into memory when **memcached** is restarted. However, the `InnoDB` **memcached** plugin automates this process for you.

When you restart MySQL, `get` operations once again return the key-value pairs you stored in the earlier **memcached** session. When a key is requested and the associated value is not already in the memory cache, the value is automatically queried from the MySQL `test.demo_test` table.

#### Creating a New Table and Column Mapping

This example shows how to setup your own `InnoDB` table with the `daemon_memcached` plugin.

1. Create an `InnoDB` table. The table must have a key column with a unique index. The key column of the city table is `city_id`, which is defined as the primary key. The table must also include columns for `flags`, `cas`, and `expiry` values. There may be one or more value columns. The `city` table has three value columns (`name`, `state`, `country`).

   Note

   There is no special requirement with respect to column names as along as a valid mapping is added to the `innodb_memcache.containers` table.

   ```sql
   mysql> CREATE TABLE city (
          city_id VARCHAR(32),
          name VARCHAR(1024),
          state VARCHAR(1024),
          country VARCHAR(1024),
          flags INT,
          cas BIGINT UNSIGNED,
          expiry INT,
          primary key(city_id)
          ) ENGINE=InnoDB;
   ```

2. Add an entry to the `innodb_memcache.containers` table so that the `daemon_memcached` plugin knows how to access the `InnoDB` table. The entry must satisfy the `innodb_memcache.containers` table definition. For a description of each field, see Section 14.21.7, “InnoDB memcached Plugin Internals”.

   ```sql
   mysql> DESCRIBE innodb_memcache.containers;
   +------------------------+--------------+------+-----+---------+-------+
   | Field                  | Type         | Null | Key | Default | Extra |
   +------------------------+--------------+------+-----+---------+-------+
   | name                   | varchar(50)  | NO   | PRI | NULL    |       |
   | db_schema              | varchar(250) | NO   |     | NULL    |       |
   | db_table               | varchar(250) | NO   |     | NULL    |       |
   | key_columns            | varchar(250) | NO   |     | NULL    |       |
   | value_columns          | varchar(250) | YES  |     | NULL    |       |
   | flags                  | varchar(250) | NO   |     | 0       |       |
   | cas_column             | varchar(250) | YES  |     | NULL    |       |
   | expire_time_column     | varchar(250) | YES  |     | NULL    |       |
   | unique_idx_name_on_key | varchar(250) | NO   |     | NULL    |       |
   +------------------------+--------------+------+-----+---------+-------+
   ```

   The `innodb_memcache.containers` table entry for the city table is defined as:

   ```sql
   mysql> INSERT INTO `innodb_memcache`.`containers` (
          `name`, `db_schema`, `db_table`, `key_columns`, `value_columns`,
          `flags`, `cas_column`, `expire_time_column`, `unique_idx_name_on_key`)
          VALUES ('default', 'test', 'city', 'city_id', 'name|state|country',
          'flags','cas','expiry','PRIMARY');
   ```

   * `default` is specified for the `containers.name` column to configure the `city` table as the default `InnoDB` table to be used with the `daemon_memcached` plugin.

   * Multiple `InnoDB` table columns (`name`, `state`, `country`) are mapped to `containers.value_columns` using a “|” delimiter.

   * The `flags`, `cas_column`, and `expire_time_column` fields of the `innodb_memcache.containers` table are typically not significant in applications using the `daemon_memcached` plugin. However, a designated `InnoDB` table column is required for each. When inserting data, specify `0` for these columns if they are unused.

3. After updating the `innodb_memcache.containers` table, restart the `daemon_memcache` plugin to apply the changes.

   ```sql
   mysql> UNINSTALL PLUGIN daemon_memcached;

   mysql> INSTALL PLUGIN daemon_memcached soname "libmemcached.so";
   ```

4. Using telnet, insert data into the `city` table using a **memcached** `set` command.

   ```sql
   telnet localhost 11211
   Trying 127.0.0.1...
   Connected to localhost.
   Escape character is '^]'.
   set B 0 0 22
   BANGALORE|BANGALORE|IN
   STORED
   ```

5. Using MySQL, query the `test.city` table to verify that the data you inserted was stored.

   ```sql
   mysql> SELECT * FROM test.city;
   +---------+-----------+-----------+---------+-------+------+--------+
   | city_id | name      | state     | country | flags | cas  | expiry |
   +---------+-----------+-----------+---------+-------+------+--------+
   | B       | BANGALORE | BANGALORE | IN      |     0 |    3 |      0 |
   +---------+-----------+-----------+---------+-------+------+--------+
   ```

6. Using MySQL, insert additional data into the `test.city` table.

   ```sql
   mysql> INSERT INTO city VALUES ('C','CHENNAI','TAMIL NADU','IN', 0, 0 ,0);
   mysql> INSERT INTO city VALUES ('D','DELHI','DELHI','IN', 0, 0, 0);
   mysql> INSERT INTO city VALUES ('H','HYDERABAD','TELANGANA','IN', 0, 0, 0);
   mysql> INSERT INTO city VALUES ('M','MUMBAI','MAHARASHTRA','IN', 0, 0, 0);
   ```

   Note

   It is recommended that you specify a value of `0` for the `flags`, `cas_column`, and `expire_time_column` fields if they are unused.

7. Using telnet, issue a **memcached** `get` command to retrieve data you inserted using MySQL.

   ```sql
   get H
   VALUE H 0 22
   HYDERABAD|TELANGANA|IN
   END
   ```

#### Configuring the InnoDB memcached Plugin

Traditional `memcached` configuration options may be specified in a MySQL configuration file or a `mysqld` startup string, encoded in the argument of the `daemon_memcached_option` configuration parameter. `memcached` configuration options take effect when the plugin is loaded, which occurs each time the MySQL server is started.

For example, to make **memcached** listen on port 11222 instead of the default port 11211, specify `-p11222` as an argument of the `daemon_memcached_option` configuration option:

```sql
mysqld .... --daemon_memcached_option="-p11222"
```

Other **memcached** options can be encoded in the `daemon_memcached_option` string. For example, you can specify options to reduce the maximum number of simultaneous connections, change the maximum memory size for a key-value pair, or enable debugging messages for the error log, and so on.

There are also configuration options specific to the `daemon_memcached` plugin. These include:

* `daemon_memcached_engine_lib_name`: Specifies the shared library that implements the `InnoDB` **memcached** plugin. The default setting is `innodb_engine.so`.

* `daemon_memcached_engine_lib_path`: The path of the directory containing the shared library that implements the `InnoDB` **memcached** plugin. The default is NULL, representing the plugin directory.

* `daemon_memcached_r_batch_size`: Defines the batch commit size for read operations (`get`). It specifies the number of **memcached** read operations after which a commit occurs. `daemon_memcached_r_batch_size` is set to 1 by default so that every `get` request accesses the most recently committed data in the `InnoDB` table, whether the data was updated through **memcached** or by SQL. When the value is greater than 1, the counter for read operations is incremented with each `get` call. A `flush_all` call resets both read and write counters.

* `daemon_memcached_w_batch_size`: Defines the batch commit size for write operations (`set`, `replace`, `append`, `prepend`, `incr`, `decr`, and so on). `daemon_memcached_w_batch_size` is set to 1 by default so that no uncommitted data is lost in case of an outage, and so that SQL queries on the underlying table access the most recent data. When the value is greater than 1, the counter for write operations is incremented for each `add`, `set`, `incr`, `decr`, and `delete` call. A `flush_all` call resets both read and write counters.

By default, you do not need to modify `daemon_memcached_engine_lib_name` or `daemon_memcached_engine_lib_path`. You might configure these options if, for example, you want to use a different storage engine for **memcached** (such as the NDB **memcached** engine).

`daemon_memcached` plugin configuration parameters may be specified in the MySQL configuration file or in a `mysqld` startup string. They take effect when you load the `daemon_memcached` plugin.

When making changes to `daemon_memcached` plugin configuration, reload the plugin to apply the changes. To do so, issue the following statements:

```sql
mysql> UNINSTALL PLUGIN daemon_memcached;

mysql> INSTALL PLUGIN daemon_memcached soname "libmemcached.so";
```

Configuration settings, required tables, and data are preserved when the plugin is restarted.

For additional information about enabling and disabling plugins, see Section 5.5.1, “Installing and Uninstalling Plugins”.


### 14.21.4 Security Considerations for the InnoDB memcached Plugin

Caution

Consult this section before deploying the `daemon_memcached` plugin on a production server, or even on a test server if the MySQL instance contains sensitive data.

Because **memcached** does not use an authentication mechanism by default, and the optional SASL authentication is not as strong as traditional DBMS security measures, only keep non-sensitive data in the MySQL instance that uses the `daemon_memcached` plugin, and wall off any servers that use this configuration from potential intruders. Do not allow **memcached** access to these servers from the Internet; only allow access from within a firewalled intranet, ideally from a subnet whose membership you can restrict.

#### Password-Protecting memcached Using SASL

SASL support provides the capability to protect your MySQL database from unauthenticated access through **memcached** clients. This section explains how to enable SASL with the `daemon_memcached` plugin. The steps are almost identical to those performed to enabled SASL for a traditional **memcached** server.

SASL stands for “Simple Authentication and Security Layer”, a standard for adding authentication support to connection-based protocols. **memcached** added SASL support in version 1.4.3.

SASL authentication is only supported with the binary protocol.

**memcached** clients are only able to access `InnoDB` tables that are registered in the `innodb_memcache.containers` table. Even though a DBA can place access restrictions on such tables, access through **memcached** applications cannot be controlled. For this reason, SASL support is provided to control access to `InnoDB` tables associated with the `daemon_memcached` plugin.

The following section shows how to build, enable, and test an SASL-enabled `daemon_memcached` plugin.

#### Building and Enabling SASL with the InnoDB memcached Plugin

By default, an SASL-enabled `daemon_memcached` plugin is not included in MySQL release packages, since an SASL-enabled `daemon_memcached` plugin requires building **memcached** with SASL libraries. To enable SASL support, download the MySQL source and rebuild the `daemon_memcached` plugin after downloading the SASL libraries:

1. Install the SASL development and utility libraries. For example, on Ubuntu, use **apt-get** to obtain the libraries:

   ```sql
   sudo apt-get -f install libsasl2-2 sasl2-bin libsasl2-2 libsasl2-dev libsasl2-modules
   ```

2. Build the `daemon_memcached` plugin shared libraries with SASL capability by adding `ENABLE_MEMCACHED_SASL=1` to your **cmake** options. **memcached** also provides *simple cleartext password support*, which facilitates testing. To enable simple cleartext password support, specify the `ENABLE_MEMCACHED_SASL_PWDB=1` **cmake** option.

   In summary, add following three **cmake** options:

   ```sql
   cmake ... -DWITH_INNODB_MEMCACHED=1 -DENABLE_MEMCACHED_SASL=1 -DENABLE_MEMCACHED_SASL_PWDB=1
   ```

3. Install the `daemon_memcached` plugin, as described in Section 14.21.3, “Setting Up the InnoDB memcached Plugin”.

4. Configure a user name and password file. (This example uses **memcached** simple cleartext password support.)

   1. In a file, create a user named `testname` and define the password as `testpasswd`:

      ```sql
      echo "testname:testpasswd:::::::" >/home/jy/memcached-sasl-db
      ```

   2. Configure the `MEMCACHED_SASL_PWDB` environment variable to inform `memcached` of the user name and password file:

      ```sql
      export MEMCACHED_SASL_PWDB=/home/jy/memcached-sasl-db
      ```

   3. Inform `memcached` that a cleartext password is used:

      ```sql
      echo "mech_list: plain" > /home/jy/work2/msasl/clients/memcached.conf
      export SASL_CONF_PATH=/home/jy/work2/msasl/clients
      ```

5. Enable SASL by restarting the MySQL server with the **memcached** `-S` option encoded in the `daemon_memcached_option` configuration parameter:

   ```sql
   mysqld ... --daemon_memcached_option="-S"
   ```

6. To test the setup, use an SASL-enabled client such as [SASL-enabled libmemcached](https://code.launchpad.net/~trond-norbye/libmemcached/sasl).

   ```sql
   memcp --servers=localhost:11211 --binary  --username=testname
     --password=password myfile.txt

   memcat --servers=localhost:11211 --binary --username=testname
     --password=password myfile.txt
   ```

   If you specify an incorrect user name or password, the operation is rejected with a `memcache error AUTHENTICATION FAILURE` message. In this case, examine the cleartext password set in the `memcached-sasl-db` file to verify that the credentials you supplied are correct.

There are other methods to test SASL authentication with **memcached**, but the method described above is the most straightforward.


### 14.21.5 Writing Applications for the InnoDB memcached Plugin

Typically, writing an application for the `InnoDB` **memcached** plugin involves some degree of rewriting or adapting existing code that uses MySQL or the **memcached** API.

* With the `daemon_memcached` plugin, instead of many traditional **memcached** servers running on low-powered machines, you have the same number of **memcached** servers as MySQL servers, running on relatively high-powered machines with substantial disk storage and memory. You might reuse some existing code that works with the **memcached** API, but adaptation is likely required due to the different server configuration.

* The data stored through the `daemon_memcached` plugin goes into `VARCHAR`, `TEXT`, or `BLOB` columns, and must be converted to do numeric operations. You can perform the conversion on the application side, or by using the `CAST()` function in queries.

* Coming from a database background, you might be used to general-purpose SQL tables with many columns. The tables accessed by **memcached** code likely have only a few or even a single column holding data values.

* You might adapt parts of your application that perform single-row queries, inserts, updates, or deletes, to improve performance in critical sections of code. Both queries (read) and DML (write) operations can be substantially faster when performed through the `InnoDB` **memcached** interface. The performance improvement for writes is typically greater than the performance improvement for reads, so you might focus on adapting code that performs logging or records interactive choices on a website.

The following sections explore these points in more detail.


#### 14.21.5.1 Adapting an Existing MySQL Schema for the InnoDB memcached Plugin

Consider these aspects of **memcached** applications when adapting an existing MySQL schema or application to use the `daemon_memcached` plugin:

* **memcached** keys cannot contain spaces or newlines, because these characters are used as separators in the ASCII protocol. If you are using lookup values that contain spaces, transform or hash them into values without spaces before using them as keys in calls to `add()`, `set()`, `get()`, and so on. Although theoretically these characters are allowed in keys in programs that use the binary protocol, you should restrict the characters used in keys to ensure compatibility with a broad range of clients.

* If there is a short numeric primary key column in an `InnoDB` table, use it as the unique lookup key for **memcached** by converting the integer to a string value. If the **memcached** server is used for multiple applications, or with more than one `InnoDB` table, consider modifying the name to ensure that it is unique. For example, prepend the table name, or the database name and the table name, before the numeric value.

  Note

  The `daemon_memcached` plugin supports inserts and reads on mapped `InnoDB` tables that have an `INTEGER` defined as the primary key.

* You cannot use a partitioned table for data queried or stored using **memcached**.

* The **memcached** protocol passes numeric values around as strings. To store numeric values in the underlying `InnoDB` table, to implement counters that can be used in SQL functions such as `SUM()` or `AVG()`, for example:

  + Use `VARCHAR` columns with enough characters to hold all the digits of the largest expected number (and additional characters if appropriate for the negative sign, decimal point, or both).

  + In any query that performs arithmetic using column values, use the `CAST()` function to convert the values from string to integer, or to some other numeric type. For example:

    ```sql
    # Alphabetic entries are returned as zero.

    SELECT CAST(c2 as unsigned integer) FROM demo_test;

    # Since there could be numeric values of 0, can't disqualify them.
    # Test the string values to find the ones that are integers, and average only those.

    SELECT AVG(cast(c2 as unsigned integer)) FROM demo_test
      WHERE c2 BETWEEN '0' and '9999999999';

    # Views let you hide the complexity of queries. The results are already converted;
    # no need to repeat conversion functions and WHERE clauses each time.

    CREATE VIEW numbers AS SELECT c1 KEY, CAST(c2 AS UNSIGNED INTEGER) val
      FROM demo_test WHERE c2 BETWEEN '0' and '9999999999';
    SELECT SUM(val) FROM numbers;
    ```

    Note

    Any alphabetic values in the result set are converted into 0 by the call to `CAST()`. When using functions such as `AVG()`, which depend on the number of rows in the result set, include `WHERE` clauses to filter out non-numeric values.

* If the `InnoDB` column used as a key could have values longer than 250 bytes, hash the value to less than 250 bytes.

* To use an existing table with the `daemon_memcached` plugin, define an entry for it in the `innodb_memcache.containers` table. To make that table the default for all **memcached** requests, specify a value of `default` in the `name` column, then restart the MySQL server to make the change take effect. If you use multiple tables for different classes of **memcached** data, set up multiple entries in the `innodb_memcache.containers` table with `name` values of your choice, then issue a **memcached** request in the form of `get @@name` or `set @@name` within the application to specify the table to be used for subsequent **memcached** requests.

  For an example of using a table other than the predefined `test.demo_test` table, see Example 14.13, “Using Your Own Table with an InnoDB memcached Application”. For the required table layout, see Section 14.21.7, “InnoDB memcached Plugin Internals”.

* To use multiple `InnoDB` table column values with **memcached** key-value pairs, specify column names separated by comma, semicolon, space, or pipe characters in the `value_columns` field of the `innodb_memcache.containers` entry for the `InnoDB` table. For example, specify `col1,col2,col3` or `col1|col2|col3` in the `value_columns` field.

  Concatenate the column values into a single string using the pipe character as a separator before passing the string to **memcached** `add` or `set` calls. The string is unpacked automatically into the correct column. Each `get` call returns a single string containing the column values that is also delimited by the pipe character. You can unpack the values using the appropriate application language syntax.

**Example 14.13 Using Your Own Table with an InnoDB memcached Application**

This example shows how to use your own table with a sample Python application that uses `memcached` for data manipulation.

The example assumes that the `daemon_memcached` plugin is installed as described in Section 14.21.3, “Setting Up the InnoDB memcached Plugin”. It also assumes that your system is configured to run a Python script that uses the `python-memcache` module.

1. Create the `multicol` table which stores country information including population, area, and driver side data (`'R'` for right and `'L'` for left).

   ```sql
   mysql> USE test;

   mysql> CREATE TABLE `multicol` (
           `country` varchar(128) NOT NULL DEFAULT '',
           `population` varchar(10) DEFAULT NULL,
           `area_sq_km` varchar(9) DEFAULT NULL,
           `drive_side` varchar(1) DEFAULT NULL,
           `c3` int(11) DEFAULT NULL,
           `c4` bigint(20) unsigned DEFAULT NULL,
           `c5` int(11) DEFAULT NULL,
           PRIMARY KEY (`country`)
           ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
   ```

2. Insert a record into the `innodb_memcache.containers` table so that the `daemon_memcached` plugin can access the `multicol` table.

   ```sql
   mysql> INSERT INTO innodb_memcache.containers
          (name,db_schema,db_table,key_columns,value_columns,flags,cas_column,
          expire_time_column,unique_idx_name_on_key)
          VALUES
          ('bbb','test','multicol','country','population,area_sq_km,drive_side',
          'c3','c4','c5','PRIMARY');

   mysql> COMMIT;
   ```

   * The `innodb_memcache.containers` record for the `multicol` table specifies a `name` value of `'bbb'`, which is the table identifier.

     Note

     If a single `InnoDB` table is used for all **memcached** applications, the `name` value can be set to `default` to avoid using `@@` notation to switch tables.

   * The `db_schema` column is set to `test`, which is the name of the database where the `multicol` table resides.

   * The `db_table` column is set to `multicol`, which is the name of the `InnoDB` table.

   * `key_columns` is set to the unique `country` column. The `country` column is defined as the primary key in the `multicol` table definition.

   * Rather than a single `InnoDB` table column to hold a composite data value, data is divided among three table columns (`population`, `area_sq_km`, and `drive_side`). To accommodate multiple value columns, a comma-separated list of columns is specified in the `value_columns` field. The columns defined in the `value_columns` field are the columns used when storing or retrieving values.

   * Values for the `flags`, `expire_time`, and `cas_column` fields are based on values used in the `demo.test` sample table. These fields are typically not significant in applications that use the `daemon_memcached` plugin because MySQL keeps data synchronized, and there is no need to worry about data expiring or becoming stale.

   * The `unique_idx_name_on_key` field is set to `PRIMARY`, which refers to the primary index defined on the unique `country` column in the `multicol` table.

3. Copy the sample Python application into a file. In this example, the sample script is copied to a file named `multicol.py`.

   The sample Python application inserts data into the `multicol` table and retrieves data for all keys, demonstrating how to access an `InnoDB` table through the `daemon_memcached` plugin.

   ```sql
   import sys, os
   import memcache

   def connect_to_memcached():
     memc = memcache.Client(['127.0.0.1:11211'], debug=0);
     print "Connected to memcached."
     return memc

   def banner(message):
     print
     print "=" * len(message)
     print message
     print "=" * len(message)

   country_data = [
   ("Canada","34820000","9984670","R"),
   ("USA","314242000","9826675","R"),
   ("Ireland","6399152","84421","L"),
   ("UK","62262000","243610","L"),
   ("Mexico","113910608","1972550","R"),
   ("Denmark","5543453","43094","R"),
   ("Norway","5002942","385252","R"),
   ("UAE","8264070","83600","R"),
   ("India","1210193422","3287263","L"),
   ("China","1347350000","9640821","R"),
   ]

   def switch_table(memc,table):
     key = "@@" + table
     print "Switching default table to '" + table + "' by issuing GET for '" + key + "'."
     result = memc.get(key)

   def insert_country_data(memc):
     banner("Inserting initial data via memcached interface")
     for item in country_data:
       country = item[0]
       population = item[1]
       area = item[2]
       drive_side = item[3]

       key = country
       value = "|".join([population,area,drive_side])
       print "Key = " + key
       print "Value = " + value

       if memc.add(key,value):
         print "Added new key, value pair."
       else:
         print "Updating value for existing key."
         memc.set(key,value)

   def query_country_data(memc):
     banner("Retrieving data for all keys (country names)")
     for item in country_data:
       key = item[0]
       result = memc.get(key)
       print "Here is the result retrieved from the database for key " + key + ":"
       print result
       (m_population, m_area, m_drive_side) = result.split("|")
       print "Unpacked population value: " + m_population
       print "Unpacked area value      : " + m_area
       print "Unpacked drive side value: " + m_drive_side

   if __name__ == '__main__':

     memc = connect_to_memcached()
     switch_table(memc,"bbb")
     insert_country_data(memc)
     query_country_data(memc)

     sys.exit(0)
   ```

   Sample Python application notes:

   * No database authorization is required to run the application, since data manipulation is performed through the **memcached** interface. The only required information is the port number on the local system where the **memcached** daemon listens.

   * To make sure the application uses the `multicol` table, the `switch_table()` function is called, which performs a dummy `get` or `set` request using `@@` notation. The `name` value in the request is `bbb`, which is the `multicol` table identifier defined in the `innodb_memcache.containers.name` field.

     A more descriptive `name` value might be used in a real-world application. This example simply illustrates that a table identifier is specified rather than the table name in `get @@...` requests.

   * The utility functions used to insert and query data demonstrate how to turn a Python data structure into pipe-separated values for sending data to MySQL with `add` or `set` requests, and how to unpack the pipe-separated values returned by `get` requests. This extra processing is only required when mapping a single **memcached** value to multiple MySQL table columns.

4. Run the sample Python application.

   ```sql
   $> python multicol.py
   ```

   If successful, the sample application returns this output:

   ```sql
   Connected to memcached.
   Switching default table to 'bbb' by issuing GET for '@@bbb'.

   ==============================================
   Inserting initial data via memcached interface
   ==============================================
   Key = Canada
   Value = 34820000|9984670|R
   Added new key, value pair.
   Key = USA
   Value = 314242000|9826675|R
   Added new key, value pair.
   Key = Ireland
   Value = 6399152|84421|L
   Added new key, value pair.
   Key = UK
   Value = 62262000|243610|L
   Added new key, value pair.
   Key = Mexico
   Value = 113910608|1972550|R
   Added new key, value pair.
   Key = Denmark
   Value = 5543453|43094|R
   Added new key, value pair.
   Key = Norway
   Value = 5002942|385252|R
   Added new key, value pair.
   Key = UAE
   Value = 8264070|83600|R
   Added new key, value pair.
   Key = India
   Value = 1210193422|3287263|L
   Added new key, value pair.
   Key = China
   Value = 1347350000|9640821|R
   Added new key, value pair.

   ============================================
   Retrieving data for all keys (country names)
   ============================================
   Here is the result retrieved from the database for key Canada:
   34820000|9984670|R
   Unpacked population value: 34820000
   Unpacked area value      : 9984670
   Unpacked drive side value: R
   Here is the result retrieved from the database for key USA:
   314242000|9826675|R
   Unpacked population value: 314242000
   Unpacked area value      : 9826675
   Unpacked drive side value: R
   Here is the result retrieved from the database for key Ireland:
   6399152|84421|L
   Unpacked population value: 6399152
   Unpacked area value      : 84421
   Unpacked drive side value: L
   Here is the result retrieved from the database for key UK:
   62262000|243610|L
   Unpacked population value: 62262000
   Unpacked area value      : 243610
   Unpacked drive side value: L
   Here is the result retrieved from the database for key Mexico:
   113910608|1972550|R
   Unpacked population value: 113910608
   Unpacked area value      : 1972550
   Unpacked drive side value: R
   Here is the result retrieved from the database for key Denmark:
   5543453|43094|R
   Unpacked population value: 5543453
   Unpacked area value      : 43094
   Unpacked drive side value: R
   Here is the result retrieved from the database for key Norway:
   5002942|385252|R
   Unpacked population value: 5002942
   Unpacked area value      : 385252
   Unpacked drive side value: R
   Here is the result retrieved from the database for key UAE:
   8264070|83600|R
   Unpacked population value: 8264070
   Unpacked area value      : 83600
   Unpacked drive side value: R
   Here is the result retrieved from the database for key India:
   1210193422|3287263|L
   Unpacked population value: 1210193422
   Unpacked area value      : 3287263
   Unpacked drive side value: L
   Here is the result retrieved from the database for key China:
   1347350000|9640821|R
   Unpacked population value: 1347350000
   Unpacked area value      : 9640821
   Unpacked drive side value: R
   ```

5. Query the `innodb_memcache.containers` table to view the record you inserted earlier for the `multicol` table. The first record is the sample entry for the `demo_test` table that is created during the initial `daemon_memcached` plugin setup. The second record is the entry you inserted for the `multicol` table.

   ```sql
   mysql> SELECT * FROM innodb_memcache.containers\G
   *************************** 1. row ***************************
                     name: aaa
                db_schema: test
                 db_table: demo_test
              key_columns: c1
            value_columns: c2
                    flags: c3
               cas_column: c4
       expire_time_column: c5
   unique_idx_name_on_key: PRIMARY
   *************************** 2. row ***************************
                     name: bbb
                db_schema: test
                 db_table: multicol
              key_columns: country
            value_columns: population,area_sq_km,drive_side
                    flags: c3
               cas_column: c4
       expire_time_column: c5
   unique_idx_name_on_key: PRIMARY
   ```

6. Query the `multicol` table to view data inserted by the sample Python application. The data is available for MySQL queries, which demonstrates how the same data can be accessed using SQL or through applications (using the appropriate MySQL Connector or API).

   ```sql
   mysql> SELECT * FROM test.multicol;
   +---------+------------+------------+------------+------+------+------+
   | country | population | area_sq_km | drive_side | c3   | c4   | c5   |
   +---------+------------+------------+------------+------+------+------+
   | Canada  | 34820000   | 9984670    | R          |    0 |   11 |    0 |
   | China   | 1347350000 | 9640821    | R          |    0 |   20 |    0 |
   | Denmark | 5543453    | 43094      | R          |    0 |   16 |    0 |
   | India   | 1210193422 | 3287263    | L          |    0 |   19 |    0 |
   | Ireland | 6399152    | 84421      | L          |    0 |   13 |    0 |
   | Mexico  | 113910608  | 1972550    | R          |    0 |   15 |    0 |
   | Norway  | 5002942    | 385252     | R          |    0 |   17 |    0 |
   | UAE     | 8264070    | 83600      | R          |    0 |   18 |    0 |
   | UK      | 62262000   | 243610     | L          |    0 |   14 |    0 |
   | USA     | 314242000  | 9826675    | R          |    0 |   12 |    0 |
   +---------+------------+------------+------------+------+------+------+
   ```

   Note

   Always allow sufficient size to hold necessary digits, decimal points, sign characters, leading zeros, and so on when defining the length for columns that are treated as numbers. Too-long values in a string column such as a `VARCHAR` are truncated by removing some characters, which could produce nonsensical numeric values.

7. Optionally, run report-type queries on the `InnoDB` table that stores the **memcached** data.

   You can produce reports through SQL queries, performing calculations and tests across any columns, not just the `country` key column. (Because the following examples use data from only a few countries, the numbers are for illustration purposes only.) The following queries return the average population of countries where people drive on the right, and the average size of countries whose names start with “U”:

   ```sql
   mysql> SELECT AVG(population) FROM multicol WHERE drive_side = 'R';
   +-------------------+
   | avg(population)   |
   +-------------------+
   | 261304724.7142857 |
   +-------------------+

   mysql> SELECT SUM(area_sq_km) FROM multicol WHERE country LIKE 'U%';
   +-----------------+
   | sum(area_sq_km) |
   +-----------------+
   |        10153885 |
   +-----------------+
   ```

   Because the `population` and `area_sq_km` columns store character data rather than strongly typed numeric data, functions such as `AVG()` and `SUM()` work by converting each value to a number first. This approach *does not work* for operators such as `<` or `>`, for example, when comparing character-based values, `9
   > 1000`, which is not expected from a clause such as `ORDER BY population DESC`. For the most accurate type treatment, perform queries against views that cast numeric columns to the appropriate types. This technique lets you issue simple `SELECT *` queries from database applications, while ensuring that casting, filtering, and ordering is correct. The following example shows a view that can be queried to find the top three countries in descending order of population, with the results reflecting the latest data in the `multicol` table, and with population and area figures treated as numbers:

   ```sql
   mysql> CREATE VIEW populous_countries AS
          SELECT
          country,
          cast(population as unsigned integer) population,
          cast(area_sq_km as unsigned integer) area_sq_km,
          drive_side FROM multicol
          ORDER BY CAST(population as unsigned integer) DESC
          LIMIT 3;

   mysql> SELECT * FROM populous_countries;
   +---------+------------+------------+------------+
   | country | population | area_sq_km | drive_side |
   +---------+------------+------------+------------+
   | China   | 1347350000 |    9640821 | R          |
   | India   | 1210193422 |    3287263 | L          |
   | USA     |  314242000 |    9826675 | R          |
   +---------+------------+------------+------------+

   mysql> DESC populous_countries;
   +------------+---------------------+------+-----+---------+-------+
   | Field      | Type                | Null | Key | Default | Extra |
   +------------+---------------------+------+-----+---------+-------+
   | country    | varchar(128)        | NO   |     |         |       |
   | population | bigint(10) unsigned | YES  |     | NULL    |       |
   | area_sq_km | int(9) unsigned     | YES  |     | NULL    |       |
   | drive_side | varchar(1)          | YES  |     | NULL    |       |
   +------------+---------------------+------+-----+---------+-------+
   ```


#### 14.21.5.2 Adapting a memcached Application for the InnoDB memcached Plugin

Consider these aspects of MySQL and `InnoDB` tables when adapting existing **memcached** applications to use the `daemon_memcached` plugin:

* If there are key values longer than a few bytes, it may be more efficient to use a numeric auto-increment column as the primary key of the `InnoDB` table, and to create a unique secondary index on the column that contains the **memcached** key values. This is because `InnoDB` performs best for large-scale insertions if primary key values are added in sorted order (as they are with auto-increment values). Primary key values are included in secondary indexes, which takes up unnecessary space if the primary key is a long string value.

* If you store several different classes of information using **memcached**, consider setting up a separate `InnoDB` table for each type of data. Define additional table identifiers in the `innodb_memcache.containers` table, and use the `@@table_id.key` notation to store and retrieve items from different tables. Physically dividing different types of information allows you tune the characteristics of each table for optimum space utilization, performance, and reliability. For example, you might enable compression for a table that holds blog posts, but not for a table that holds thumbnail images. You might back up one table more frequently than another because it holds critical data. You might create additional secondary indexes on tables that are frequently used to generate reports using SQL.

* Preferably, configure a stable set of table definitions for use with the **daemon\_memcached** plugin, and leave the tables in place permanently. Changes to the `innodb_memcache.containers` table take effect the next time the `innodb_memcache.containers` table is queried. Entries in the containers table are processed at startup, and are consulted whenever an unrecognized table identifier (as defined by `containers.name`) is requested using `@@` notation. Thus, new entries are visible as soon as you use the associated table identifier, but changes to existing entries require a server restart before they take effect.

* When you use the default `innodb_only` caching policy, calls to `add()`, `set()`, `incr()`, and so on can succeed but still trigger debugging messages such as `while expecting 'STORED', got unexpected response 'NOT_STORED`. Debug messages occur because new and updated values are sent directly to the `InnoDB` table without being saved in the memory cache, due to the `innodb_only` caching policy.


#### 14.21.5.3 Tuning InnoDB memcached Plugin Performance

Because using `InnoDB` in combination with **memcached** involves writing all data to disk, whether immediately or sometime later, raw performance is expected to be somewhat slower than using **memcached** by itself. When using the `InnoDB` **memcached** plugin, focus tuning goals for **memcached** operations on achieving better performance than equivalent SQL operations.

Benchmarks suggest that queries and DML operations (inserts, updates, and deletes) that use the **memcached** interface are faster than traditional SQL. DML operations typically see a larger improvements. Therefore, consider adapting write-intensive applications to use the **memcached** interface first. Also consider prioritizing adaptation of write-intensive applications that use fast, lightweight mechanisms that lack reliability.

##### Adapting SQL Queries

The types of queries that are most suited to simple `GET` requests are those with a single clause or a set of `AND` conditions in the `WHERE` clause:

```sql
SQL:
SELECT col FROM tbl WHERE key = 'key_value';

memcached:
get key_value

SQL:
SELECT col FROM tbl WHERE col1 = val1 and col2 = val2 and col3 = val3;

memcached:
# Since you must always know these 3 values to look up the key,
# combine them into a unique string and use that as the key
# for all ADD, SET, and GET operations.
key_value = val1 + ":" + val2 + ":" + val3
get key_value

SQL:
SELECT 'key exists!' FROM tbl
  WHERE EXISTS (SELECT col1 FROM tbl WHERE KEY = 'key_value') LIMIT 1;

memcached:
# Test for existence of key by asking for its value and checking if the call succeeds,
# ignoring the value itself. For existence checking, you typically only store a very
# short value such as "1".
get key_value
```

##### Using System Memory

For best performance, deploy the `daemon_memcached` plugin on machines that are configured as typical database servers, where the majority of system RAM is devoted to the `InnoDB` buffer pool, through the `innodb_buffer_pool_size` configuration option. For systems with multi-gigabyte buffer pools, consider raising the value of `innodb_buffer_pool_instances` for maximum throughput when most operations involve data that is already cached in memory.

##### Reducing Redundant I/O

`InnoDB` has a number of settings that let you choose the balance between high reliability, in case of a crash, and the amount of I/O overhead during high write workloads. For example, consider setting the `innodb_doublewrite` to `0` and `innodb_flush_log_at_trx_commit` to `2`. Measure performance with different `innodb_flush_method` settings.

Note

`innodb_support_xa` is deprecated; expect it to be removed in a future release. As of MySQL 5.7.10, `InnoDB` support for two-phase commit in XA transactions is always enabled and disabling `innodb_support_xa` is no longer permitted.

For other ways to reduce or tune I/O for table operations, see Section 8.5.8, “Optimizing InnoDB Disk I/O”.

##### Reducing Transactional Overhead

A default value of 1 for `daemon_memcached_r_batch_size` and `daemon_memcached_w_batch_size` is intended for maximum reliability of results and safety of stored or updated data.

Depending on the type of application, you might increase one or both of these settings to reduce the overhead of frequent commit operations. On a busy system, you might increase `daemon_memcached_r_batch_size`, knowing that changes to data made through SQL may not become visible to **memcached** immediately (that is, until *`N`* more `get` operations are processed). When processing data where every write operation must be reliably stored, leave `daemon_memcached_w_batch_size` set to `1`. Increase the setting when processing large numbers of updates intended only for statistical analysis, where losing the last *`N`* updates in an unexpected exit is an acceptable risk.

For example, imagine a system that monitors traffic crossing a busy bridge, recording data for approximately 100,000 vehicles each day. If the application counts different types of vehicles to analyze traffic patterns, changing `daemon_memcached_w_batch_size` from `1` to `100` reduces I/O overhead for commit operations by 99%. In case of an outage, a maximum of 100 records are lost, which may be an acceptable margin of error. If instead the application performed automated toll collection for each car, you would set `daemon_memcached_w_batch_size` to `1` to ensure that each toll record is immediately saved to disk.

Because of the way `InnoDB` organizes **memcached** key values on disk, if you have a large number of keys to create, it may be faster to sort the data items by key value in the application and `add` them in sorted order, rather than create keys in arbitrary order.

The **memslap** command, which is part of the regular **memcached** distribution but not included with the `daemon_memcached` plugin, can be useful for benchmarking different configurations. It can also be used to generate sample key-value pairs to use in your own benchmarks.


#### 14.21.5.4 Controlling Transactional Behavior of the InnoDB memcached Plugin

Unlike traditional **memcached**, the `daemon_memcached` plugin allows you to control durability of data values produced through calls to `add`, `set`, `incr`, and so on. By default, data written through the **memcached** interface is stored to disk, and calls to `get` return the most recent value from disk. Although the default behavior does not offer the best possible raw performance, it is still fast compared to the SQL interface for `InnoDB` tables.

As you gain experience using the `daemon_memcached` plugin, you can consider relaxing durability settings for non-critical classes of data, at the risk of losing some updated values in the event of an outage, or returning data that is slightly out-of-date.

##### Frequency of Commits

One tradeoff between durability and raw performance is how frequently new and changed data is committed. If data is critical, is should be committed immediately so that it is safe in case of an unexpected exit or outage. If data is less critical, such as counters that are reset after an unexpected exit or logging data that you can afford to lose, you might prefer higher raw throughput that is available with less frequent commits.

When a **memcached** operation inserts, updates, or deletes data in the underlying `InnoDB` table, the change might be committed to the `InnoDB` table instantly (if `daemon_memcached_w_batch_size=1`) or some time later (if the `daemon_memcached_w_batch_size` value is greater than 1). In either case, the change cannot be rolled back. If you increase the value of `daemon_memcached_w_batch_size` to avoid high I/O overhead during busy times, commits could become infrequent when the workload decreases. As a safety measure, a background thread automatically commits changes made through the **memcached** API at regular intervals. The interval is controlled by the `innodb_api_bk_commit_interval` configuration option, which has a default setting of `5` seconds.

When a **memcached** operation inserts or updates data in the underlying `InnoDB` table, the changed data is immediately visible to other **memcached** requests because the new value remains in the memory cache, even if it is not yet committed on the MySQL side.

##### Transaction Isolation

When a **memcached** operation such as `get` or `incr` causes a query or DML operation on the underlying `InnoDB` table, you can control whether the operation sees the very latest data written to the table, only data that has been committed, or other variations of transaction isolation level. Use the `innodb_api_trx_level` configuration option to control this feature. The numeric values specified for this option correspond to isolation levels such as `REPEATABLE READ`. See the description of the `innodb_api_trx_level` option for information about other settings.

A strict isolation level ensures that data you retrieve is not rolled back or changed suddenly causing subsequent queries to return different values. However, strict isolation levels require greater locking overhead, which can cause waits. For a NoSQL-style application that does not use long-running transactions, you can typically use the default isolation level or switch to a less strict isolation level.

##### Disabling Row Locks for memcached DML Operations

The `innodb_api_disable_rowlock` option can be used to disable row locks when **memcached** requests through the `daemon_memcached` plugin cause DML operations. By default, `innodb_api_disable_rowlock` is set to `OFF` which means that **memcached** requests row locks for `get` and `set` operations. When `innodb_api_disable_rowlock` is set to `ON`, **memcached** requests a table lock instead of row locks.

The `innodb_api_disable_rowlock` option is not dynamic. It must be specified at startup on the `mysqld` command line or entered in a MySQL configuration file.

##### Allowing or Disallowing DDL

By default, you can perform DDL operations such as `ALTER TABLE` on tables used by the `daemon_memcached` plugin. To avoid potential slowdowns when these tables are used for high-throughput applications, disable DDL operations on these tables by enabling `innodb_api_enable_mdl` at startup. This option is less appropriate when accessing the same tables through both **memcached** and SQL, because it blocks `CREATE INDEX` statements on the tables, which could be important for running reporting queries.

##### Storing Data on Disk, in Memory, or Both

The `innodb_memcache.cache_policies` table specifies whether to store data written through the **memcached** interface to disk (`innodb_only`, the default); in memory only, as with traditional **memcached** (`cache_only`); or both (`caching`).

With the `caching` setting, if **memcached** cannot find a key in memory, it searches for the value in an `InnoDB` table. Values returned from `get` calls under the `caching` setting could be out-of-date if the values were updated on disk in the `InnoDB` table but are not yet expired from the memory cache.

The caching policy can be set independently for `get`, `set` (including `incr` and `decr`), `delete`, and `flush` operations.

For example, you might allow `get` and `set` operations to query or update a table and the **memcached** memory cache at the same time (using the `caching` setting), while making `delete`, `flush`, or both operate only on the in-memory copy (using the `cache_only` setting). That way, deleting or flushing an item only expires the item from the cache, and the latest value is returned from the `InnoDB` table the next time the item is requested.

```sql
mysql> SELECT * FROM innodb_memcache.cache_policies;
+--------------+-------------+-------------+---------------+--------------+
| policy_name  | get_policy  | set_policy  | delete_policy | flush_policy |
+--------------+-------------+-------------+---------------+--------------+
| cache_policy | innodb_only | innodb_only | innodb_only   | innodb_only  |
+--------------+-------------+-------------+---------------+--------------+

mysql> UPDATE innodb_memcache.cache_policies SET set_policy = 'caching'
       WHERE policy_name = 'cache_policy';
```

`innodb_memcache.cache_policies` values are only read at startup. After changing values in this table, uninstall and reinstall the `daemon_memcached` plugin to ensure that changes take effect.

```sql
mysql> UNINSTALL PLUGIN daemon_memcached;

mysql> INSTALL PLUGIN daemon_memcached soname "libmemcached.so";
```


#### 14.21.5.5 Adapting DML Statements to memcached Operations

Benchmarks suggest that the `daemon_memcached` plugin speeds up DML operations (inserts, updates, and deletes) more than it speeds up queries. Therefore, consider focussing initial development efforts on write-intensive applications that are I/O-bound, and look for opportunities to use MySQL with the `daemon_memcached` plugin for new write-intensive applications.

Single-row DML statements are the easiest types of statements to turn into `memcached` operations. `INSERT` becomes `add`, `UPDATE` becomes `set`, `incr` or `decr`, and `DELETE` becomes `delete`. These operations are guaranteed to only affect one row when issued through the **memcached** interface, because the *`key`* is unique within the table.

In the following SQL examples, `t1` refers to the table used for **memcached** operations, based on the configuration in the `innodb_memcache.containers` table. `key` refers to the column listed under `key_columns`, and `val` refers to the column listed under `value_columns`.

```sql
INSERT INTO t1 (key,val) VALUES (some_key,some_value);
SELECT val FROM t1 WHERE key = some_key;
UPDATE t1 SET val = new_value WHERE key = some_key;
UPDATE t1 SET val = val + x WHERE key = some_key;
DELETE FROM t1 WHERE key = some_key;
```

The following `TRUNCATE TABLE` and `DELETE` statements, which remove all rows from the table, correspond to the `flush_all` operation, where `t1` is configured as the table for **memcached** operations, as in the previous example.

```sql
TRUNCATE TABLE t1;
DELETE FROM t1;
```


#### 14.21.5.6 Performing DML and DDL Statements on the Underlying InnoDB Table

You can access the underlying `InnoDB` table (which is `test.demo_test` by default) through standard SQL interfaces. However, there are some restrictions:

* When querying a table that is also accessed through the **memcached** interface, remember that **memcached** operations can be configured to be committed periodically rather than after every write operation. This behavior is controlled by the `daemon_memcached_w_batch_size` option. If this option is set to a value greater than `1`, use `READ UNCOMMITTED` queries to find rows that were just inserted.

  ```sql
  mysql> SET SESSSION TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

  mysql> SELECT * FROM demo_test;
  +------+------+------+------+-----------+------+------+------+------+------+------+
  | cx   | cy   | c1   | cz   | c2        | ca   | CB   | c3   | cu   | c4   | C5   |
  +------+------+------+------+-----------+------+------+------+------+------+------+
  | NULL | NULL | a11  | NULL | 123456789 | NULL | NULL |   10 | NULL |    3 | NULL |
  +------+------+------+------+-----------+------+------+------+------+------+------+
  ```

* When modifying a table using SQL that is also accessed through the **memcached** interface, you can configure **memcached** operations to start a new transaction periodically rather than for every read operation. This behavior is controlled by the `daemon_memcached_r_batch_size` option. If this option is set to a value greater than `1`, changes made to the table using SQL are not immediately visible to **memcached** operations.

* The `InnoDB` table is either IS (intention shared) or IX (intention exclusive) locked for all operations in a transaction. If you increase `daemon_memcached_r_batch_size` and `daemon_memcached_w_batch_size` substantially from their default value of `1`, the table is most likely locked between each operation, preventing DDL statements on the table.


### 14.21.6 The InnoDB memcached Plugin and Replication

Because the `daemon_memcached` plugin supports the MySQL binary log, updates made on a source server through the **memcached** interface can be replicated for backup, balancing intensive read workloads, and high availability. All **memcached** commands are supported with binary logging.

You do not need to set up the `daemon_memcached` plugin on replica servers. The primary advantage of this configuration is increased write throughput on the source. The speed of the replication mechanism is not affected.

The following sections show how to use the binary log capability when using the `daemon_memcached` plugin with MySQL replication. It is assumed that you have completed the setup described in Section 14.21.3, “Setting Up the InnoDB memcached Plugin”.

#### Enabling the InnoDB memcached Binary Log

1. To use the `daemon_memcached` plugin with the MySQL binary log, enable the `innodb_api_enable_binlog` configuration option on the source server. This option can only be set at server startup. You must also enable the MySQL binary log on the source server using the `--log-bin` option. You can add these options to the MySQL configuration file, or on the `mysqld` command line.

   ```sql
   mysqld ... --log-bin -–innodb_api_enable_binlog=1
   ```

2. Configure the source and replica server, as described in Section 16.1.2, “Setting Up Binary Log File Position Based Replication”.

3. Use **mysqldump** to create a source data snapshot, and sync the snapshot to the replica server.

   ```sql
   source $> mysqldump --all-databases --lock-all-tables > dbdump.db
   replica $> mysql < dbdump.db
   ```

4. On the source server, issue `SHOW MASTER STATUS` to obtain the source binary log coordinates.

   ```sql
   mysql> SHOW MASTER STATUS;
   ```

5. On the replica server, use a `CHANGE MASTER TO` statement to set up a replica server using the source binary log coordinates.

   ```sql
   mysql> CHANGE MASTER TO
          MASTER_HOST='localhost',
          MASTER_USER='root',
          MASTER_PASSWORD='',
          MASTER_PORT = 13000,
          MASTER_LOG_FILE='0.000001,
          MASTER_LOG_POS=114;
   ```

6. Start the replica.

   ```sql
   mysql> START SLAVE;
   ```

   If the error log prints output similar to the following, the replica is ready for replication.

   ```sql
   2013-09-24T13:04:38.639684Z 49 [Note] Slave I/O thread: connected to
   master 'root@localhost:13000', replication started in log '0.000001'
   at position 114
   ```

#### Testing the InnoDB memcached Replication Configuration

This example demonstrates how to test the `InnoDB` **memcached** replication configuration using the **memcached** and telnet to insert, update, and delete data. A MySQL client is used to verify results on the source and replica servers.

The example uses the `demo_test` table, which was created by the `innodb_memcached_config.sql` configuration script during the initial setup of the `daemon_memcached` plugin. The `demo_test` table contains a single example record.

1. Use the `set` command to insert a record with a key of `test1`, a flag value of `10`, an expiration value of `0`, a cas value of 1, and a value of `t1`.

   ```sql
   telnet 127.0.0.1 11211
   Trying 127.0.0.1...
   Connected to 127.0.0.1.
   Escape character is '^]'.
   set test1 10 0 1
   t1
   STORED
   ```

2. On the source server, check that the record was inserted into the `demo_test` table. Assuming the `demo_test` table was not previously modified, there should be two records. The example record with a key of `AA`, and the record you just inserted, with a key of `test1`. The `c1` column maps to the key, the `c2` column to the value, the `c3` column to the flag value, the `c4` column to the cas value, and the `c5` column to the expiration time. The expiration time was set to 0, since it is unused.

   ```sql
   mysql> SELECT * FROM test.demo_test;
   +-------+--------------+------+------+------+
   | c1    | c2           | c3   | c4   | c5   |
   +-------+--------------+------+------+------+
   | AA    | HELLO, HELLO |    8 |    0 |    0 |
   | test1 | t1           |   10 |    1 |    0 |
   +-------+--------------+------+------+------+
   ```

3. Check to verify that the same record was replicated to the replica server.

   ```sql
   mysql> SELECT * FROM test.demo_test;
   +-------+--------------+------+------+------+
   | c1    | c2           | c3   | c4   | c5   |
   +-------+--------------+------+------+------+
   | AA    | HELLO, HELLO |    8 |    0 |    0 |
   | test1 | t1           |   10 |    1 |    0 |
   +-------+--------------+------+------+------+
   ```

4. Use the `set` command to update the key to a value of `new`.

   ```sql
   telnet 127.0.0.1 11211
   Trying 127.0.0.1...
   Connected to 127.0.0.1.
   Escape character is '^]'.
   set test1 10 0 2
   new
   STORED
   ```

   The update is replicated to the replica server (notice that the `cas` value is also updated).

   ```sql
   mysql> SELECT * FROM test.demo_test;
   +-------+--------------+------+------+------+
   | c1    | c2           | c3   | c4   | c5   |
   +-------+--------------+------+------+------+
   | AA    | HELLO, HELLO |    8 |    0 |    0 |
   | test1 | new          |   10 |    2 |    0 |
   +-------+--------------+------+------+------+
   ```

5. Delete the `test1` record using a `delete` command.

   ```sql
   telnet 127.0.0.1 11211
   Trying 127.0.0.1...
   Connected to 127.0.0.1.
   Escape character is '^]'.
   delete test1
   DELETED
   ```

   When the `delete` operation is replicated to the replica, the `test1` record on the replica is also deleted.

   ```sql
   mysql> SELECT * FROM test.demo_test;
   +----+--------------+------+------+------+
   | c1 | c2           | c3   | c4   | c5   |
   +----+--------------+------+------+------+
   | AA | HELLO, HELLO |    8 |    0 |    0 |
   +----+--------------+------+------+------+
   ```

6. Remove all rows from the table using the `flush_all` command.

   ```sql
   telnet 127.0.0.1 11211
   Trying 127.0.0.1...
   Connected to 127.0.0.1.
   Escape character is '^]'.
   flush_all
   OK
   ```

   ```sql
   mysql> SELECT * FROM test.demo_test;
   Empty set (0.00 sec)
   ```

7. Telnet to the source server and enter two new records.

   ```sql
   telnet 127.0.0.1 11211
   Trying 127.0.0.1...
   Connected to 127.0.0.1.
   Escape character is '^]'
   set test2 10 0 4
   again
   STORED
   set test3 10 0 5
   again1
   STORED
   ```

8. Confirm that the two records were replicated to the replica server.

   ```sql
   mysql> SELECT * FROM test.demo_test;
   +-------+--------------+------+------+------+
   | c1    | c2           | c3   | c4   | c5   |
   +-------+--------------+------+------+------+
   | test2 | again        |   10 |    4 |    0 |
   | test3 | again1       |   10 |    5 |    0 |
   +-------+--------------+------+------+------+
   ```

9. Remove all rows from the table using the `flush_all` command.

   ```sql
   telnet 127.0.0.1 11211
   Trying 127.0.0.1...
   Connected to 127.0.0.1.
   Escape character is '^]'.
   flush_all
   OK
   ```

10. Check to ensure that the `flush_all` operation was replicated on the replica server.

    ```sql
    mysql> SELECT * FROM test.demo_test;
    Empty set (0.00 sec)
    ```

#### InnoDB memcached Binary Log Notes

Binary Log Format:

* Most **memcached** operations are mapped to DML statements (analogous to insert, delete, update). Since there is no actual SQL statement being processed by the MySQL server, all **memcached** commands (except for `flush_all`) use Row-Based Replication (RBR) logging, which is independent of any server `binlog_format` setting.

* The **memcached** `flush_all` command is mapped to the `TRUNCATE TABLE` command. Since DDL commands can only use statement-based logging, the `flush_all` command is replicated by sending a `TRUNCATE TABLE` statement.

Transactions:

* The concept of transactions has not typically been part of **memcached** applications. For performance considerations, `daemon_memcached_r_batch_size` and `daemon_memcached_w_batch_size` are used to control the batch size for read and write transactions. These settings do not affect replication. Each SQL operation on the underlying `InnoDB` table is replicated after successful completion.

* The default value of `daemon_memcached_w_batch_size` is `1`, which means that each **memcached** write operation is committed immediately. This default setting incurs a certain amount of performance overhead to avoid inconsistencies in the data that is visible on the source and replica servers. The replicated records are always available immediately on the replica server. If you set `daemon_memcached_w_batch_size` to a value greater than `1`, records inserted or updated through **memcached** are not immediately visible on the source server; to view the records on the source server before they are committed, issue `SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED`.


### 14.21.7 InnoDB memcached Plugin Internals

#### InnoDB API for the InnoDB memcached Plugin

The `InnoDB` **memcached** engine accesses `InnoDB` through `InnoDB` APIs, most of which are directly adopted from embedded `InnoDB`. `InnoDB` API functions are passed to the `InnoDB` **memcached** engine as callback functions. `InnoDB` API functions access the `InnoDB` tables directly, and are mostly DML operations with the exception of `TRUNCATE TABLE`.

**memcached** commands are implemented through the `InnoDB` **memcached** API. The following table outlines how **memcached** commands are mapped to DML or DDL operations.

**Table 14.21 memcached Commands and Associated DML or DDL Operations**

<table frame="all" summary="memcached commands and associated DML or DDL operations."><col style="width: 25%"/><col style="width: 75%"/><thead><tr> <th>memcached Command</th> <th>DML or DDL Operations</th> </tr></thead><tbody><tr> <td><code>get</code></td> <td>a read/fetch command</td> </tr><tr> <td><code>set</code></td> <td>a search followed by an <code>INSERT</code> or <code>UPDATE</code> (depending on whether or not a key exists)</td> </tr><tr> <td><code>add</code></td> <td>a search followed by an <code>INSERT</code> or <code>UPDATE</code></td> </tr><tr> <td><code>replace</code></td> <td>a search followed by an <code>UPDATE</code></td> </tr><tr> <td><code>append</code></td> <td>a search followed by an <code>UPDATE</code> (appends data to the result before <code>UPDATE</code>)</td> </tr><tr> <td><code>prepend</code></td> <td>a search followed by an <code>UPDATE</code> (prepends data to the result before <code>UPDATE</code>)</td> </tr><tr> <td><code>incr</code></td> <td>a search followed by an <code>UPDATE</code></td> </tr><tr> <td><code>decr</code></td> <td>a search followed by an <code>UPDATE</code></td> </tr><tr> <td><code>delete</code></td> <td>a search followed by a <code>DELETE</code></td> </tr><tr> <td><code>flush_all</code></td> <td><code>TRUNCATE TABLE</code> (DDL)</td> </tr></tbody></table>

#### InnoDB memcached Plugin Configuration Tables

This section describes configuration tables used by the `daemon_memcached` plugin. The `cache_policies` table, `config_options` table, and `containers` table are created by the `innodb_memcached_config.sql` configuration script in the `innodb_memcache` database.

```sql
mysql> USE innodb_memcache;
Database changed
mysql> SHOW TABLES;
+---------------------------+
| Tables_in_innodb_memcache |
+---------------------------+
| cache_policies            |
| config_options            |
| containers                |
+---------------------------+
```

#### cache\_policies Table

The `cache_policies` table defines a cache policy for the `InnoDB` `memcached` installation. You can specify individual policies for `get`, `set`, `delete`, and `flush` operations, within a single cache policy. The default setting for all operations is `innodb_only`.

* `innodb_only`: Use `InnoDB` as the data store.

* `cache_only`: Use the **memcached** engine as the data store.

* `caching`: Use both `InnoDB` and the **memcached** engine as data stores. In this case, if **memcached** cannot find a key in memory, it searches for the value in an `InnoDB` table.

* `disable`: Disable caching.

**Table 14.22 cache\_policies Columns**

<table frame="all" summary="Columns of the cache_policies table."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Column</th> <th>Description</th> </tr></thead><tbody><tr> <td><code>policy_name</code></td> <td>Name of the cache policy. The default cache policy name is <code>cache_policy</code>.</td> </tr><tr> <td><code>get_policy</code></td> <td>The cache policy for get operations. Valid values are <code>innodb_only</code>, <code>cache_only</code>, <code>caching</code>, or <code>disabled</code>. The default setting is <code>innodb_only</code>.</td> </tr><tr> <td><code>set_policy</code></td> <td>The cache policy for set operations. Valid values are <code>innodb_only</code>, <code>cache_only</code>, <code>caching</code>, or <code>disabled</code>. The default setting is <code>innodb_only</code>.</td> </tr><tr> <td><code>delete_policy</code></td> <td>The cache policy for delete operations. Valid values are <code>innodb_only</code>, <code>cache_only</code>, <code>caching</code>, or <code>disabled</code>. The default setting is <code>innodb_only</code>.</td> </tr><tr> <td><code>flush_policy</code></td> <td>The cache policy for flush operations. Valid values are <code>innodb_only</code>, <code>cache_only</code>, <code>caching</code>, or <code>disabled</code>. The default setting is <code>innodb_only</code>.</td> </tr></tbody></table>

#### config\_options Table

The `config_options` table stores **memcached**-related settings that can be changed at runtime using SQL. Supported configuration options are `separator` and `table_map_delimiter`.

**Table 14.23 config\_options Columns**

<table frame="all" summary="Columns of the config_options table."><col style="width: 20%"/><col style="width: 80%"/><thead><tr> <th>Column</th> <th>Description</th> </tr></thead><tbody><tr> <td><code>Name</code></td> <td>Name of the <strong>memcached</strong>-related configuration option. The following configuration options are supported by the <code>config_options</code> table: <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <code>separator</code>: Used to separate values of a long string into separate values when there are multiple <code>value_columns</code> defined. By default, the <code>separator</code> is a <code>|</code> character. For example, if you define <code>col1, col2</code> as value columns, and you define <code>|</code> as the separator, you can issue the following <strong>memcached</strong> command to insert values into <code>col1</code> and <code>col2</code>, respectively: </p><pre class="programlisting copytoclipboard language-terminal"><code class="language-terminal">set keyx 10 0 19 valuecolx|valuecoly</code></pre><p> <code>valuecol1x</code> is stored in <code>col1</code> and <code>valuecoly</code> is stored in <code>col2</code>. </p></li><li class="listitem"><p> <code>table_map_delimiter</code>: The character separating the schema name and the table name when you use the <code>@@</code> notation in a key name to access a key in a specific table. For example, <code>@@t1.some_key</code> and <code>@@t2.some_key</code> have the same key value, but are stored in different tables. </p></li></ul> </div> </td> </tr><tr> <td><code>Value</code></td> <td>The value assigned to the <strong>memcached</strong>-related configuration option.</td> </tr></tbody></table>

#### containers Table

The `containers` table is the most important of the three configuration tables. Each `InnoDB` table that is used to store **memcached** values must have an entry in the `containers` table. The entry provides a mapping between `InnoDB` table columns and container table columns, which is required for `memcached` to work with `InnoDB` tables.

The `containers` table contains a default entry for the `test.demo_test` table, which is created by the `innodb_memcached_config.sql` configuration script. To use the `daemon_memcached` plugin with your own `InnoDB` table, you must create an entry in the `containers` table.

**Table 14.24 containers Columns**

<table frame="all" summary="Columns of the containers table."><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Column</th> <th>Description</th> </tr></thead><tbody><tr> <td><code>name</code></td> <td>The name given to the container. If an <code>InnoDB</code> table is not requested by name using <code>@@</code> notation, the <code>daemon_memcached</code> plugin uses the <code>InnoDB</code> table with a <code>containers.name</code> value of <code>default</code>. If there is no such entry, the first entry in the <code>containers</code> table, ordered alphabetically by <code>name</code> (ascending), determines the default <code>InnoDB</code> table.</td> </tr><tr> <td><code>db_schema</code></td> <td>The name of the database where the <code>InnoDB</code> table resides. This is a required value.</td> </tr><tr> <td><code>db_table</code></td> <td>The name of the <code>InnoDB</code> table that stores <strong>memcached</strong> values. This is a required value.</td> </tr><tr> <td><code>key_columns</code></td> <td>The column in the <code>InnoDB</code> table that contains lookup key values for <strong>memcached</strong> operations. This is a required value.</td> </tr><tr> <td><code>value_columns</code></td> <td>The <code>InnoDB</code> table columns (one or more) that store <code>memcached</code> data. Multiple columns can be specified using the separator character specified in the <code>innodb_memcached.config_options</code> table. By default, the separator is a pipe character (“|”). To specify multiple columns, separate them with the defined separator character. For example: <code>col1|col2|col3</code>. This is a required value.</td> </tr><tr> <td><code>flags</code></td> <td>The <code>InnoDB</code> table columns that are used as flags (a user-defined numeric value that is stored and retrieved along with the main value) for <strong>memcached</strong>. A flag value can be used as a column specifier for some operations (such as <code>incr</code>, <code>prepend</code>) if a <strong>memcached</strong> value is mapped to multiple columns, so that an operation is performed on a specified column. For example, if you have mapped a <code>value_columns</code> to three <code>InnoDB</code> table columns, and only want the increment operation performed on one columns, use the <code>flags</code> column to specify the column. If you do not use the <code>flags</code> column, set a value of <code>0</code> to indicate that it is unused.</td> </tr><tr> <td><code>cas_column</code></td> <td>The <code>InnoDB</code> table column that stores compare-and-swap (cas) values. The <code>cas_column</code> value is related to the way <strong>memcached</strong> hashes requests to different servers and caches data in memory. Because the <code>InnoDB</code> <strong>memcached</strong> plugin is tightly integrated with a single <strong>memcached</strong> daemon, and the in-memory caching mechanism is handled by MySQL and the <a class="link" href="glossary.html#glos_buffer_pool" title="buffer pool">InnoDB buffer pool</a>, this column is rarely needed. If you do not use this column, set a value of <code>0</code> to indicate that it is unused.</td> </tr><tr> <td><code>expire_time_column</code></td> <td>The <code>InnoDB</code> table column that stores expiration values. The <code>expire_time_column</code> value is related to the way <strong>memcached</strong> hashes requests to different servers and caches data in memory. Because the <code>InnoDB</code> <strong>memcached</strong> plugin is tightly integrated with a single <strong>memcached</strong> daemon, and the in-memory caching mechanism is handled by MySQL and the <a class="link" href="glossary.html#glos_buffer_pool" title="buffer pool">InnoDB buffer pool</a>, this column is rarely needed. If you do not use this column, set a value of <code>0</code> to indicate that the column is unused. The maximum expire time is defined as <code>INT_MAX32</code> or 2147483647 seconds (approximately 68 years).</td> </tr><tr> <td><code>unique_idx_name_on_key</code></td> <td>The name of the index on the key column. It must be a unique index. It can be the <a class="link" href="glossary.html#glos_primary_key" title="primary key">primary key</a> or a <a class="link" href="glossary.html#glos_secondary_index" title="secondary index">secondary index</a>. Preferably, use the primary key of the <code>InnoDB</code> table. Using the primary key avoids a lookup that is performed when using a secondary index. You cannot make a covering index for <strong>memcached</strong> lookups; <code>InnoDB</code> returns an error if you try to define a composite secondary index over both the key and value columns.</td> </tr></tbody></table>

##### containers Table Column Constraints

* You must supply a value for `db_schema`, `db_name`, `key_columns`, `value_columns` and `unique_idx_name_on_key`. Specify `0` for `flags`, `cas_column`, and `expire_time_column` if they are unused. Failing to do so could cause your setup to fail.

* `key_columns`: The maximum limit for a **memcached** key is 250 characters, which is enforced by **memcached**. The mapped key must be a non-Null `CHAR` or `VARCHAR` type.

* `value_columns`: Must be mapped to a `CHAR`, `VARCHAR`, or `BLOB` column. There is no length restriction and the value can be NULL.

* `cas_column`: The `cas` value is a 64 bit integer. It must be mapped to a `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") of at least 8 bytes. If you do not use this column, set a value of `0` to indicate that it is unused.

* `expiration_time_column`: Must mapped to an `INTEGER` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") of at least 4 bytes. Expiration time is defined as a 32-bit integer for Unix time (the number of seconds since January 1, 1970, as a 32-bit value), or the number of seconds starting from the current time. For the latter, the number of seconds may not exceed 60\*60\*24\*30 (the number of seconds in 30 days). If the number sent by a client is larger, the server considers it to be a real Unix time value rather than an offset from the current time. If you do not use this column, set a value of `0` to indicate that it is unused.

* `flags`: Must be mapped to an `INTEGER` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") of at least 32-bits and can be NULL. If you do not use this column, set a value of `0` to indicate that it is unused.

A pre-check is performed at plugin load time to enforce column constraints. If mismatches are found, the plugin is not loaded.

##### Multiple Value Column Mapping

* During plugin initialization, when `InnoDB` **memcached** is configured with information defined in the `containers` table, each mapped column defined in `containers.value_columns` is verified against the mapped `InnoDB` table. If multiple `InnoDB` table columns are mapped, there is a check to ensure that each column exists and is the right type.

* At run-time, for `memcached` insert operations, if there are more delimited values than the number of mapped columns, only the number of mapped values are taken. For example, if there are six mapped columns, and seven delimited values are provided, only the first six delimited values are taken. The seventh delimited value is ignored.

* If there are fewer delimited values than mapped columns, unfilled columns are set to NULL. If an unfilled column cannot be set to NULL, insert operations fail.

* If a table has more columns than mapped values, the extra columns do not affect results.

#### The demo\_test Example Table

The `innodb_memcached_config.sql` configuration script creates a `demo_test` table in the `test` database, which can be used to verify `InnoDB` **memcached** plugin installation immediately after setup.

The `innodb_memcached_config.sql` configuration script also creates an entry for the `demo_test` table in the `innodb_memcache.containers` table.

```sql
mysql> SELECT * FROM innodb_memcache.containers\G
*************************** 1. row ***************************
                  name: aaa
             db_schema: test
              db_table: demo_test
           key_columns: c1
         value_columns: c2
                 flags: c3
            cas_column: c4
    expire_time_column: c5
unique_idx_name_on_key: PRIMARY

mysql> SELECT * FROM test.demo_test;
+----+------------------+------+------+------+
| c1 | c2               | c3   | c4   | c5   |
+----+------------------+------+------+------+
| AA | HELLO, HELLO     |    8 |    0 |    0 |
+----+------------------+------+------+------+
```


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
