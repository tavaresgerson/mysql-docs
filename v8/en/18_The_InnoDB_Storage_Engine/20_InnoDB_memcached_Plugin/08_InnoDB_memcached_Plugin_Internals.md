### 17.20.8 InnoDB memcached Plugin Internals

#### InnoDB API for the InnoDB memcached Plugin

The `InnoDB` **memcached** engine accesses `InnoDB` through `InnoDB` APIs, most of which are directly adopted from embedded `InnoDB`. `InnoDB` API functions are passed to the `InnoDB` **memcached** engine as callback functions. `InnoDB` API functions access the `InnoDB` tables directly, and are mostly DML operations with the exception of `TRUNCATE TABLE`.

**memcached** commands are implemented through the `InnoDB` **memcached** API. The following table outlines how **memcached** commands are mapped to DML or DDL operations.

**Table 17.27 memcached Commands and Associated DML or DDL Operations**

<table frame="all" summary="memcached commands and associated DML or DDL operations."><thead><tr> <th>memcached Command</th> <th>DML or DDL Operations</th> </tr></thead><tbody><tr> <td><code>get</code></td> <td>a read/fetch command</td> </tr><tr> <td><code>set</code></td> <td>a search followed by an <code>INSERT</code> or <code>UPDATE</code> (depending on whether or not a key exists)</td> </tr><tr> <td><code>add</code></td> <td>a search followed by an <code>INSERT</code> or <code>UPDATE</code></td> </tr><tr> <td><code>replace</code></td> <td>a search followed by an <code>UPDATE</code></td> </tr><tr> <td><code>append</code></td> <td>a search followed by an <code>UPDATE</code> (appends data to the result before <code>UPDATE</code>)</td> </tr><tr> <td><code>prepend</code></td> <td>a search followed by an <code>UPDATE</code> (prepends data to the result before <code>UPDATE</code>)</td> </tr><tr> <td><code>incr</code></td> <td>a search followed by an <code>UPDATE</code></td> </tr><tr> <td><code>decr</code></td> <td>a search followed by an <code>UPDATE</code></td> </tr><tr> <td><code>delete</code></td> <td>a search followed by a <code>DELETE</code></td> </tr><tr> <td><code>flush_all</code></td> <td><code>TRUNCATE TABLE</code> (DDL)</td> </tr></tbody></table>

#### InnoDB memcached Plugin Configuration Tables

This section describes configuration tables used by the `daemon_memcached` plugin. The `cache_policies` table, `config_options` table, and `containers` table are created by the `innodb_memcached_config.sql` configuration script in the `innodb_memcache` database.

```
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

#### cache_policies Table

The `cache_policies` table defines a cache policy for the `InnoDB` `memcached` installation. You can specify individual policies for `get`, `set`, `delete`, and `flush` operations, within a single cache policy. The default setting for all operations is `innodb_only`.

* `innodb_only`: Use `InnoDB` as the data store.

* `cache_only`: Use the **memcached** engine as the data store.

* `caching`: Use both `InnoDB` and the **memcached** engine as data stores. In this case, if **memcached** cannot find a key in memory, it searches for the value in an `InnoDB` table.

* `disable`: Disable caching.

**Table 17.28 cache_policies Columns**

<table frame="all" summary="Columns of the cache_policies table."><thead><tr> <th>Column</th> <th>Description</th> </tr></thead><tbody><tr> <td><code>policy_name</code></td> <td>Name of the cache policy. The default cache policy name is <code>cache_policy</code>.</td> </tr><tr> <td><code>get_policy</code></td> <td>The cache policy for get operations. Valid values are <code>innodb_only</code>, <code>cache_only</code>, <code>caching</code>, or <code>disabled</code>. The default setting is <code>innodb_only</code>.</td> </tr><tr> <td><code>set_policy</code></td> <td>The cache policy for set operations. Valid values are <code>innodb_only</code>, <code>cache_only</code>, <code>caching</code>, or <code>disabled</code>. The default setting is <code>innodb_only</code>.</td> </tr><tr> <td><code>delete_policy</code></td> <td>The cache policy for delete operations. Valid values are <code>innodb_only</code>, <code>cache_only</code>, <code>caching</code>, or <code>disabled</code>. The default setting is <code>innodb_only</code>.</td> </tr><tr> <td><code>flush_policy</code></td> <td>The cache policy for flush operations. Valid values are <code>innodb_only</code>, <code>cache_only</code>, <code>caching</code>, or <code>disabled</code>. The default setting is <code>innodb_only</code>.</td> </tr></tbody></table>

#### config_options Table

The `config_options` table stores **memcached**-related settings that can be changed at runtime using SQL. Supported configuration options are `separator` and `table_map_delimiter`.

**Table 17.29 config_options Columns**

<table frame="all" summary="Columns of the config_options table."><thead><tr> <th>Column</th> <th>Description</th> </tr></thead><tbody><tr> <td><code>Name</code></td> <td>Name of the <span><strong>memcached</strong></span>-related configuration option. The following configuration options are supported by the <code>config_options</code> table: <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <code>separator</code>: Used to separate values of a long string into separate values when there are multiple <code>value_columns</code> defined. By default, the <code>separator</code> is a <code>|</code> character. For example, if you define <code>col1, col2</code> as value columns, and you define <code>|</code> as the separator, you can issue the following <span><strong>memcached</strong></span> command to insert values into <code>col1</code> and <code>col2</code>, respectively: </p><pre class="programlisting copytoclipboard language-terminal"><code class="language-terminal">set keyx 10 0 19 valuecolx|valuecoly</code></pre><p> <code>valuecol1x</code> is stored in <code>col1</code> and <code>valuecoly</code> is stored in <code>col2</code>. </p></li><li class="listitem"><p> <code>table_map_delimiter</code>: The character separating the schema name and the table name when you use the <code>@@</code> notation in a key name to access a key in a specific table. For example, <code>@@t1.some_key</code> and <code>@@t2.some_key</code> have the same key value, but are stored in different tables. </p></li></ul> </div> </td> </tr><tr> <td><code>Value</code></td> <td>The value assigned to the <span><strong>memcached</strong></span>-related configuration option.</td> </tr></tbody></table>

#### containers Table

The `containers` table is the most important of the three configuration tables. Each `InnoDB` table that is used to store **memcached** values must have an entry in the `containers` table. The entry provides a mapping between `InnoDB` table columns and container table columns, which is required for `memcached` to work with `InnoDB` tables.

The `containers` table contains a default entry for the `test.demo_test` table, which is created by the `innodb_memcached_config.sql` configuration script. To use the `daemon_memcached` plugin with your own `InnoDB` table, you must create an entry in the `containers` table.

**Table 17.30 containers Columns**

<table frame="all" summary="Columns of the containers table."><thead><tr> <th>Column</th> <th>Description</th> </tr></thead><tbody><tr> <td><code>name</code></td> <td>The name given to the container. If an <code>InnoDB</code> table is not requested by name using <code>@@</code> notation, the <code>daemon_memcached</code> plugin uses the <code>InnoDB</code> table with a <code>containers.name</code> value of <code>default</code>. If there is no such entry, the first entry in the <code>containers</code> table, ordered alphabetically by <code>name</code> (ascending), determines the default <code>InnoDB</code> table.</td> </tr><tr> <td><code>db_schema</code></td> <td>The name of the database where the <code>InnoDB</code> table resides. This is a required value.</td> </tr><tr> <td><code>db_table</code></td> <td>The name of the <code>InnoDB</code> table that stores <span><strong>memcached</strong></span> values. This is a required value.</td> </tr><tr> <td><code>key_columns</code></td> <td>The column in the <code>InnoDB</code> table that contains lookup key values for <span><strong>memcached</strong></span> operations. This is a required value.</td> </tr><tr> <td><code>value_columns</code></td> <td>The <code>InnoDB</code> table columns (one or more) that store <code>memcached</code> data. Multiple columns can be specified using the separator character specified in the <code>innodb_memcached.config_options</code> table. By default, the separator is a pipe character (<span class="quote">“<span class="quote">|</span>”</span>). To specify multiple columns, separate them with the defined separator character. For example: <code>col1|col2|col3</code>. This is a required value.</td> </tr><tr> <td><code>flags</code></td> <td>The <code>InnoDB</code> table columns that are used as flags (a user-defined numeric value that is stored and retrieved along with the main value) for <span><strong>memcached</strong></span>. A flag value can be used as a column specifier for some operations (such as <code>incr</code>, <code>prepend</code>) if a <span><strong>memcached</strong></span> value is mapped to multiple columns, so that an operation is performed on a specified column. For example, if you have mapped a <code>value_columns</code> to three <code>InnoDB</code> table columns, and only want the increment operation performed on one columns, use the <code>flags</code> column to specify the column. If you do not use the <code>flags</code> column, set a value of <code>0</code> to indicate that it is unused.</td> </tr><tr> <td><code>cas_column</code></td> <td>The <code>InnoDB</code> table column that stores compare-and-swap (cas) values. The <code>cas_column</code> value is related to the way <span><strong>memcached</strong></span> hashes requests to different servers and caches data in memory. Because the <code>InnoDB</code> <span><strong>memcached</strong></span> plugin is tightly integrated with a single <span><strong>memcached</strong></span> daemon, and the in-memory caching mechanism is handled by MySQL and the InnoDB buffer pool, this column is rarely needed. If you do not use this column, set a value of <code>0</code> to indicate that it is unused.</td> </tr><tr> <td><code>expire_time_column</code></td> <td>The <code>InnoDB</code> table column that stores expiration values. The <code>expire_time_column</code> value is related to the way <span><strong>memcached</strong></span> hashes requests to different servers and caches data in memory. Because the <code>InnoDB</code> <span><strong>memcached</strong></span> plugin is tightly integrated with a single <span><strong>memcached</strong></span> daemon, and the in-memory caching mechanism is handled by MySQL and the InnoDB buffer pool, this column is rarely needed. If you do not use this column, set a value of <code>0</code> to indicate that the column is unused. The maximum expire time is defined as <code>INT_MAX32</code> or 2147483647 seconds (approximately 68 years).</td> </tr><tr> <td><code>unique_idx_name_on_key</code></td> <td>The name of the index on the key column. It must be a unique index. It can be the primary key or a secondary index. Preferably, use the primary key of the <code>InnoDB</code> table. Using the primary key avoids a lookup that is performed when using a secondary index. You cannot make a covering index for <span><strong>memcached</strong></span> lookups; <code>InnoDB</code> returns an error if you try to define a composite secondary index over both the key and value columns.</td> </tr></tbody></table>

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

#### The demo_test Example Table

The `innodb_memcached_config.sql` configuration script creates a `demo_test` table in the `test` database, which can be used to verify `InnoDB` **memcached** plugin installation immediately after setup.

The `innodb_memcached_config.sql` configuration script also creates an entry for the `demo_test` table in the `innodb_memcache.containers` table.

```
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
