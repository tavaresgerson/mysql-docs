### 21.7.4 NDB Cluster Replication Schema and Tables

* [ndb\_apply\_status Table](mysql-cluster-replication-schema.html#ndb-replication-ndb-apply-status "ndb_apply_status Table")
* [ndb\_binlog\_index Table](mysql-cluster-replication-schema.html#ndb-replication-ndb-binlog-index "ndb_binlog_index Table")
* [ndb\_replication Table](mysql-cluster-replication-schema.html#ndb-replication-ndb-replication "ndb_replication Table")

Replication in NDB Cluster makes use of a number of dedicated tables in the `mysql` database on each MySQL Server instance acting as an SQL node in both the cluster being replicated and in the replica. This is true regardless of whether the replica is a single server or a cluster.

The `ndb_binlog_index` and `ndb_apply_status` tables are created in the `mysql` database. They should not be explicitly replicated by the user. User intervention is normally not required to create or maintain either of these tables, since both are maintained by the [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") binary log (binlog) injector thread. This keeps the source [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") process updated to changes performed by the [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engine. The [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") binlog injector thread receives events directly from the [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engine. The [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") injector is responsible for capturing all the data events within the cluster, and ensures that all events which change, insert, or delete data are recorded in the `ndb_binlog_index` table. The replica I/O thread transfers the events from the source's binary log to the replica's relay log.

The `ndb_replication` table must be created manually. This table can be updated by the user to perform filtering by database or table. See [ndb\_replication Table](mysql-cluster-replication-schema.html#ndb-replication-ndb-replication "ndb_replication Table"), for more information. `ndb_replication` is also used in NDB Replication conflict detection and resolution for conflict resolution control; see [Conflict Resolution Control](mysql-cluster-replication-conflict-resolution.html#conflict-resolution-control "Conflict Resolution Control").

Even though `ndb_binlog_index` and `ndb_apply_status` are created and maintained automatically, it is advisable to check for the existence and integrity of these tables as an initial step in preparing an NDB Cluster for replication. It is possible to view event data recorded in the binary log by querying the `mysql.ndb_binlog_index` table directly on the source. This can be also be accomplished using the [`SHOW BINLOG EVENTS`](show-binlog-events.html "13.7.5.2 SHOW BINLOG EVENTS Statement") statement on either the source or replica SQL node. (See [Section 13.7.5.2, “SHOW BINLOG EVENTS Statement”](show-binlog-events.html "13.7.5.2 SHOW BINLOG EVENTS Statement").)

You can also obtain useful information from the output of [`SHOW ENGINE NDB STATUS`](show-engine.html "13.7.5.15 SHOW ENGINE Statement").

Note

When performing schema changes on [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") tables, applications should wait until the [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") statement has returned in the MySQL client connection that issued the statement before attempting to use the updated definition of the table.

#### ndb\_apply\_status Table

`ndb_apply_status` is used to keep a record of the operations that have been replicated from the source to the replica. If the `ndb_apply_status` table does not exist on the replica, [**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") re-creates it.

Unlike the case with `ndb_binlog_index`, the data in this table is not specific to any one SQL node in the (replica) cluster, and so `ndb_apply_status` can use the `NDBCLUSTER` storage engine, as shown here:

```sql
CREATE TABLE `ndb_apply_status` (
    `server_id`   INT(10) UNSIGNED NOT NULL,
    `epoch`       BIGINT(20) UNSIGNED NOT NULL,
    `log_name`    VARCHAR(255) CHARACTER SET latin1 COLLATE latin1_bin NOT NULL,
    `start_pos`   BIGINT(20) UNSIGNED NOT NULL,
    `end_pos`     BIGINT(20) UNSIGNED NOT NULL,
    PRIMARY KEY (`server_id`) USING HASH
) ENGINE=NDBCLUSTER   DEFAULT CHARSET=latin1;
```

The `ndb_apply_status` table is populated only on replicas, which means that, on the source, this table never contains any rows; thus, there is no need to allot any [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory) to `ndb_apply_status` there.

Because this table is populated from data originating on the source, it should be allowed to replicate; any replication filtering or binary log filtering rules that inadvertently prevent the replica from updating `ndb_apply_status`, or that prevent the source from writing into the binary log may prevent replication between clusters from operating properly. For more information about potential problems arising from such filtering rules, see [Replication and binary log filtering rules with replication between NDB Clusters](mysql-cluster-replication-issues.html#mysql-cluster-replication-issues-filtering "Replication and binary log filtering rules with replication between NDB Clusters").

`0` in the `epoch` column of this table indicates a transaction originating from a storage engine other than `NDB`.

#### ndb\_binlog\_index Table

NDB Cluster Replication uses the `ndb_binlog_index` table for storing the binary log's indexing data. Since this table is local to each MySQL server and does not participate in clustering, it uses the [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") storage engine. This means that it must be created separately on each [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") participating in the source cluster. (The binary log itself contains updates from all MySQL servers in the cluster.) This table is defined as follows:

```sql
CREATE TABLE `ndb_binlog_index` (
    `Position` BIGINT(20) UNSIGNED NOT NULL,
    `File` VARCHAR(255) NOT NULL,
    `epoch` BIGINT(20) UNSIGNED NOT NULL,
    `inserts` INT(10) UNSIGNED NOT NULL,
    `updates` INT(10) UNSIGNED NOT NULL,
    `deletes` INT(10) UNSIGNED NOT NULL,
    `schemaops` INT(10) UNSIGNED NOT NULL,
    `orig_server_id` INT(10) UNSIGNED NOT NULL,
    `orig_epoch` BIGINT(20) UNSIGNED NOT NULL,
    `gci` INT(10) UNSIGNED NOT NULL,
    `next_position` bigint(20) unsigned NOT NULL,
    `next_file` varchar(255) NOT NULL,
    PRIMARY KEY (`epoch`,`orig_server_id`,`orig_epoch`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
```

Note

Prior to NDB 7.5.2, this table always used the [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") storage engine. If you are upgrading from an earlier release, you can use [**mysql\_upgrade**](mysql-upgrade.html "4.4.7 mysql_upgrade — Check and Upgrade MySQL Tables") with the [`--force`](mysql-upgrade.html#option_mysql_upgrade_force) and [`--upgrade-system-tables`](mysql-upgrade.html#option_mysql_upgrade_upgrade-system-tables) options after starting the server.) The system table upgrade causes an [`ALTER TABLE ... ENGINE=INNODB`](alter-table.html "13.1.8 ALTER TABLE Statement") statement to be executed for this table. Use of the `MyISAM` storage engine for this table continues to be supported for backward compatibility.

`ndb_binlog_index` may require additional disk space after being converted to `InnoDB`. If this becomes an issue, you may be able to conserve space by using an `InnoDB` tablespace for this table, changing its `ROW_FORMAT` to `COMPRESSED`, or both. For more information, see [Section 13.1.19, “CREATE TABLESPACE Statement”](create-tablespace.html "13.1.19 CREATE TABLESPACE Statement"), and [Section 13.1.18, “CREATE TABLE Statement”](create-table.html "13.1.18 CREATE TABLE Statement"), as well as [Section 14.6.3, “Tablespaces”](innodb-tablespace.html "14.6.3 Tablespaces").

The size of the `ndb_binlog_index` table is dependent on the number of epochs per binary log file and the number of binary log files. The number of epochs per binary log file normally depends on the amount of binary log generated per epoch and the size of the binary log file, with smaller epochs resulting in more epochs per file. You should be aware that empty epochs produce inserts to the `ndb_binlog_index` table, even when the [`--ndb-log-empty-epochs`](mysql-cluster-options-variables.html#option_mysqld_ndb-log-empty-epochs) option is `OFF`, meaning that the number of entries per file depends on the length of time that the file is in use; this relationship can be represented by the formula shown here:

```sql
[number of epochs per file] = [time spent per file] / TimeBetweenEpochs
```

A busy NDB Cluster writes to the binary log regularly and presumably rotates binary log files more quickly than a quiet one. This means that a “quiet” NDB Cluster with [`--ndb-log-empty-epochs=ON`](mysql-cluster-options-variables.html#option_mysqld_ndb-log-empty-epochs) can actually have a much higher number of `ndb_binlog_index` rows per file than one with a great deal of activity.

When [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") is started with the [`--ndb-log-orig`](mysql-cluster-options-variables.html#option_mysqld_ndb-log-orig) option, the `orig_server_id` and `orig_epoch` columns store, respectively, the ID of the server on which the event originated and the epoch in which the event took place on the originating server, which is useful in NDB Cluster replication setups employing multiple sources. The [`SELECT`](select.html "13.2.9 SELECT Statement") statement used to find the closest binary log position to the highest applied epoch on the replica in a multi-source setup (see [Section 21.7.10, “NDB Cluster Replication: Bidirectional and Circular Replication”](mysql-cluster-replication-multi-source.html "21.7.10 NDB Cluster Replication: Bidirectional and Circular Replication")) employs these two columns, which are not indexed. This can lead to performance issues when trying to fail over, since the query must perform a table scan, especially when the source has been running with [`--ndb-log-empty-epochs=ON`](mysql-cluster-options-variables.html#option_mysqld_ndb-log-empty-epochs). You can improve multi-source failover times by adding an index to these columns, as shown here:

```sql
ALTER TABLE mysql.ndb_binlog_index
    ADD INDEX orig_lookup USING BTREE (orig_server_id, orig_epoch);
```

Adding this index provides no benefit when replicating from a single source to a single replica, since the query used to get the binary log position in such cases makes no use of `orig_server_id` or `orig_epoch`.

See [Section 21.7.8, “Implementing Failover with NDB Cluster Replication”](mysql-cluster-replication-failover.html "21.7.8 Implementing Failover with NDB Cluster Replication"), for more information about using the `next_position` and `next_file` columns.

The following figure shows the relationship of the NDB Cluster replication source server, its binary log injector thread, and the `mysql.ndb_binlog_index` table.

**Figure 21.16 The Replication Source Cluster**

![Most concepts are described in the surrounding text. This complex image has three main areas. The top left area is divided into three sections: MySQL Server (mysqld), NDBCLUSTER table handler, and mutex. A connection thread connects these, and receiver and injector threads connect the NDBCLUSTER table handler and mutex. The bottom area shows four data nodes (ndbd). They all produce events represented by arrows pointing to the receiver thread, and the receiver thread also points to the connection and injector threads. One node sends and receives to the mutex area. The arrow representing the injector thread points to a binary log as well as the ndb_binlog_index table, which is described in the surrounding text.](images/cluster-replication-binlog-injector.png)

#### ndb\_replication Table

The `ndb_replication` table is used to control binary logging and conflict resolution, and acts on a per-table basis. Each row in this table corresponds to a table being replicated, determines how to log changes to the table and, if a conflict resolution function is specified, and determines how to resolve conflicts for that table.

Unlike the `ndb_apply_status` and `ndb_replication` tables, the `ndb_replication` table must be created manually, using the SQL statement shown here:

```sql
CREATE TABLE mysql.ndb_replication  (
    db VARBINARY(63),
    table_name VARBINARY(63),
    server_id INT UNSIGNED,
    binlog_type INT UNSIGNED,
    conflict_fn VARBINARY(128),
    PRIMARY KEY USING HASH (db, table_name, server_id)
)   ENGINE=NDB
PARTITION BY KEY(db,table_name);
```

The columns of this table are listed here, with descriptions:

* `db` column

  The name of the database containing the table to be replicated.

  You may employ either or both of the wildcards `_` and `%` as part of the database name. (See [Matching with wildcards](mysql-cluster-replication-schema.html#ndb-replication-wildcards "Matching with wildcards"), later in this section.)

* `table_name` column

  The name of the table to be replicated.

  The table name may include either or both of the wildcards `_` and `%`. See [Matching with wildcards](mysql-cluster-replication-schema.html#ndb-replication-wildcards "Matching with wildcards"), later in this section.

* `server_id` column

  The unique server ID of the MySQL instance (SQL node) where the table resides.

  `0` in this column acts like a wildcard equivalent to `%`, and matches any server ID. (See [Matching with wildcards](mysql-cluster-replication-schema.html#ndb-replication-wildcards "Matching with wildcards"), later in this section.)

* `binlog_type` column

  The type of binary logging to be employed. See text for values and descriptions.

* `conflict_fn` column

  The conflict resolution function to be applied; one of [NDB$OLD()](mysql-cluster-replication-conflict-resolution.html#mysql-cluster-replication-ndb-old "NDB$OLD()"), [NDB$MAX()](mysql-cluster-replication-conflict-resolution.html#mysql-cluster-replication-ndb-max "NDB$MAX()"), [NDB$MAX\_DELETE\_WIN()](mysql-cluster-replication-conflict-resolution.html#mysql-cluster-replication-ndb-max-delete-win "NDB$MAX_DELETE_WIN()"), [NDB$EPOCH()](mysql-cluster-replication-conflict-resolution.html#mysql-cluster-replication-ndb-epoch "NDB$EPOCH()"), [NDB$EPOCH\_TRANS()](mysql-cluster-replication-conflict-resolution.html#mysql-cluster-replication-ndb-epoch-trans "NDB$EPOCH_TRANS()"), [NDB$EPOCH2()](mysql-cluster-replication-conflict-resolution.html#mysql-cluster-replication-ndb-epoch2 "NDB$EPOCH2()"), [NDB$EPOCH2\_TRANS()](mysql-cluster-replication-conflict-resolution.html#mysql-cluster-replication-ndb-epoch2-trans "NDB$EPOCH2_TRANS()"); `NULL` indicates that conflict resolution is not used for this table.

  See [Conflict Resolution Functions](mysql-cluster-replication-conflict-resolution.html#conflict-resolution-functions "Conflict Resolution Functions"), for more information about these functions and their uses in NDB Replication conflict resolution.

  Some conflict resolution functions (`NDB$OLD()`, `NDB$EPOCH()`, `NDB$EPOCH_TRANS()`) require the use of one or more user-created exceptions tables. See [Conflict Resolution Exceptions Table](mysql-cluster-replication-conflict-resolution.html#conflict-resolution-exceptions-table "Conflict Resolution Exceptions Table").

To enable conflict resolution with NDB Replication, it is necessary to create and populate this table with control information on the SQL node or nodes on which the conflict should be resolved. Depending on the conflict resolution type and method to be employed, this may be the source, the replica, or both servers. In a simple source-replica setup where data can also be changed locally on the replica this is typically the replica. In a more complex replication scheme, such as bidirectional replication, this is usually all of the sources involved. See [Section 21.7.11, “NDB Cluster Replication Conflict Resolution”](mysql-cluster-replication-conflict-resolution.html "21.7.11 NDB Cluster Replication Conflict Resolution"), for more information.

The `ndb_replication` table allows table-level control over binary logging outside the scope of conflict resolution, in which case `conflict_fn` is specified as `NULL`, while the remaining column values are used to control binary logging for a given table or set of tables matching a wildcard expression. By setting the proper value for the `binlog_type` column, you can make logging for a given table or tables use a desired binary log format, or disabling binary logging altogether. Possible values for this column, with values and descriptions, are shown in the following table:

**Table 21.64 binlog\_type values, with values and descriptions**

<table><col width="10%"/><col width="55%"/><thead><tr> <th scope="col">Value</th> <th scope="col">Description</th> </tr></thead><tbody><tr> <td>0</td> <td>Use server default</td> </tr><tr> <td>1</td> <td>Do not log this table in the binary log (same effect as <a class="link" href="replication-options-binary-log.html#sysvar_sql_log_bin"><code class="literal">sql_log_bin = 0</code></a>, but applies to one or more specified tables only)</td> </tr><tr> <td>2</td> <td>Log updated attributes only; log these as <code class="literal">WRITE_ROW</code> events</td> </tr><tr> <td>3</td> <td>Log full row, even if not updated (MySQL server default behavior)</td> </tr><tr> <td>6</td> <td>Use updated attributes, even if values are unchanged</td> </tr><tr> <td>7</td> <td>Log full row, even if no values are changed; log updates as <code class="literal">UPDATE_ROW</code> events</td> </tr><tr> <td>8</td> <td>Log update as <code class="literal">UPDATE_ROW</code>; log only primary key columns in before image, and only updated columns in after image (same effect as <a class="link" href="mysql-cluster-options-variables.html#option_mysqld_ndb-log-update-minimal"><code class="option">--ndb-log-update-minimal</code></a>, but applies to one or more specified tables only)</td> </tr><tr> <td>9</td> <td>Log update as <code class="literal">UPDATE_ROW</code>; log only primary key columns in before image, and all columns other than primary key columns in after image</td> </tr></tbody></table>

Note

`binlog_type` values 4 and 5 are not used, and so are omitted from the table just shown, as well as from the next table.

Several `binlog_type` values are equivalent to various combinations of the [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") logging options [`--ndb-log-updated-only`](mysql-cluster-options-variables.html#option_mysqld_ndb-log-updated-only), [`--ndb-log-update-as-write`](mysql-cluster-options-variables.html#option_mysqld_ndb-log-update-as-write), and [`--ndb-log-update-minimal`](mysql-cluster-options-variables.html#option_mysqld_ndb-log-update-minimal), as shown in the following table:

**Table 21.65 binlog\_type values with equivalent combinations of NDB logging options**

<table><col width="10%"/><col width="30%"/><col width="30%"/><col width="30%"/><thead><tr> <th scope="col">Value</th> <th scope="col"><code class="option">--ndb-log-updated-only</code> Value</th> <th scope="col"><code class="option">--ndb-log-update-as-write</code> Value</th> <th scope="col"><code class="option">--ndb-log-update-minimal</code> Value</th> </tr></thead><tbody><tr> <td>0</td> <td>--</td> <td>--</td> <td>--</td> </tr><tr> <td>1</td> <td>--</td> <td>--</td> <td>--</td> </tr><tr> <td>2</td> <td>ON</td> <td>ON</td> <td>OFF</td> </tr><tr> <td>3</td> <td>OFF</td> <td>ON</td> <td>OFF</td> </tr><tr> <td>6</td> <td>ON</td> <td>OFF</td> <td>OFF</td> </tr><tr> <td>7</td> <td>OFF</td> <td>OFF</td> <td>OFF</td> </tr><tr> <td>8</td> <td>ON</td> <td>OFF</td> <td>ON</td> </tr><tr> <td>9</td> <td>OFF</td> <td>OFF</td> <td>ON</td> </tr></tbody></table>

Binary logging can be set to different formats for different tables by inserting rows into the `ndb_replication` table using the appropriate `db`, `table_name`, and `binlog_type` column values. The internal integer value shown in the preceding table should be used when setting the binary logging format. The following two statements set binary logging to logging of full rows ( value 3) for table `test.a`, and to logging of updates only ( value 2) for table `test.b`:

```sql
# Table test.a: Log full rows
INSERT INTO mysql.ndb_replication VALUES("test", "a", 0, 3, NULL);

# Table test.b: log updates only
INSERT INTO mysql.ndb_replication VALUES("test", "b", 0, 2, NULL);
```

To disable logging for one or more tables, use 1 for `binlog_type`, as shown here:

```sql
# Disable binary logging for table test.t1
INSERT INTO mysql.ndb_replication VALUES("test", "t1", 0, 1, NULL);

# Disable binary logging for any table in 'test' whose name begins with 't'
INSERT INTO mysql.ndb_replication VALUES("test", "t%", 0, 1, NULL);
```

Disabling logging for a given table is the equivalent of setting [`sql_log_bin = 0`](replication-options-binary-log.html#sysvar_sql_log_bin), except that it applies to one or more tables individually. If an SQL node is not performing binary logging for a given table, it is not sent the row change events for those tables. This means that it is not receiving all changes and discarding some, but rather it is not subscribing to these changes.

Disabling logging can be useful for a number of reasons, including those listed here:

* Not sending changes across the network generally saves bandwidth, buffering, and CPU resources.

* Not logging changes to tables with very frequent updates but whose value is not great is a good fit for transient data (such as session data) that may be relatively unimportant in the event of a complete failure of the cluster.

* Using a session variable (or `sql_log_bin`) and application code, it is also possible to log (or not to log) certain SQL statements or types of SQL statements; for example, it may be desirable in some cases not to record DDL statements on one or more tables.

* Splitting replication streams into two (or more) binary logs can be done for reasons of performance, a need to replicate different databases to different places, use of different binary logging types for different databases, and so on.

**Matching with wildcards.** In order not to make it necessary to insert a row in the `ndb_replication` table for each and every combination of database, table, and SQL node in your replication setup, `NDB` supports wildcard matching on the this table's `db`, `table_name`, and `server_id` columns. Database and table names used in, respectively, `db` and `table_name` may contain either or both of the following wildcards:

* `_` (underscore character): matches zero or more characters

* `%` (percent sign): matches a single character

(These are the same wildcards as supported by the MySQL [`LIKE`](string-comparison-functions.html#operator_like) operator.)

The `server_id` column supports `0` as a wildcard equivalent to `_` (matches anything). This is used in the examples shown previously.

A given row in the `ndb_replication` table can use wildcards to match any of the database name, table name, and server ID in any combination. Where there are multiple potential matches in the table, the best match is chosen, according to the table shown here, where *W* represents a wildcard match, *E* an exact match, and the greater the value in the *Quality* column, the better the match:

**Table 21.66 Weights of different combinations of wildcard and exact matches on columns in the mysql.ndb\_replication table**

<table><col style="width: 25%"/><col style="width: 25%"/><col style="width: 25%"/><col style="width: 25%"/><thead><tr> <th scope="col"><code class="literal">db</code></th> <th scope="col"><code class="literal">table_name</code></th> <th scope="col"><code class="literal">server_id</code></th> <th scope="col">Quality</th> </tr></thead><tbody><tr> <td>W</td> <td>W</td> <td>W</td> <td>1</td> </tr><tr> <td>W</td> <td>W</td> <td>E</td> <td>2</td> </tr><tr> <td>W</td> <td>E</td> <td>W</td> <td>3</td> </tr><tr> <td>W</td> <td>E</td> <td>E</td> <td>4</td> </tr><tr> <td>E</td> <td>W</td> <td>W</td> <td>5</td> </tr><tr> <td>E</td> <td>W</td> <td>E</td> <td>6</td> </tr><tr> <td>E</td> <td>E</td> <td>W</td> <td>7</td> </tr><tr> <td>E</td> <td>E</td> <td>E</td> <td>8</td> </tr></tbody></table>

Thus, an exact match on database name, table name, and server ID is considered best (strongest), while the weakest (worst) match is a wildcard match on all three columns. Only the strength of the match is considered when choosing which rule to apply; the order in which the rows occur in the table has no effect on this determination.

**Logging Full or Partial Rows.**

There are two basic methods of logging rows, as determined by the setting of the [`--ndb-log-updated-only`](mysql-cluster-options-variables.html#option_mysqld_ndb-log-updated-only) option for [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"):

* Log complete rows (option set to `ON`)
* Log only column data that has been updated—that is, column data whose value has been set, regardless of whether or not this value was actually changed. This is the default behavior (option set to `OFF`).

It is usually sufficient—and more efficient—to log updated columns only; however, if you need to log full rows, you can do so by setting [`--ndb-log-updated-only`](mysql-cluster-options-variables.html#option_mysqld_ndb-log-updated-only) to `0` or `OFF`.

**Logging Changed Data as Updates.**

The setting of the MySQL Server's [`--ndb-log-update-as-write`](mysql-cluster-options-variables.html#option_mysqld_ndb-log-update-as-write) option determines whether logging is performed with or without the “before” image.

Because conflict resolution for updates and delete operations is done in the MySQL Server's update handler, it is necessary to control the logging performed by the replication source such that updates are updates and not writes; that is, such that updates are treated as changes in existing rows rather than the writing of new rows, even though these replace existing rows.

This option is turned on by default; in other words, updates are treated as writes. That is, updates are by default written as `write_row` events in the binary log, rather than as `update_row` events.

To disable the option, start the source [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") with `--ndb-log-update-as-write=0` or `--ndb-log-update-as-write=OFF`. You must do this when replicating from NDB tables to tables using a different storage engine; see [Replication from NDB to other storage engines](mysql-cluster-replication-issues.html#mysql-cluster-replication-ndb-to-non-ndb "Replication from NDB to other storage engines"), and [Replication from NDB to a nontransactional storage engine](mysql-cluster-replication-issues.html#mysql-cluster-replication-ndb-to-nontransactional "Replication from NDB to a nontransactional storage engine"), for more information.
