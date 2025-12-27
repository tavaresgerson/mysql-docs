### 14.21.7 InnoDB memcached Plugin Internals

#### InnoDB API for the InnoDB memcached Plugin

The `InnoDB` **memcached** engine accesses `InnoDB` through `InnoDB` APIs, most of which are directly adopted from embedded `InnoDB`. `InnoDB` API functions are passed to the `InnoDB` **memcached** engine as callback functions. `InnoDB` API functions access the `InnoDB` tables directly, and are mostly DML operations with the exception of `TRUNCATE TABLE`.

**memcached** commands are implemented through the `InnoDB` **memcached** API. The following table outlines how **memcached** commands are mapped to DML or DDL operations.

**Table 14.21 memcached Commands and Associated DML or DDL Operations**

<table frame="all" summary="memcached commands and associated DML or DDL operations."><col style="width: 25%"/><col style="width: 75%"/><thead><tr> <th>memcached Command</th> <th>DML or DDL Operations</th> </tr></thead><tbody><tr> <td><code class="literal">get</code></td> <td>a read/fetch command</td> </tr><tr> <td><code class="literal">set</code></td> <td>a search followed by an <code class="literal">INSERT</code> or <code class="literal">UPDATE</code> (depending on whether or not a key exists)</td> </tr><tr> <td><code class="literal">add</code></td> <td>a search followed by an <code class="literal">INSERT</code> or <code class="literal">UPDATE</code></td> </tr><tr> <td><code class="literal">replace</code></td> <td>a search followed by an <code class="literal">UPDATE</code></td> </tr><tr> <td><code class="literal">append</code></td> <td>a search followed by an <code class="literal">UPDATE</code> (appends data to the result before <code class="literal">UPDATE</code>)</td> </tr><tr> <td><code class="literal">prepend</code></td> <td>a search followed by an <code class="literal">UPDATE</code> (prepends data to the result before <code class="literal">UPDATE</code>)</td> </tr><tr> <td><code class="literal">incr</code></td> <td>a search followed by an <code class="literal">UPDATE</code></td> </tr><tr> <td><code class="literal">decr</code></td> <td>a search followed by an <code class="literal">UPDATE</code></td> </tr><tr> <td><code class="literal">delete</code></td> <td>a search followed by a <code class="literal">DELETE</code></td> </tr><tr> <td><code class="literal">flush_all</code></td> <td><code class="literal">TRUNCATE TABLE</code> (DDL)</td> </tr></tbody></table>

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

<table frame="all" summary="Columns of the cache_policies table."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Column</th> <th>Description</th> </tr></thead><tbody><tr> <td><code class="literal">policy_name</code></td> <td>Name of the cache policy. The default cache policy name is <code class="literal">cache_policy</code>.</td> </tr><tr> <td><code class="literal">get_policy</code></td> <td>The cache policy for get operations. Valid values are <code class="literal">innodb_only</code>, <code class="literal">cache_only</code>, <code class="literal">caching</code>, or <code class="literal">disabled</code>. The default setting is <code class="literal">innodb_only</code>.</td> </tr><tr> <td><code class="literal">set_policy</code></td> <td>The cache policy for set operations. Valid values are <code class="literal">innodb_only</code>, <code class="literal">cache_only</code>, <code class="literal">caching</code>, or <code class="literal">disabled</code>. The default setting is <code class="literal">innodb_only</code>.</td> </tr><tr> <td><code class="literal">delete_policy</code></td> <td>The cache policy for delete operations. Valid values are <code class="literal">innodb_only</code>, <code class="literal">cache_only</code>, <code class="literal">caching</code>, or <code class="literal">disabled</code>. The default setting is <code class="literal">innodb_only</code>.</td> </tr><tr> <td><code class="literal">flush_policy</code></td> <td>The cache policy for flush operations. Valid values are <code class="literal">innodb_only</code>, <code class="literal">cache_only</code>, <code class="literal">caching</code>, or <code class="literal">disabled</code>. The default setting is <code class="literal">innodb_only</code>.</td> </tr></tbody></table>

#### config\_options Table

The `config_options` table stores **memcached**-related settings that can be changed at runtime using SQL. Supported configuration options are `separator` and `table_map_delimiter`.

**Table 14.23 config\_options Columns**

<table frame="all" summary="Columns of the config_options table."><col style="width: 20%"/><col style="width: 80%"/><thead><tr> <th>Column</th> <th>Description</th> </tr></thead><tbody><tr> <td><code class="literal">Name</code></td> <td>Name of the <span class="command"><strong>memcached</strong></span>-related configuration option. The following configuration options are supported by the <code class="literal">config_options</code> table: <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <code class="literal">separator</code>: Used to separate values of a long string into separate values when there are multiple <code class="literal">value_columns</code> defined. By default, the <code class="literal">separator</code> is a <code class="literal">|</code> character. For example, if you define <code class="literal">col1, col2</code> as value columns, and you define <code class="literal">|</code> as the separator, you can issue the following <span class="command"><strong>memcached</strong></span> command to insert values into <code class="literal">col1</code> and <code class="literal">col2</code>, respectively: </p><pre class="programlisting copytoclipboard language-terminal"><code class="language-terminal">set keyx 10 0 19 valuecolx|valuecoly</code></pre><p> <code class="literal">valuecol1x</code> is stored in <code class="literal">col1</code> and <code class="literal">valuecoly</code> is stored in <code class="literal">col2</code>. </p></li><li class="listitem"><p> <code class="literal">table_map_delimiter</code>: The character separating the schema name and the table name when you use the <code class="literal">@@</code> notation in a key name to access a key in a specific table. For example, <code class="literal">@@t1.some_key</code> and <code class="literal">@@t2.some_key</code> have the same key value, but are stored in different tables. </p></li></ul> </div> </td> </tr><tr> <td><code class="literal">Value</code></td> <td>The value assigned to the <span class="command"><strong>memcached</strong></span>-related configuration option.</td> </tr></tbody></table>

#### containers Table

The `containers` table is the most important of the three configuration tables. Each `InnoDB` table that is used to store **memcached** values must have an entry in the `containers` table. The entry provides a mapping between `InnoDB` table columns and container table columns, which is required for `memcached` to work with `InnoDB` tables.

The `containers` table contains a default entry for the `test.demo_test` table, which is created by the `innodb_memcached_config.sql` configuration script. To use the `daemon_memcached` plugin with your own `InnoDB` table, you must create an entry in the `containers` table.

**Table 14.24 containers Columns**

<table frame="all" summary="Columns of the containers table."><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Column</th> <th>Description</th> </tr></thead><tbody><tr> <td><code class="literal">name</code></td> <td>The name given to the container. If an <code class="literal">InnoDB</code> table is not requested by name using <code class="literal">@@</code> notation, the <code class="literal">daemon_memcached</code> plugin uses the <code class="literal">InnoDB</code> table with a <code class="literal">containers.name</code> value of <code class="literal">default</code>. If there is no such entry, the first entry in the <code class="literal">containers</code> table, ordered alphabetically by <code class="literal">name</code> (ascending), determines the default <code class="literal">InnoDB</code> table.</td> </tr><tr> <td><code class="literal">db_schema</code></td> <td>The name of the database where the <code class="literal">InnoDB</code> table resides. This is a required value.</td> </tr><tr> <td><code class="literal">db_table</code></td> <td>The name of the <code class="literal">InnoDB</code> table that stores <span class="command"><strong>memcached</strong></span> values. This is a required value.</td> </tr><tr> <td><code class="literal">key_columns</code></td> <td>The column in the <code class="literal">InnoDB</code> table that contains lookup key values for <span class="command"><strong>memcached</strong></span> operations. This is a required value.</td> </tr><tr> <td><code class="literal">value_columns</code></td> <td>The <code class="literal">InnoDB</code> table columns (one or more) that store <code class="literal">memcached</code> data. Multiple columns can be specified using the separator character specified in the <code class="literal">innodb_memcached.config_options</code> table. By default, the separator is a pipe character (<span class="quote">“<span class="quote">|</span>”</span>). To specify multiple columns, separate them with the defined separator character. For example: <code class="literal">col1|col2|col3</code>. This is a required value.</td> </tr><tr> <td><code class="literal">flags</code></td> <td>The <code class="literal">InnoDB</code> table columns that are used as flags (a user-defined numeric value that is stored and retrieved along with the main value) for <span class="command"><strong>memcached</strong></span>. A flag value can be used as a column specifier for some operations (such as <code class="literal">incr</code>, <code class="literal">prepend</code>) if a <span class="command"><strong>memcached</strong></span> value is mapped to multiple columns, so that an operation is performed on a specified column. For example, if you have mapped a <code class="literal">value_columns</code> to three <code class="literal">InnoDB</code> table columns, and only want the increment operation performed on one columns, use the <code class="literal">flags</code> column to specify the column. If you do not use the <code class="literal">flags</code> column, set a value of <code class="literal">0</code> to indicate that it is unused.</td> </tr><tr> <td><code class="literal">cas_column</code></td> <td>The <code class="literal">InnoDB</code> table column that stores compare-and-swap (cas) values. The <code class="literal">cas_column</code> value is related to the way <span class="command"><strong>memcached</strong></span> hashes requests to different servers and caches data in memory. Because the <code class="literal">InnoDB</code> <span class="command"><strong>memcached</strong></span> plugin is tightly integrated with a single <span class="command"><strong>memcached</strong></span> daemon, and the in-memory caching mechanism is handled by MySQL and the <a class="link" href="glossary.html#glos_buffer_pool" title="buffer pool">InnoDB buffer pool</a>, this column is rarely needed. If you do not use this column, set a value of <code class="literal">0</code> to indicate that it is unused.</td> </tr><tr> <td><code class="literal">expire_time_column</code></td> <td>The <code class="literal">InnoDB</code> table column that stores expiration values. The <code class="literal">expire_time_column</code> value is related to the way <span class="command"><strong>memcached</strong></span> hashes requests to different servers and caches data in memory. Because the <code class="literal">InnoDB</code> <span class="command"><strong>memcached</strong></span> plugin is tightly integrated with a single <span class="command"><strong>memcached</strong></span> daemon, and the in-memory caching mechanism is handled by MySQL and the <a class="link" href="glossary.html#glos_buffer_pool" title="buffer pool">InnoDB buffer pool</a>, this column is rarely needed. If you do not use this column, set a value of <code class="literal">0</code> to indicate that the column is unused. The maximum expire time is defined as <code class="literal">INT_MAX32</code> or 2147483647 seconds (approximately 68 years).</td> </tr><tr> <td><code class="literal">unique_idx_name_on_key</code></td> <td>The name of the index on the key column. It must be a unique index. It can be the <a class="link" href="glossary.html#glos_primary_key" title="primary key">primary key</a> or a <a class="link" href="glossary.html#glos_secondary_index" title="secondary index">secondary index</a>. Preferably, use the primary key of the <code class="literal">InnoDB</code> table. Using the primary key avoids a lookup that is performed when using a secondary index. You cannot make a <a class="link" href="glossary.html#glos_covering_index" title="covering index">covering index</a> for <span class="command"><strong>memcached</strong></span> lookups; <code class="literal">InnoDB</code> returns an error if you try to define a composite secondary index over both the key and value columns.</td> </tr></tbody></table>

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
