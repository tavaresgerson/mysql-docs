#### 15.7.7.17 SHOW ENGINE Statement

```
SHOW ENGINE engine_name {STATUS | MUTEX}
```

`SHOW ENGINE` displays operational information about a storage engine. It requires the `PROCESS` privilege. The statement has these variants:

```
SHOW ENGINE INNODB STATUS
SHOW ENGINE INNODB MUTEX
SHOW ENGINE PERFORMANCE_SCHEMA STATUS
```

`SHOW ENGINE INNODB STATUS` displays extensive information from the standard `InnoDB` Monitor about the state of the `InnoDB` storage engine. For information about the standard monitor and other `InnoDB` Monitors that provide information about `InnoDB` processing, see Section 17.17, “InnoDB Monitors”.

`SHOW ENGINE INNODB MUTEX` displays `InnoDB` mutex and rw-lock statistics.

Note

`InnoDB` mutexes and rwlocks can also be monitored using Performance Schema tables. See Section 17.16.2, “Monitoring InnoDB Mutex Waits Using Performance Schema”.

Mutex statistics collection is configured dynamically using the following options:

* To enable the collection of mutex statistics, run:

  ```
  SET GLOBAL innodb_monitor_enable='latch';
  ```

* To reset mutex statistics, run:

  ```
  SET GLOBAL innodb_monitor_reset='latch';
  ```

* To disable the collection of mutex statistics, run:

  ```
  SET GLOBAL innodb_monitor_disable='latch';
  ```

Collection of mutex statistics for `SHOW ENGINE INNODB MUTEX` can also be enabled by setting `innodb_monitor_enable='all'`, or disabled by setting `innodb_monitor_disable='all'`.

`SHOW ENGINE INNODB MUTEX` output has these columns:

* `Type`

  Always `InnoDB`.

* `Name`

  For mutexes, the `Name` field reports only the mutex name. For rwlocks, the `Name` field reports the source file where the rwlock is implemented, and the line number in the file where the rwlock is created. The line number is specific to your version of MySQL.

* `Status`

  The mutex status. This field reports the number of spins, waits, and calls. Statistics for low-level operating system mutexes, which are implemented outside of `InnoDB`, are not reported.

  + `spins` indicates the number of spins.
  + `waits` indicates the number of mutex waits.

  + `calls` indicates how many times the mutex was requested.

`SHOW ENGINE INNODB MUTEX` does not list mutexes and rw-locks for each buffer pool block, as the amount of output would be overwhelming on systems with a large buffer pool. `SHOW ENGINE INNODB MUTEX` does, however, print aggregate `BUF_BLOCK_MUTEX` spin, wait, and call values for buffer pool block mutexes and rw-locks. `SHOW ENGINE INNODB MUTEX` also does not list any mutexes or rw-locks that have never been waited on (`os_waits=0`). Thus, `SHOW ENGINE INNODB MUTEX` only displays information about mutexes and rw-locks outside of the buffer pool that have caused at least one OS-level wait.

Use `SHOW ENGINE PERFORMANCE_SCHEMA STATUS` to inspect the internal operation of the Performance Schema code:

```
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

In some cases, there is a direct relationship between a Performance Schema configuration parameter and a `SHOW ENGINE` value. For example, `events_waits_history_long.count` corresponds to `performance_schema_events_waits_history_long_size`. In other cases, the relationship is more complex. For example, `events_waits_history.count` corresponds to `performance_schema_events_waits_history_size` (the number of rows per thread) multiplied by `performance_schema_max_thread_instances` (the number of threads).

**SHOW ENGINE NDB STATUS.** If the server has the `NDB` storage engine enabled, `SHOW ENGINE NDB STATUS` displays cluster status information such as the number of connected data nodes, the cluster connectstring, and cluster binary log epochs, as well as counts of various Cluster API objects created by the MySQL Server when connected to the cluster. Sample output from this statement is shown here:

```
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

The `Status` column in each of these rows provides information about the MySQL server's connection to the cluster and about the cluster binary log's status, respectively. The `Status` information is in the form of comma-delimited set of name-value pairs.

The `connection` row's `Status` column contains the name-value pairs described in the following table.

<table summary="Name and value pairs found in the connection row Status column in the output of the SHOW ENGINE NDB STATUS statement."><col style="width: 40%"/><col style="width: 60%"/><thead><tr> <th>Name</th> <th>Value</th> </tr></thead><tbody><tr> <td><code class="literal">cluster_node_id</code></td> <td>The node ID of the MySQL server in the cluster</td> </tr><tr> <td><code class="literal">connected_host</code></td> <td>The host name or IP address of the cluster management server to which the MySQL server is connected</td> </tr><tr> <td><code class="literal">connected_port</code></td> <td>The port used by the MySQL server to connect to the management server (<code class="literal">connected_host</code>)</td> </tr><tr> <td><code class="literal">number_of_data_nodes</code></td> <td>The number of data nodes configured for the cluster (that is, the number of <code class="literal">[ndbd]</code> sections in the cluster <code>config.ini</code> file)</td> </tr><tr> <td><code class="literal">number_of_ready_data_nodes</code></td> <td>The number of data nodes in the cluster that are actually running</td> </tr><tr> <td><code class="literal">connect_count</code></td> <td>The number of times this <span><strong>mysqld</strong></span> has connected or reconnected to cluster data nodes</td> </tr></tbody></table>

The `binlog` row's `Status` column contains information relating to NDB Cluster Replication. The name-value pairs it contains are described in the following table.

<table summary="Name and value pairs found in the binlog row Status column in the output of the SHOW ENGINE NDB STATUS statement."><col style="width: 40%"/><col style="width: 60%"/><thead><tr> <th>Name</th> <th>Value</th> </tr></thead><tbody><tr> <td><code class="literal">latest_epoch</code></td> <td>The most recent epoch most recently run on this MySQL server (that is, the sequence number of the most recent transaction run on the server)</td> </tr><tr> <td><code class="literal">latest_trans_epoch</code></td> <td>The most recent epoch processed by the cluster's data nodes</td> </tr><tr> <td><code class="literal">latest_received_binlog_epoch</code></td> <td>The most recent epoch received by the binary log thread</td> </tr><tr> <td><code class="literal">latest_handled_binlog_epoch</code></td> <td>The most recent epoch processed by the binary log thread (for writing to the binary log)</td> </tr><tr> <td><code class="literal">latest_applied_binlog_epoch</code></td> <td>The most recent epoch actually written to the binary log</td> </tr></tbody></table>

See Section 25.7, “NDB Cluster Replication”, for more information.

The remaining rows from the output of `SHOW ENGINE NDB STATUS` which are most likely to prove useful in monitoring the cluster are listed here by `Name`:

* `NdbTransaction`: The number and size of `NdbTransaction` objects that have been created. An `NdbTransaction` is created each time a table schema operation (such as `CREATE TABLE` or `ALTER TABLE`) is performed on an `NDB` table.

* `NdbOperation`: The number and size of `NdbOperation` objects that have been created.

* `NdbIndexScanOperation`: The number and size of `NdbIndexScanOperation` objects that have been created.

* `NdbIndexOperation`: The number and size of `NdbIndexOperation` objects that have been created.

* `NdbRecAttr`: The number and size of `NdbRecAttr` objects that have been created. In general, one of these is created each time a data manipulation statement is performed by an SQL node.

* `NdbBlob`: The number and size of `NdbBlob` objects that have been created. An `NdbBlob` is created for each new operation involving a `BLOB` column in an `NDB` table.

* `NdbReceiver`: The number and size of any `NdbReceiver` object that have been created. The number in the `created` column is the same as the number of data nodes in the cluster to which the MySQL server has connected.

Note

`SHOW ENGINE NDB STATUS` returns an empty result if no operations involving `NDB` tables have been performed during the current session by the MySQL client accessing the SQL node on which this statement is run.
