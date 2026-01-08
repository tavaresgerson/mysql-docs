#### 13.7.5.15 SHOW ENGINE Statement

```sql
SHOW ENGINE engine_name {STATUS | MUTEX}
```

[`SHOW ENGINE`](show-engine.html "13.7.5.15 SHOW ENGINE Statement") displays operational information about a storage engine. It requires the [`PROCESS`](privileges-provided.html#priv_process) privilege. The statement has these variants:

```sql
SHOW ENGINE INNODB STATUS
SHOW ENGINE INNODB MUTEX
SHOW ENGINE PERFORMANCE_SCHEMA STATUS
```

[`SHOW ENGINE INNODB STATUS`](show-engine.html "13.7.5.15 SHOW ENGINE Statement") displays extensive information from the standard `InnoDB` Monitor about the state of the `InnoDB` storage engine. For information about the standard monitor and other `InnoDB` Monitors that provide information about `InnoDB` processing, see [Section 14.18, “InnoDB Monitors”](innodb-monitors.html "14.18 InnoDB Monitors").

[`SHOW ENGINE INNODB MUTEX`](show-engine.html "13.7.5.15 SHOW ENGINE Statement") displays `InnoDB` [mutex](glossary.html#glos_mutex "mutex") and [rw-lock](glossary.html#glos_rw_lock "rw-lock") statistics.

Note

`InnoDB` mutexes and rwlocks can also be monitored using [Performance Schema](performance-schema.html "Chapter 25 MySQL Performance Schema") tables. See [Section 14.17.2, “Monitoring InnoDB Mutex Waits Using Performance Schema”](monitor-innodb-mutex-waits-performance-schema.html "14.17.2 Monitoring InnoDB Mutex Waits Using Performance Schema").

[`SHOW ENGINE INNODB MUTEX`](show-engine.html "13.7.5.15 SHOW ENGINE Statement") output was removed in MySQL 5.7.2. It was revised and reintroduced in MySQL 5.7.8.

In MySQL 5.7.8, mutex statistics collection is configured dynamically using the following options:

* To enable the collection of mutex statistics, run:

  ```sql
  SET GLOBAL innodb_monitor_enable='latch';
  ```

* To reset mutex statistics, run:

  ```sql
  SET GLOBAL innodb_monitor_reset='latch';
  ```

* To disable the collection of mutex statistics, run:

  ```sql
  SET GLOBAL innodb_monitor_disable='latch';
  ```

Collection of mutex statistics for [`SHOW ENGINE INNODB MUTEX`](show-engine.html "13.7.5.15 SHOW ENGINE Statement") can also be enabled by setting [`innodb_monitor_enable='all'`](innodb-parameters.html#sysvar_innodb_monitor_enable), or disabled by setting [`innodb_monitor_disable='all'`](innodb-parameters.html#sysvar_innodb_monitor_disable).

[`SHOW ENGINE INNODB MUTEX`](show-engine.html "13.7.5.15 SHOW ENGINE Statement") output has these columns:

* `Type`

  Always `InnoDB`.

* `Name`

  Prior to MySQL 5.7.8, the `Name` field reports the source file where the mutex is implemented, and the line number in the file where the mutex is created. The line number is specific to your version of MySQL. As of MySQL 5.7.8, only the mutex name is reported. File name and line number are still reported for rwlocks.

* `Status`

  The mutex status.

  Prior to MySQL 5.7.8, the `Status` field displays several values if [`WITH_DEBUG`](source-configuration-options.html#option_cmake_with_debug) was defined at MySQL compilation time. If [`WITH_DEBUG`](source-configuration-options.html#option_cmake_with_debug) was not defined, the statement displays only the `os_waits` value. In the latter case (without [`WITH_DEBUG`](source-configuration-options.html#option_cmake_with_debug)), the information on which the output is based is insufficient to distinguish regular mutexes and mutexes that protect rwlocks (which permit multiple readers or a single writer). Consequently, the output may appear to contain multiple rows for the same mutex. Pre-MySQL 5.7.8 `Status` field values include:

  + `count` indicates how many times the mutex was requested.

  + `spin_waits` indicates how many times the spinlock had to run.

  + `spin_rounds` indicates the number of spinlock rounds. (`spin_rounds` divided by `spin_waits` provides the average round count.)

  + `os_waits` indicates the number of operating system waits. This occurs when the spinlock did not work (the mutex was not locked during the spinlock and it was necessary to yield to the operating system and wait).

  + `os_yields` indicates the number of times a thread trying to lock a mutex gave up its timeslice and yielded to the operating system (on the presumption that permitting other threads to run frees the mutex so that it can be locked).

  + `os_wait_times` indicates the amount of time (in ms) spent in operating system waits. In MySQL 5.7 timing is disabled and this value is always 0.

  As of MySQL 5.7.8, the `Status` field reports the number of spins, waits, and calls. Statistics for low-level operating system mutexes, which are implemented outside of `InnoDB`, are not reported.

  + `spins` indicates the number of spins.
  + `waits` indicates the number of mutex waits.

  + `calls` indicates how many times the mutex was requested.

`SHOW ENGINE INNODB MUTEX` does not list mutexes and rw-locks for each buffer pool block, as the amount of output would be overwhelming on systems with a large buffer pool. `SHOW ENGINE INNODB MUTEX` does, however, print aggregate `BUF_BLOCK_MUTEX` spin, wait, and call values for buffer pool block mutexes and rw-locks. `SHOW ENGINE INNODB MUTEX` also does not list any mutexes or rw-locks that have never been waited on (`os_waits=0`). Thus, `SHOW ENGINE INNODB MUTEX` only displays information about mutexes and rw-locks outside of the buffer pool that have caused at least one OS-level [wait](glossary.html#glos_wait "wait").

Use [`SHOW ENGINE PERFORMANCE_SCHEMA STATUS`](show-engine.html "13.7.5.15 SHOW ENGINE Statement") to inspect the internal operation of the Performance Schema code:

```sql
mysql> SHOW ENGINE PERFORMANCE_SCHEMA STATUS\G
...
*************************** 3. row ***************************
  Type: performance_schema
  Name: events_waits_history.size
Status: 76
*************************** 4. row ***************************
  Type: performance_schema
  Name: events_waits_history.count
Status: 10000
*************************** 5. row ***************************
  Type: performance_schema
  Name: events_waits_history.memory
Status: 760000
...
*************************** 57. row ***************************
  Type: performance_schema
  Name: performance_schema.memory
Status: 26459600
...
```

This statement is intended to help the DBA understand the effects that different Performance Schema options have on memory requirements.

`Name` values consist of two parts, which name an internal buffer and a buffer attribute, respectively. Interpret buffer names as follows:

* An internal buffer that is not exposed as a table is named within parentheses. Examples: `(pfs_cond_class).size`, `(pfs_mutex_class).memory`.

* An internal buffer that is exposed as a table in the `performance_schema` database is named after the table, without parentheses. Examples: `events_waits_history.size`, `mutex_instances.count`.

* A value that applies to the Performance Schema as a whole begins with `performance_schema`. Example: `performance_schema.memory`.

Buffer attributes have these meanings:

* `size` is the size of the internal record used by the implementation, such as the size of a row in a table. `size` values cannot be changed.

* `count` is the number of internal records, such as the number of rows in a table. `count` values can be changed using Performance Schema configuration options.

* For a table, `tbl_name.memory` is the product of `size` and `count`. For the Performance Schema as a whole, `performance_schema.memory` is the sum of all the memory used (the sum of all other `memory` values).

In some cases, there is a direct relationship between a Performance Schema configuration parameter and a `SHOW ENGINE` value. For example, `events_waits_history_long.count` corresponds to [`performance_schema_events_waits_history_long_size`](performance-schema-system-variables.html#sysvar_performance_schema_events_waits_history_long_size). In other cases, the relationship is more complex. For example, `events_waits_history.count` corresponds to [`performance_schema_events_waits_history_size`](performance-schema-system-variables.html#sysvar_performance_schema_events_waits_history_size) (the number of rows per thread) multiplied by [`performance_schema_max_thread_instances`](performance-schema-system-variables.html#sysvar_performance_schema_max_thread_instances) ( the number of threads).

**SHOW ENGINE NDB STATUS.** If the server has the [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engine enabled, `SHOW ENGINE NDB STATUS` displays cluster status information such as the number of connected data nodes, the cluster connectstring, and cluster binary log epochs, as well as counts of various Cluster API objects created by the MySQL Server when connected to the cluster. Sample output from this statement is shown here:

```sql
mysql> SHOW ENGINE NDB STATUS;
+------------+-----------------------+--------------------------------------------------+
| Type       | Name                  | Status                                           |
+------------+-----------------------+--------------------------------------------------+
| ndbcluster | connection            | cluster_node_id=7,
  connected_host=198.51.100.103, connected_port=1186, number_of_data_nodes=4,
  number_of_ready_data_nodes=3, connect_count=0                                         |
| ndbcluster | NdbTransaction        | created=6, free=0, sizeof=212                    |
| ndbcluster | NdbOperation          | created=8, free=8, sizeof=660                    |
| ndbcluster | NdbIndexScanOperation | created=1, free=1, sizeof=744                    |
| ndbcluster | NdbIndexOperation     | created=0, free=0, sizeof=664                    |
| ndbcluster | NdbRecAttr            | created=1285, free=1285, sizeof=60               |
| ndbcluster | NdbApiSignal          | created=16, free=16, sizeof=136                  |
| ndbcluster | NdbLabel              | created=0, free=0, sizeof=196                    |
| ndbcluster | NdbBranch             | created=0, free=0, sizeof=24                     |
| ndbcluster | NdbSubroutine         | created=0, free=0, sizeof=68                     |
| ndbcluster | NdbCall               | created=0, free=0, sizeof=16                     |
| ndbcluster | NdbBlob               | created=1, free=1, sizeof=264                    |
| ndbcluster | NdbReceiver           | created=4, free=0, sizeof=68                     |
| ndbcluster | binlog                | latest_epoch=155467, latest_trans_epoch=148126,
  latest_received_binlog_epoch=0, latest_handled_binlog_epoch=0,
  latest_applied_binlog_epoch=0                                                         |
+------------+-----------------------+--------------------------------------------------+
```

The `Status` column in each of these rows provides information about the MySQL server's connection to the cluster and about the cluster binary log's status, respectively. The `Status` information is in the form of comma-delimited set of name/value pairs.

The `connection` row's `Status` column contains the name/value pairs described in the following table.

<table summary="Name and value pairs found in the connection row Status column in the output of the SHOW ENGINE NDB STATUS statement."><col style="width: 40%"/><col style="width: 60%"/><thead><tr> <th>Name</th> <th>Value</th> </tr></thead><tbody><tr> <td><code>cluster_node_id</code></td> <td>The node ID of the MySQL server in the cluster</td> </tr><tr> <td><code>connected_host</code></td> <td>The host name or IP address of the cluster management server to which the MySQL server is connected</td> </tr><tr> <td><code>connected_port</code></td> <td>The port used by the MySQL server to connect to the management server (<code>connected_host</code>)</td> </tr><tr> <td><code>number_of_data_nodes</code></td> <td>The number of data nodes configured for the cluster (that is, the number of <code>[ndbd]</code> sections in the cluster <code class="filename">config.ini</code> file)</td> </tr><tr> <td><code>number_of_ready_data_nodes</code></td> <td>The number of data nodes in the cluster that are actually running</td> </tr><tr> <td><code>connect_count</code></td> <td>The number of times this <a class="link" href="mysqld.html" title="4.3.1 mysqld — The MySQL Server"><span class="command"><strong>mysqld</strong></span></a> has connected or reconnected to cluster data nodes</td> </tr></tbody></table>

The `binlog` row's `Status` column contains information relating to NDB Cluster Replication. The name/value pairs it contains are described in the following table.

<table summary="Name and value pairs found in the binlog row Status column in the output of the SHOW ENGINE NDB STATUS statement."><col style="width: 40%"/><col style="width: 60%"/><thead><tr> <th>Name</th> <th>Value</th> </tr></thead><tbody><tr> <td><code>latest_epoch</code></td> <td>The most recent epoch most recently run on this MySQL server (that is, the sequence number of the most recent transaction run on the server)</td> </tr><tr> <td><code>latest_trans_epoch</code></td> <td>The most recent epoch processed by the cluster's data nodes</td> </tr><tr> <td><code>latest_received_binlog_epoch</code></td> <td>The most recent epoch received by the binary log thread</td> </tr><tr> <td><code>latest_handled_binlog_epoch</code></td> <td>The most recent epoch processed by the binary log thread (for writing to the binary log)</td> </tr><tr> <td><code>latest_applied_binlog_epoch</code></td> <td>The most recent epoch actually written to the binary log</td> </tr></tbody></table>

See [Section 21.7, “NDB Cluster Replication”](mysql-cluster-replication.html "21.7 NDB Cluster Replication"), for more information.

The remaining rows from the output of `SHOW ENGINE NDB STATUS` which are most likely to prove useful in monitoring the cluster are listed here by `Name`:

* `NdbTransaction`: The number and size of `NdbTransaction` objects that have been created. An `NdbTransaction` is created each time a table schema operation (such as [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") or [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement")) is performed on an [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") table.

* `NdbOperation`: The number and size of `NdbOperation` objects that have been created.

* `NdbIndexScanOperation`: The number and size of `NdbIndexScanOperation` objects that have been created.

* `NdbIndexOperation`: The number and size of `NdbIndexOperation` objects that have been created.

* `NdbRecAttr`: The number and size of `NdbRecAttr` objects that have been created. In general, one of these is created each time a data manipulation statement is performed by an SQL node.

* `NdbBlob`: The number and size of `NdbBlob` objects that have been created. An `NdbBlob` is created for each new operation involving a [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") column in an [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") table.

* `NdbReceiver`: The number and size of any `NdbReceiver` object that have been created. The number in the `created` column is the same as the number of data nodes in the cluster to which the MySQL server has connected.

Note

`SHOW ENGINE NDB STATUS` returns an empty result if no operations involving [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") tables have been performed during the current session by the MySQL client accessing the SQL node on which this statement is run.
