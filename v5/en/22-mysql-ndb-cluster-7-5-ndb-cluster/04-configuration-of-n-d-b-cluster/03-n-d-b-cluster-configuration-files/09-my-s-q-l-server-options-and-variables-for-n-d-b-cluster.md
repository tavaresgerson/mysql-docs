#### 21.4.3.9 MySQL Server Options and Variables for NDB Cluster

This section provides information about MySQL server options, server and status variables that are specific to NDB Cluster. For general information on using these, and for other options and variables not specific to NDB Cluster, see [Section 5.1, “The MySQL Server”](mysqld-server.html "5.1 The MySQL Server").

For NDB Cluster configuration parameters used in the cluster configuration file (usually named `config.ini`), see [Section 21.4, “Configuration of NDB Cluster”](mysql-cluster-configuration.html "21.4 Configuration of NDB Cluster").

##### 21.4.3.9.1 MySQL Server Options for NDB Cluster

This section provides descriptions of [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") server options relating to NDB Cluster. For information about [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") options not specific to NDB Cluster, and for general information about the use of options with [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"), see [Section 5.1.6, “Server Command Options”](server-options.html "5.1.6 Server Command Options").

For information about command-line options used with other NDB Cluster processes, see [Section 21.5, “NDB Cluster Programs”](mysql-cluster-programs.html "21.5 NDB Cluster Programs").

* [`--ndbcluster`](mysql-cluster-options-variables.html#option_mysqld_ndbcluster)

  <table frame="box" rules="all" summary="Properties for ndbcluster"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndbcluster[=value]</code></td> </tr><tr><th>Disabled by</th> <td><code class="literal">skip-ndbcluster</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">OFF</code></td> </tr></tbody></table>

  The [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engine is necessary for using NDB Cluster. If a [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") binary includes support for the [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engine, the engine is disabled by default. Use the [`--ndbcluster`](mysql-cluster-options-variables.html#option_mysqld_ndbcluster) option to enable it. Use `--skip-ndbcluster` to explicitly disable the engine.

  It is not necessary or desirable to use this option together with [`--initialize`](server-options.html#option_mysqld_initialize). Beginning with NDB 7.5.4, `--ndbcluster` is ignored (and the `NDB` storage engine is *not* enabled) if `--initialize` is also used. (Bug #81689, Bug
  #23518923)

* `--ndb-allow-copying-alter-table=[ON|OFF]`

  <table frame="box" rules="all" summary="Properties for ndb-allow-copying-alter-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-allow-copying-alter-table[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_allow_copying_alter_table</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">ON</code></td> </tr></tbody></table>

  Let [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") and other DDL statements use copying operations on `NDB` tables. Set to `OFF` to keep this from happening; doing so may improve performance of critical applications.

* `--ndb-batch-size=#`

  <table frame="box" rules="all" summary="Properties for ndb-batch-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-batch-size</code></td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_batch_size</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">32768</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value (≥ 5.7.37-ndb-7.6.22)</th> <td><code class="literal">2147483648</code></td> </tr><tr><th>Maximum Value (≥ 5.7.37-ndb-7.5.26)</th> <td><code class="literal">2147483648</code></td> </tr><tr><th>Maximum Value (≤ 5.7.37-ndb-7.5.25)</th> <td><code class="literal">31536000</code></td> </tr><tr><th>Maximum Value (≤ 5.7.37-ndb-7.6.21)</th> <td><code class="literal">31536000</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">31536000</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>

  This sets the size in bytes that is used for NDB transaction batches.

* `--ndb-cluster-connection-pool=#`

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-cluster-connection-pool</code></td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_cluster_connection_pool</code></td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_cluster_connection_pool</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">1</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">1</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">63</code></td> </tr></tbody></table>

  By setting this option to a value greater than 1 (the default), a [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") process can use multiple connections to the cluster, effectively mimicking several SQL nodes. Each connection requires its own `[api]` or `[mysqld]` section in the cluster configuration (`config.ini`) file, and counts against the maximum number of API connections supported by the cluster.

  Suppose that you have 2 cluster host computers, each running an SQL node whose [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") process was started with `--ndb-cluster-connection-pool=4`; this means that the cluster must have 8 API slots available for these connections (instead of 2). All of these connections are set up when the SQL node connects to the cluster, and are allocated to threads in a round-robin fashion.

  This option is useful only when running [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") on host machines having multiple CPUs, multiple cores, or both. For best results, the value should be smaller than the total number of cores available on the host machine. Setting it to a value greater than this is likely to degrade performance severely.

  Important

  Because each SQL node using connection pooling occupies multiple API node slots—each slot having its own node ID in the cluster—you must *not* use a node ID as part of the cluster connection string when starting any [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") process that employs connection pooling.

  Setting a node ID in the connection string when using the `--ndb-cluster-connection-pool` option causes node ID allocation errors when the SQL node attempts to connect to the cluster.

* `--ndb-cluster-connection-pool-nodeids=list`

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool-nodeids"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-cluster-connection-pool-nodeids</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>System Variable (≥ 5.7.10-ndb-7.5.0)</th> <td><code class="literal">ndb_cluster_connection_pool_nodeids</code></td> </tr><tr><th>Scope (≥ 5.7.10-ndb-7.5.0)</th> <td>Global</td> </tr><tr><th>Dynamic (≥ 5.7.10-ndb-7.5.0)</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code class="literal"></code></td> </tr></tbody></table>

  Specifies a comma-separated list of node IDs for connections to the cluster used by an SQL node. The number of nodes in this list must be the same as the value set for the [`--ndb-cluster-connection-pool`](mysql-cluster-options-variables.html#option_mysqld_ndb-cluster-connection-pool) option.

  `--ndb-cluster-connection-pool-nodeids` was added in NDB 7.5.0.

* `--ndb-blob-read-batch-bytes=bytes`

  <table frame="box" rules="all" summary="Properties for ndb-blob-read-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-blob-read-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_blob_read_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">65536</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">4294967295</code></td> </tr></tbody></table>

  This option can be used to set the size (in bytes) for batching of [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") data reads in NDB Cluster applications. When this batch size is exceeded by the amount of [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") data to be read within the current transaction, any pending [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") read operations are immediately executed.

  The maximum value for this option is 4294967295; the default is 65536. Setting it to 0 has the effect of disabling [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") read batching.

  Note

  In NDB API applications, you can control [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") write batching with the [`setMaxPendingBlobReadBytes()`](/doc/ndbapi/en/ndb-ndbtransaction.html#ndb-ndbtransaction-setmaxpendingblobreadbytes) and [`getMaxPendingBlobReadBytes()`](/doc/ndbapi/en/ndb-ndbtransaction.html#ndb-ndbtransaction-getmaxpendingblobreadbytes) methods.

* `--ndb-blob-write-batch-bytes=bytes`

  <table frame="box" rules="all" summary="Properties for ndb-blob-write-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-blob-write-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_blob_write_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">65536</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>

  This option can be used to set the size (in bytes) for batching of [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") data writes in NDB Cluster applications. When this batch size is exceeded by the amount of [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") data to be written within the current transaction, any pending [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") write operations are immediately executed.

  The maximum value for this option is 4294967295; the default is 65536. Setting it to 0 has the effect of disabling [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") write batching.

  Note

  In NDB API applications, you can control [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") write batching with the [`setMaxPendingBlobWriteBytes()`](/doc/ndbapi/en/ndb-ndbtransaction.html#ndb-ndbtransaction-setmaxpendingblobwritebytes) and [`getMaxPendingBlobWriteBytes()`](/doc/ndbapi/en/ndb-ndbtransaction.html#ndb-ndbtransaction-getmaxpendingblobwritebytes) methods.

* `--ndb-connectstring=connection_string`

  <table frame="box" rules="all" summary="Properties for ndb-connectstring"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-connectstring</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  When using the [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engine, this option specifies the management server that distributes cluster configuration data. See [Section 21.4.3.3, “NDB Cluster Connection Strings”](mysql-cluster-connection-strings.html "21.4.3.3 NDB Cluster Connection Strings"), for syntax.

* `--ndb-default-column-format=[FIXED|DYNAMIC]`

  <table frame="box" rules="all" summary="Properties for ndb-default-column-format"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-default-column-format={FIXED|DYNAMIC}</code></td> </tr><tr><th>Introduced</th> <td>5.7.11-ndb-7.5.1</td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="mysql-cluster-options-variables.html#sysvar_ndb_default_column_format">ndb_default_column_format</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value (≥ 5.7.16-ndb-7.5.4)</th> <td><code class="literal">FIXED</code></td> </tr><tr><th>Default Value (≥ 5.7.11-ndb-7.5.1, ≤ 5.7.13-ndb-7.5.3)</th> <td><code class="literal">DYNAMIC</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">FIXED</code></p><p class="valid-value"><code class="literal">DYNAMIC</code></p></td> </tr></tbody></table>

  In NDB 7.5.1 and later, sets the default `COLUMN_FORMAT` and `ROW_FORMAT` for new tables (see [Section 13.1.18, “CREATE TABLE Statement”](create-table.html "13.1.18 CREATE TABLE Statement")).

  In NDB 7.5.1, the default for this option was `DYNAMIC`; in NDB 7.5.4, the default was changed to `FIXED` to maintain backwards compatibility with older release series (Bug #24487363).

* `--ndb-deferred-constraints=[0|1]`

  <table frame="box" rules="all" summary="Properties for ndb-deferred-constraints"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-deferred-constraints</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="mysql-cluster-options-variables.html#sysvar_ndb_deferred_constraints">ndb_deferred_constraints</a></code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">1</code></td> </tr></tbody></table>

  Controls whether or not constraint checks on unique indexes are deferred until commit time, where such checks are supported. `0` is the default.

  This option is not normally needed for operation of NDB Cluster or NDB Cluster Replication, and is intended primarily for use in testing.

* `--ndb-distribution=[KEYHASH|LINHASH]`

  <table frame="box" rules="all" summary="Properties for ndb-allow-copying-alter-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-allow-copying-alter-table[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_allow_copying_alter_table</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">ON</code></td> </tr></tbody></table>0

  Controls the default distribution method for [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") tables. Can be set to either of `KEYHASH` (key hashing) or `LINHASH` (linear hashing). `KEYHASH` is the default.

* `--ndb-log-apply-status`

  <table frame="box" rules="all" summary="Properties for ndb-allow-copying-alter-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-allow-copying-alter-table[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_allow_copying_alter_table</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">ON</code></td> </tr></tbody></table>1

  Causes a replica [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") to log any updates received from its immediate source to the `mysql.ndb_apply_status` table in its own binary log using its own server ID rather than the server ID of the source. In a circular or chain replication setting, this allows such updates to propagate to the `mysql.ndb_apply_status` tables of any MySQL servers configured as replicas of the current [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server").

  In a chain replication setup, using this option allows downstream (replica) clusters to be aware of their positions relative to all of their upstream contributors (sources).

  In a circular replication setup, this option causes changes to `ndb_apply_status` tables to complete the entire circuit, eventually propagating back to the originating NDB Cluster. This also allows a cluster acting as a source to see when its changes (epochs) have been applied to the other clusters in the circle.

  This option has no effect unless the MySQL server is started with the [`--ndbcluster`](mysql-cluster-options-variables.html#option_mysqld_ndbcluster) option.

* `--ndb-log-empty-epochs=[ON|OFF]`

  <table frame="box" rules="all" summary="Properties for ndb-allow-copying-alter-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-allow-copying-alter-table[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_allow_copying_alter_table</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">ON</code></td> </tr></tbody></table>2

  Causes epochs during which there were no changes to be written to the `ndb_apply_status` and `ndb_binlog_index` tables, even when [`log_slave_updates`](replication-options-binary-log.html#sysvar_log_slave_updates) is enabled.

  By default this option is disabled. Disabling `--ndb-log-empty-epochs` causes epoch transactions with no changes not to be written to the binary log, although a row is still written even for an empty epoch in `ndb_binlog_index`.

  Because `--ndb-log-empty-epochs=1` causes the size of the `ndb_binlog_index` table to increase independently of the size of the binary log, users should be prepared to manage the growth of this table, even if they expect the cluster to be idle a large part of the time.

* `--ndb-log-empty-update=[ON|OFF]`

  <table frame="box" rules="all" summary="Properties for ndb-allow-copying-alter-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-allow-copying-alter-table[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_allow_copying_alter_table</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">ON</code></td> </tr></tbody></table>3

  Causes updates that produced no changes to be written to the `ndb_apply_status` and `ndb_binlog_index` tables, when when [`log_slave_updates`](replication-options-binary-log.html#sysvar_log_slave_updates) is enabled.

  By default this option is disabled (`OFF`). Disabling `--ndb-log-empty-update` causes updates with no changes not to be written to the binary log.

* `--ndb-log-exclusive-reads=[0|1]`

  <table frame="box" rules="all" summary="Properties for ndb-allow-copying-alter-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-allow-copying-alter-table[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_allow_copying_alter_table</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">ON</code></td> </tr></tbody></table>4

  Starting the server with this option causes primary key reads to be logged with exclusive locks, which allows for NDB Cluster Replication conflict detection and resolution based on read conflicts. You can also enable and disable these locks at runtime by setting the value of the [`ndb_log_exclusive_reads`](mysql-cluster-options-variables.html#sysvar_ndb_log_exclusive_reads) system variable to 1 or 0, respectively. 0 (disable locking) is the default.

  For more information, see [Read conflict detection and resolution](mysql-cluster-replication-conflict-resolution.html#conflict-resolution-read-conflicts "Read conflict detection and resolution").

* `--ndb-log-fail-terminate`

  <table frame="box" rules="all" summary="Properties for ndb-allow-copying-alter-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-allow-copying-alter-table[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_allow_copying_alter_table</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">ON</code></td> </tr></tbody></table>5

  When this option is specified, and complete logging of all found row events is not possible, the [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") process is terminated.

* `--ndb-log-orig`

  <table frame="box" rules="all" summary="Properties for ndb-allow-copying-alter-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-allow-copying-alter-table[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_allow_copying_alter_table</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">ON</code></td> </tr></tbody></table>6

  Log the originating server ID and epoch in the `ndb_binlog_index` table.

  Note

  This makes it possible for a given epoch to have multiple rows in `ndb_binlog_index`, one for each originating epoch.

  For more information, see [Section 21.7.4, “NDB Cluster Replication Schema and Tables”](mysql-cluster-replication-schema.html "21.7.4 NDB Cluster Replication Schema and Tables").

* `--ndb-log-transaction-id`

  <table frame="box" rules="all" summary="Properties for ndb-allow-copying-alter-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-allow-copying-alter-table[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_allow_copying_alter_table</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">ON</code></td> </tr></tbody></table>7

  Causes a replica [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") to write the NDB transaction ID in each row of the binary log. Such logging requires the use of the Version 2 event format for the binary log; thus, the [`log_bin_use_v1_row_events`](replication-options-binary-log.html#sysvar_log_bin_use_v1_row_events) system variable must be disabled to use this option.

  `--ndb-log-transaction-id` is required to enable NDB Cluster Replication conflict detection and resolution using the `NDB$EPOCH_TRANS()` function (see [NDB$EPOCH\_TRANS()](mysql-cluster-replication-conflict-resolution.html#mysql-cluster-replication-ndb-epoch-trans "NDB$EPOCH_TRANS()")).

  For more information, see [Section 21.7.11, “NDB Cluster Replication Conflict Resolution”](mysql-cluster-replication-conflict-resolution.html "21.7.11 NDB Cluster Replication Conflict Resolution").

* `--ndb-log-update-as-write`

  <table frame="box" rules="all" summary="Properties for ndb-allow-copying-alter-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-allow-copying-alter-table[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_allow_copying_alter_table</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">ON</code></td> </tr></tbody></table>8

  Whether updates on the source are written to the binary log as updates (`OFF`) or writes (`ON`). When this option is enabled, and both [`--ndb-log-updated-only`](mysql-cluster-options-variables.html#option_mysqld_ndb-log-updated-only) and [`--ndb-log-update-minimal`](mysql-cluster-options-variables.html#option_mysqld_ndb-log-update-minimal) are disabled, operations of different types are loǵged as described in the following list:

  + `INSERT`: Logged as a `WRITE_ROW` event with no before image; the after image is logged with all columns.

    `UPDATE`: Logged as a `WRITE_ROW` event with no before image; the after image is logged with all columns.

    `DELETE`: Logged as a `DELETE_ROW` event with all columns logged in the before image; the after image is not logged.

  This option can be used for NDB Replication conflict resolution in combination with the other two NDB logging options mentioned previously; see [ndb\_replication Table](mysql-cluster-replication-schema.html#ndb-replication-ndb-replication "ndb_replication Table"), for more information.

* `--ndb-log-updated-only`

  <table frame="box" rules="all" summary="Properties for ndb-allow-copying-alter-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-allow-copying-alter-table[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_allow_copying_alter_table</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">ON</code></td> </tr></tbody></table>9

  Whether [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") writes updates only (`ON`) or complete rows (`OFF`) to the binary log. When this option is enabled, and both [`--ndb-log-update-as-write`](mysql-cluster-options-variables.html#option_mysqld_ndb-log-update-as-write) and [`--ndb-log-update-minimal`](mysql-cluster-options-variables.html#option_mysqld_ndb-log-update-minimal) are disabled, operations of different types are loǵged as described in the following list

  + `INSERT`: Logged as a `WRITE_ROW` event with no before image; the after image is logged with all columns.

  + `UPDATE`: Logged as an `UPDATE_ROW` event with primary key columns and updated columns present in both the before and after images.

  + `DELETE`: Logged as a `DELETE_ROW` event with primary key columns incuded in the before image; the after image is not logged.

  This option can be used for NDB Replication conflict resolution in combination with the other two NDB logging options mentioned previously; see [ndb\_replication Table](mysql-cluster-replication-schema.html#ndb-replication-ndb-replication "ndb_replication Table"), for more information about how these options interact with one another.

* `--ndb-log-update-minimal`

  <table frame="box" rules="all" summary="Properties for ndb-batch-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-batch-size</code></td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_batch_size</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">32768</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value (≥ 5.7.37-ndb-7.6.22)</th> <td><code class="literal">2147483648</code></td> </tr><tr><th>Maximum Value (≥ 5.7.37-ndb-7.5.26)</th> <td><code class="literal">2147483648</code></td> </tr><tr><th>Maximum Value (≤ 5.7.37-ndb-7.5.25)</th> <td><code class="literal">31536000</code></td> </tr><tr><th>Maximum Value (≤ 5.7.37-ndb-7.6.21)</th> <td><code class="literal">31536000</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">31536000</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>0

  Log updates in a minimal fashion, by writing only the primary key values in the before image, and only the changed columns in the after image. This may cause compatibility problems if replicating to storage engines other than `NDB`. When this option is enabled, and both [`--ndb-log-updated-only`](mysql-cluster-options-variables.html#option_mysqld_ndb-log-updated-only) and [`--ndb-log-update-as-write`](mysql-cluster-options-variables.html#option_mysqld_ndb-log-update-as-write) are disabled, operations of different types are loǵged as described in the following list:

  + `INSERT`: Logged as a `WRITE_ROW` event with no before image; the after image is logged with all columns.

  + `UPDATE`: Logged as an `UPDATE_ROW` event with primary key columns in the before image; all columns *except* primary key columns are logged in the after image.

  + `DELETE`: Logged as a `DELETE_ROW` event with all columns in the before image; the after image is not logged.

  This option can be used for NDB Replication conflict resolution in combination with the other two NDB logging options mentioned previously; see [ndb\_replication Table](mysql-cluster-replication-schema.html#ndb-replication-ndb-replication "ndb_replication Table"), for more information.

* `--ndb-mgmd-host=host[:port]`

  <table frame="box" rules="all" summary="Properties for ndb-batch-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-batch-size</code></td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_batch_size</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">32768</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value (≥ 5.7.37-ndb-7.6.22)</th> <td><code class="literal">2147483648</code></td> </tr><tr><th>Maximum Value (≥ 5.7.37-ndb-7.5.26)</th> <td><code class="literal">2147483648</code></td> </tr><tr><th>Maximum Value (≤ 5.7.37-ndb-7.5.25)</th> <td><code class="literal">31536000</code></td> </tr><tr><th>Maximum Value (≤ 5.7.37-ndb-7.6.21)</th> <td><code class="literal">31536000</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">31536000</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>1

  Can be used to set the host and port number of a single management server for the program to connect to. If the program requires node IDs or references to multiple management servers (or both) in its connection information, use the [`--ndb-connectstring`](mysql-cluster-options-variables.html#option_mysqld_ndb-connectstring) option instead.

* `--ndb-nodeid=#`

  <table frame="box" rules="all" summary="Properties for ndb-batch-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-batch-size</code></td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_batch_size</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">32768</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value (≥ 5.7.37-ndb-7.6.22)</th> <td><code class="literal">2147483648</code></td> </tr><tr><th>Maximum Value (≥ 5.7.37-ndb-7.5.26)</th> <td><code class="literal">2147483648</code></td> </tr><tr><th>Maximum Value (≤ 5.7.37-ndb-7.5.25)</th> <td><code class="literal">31536000</code></td> </tr><tr><th>Maximum Value (≤ 5.7.37-ndb-7.6.21)</th> <td><code class="literal">31536000</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">31536000</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>2

  Set this MySQL server's node ID in an NDB Cluster.

  The `--ndb-nodeid` option overrides any node ID set with [`--ndb-connectstring`](mysql-cluster-options-variables.html#option_mysqld_ndb-connectstring), regardless of the order in which the two options are used.

  In addition, if `--ndb-nodeid` is used, then either a matching node ID must be found in a `[mysqld]` or `[api]` section of `config.ini`, or there must be an “open” `[mysqld]` or `[api]` section in the file (that is, a section without a `NodeId` or `Id` parameter specified). This is also true if the node ID is specified as part of the connection string.

  Regardless of how the node ID is determined, its is shown as the value of the global status variable `Ndb_cluster_node_id` in the output of [`SHOW STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), and as `cluster_node_id` in the `connection` row of the output of [`SHOW ENGINE NDBCLUSTER STATUS`](show-engine.html "13.7.5.15 SHOW ENGINE Statement").

  For more information about node IDs for NDB Cluster SQL nodes, see [Section 21.4.3.7, “Defining SQL and Other API Nodes in an NDB Cluster”](mysql-cluster-api-definition.html "21.4.3.7 Defining SQL and Other API Nodes in an NDB Cluster").

* `--ndb-optimization-delay=milliseconds`

  <table frame="box" rules="all" summary="Properties for ndb-batch-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-batch-size</code></td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_batch_size</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">32768</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value (≥ 5.7.37-ndb-7.6.22)</th> <td><code class="literal">2147483648</code></td> </tr><tr><th>Maximum Value (≥ 5.7.37-ndb-7.5.26)</th> <td><code class="literal">2147483648</code></td> </tr><tr><th>Maximum Value (≤ 5.7.37-ndb-7.5.25)</th> <td><code class="literal">31536000</code></td> </tr><tr><th>Maximum Value (≤ 5.7.37-ndb-7.6.21)</th> <td><code class="literal">31536000</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">31536000</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>3

  Set the number of milliseconds to wait between sets of rows by [`OPTIMIZE TABLE`](optimize-table.html "13.7.2.4 OPTIMIZE TABLE Statement") statements on [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") tables. The default is 10.

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Properties for ndb-batch-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-batch-size</code></td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_batch_size</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">32768</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value (≥ 5.7.37-ndb-7.6.22)</th> <td><code class="literal">2147483648</code></td> </tr><tr><th>Maximum Value (≥ 5.7.37-ndb-7.5.26)</th> <td><code class="literal">2147483648</code></td> </tr><tr><th>Maximum Value (≤ 5.7.37-ndb-7.5.25)</th> <td><code class="literal">31536000</code></td> </tr><tr><th>Maximum Value (≤ 5.7.37-ndb-7.6.21)</th> <td><code class="literal">31536000</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">31536000</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>4

  Enable optimizations for selection of nodes for transactions. Enabled by default; use `--skip-ndb-optimized-node-selection` to disable.

* `--ndb-transid-mysql-connection-map=state`

  <table frame="box" rules="all" summary="Properties for ndb-batch-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-batch-size</code></td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_batch_size</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">32768</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value (≥ 5.7.37-ndb-7.6.22)</th> <td><code class="literal">2147483648</code></td> </tr><tr><th>Maximum Value (≥ 5.7.37-ndb-7.5.26)</th> <td><code class="literal">2147483648</code></td> </tr><tr><th>Maximum Value (≤ 5.7.37-ndb-7.5.25)</th> <td><code class="literal">31536000</code></td> </tr><tr><th>Maximum Value (≤ 5.7.37-ndb-7.6.21)</th> <td><code class="literal">31536000</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">31536000</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>5

  Enables or disables the plugin that handles the [`ndb_transid_mysql_connection_map`](information-schema-ndb-transid-mysql-connection-map-table.html "24.3.13 The INFORMATION_SCHEMA ndb_transid_mysql_connection_map Table") table in the `INFORMATION_SCHEMA` database. Takes one of the values `ON`, `OFF`, or `FORCE`. `ON` (the default) enables the plugin. `OFF` disables the plugin, which makes `ndb_transid_mysql_connection_map` inaccessible. `FORCE` keeps the MySQL Server from starting if the plugin fails to load and start.

  You can see whether the [`ndb_transid_mysql_connection_map`](information-schema-ndb-transid-mysql-connection-map-table.html "24.3.13 The INFORMATION_SCHEMA ndb_transid_mysql_connection_map Table") table plugin is running by checking the output of [`SHOW PLUGINS`](show-plugins.html "13.7.5.25 SHOW PLUGINS Statement").

* `--ndb-wait-connected=seconds`

  <table frame="box" rules="all" summary="Properties for ndb-batch-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-batch-size</code></td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_batch_size</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">32768</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value (≥ 5.7.37-ndb-7.6.22)</th> <td><code class="literal">2147483648</code></td> </tr><tr><th>Maximum Value (≥ 5.7.37-ndb-7.5.26)</th> <td><code class="literal">2147483648</code></td> </tr><tr><th>Maximum Value (≤ 5.7.37-ndb-7.5.25)</th> <td><code class="literal">31536000</code></td> </tr><tr><th>Maximum Value (≤ 5.7.37-ndb-7.6.21)</th> <td><code class="literal">31536000</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">31536000</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>6

  This option sets the period of time that the MySQL server waits for connections to NDB Cluster management and data nodes to be established before accepting MySQL client connections. The time is specified in seconds. The default value is `30`.

* `--ndb-wait-setup=seconds`

  <table frame="box" rules="all" summary="Properties for ndb-batch-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-batch-size</code></td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_batch_size</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">32768</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value (≥ 5.7.37-ndb-7.6.22)</th> <td><code class="literal">2147483648</code></td> </tr><tr><th>Maximum Value (≥ 5.7.37-ndb-7.5.26)</th> <td><code class="literal">2147483648</code></td> </tr><tr><th>Maximum Value (≤ 5.7.37-ndb-7.5.25)</th> <td><code class="literal">31536000</code></td> </tr><tr><th>Maximum Value (≤ 5.7.37-ndb-7.6.21)</th> <td><code class="literal">31536000</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">31536000</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>7

  This variable shows the period of time that the MySQL server waits for the [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engine to complete setup before timing out and treating [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") as unavailable. The time is specified in seconds. The default value is `30`.

* `--skip-ndbcluster`

  <table frame="box" rules="all" summary="Properties for ndb-batch-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-batch-size</code></td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_batch_size</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">32768</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value (≥ 5.7.37-ndb-7.6.22)</th> <td><code class="literal">2147483648</code></td> </tr><tr><th>Maximum Value (≥ 5.7.37-ndb-7.5.26)</th> <td><code class="literal">2147483648</code></td> </tr><tr><th>Maximum Value (≤ 5.7.37-ndb-7.5.25)</th> <td><code class="literal">31536000</code></td> </tr><tr><th>Maximum Value (≤ 5.7.37-ndb-7.6.21)</th> <td><code class="literal">31536000</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">31536000</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>8

  Disable the [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engine. This is the default for binaries that were built with [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engine support; the server allocates memory and other resources for this storage engine only if the [`--ndbcluster`](mysql-cluster-options-variables.html#option_mysqld_ndbcluster) option is given explicitly. See [Section 21.4.1, “Quick Test Setup of NDB Cluster”](mysql-cluster-quick.html "21.4.1 Quick Test Setup of NDB Cluster"), for an example.

##### 21.4.3.9.2 NDB Cluster System Variables

This section provides detailed information about MySQL server system variables that are specific to NDB Cluster and the [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engine. For system variables not specific to NDB Cluster, see [Section 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables"). For general information on using system variables, see [Section 5.1.8, “Using System Variables”](using-system-variables.html "5.1.8 Using System Variables").

* [`ndb_autoincrement_prefetch_sz`](mysql-cluster-options-variables.html#sysvar_ndb_autoincrement_prefetch_sz)

  <table frame="box" rules="all" summary="Properties for ndb-batch-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-batch-size</code></td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_batch_size</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">32768</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value (≥ 5.7.37-ndb-7.6.22)</th> <td><code class="literal">2147483648</code></td> </tr><tr><th>Maximum Value (≥ 5.7.37-ndb-7.5.26)</th> <td><code class="literal">2147483648</code></td> </tr><tr><th>Maximum Value (≤ 5.7.37-ndb-7.5.25)</th> <td><code class="literal">31536000</code></td> </tr><tr><th>Maximum Value (≤ 5.7.37-ndb-7.6.21)</th> <td><code class="literal">31536000</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">31536000</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>9

  Determines the probability of gaps in an autoincremented column. Set it to `1` to minimize this. Setting it to a high value for optimization makes inserts faster, but decreases the likelihood that consecutive autoincrement numbers are used in a batch of inserts.

  This variable affects only the number of `AUTO_INCREMENT` IDs that are fetched between statements; within a given statement, at least 32 IDs are obtained at a time.

  Important

  This variable does not affect inserts performed using [`INSERT ... SELECT`](insert-select.html "13.2.5.1 INSERT ... SELECT Statement").

* [`ndb_cache_check_time`](mysql-cluster-options-variables.html#sysvar_ndb_cache_check_time)

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-cluster-connection-pool</code></td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_cluster_connection_pool</code></td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_cluster_connection_pool</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">1</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">1</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">63</code></td> </tr></tbody></table>0

  The number of milliseconds that elapse between checks of NDB Cluster SQL nodes by the MySQL query cache. Setting this to 0 (the default and minimum value) means that the query cache checks for validation on every query.

  The recommended maximum value for this variable is 1000, which means that the check is performed once per second. A larger value means that the check is performed and possibly invalidated due to updates on different SQL nodes less often. It is generally not desirable to set this to a value greater than 2000.

  Note

  The query cache is deprecated as of MySQL 5.7.20, and is removed in MySQL 8.0. Deprecation includes [`ndb_cache_check_time`](mysql-cluster-options-variables.html#sysvar_ndb_cache_check_time).

* [`ndb_clear_apply_status`](mysql-cluster-options-variables.html#sysvar_ndb_clear_apply_status)

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-cluster-connection-pool</code></td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_cluster_connection_pool</code></td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_cluster_connection_pool</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">1</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">1</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">63</code></td> </tr></tbody></table>1

  By the default, executing [`RESET SLAVE`](reset-slave.html "13.4.2.3 RESET SLAVE Statement") causes an NDB Cluster replica to purge all rows from its `ndb_apply_status` table. You can disable this by setting `ndb_clear_apply_status=OFF`.

* [`ndb_data_node_neighbour`](mysql-cluster-options-variables.html#sysvar_ndb_data_node_neighbour)

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-cluster-connection-pool</code></td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_cluster_connection_pool</code></td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_cluster_connection_pool</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">1</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">1</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">63</code></td> </tr></tbody></table>2

  Sets the ID of a “nearest” data node—that is, a preferred nonlocal data node is chosen to execute the transaction, rather than one running on the same host as the SQL or API node. This used to ensure that when a fully replicated table is accessed, we access it on this data node, to ensure that the local copy of the table is always used whenever possible. This can also be used for providing hints for transactions.

  This can improve data access times in the case of a node that is physically closer than and thus has higher network throughput than others on the same host.

  See [Section 13.1.18.9, “Setting NDB Comment Options”](create-table-ndb-comment-options.html "13.1.18.9 Setting NDB Comment Options"), for further information.

  Added in NDB 7.5.2.

  Note

  An equivalent method [`set_data_node_neighbour()`](/doc/ndbapi/en/ndb-ndb-cluster-connection.html#ndb-ndb-cluster-connection-set-data-node-neighbour) is provided for use in NDB API applications.

* [`ndb_default_column_format`](mysql-cluster-options-variables.html#sysvar_ndb_default_column_format)

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-cluster-connection-pool</code></td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_cluster_connection_pool</code></td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_cluster_connection_pool</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">1</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">1</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">63</code></td> </tr></tbody></table>3

  In NDB 7.5.1 and later, sets the default `COLUMN_FORMAT` and `ROW_FORMAT` for new tables (see [Section 13.1.18, “CREATE TABLE Statement”](create-table.html "13.1.18 CREATE TABLE Statement")).

  In NDB 7.5.1, the default for this variable was `DYNAMIC`; in NDB 7.5.4, the default was changed to `FIXED` to maintain backwards compatibility with older release series (Bug #24487363).

* [`ndb_deferred_constraints`](mysql-cluster-options-variables.html#sysvar_ndb_deferred_constraints)

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-cluster-connection-pool</code></td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_cluster_connection_pool</code></td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_cluster_connection_pool</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">1</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">1</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">63</code></td> </tr></tbody></table>4

  Controls whether or not constraint checks are deferred, where these are supported. `0` is the default.

  This variable is not normally needed for operation of NDB Cluster or NDB Cluster Replication, and is intended primarily for use in testing.

* [`ndb_distribution`](mysql-cluster-options-variables.html#sysvar_ndb_distribution)

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-cluster-connection-pool</code></td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_cluster_connection_pool</code></td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_cluster_connection_pool</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">1</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">1</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">63</code></td> </tr></tbody></table>5

  Controls the default distribution method for [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") tables. Can be set to either of `KEYHASH` (key hashing) or `LINHASH` (linear hashing). `KEYHASH` is the default.

* [`ndb_eventbuffer_free_percent`](mysql-cluster-options-variables.html#sysvar_ndb_eventbuffer_free_percent)

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-cluster-connection-pool</code></td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_cluster_connection_pool</code></td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_cluster_connection_pool</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">1</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">1</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">63</code></td> </tr></tbody></table>6

  Sets the percentage of the maximum memory allocated to the event buffer (ndb\_eventbuffer\_max\_alloc) that should be available in event buffer after reaching the maximum, before starting to buffer again.

* [`ndb_eventbuffer_max_alloc`](mysql-cluster-options-variables.html#sysvar_ndb_eventbuffer_max_alloc)

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-cluster-connection-pool</code></td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_cluster_connection_pool</code></td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_cluster_connection_pool</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">1</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">1</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">63</code></td> </tr></tbody></table>7

  Sets the maximum amount memory (in bytes) that can be allocated for buffering events by the NDB API. 0 means that no limit is imposed, and is the default.

* [`ndb_extra_logging`](mysql-cluster-options-variables.html#sysvar_ndb_extra_logging)

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-cluster-connection-pool</code></td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_cluster_connection_pool</code></td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_cluster_connection_pool</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">1</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">1</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">63</code></td> </tr></tbody></table>8

  This variable enables recording in the MySQL error log of information specific to the [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engine.

  When this variable is set to 0, the only information specific to `NDB` that is written to the MySQL error log relates to transaction handling. If it set to a value greater than 0 but less than 10, `NDB` table schema and connection events are also logged, as well as whether or not conflict resolution is in use, and other `NDB` errors and information. If the value is set to 10 or more, information about `NDB` internals, such as the progress of data distribution among cluster nodes, is also written to the MySQL error log. The default is 1.

* [`ndb_force_send`](mysql-cluster-options-variables.html#sysvar_ndb_force_send)

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-cluster-connection-pool</code></td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_cluster_connection_pool</code></td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_cluster_connection_pool</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">1</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">1</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">63</code></td> </tr></tbody></table>9

  Forces sending of buffers to [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") immediately, without waiting for other threads. Defaults to `ON`.

* [`ndb_fully_replicated`](mysql-cluster-options-variables.html#sysvar_ndb_fully_replicated)

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool-nodeids"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-cluster-connection-pool-nodeids</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>System Variable (≥ 5.7.10-ndb-7.5.0)</th> <td><code class="literal">ndb_cluster_connection_pool_nodeids</code></td> </tr><tr><th>Scope (≥ 5.7.10-ndb-7.5.0)</th> <td>Global</td> </tr><tr><th>Dynamic (≥ 5.7.10-ndb-7.5.0)</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code class="literal"></code></td> </tr></tbody></table>0

  Determines whether new `NDB` tables are fully replicated. This setting can be overridden for an individual table using `COMMENT="NDB_TABLE=FULLY_REPLICATED=..."` in a [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") or [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") statement; see [Section 13.1.18.9, “Setting NDB Comment Options”](create-table-ndb-comment-options.html "13.1.18.9 Setting NDB Comment Options"), for syntax and other information.

  Added in NDB 7.5.2.

* [`ndb_index_stat_enable`](mysql-cluster-options-variables.html#sysvar_ndb_index_stat_enable)

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool-nodeids"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-cluster-connection-pool-nodeids</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>System Variable (≥ 5.7.10-ndb-7.5.0)</th> <td><code class="literal">ndb_cluster_connection_pool_nodeids</code></td> </tr><tr><th>Scope (≥ 5.7.10-ndb-7.5.0)</th> <td>Global</td> </tr><tr><th>Dynamic (≥ 5.7.10-ndb-7.5.0)</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code class="literal"></code></td> </tr></tbody></table>1

  Use [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") index statistics in query optimization. The default is `ON`.

* [`ndb_index_stat_option`](mysql-cluster-options-variables.html#sysvar_ndb_index_stat_option)

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool-nodeids"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-cluster-connection-pool-nodeids</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>System Variable (≥ 5.7.10-ndb-7.5.0)</th> <td><code class="literal">ndb_cluster_connection_pool_nodeids</code></td> </tr><tr><th>Scope (≥ 5.7.10-ndb-7.5.0)</th> <td>Global</td> </tr><tr><th>Dynamic (≥ 5.7.10-ndb-7.5.0)</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code class="literal"></code></td> </tr></tbody></table>2

  This variable is used for providing tuning options for NDB index statistics generation. The list consist of comma-separated name-value pairs of option names and values, and this list must not contain any space characters.

  Options not used when setting `ndb_index_stat_option` are not changed from their default values. For example, you can set `ndb_index_stat_option = 'loop_idle=1000ms,cache_limit=32M'`.

  Time values can be optionally suffixed with `h` (hours), `m` (minutes), or `s` (seconds). Millisecond values can optionally be specified using `ms`; millisecond values cannot be specified using `h`, `m`, or `s`.) Integer values can be suffixed with `K`, `M`, or `G`.

  The names of the options that can be set using this variable are shown in the table that follows. The table also provides brief descriptions of the options, their default values, and (where applicable) their minimum and maximum values.

  **Table 21.18 ndb\_index\_stat\_option options and values**

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool-nodeids"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-cluster-connection-pool-nodeids</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>System Variable (≥ 5.7.10-ndb-7.5.0)</th> <td><code class="literal">ndb_cluster_connection_pool_nodeids</code></td> </tr><tr><th>Scope (≥ 5.7.10-ndb-7.5.0)</th> <td>Global</td> </tr><tr><th>Dynamic (≥ 5.7.10-ndb-7.5.0)</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code class="literal"></code></td> </tr></tbody></table>3

* [`ndb_join_pushdown`](mysql-cluster-options-variables.html#sysvar_ndb_join_pushdown)

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool-nodeids"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-cluster-connection-pool-nodeids</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>System Variable (≥ 5.7.10-ndb-7.5.0)</th> <td><code class="literal">ndb_cluster_connection_pool_nodeids</code></td> </tr><tr><th>Scope (≥ 5.7.10-ndb-7.5.0)</th> <td>Global</td> </tr><tr><th>Dynamic (≥ 5.7.10-ndb-7.5.0)</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code class="literal"></code></td> </tr></tbody></table>4

  This variable controls whether joins on [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") tables are pushed down to the NDB kernel (data nodes). Previously, a join was handled using multiple accesses of [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") by the SQL node; however, when [`ndb_join_pushdown`](mysql-cluster-options-variables.html#sysvar_ndb_join_pushdown) is enabled, a pushable join is sent in its entirety to the data nodes, where it can be distributed among the data nodes and executed in parallel on multiple copies of the data, with a single, merged result being returned to [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"). This can reduce greatly the number of round trips between an SQL node and the data nodes required to handle such a join.

  By default, [`ndb_join_pushdown`](mysql-cluster-options-variables.html#sysvar_ndb_join_pushdown) is enabled.

  **Conditions for NDB pushdown joins.** In order for a join to be pushable, it must meet the following conditions:

  1. Only columns can be compared, and all columns to be joined must use *exactly* the same data type.

     This means that expressions such as `t1.a = t2.a + constant` cannot be pushed down, and that (for example) a join on an [`INT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") column and a [`BIGINT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") column also cannot be pushed down.

  2. Queries referencing [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") or [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") columns are not supported.

  3. Explicit locking is not supported; however, the [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engine's characteristic implicit row-based locking is enforced.

     This means that a join using `FOR UPDATE` cannot be pushed down.

  4. In order for a join to be pushed down, child tables in the join must be accessed using one of the [`ref`](explain-output.html#jointype_ref), [`eq_ref`](explain-output.html#jointype_eq_ref), or [`const`](explain-output.html#jointype_const) access methods, or some combination of these methods.

     Outer joined child tables can only be pushed using [`eq_ref`](explain-output.html#jointype_eq_ref).

     If the root of the pushed join is an [`eq_ref`](explain-output.html#jointype_eq_ref) or [`const`](explain-output.html#jointype_const), only child tables joined by [`eq_ref`](explain-output.html#jointype_eq_ref) can be appended. (A table joined by [`ref`](explain-output.html#jointype_ref) is likely to become the root of another pushed join.)

     If the query optimizer decides on `Using join cache` for a candidate child table, that table cannot be pushed as a child. However, it may be the root of another set of pushed tables.

  5. Joins referencing tables explicitly partitioned by `[LINEAR] HASH`, `LIST`, or `RANGE` currently cannot be pushed down.

  You can see whether a given join can be pushed down by checking it with [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement"); when the join can be pushed down, you can see references to the `pushed join` in the `Extra` column of the output, as shown in this example:

  ```sql
  mysql> EXPLAIN
      ->     SELECT e.first_name, e.last_name, t.title, d.dept_name
      ->         FROM employees e
      ->         JOIN dept_emp de ON e.emp_no=de.emp_no
      ->         JOIN departments d ON d.dept_no=de.dept_no
      ->         JOIN titles t ON e.emp_no=t.emp_no\G
  *************************** 1. row ***************************
             id: 1
    select_type: SIMPLE
          table: d
           type: ALL
  possible_keys: PRIMARY
            key: NULL
        key_len: NULL
            ref: NULL
           rows: 9
          Extra: Parent of 4 pushed join@1
  *************************** 2. row ***************************
             id: 1
    select_type: SIMPLE
          table: de
           type: ref
  possible_keys: PRIMARY,emp_no,dept_no
            key: dept_no
        key_len: 4
            ref: employees.d.dept_no
           rows: 5305
          Extra: Child of 'd' in pushed join@1
  *************************** 3. row ***************************
             id: 1
    select_type: SIMPLE
          table: e
           type: eq_ref
  possible_keys: PRIMARY
            key: PRIMARY
        key_len: 4
            ref: employees.de.emp_no
           rows: 1
          Extra: Child of 'de' in pushed join@1
  *************************** 4. row ***************************
             id: 1
    select_type: SIMPLE
          table: t
           type: ref
  possible_keys: PRIMARY,emp_no
            key: emp_no
        key_len: 4
            ref: employees.de.emp_no
           rows: 19
          Extra: Child of 'e' in pushed join@1
  4 rows in set (0.00 sec)
  ```

  Note

  If inner joined child tables are joined by [`ref`](explain-output.html#jointype_ref), *and* the result is ordered or grouped by a sorted index, this index cannot provide sorted rows, which forces writing to a sorted tempfile.

  Two additional sources of information about pushed join performance are available:

  1. The status variables [`Ndb_pushed_queries_defined`](mysql-cluster-options-variables.html#statvar_Ndb_pushed_queries_defined), [`Ndb_pushed_queries_dropped`](mysql-cluster-options-variables.html#statvar_Ndb_pushed_queries_dropped), [`Ndb_pushed_queries_executed`](mysql-cluster-options-variables.html#statvar_Ndb_pushed_queries_executed), and [`Ndb_pushed_reads`](mysql-cluster-options-variables.html#statvar_Ndb_pushed_reads).

  2. The counters in the [`ndbinfo.counters`](mysql-cluster-ndbinfo-counters.html "21.6.15.10 The ndbinfo counters Table") table that belong to the [`DBSPJ`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dbspj.html) kernel block.

* [`ndb_log_apply_status`](mysql-cluster-options-variables.html#sysvar_ndb_log_apply_status)

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool-nodeids"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-cluster-connection-pool-nodeids</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>System Variable (≥ 5.7.10-ndb-7.5.0)</th> <td><code class="literal">ndb_cluster_connection_pool_nodeids</code></td> </tr><tr><th>Scope (≥ 5.7.10-ndb-7.5.0)</th> <td>Global</td> </tr><tr><th>Dynamic (≥ 5.7.10-ndb-7.5.0)</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code class="literal"></code></td> </tr></tbody></table>5

  A read-only variable which shows whether the server was started with the [`--ndb-log-apply-status`](mysql-cluster-options-variables.html#option_mysqld_ndb-log-apply-status) option.

* [`ndb_log_bin`](mysql-cluster-options-variables.html#sysvar_ndb_log_bin)

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool-nodeids"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-cluster-connection-pool-nodeids</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>System Variable (≥ 5.7.10-ndb-7.5.0)</th> <td><code class="literal">ndb_cluster_connection_pool_nodeids</code></td> </tr><tr><th>Scope (≥ 5.7.10-ndb-7.5.0)</th> <td>Global</td> </tr><tr><th>Dynamic (≥ 5.7.10-ndb-7.5.0)</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code class="literal"></code></td> </tr></tbody></table>6

  Causes updates to `NDB` tables to be written to the binary log. Setting this variable has no effect if binary logging is not already enabled for the server using [`log_bin`](replication-options-binary-log.html#sysvar_log_bin). `ndb_log_bin` defaults to 1 (ON); normally, there is never any need to change this value in a production environment.

* [`ndb_log_binlog_index`](mysql-cluster-options-variables.html#sysvar_ndb_log_binlog_index)

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool-nodeids"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-cluster-connection-pool-nodeids</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>System Variable (≥ 5.7.10-ndb-7.5.0)</th> <td><code class="literal">ndb_cluster_connection_pool_nodeids</code></td> </tr><tr><th>Scope (≥ 5.7.10-ndb-7.5.0)</th> <td>Global</td> </tr><tr><th>Dynamic (≥ 5.7.10-ndb-7.5.0)</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code class="literal"></code></td> </tr></tbody></table>7

  Causes a mapping of epochs to positions in the binary log to be inserted into the `ndb_binlog_index` table. Setting this variable has no effect if binary logging is not already enabled for the server using [`log_bin`](replication-options-binary-log.html#sysvar_log_bin). (In addition, [`ndb_log_bin`](mysql-cluster-options-variables.html#sysvar_ndb_log_bin) must not be disabled.) `ndb_log_binlog_index` defaults to `1` (`ON`); normally, there is never any need to change this value in a production environment.

* [`ndb_log_empty_epochs`](mysql-cluster-options-variables.html#sysvar_ndb_log_empty_epochs)

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool-nodeids"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-cluster-connection-pool-nodeids</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>System Variable (≥ 5.7.10-ndb-7.5.0)</th> <td><code class="literal">ndb_cluster_connection_pool_nodeids</code></td> </tr><tr><th>Scope (≥ 5.7.10-ndb-7.5.0)</th> <td>Global</td> </tr><tr><th>Dynamic (≥ 5.7.10-ndb-7.5.0)</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code class="literal"></code></td> </tr></tbody></table>8

  When this variable is set to 0, epoch transactions with no changes are not written to the binary log, although a row is still written even for an empty epoch in `ndb_binlog_index`.

* [`ndb_log_empty_update`](mysql-cluster-options-variables.html#sysvar_ndb_log_empty_update)

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool-nodeids"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-cluster-connection-pool-nodeids</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>System Variable (≥ 5.7.10-ndb-7.5.0)</th> <td><code class="literal">ndb_cluster_connection_pool_nodeids</code></td> </tr><tr><th>Scope (≥ 5.7.10-ndb-7.5.0)</th> <td>Global</td> </tr><tr><th>Dynamic (≥ 5.7.10-ndb-7.5.0)</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code class="literal"></code></td> </tr></tbody></table>9

  When this variable is set to `ON` (`1`), update transactions with no changes are written to the binary log, even when [`log_slave_updates`](replication-options-binary-log.html#sysvar_log_slave_updates) is enabled.

* [`ndb_log_exclusive_reads`](mysql-cluster-options-variables.html#sysvar_ndb_log_exclusive_reads)

  <table frame="box" rules="all" summary="Properties for ndb-blob-read-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-blob-read-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_blob_read_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">65536</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">4294967295</code></td> </tr></tbody></table>0

  This variable determines whether primary key reads are logged with exclusive locks, which allows for NDB Cluster Replication conflict detection and resolution based on read conflicts. To enable these locks, set the value of `ndb_log_exclusive_reads` to 1. 0, which disables such locking, is the default.

  For more information, see [Read conflict detection and resolution](mysql-cluster-replication-conflict-resolution.html#conflict-resolution-read-conflicts "Read conflict detection and resolution").

* [`ndb_log_orig`](mysql-cluster-options-variables.html#sysvar_ndb_log_orig)

  <table frame="box" rules="all" summary="Properties for ndb-blob-read-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-blob-read-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_blob_read_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">65536</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">4294967295</code></td> </tr></tbody></table>1

  Shows whether the originating server ID and epoch are logged in the `ndb_binlog_index` table. Set using the [`--ndb-log-orig`](mysql-cluster-options-variables.html#option_mysqld_ndb-log-orig) server option.

* [`ndb_log_transaction_id`](mysql-cluster-options-variables.html#sysvar_ndb_log_transaction_id)

  <table frame="box" rules="all" summary="Properties for ndb-blob-read-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-blob-read-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_blob_read_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">65536</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">4294967295</code></td> </tr></tbody></table>2

  This read-only, Boolean system variable shows whether a replica [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") writes NDB transaction IDs in the binary log (required to use “active-active” NDB Cluster Replication with `NDB$EPOCH_TRANS()` conflict detection). To change the setting, use the [`--ndb-log-transaction-id`](mysql-cluster-options-variables.html#option_mysqld_ndb-log-transaction-id) option.

  [`ndb_log_transaction_id`](mysql-cluster-options-variables.html#sysvar_ndb_log_transaction_id) is not supported in mainline MySQL Server 5.7.

  For more information, see [Section 21.7.11, “NDB Cluster Replication Conflict Resolution”](mysql-cluster-replication-conflict-resolution.html "21.7.11 NDB Cluster Replication Conflict Resolution").

* [`ndb_optimized_node_selection`](mysql-cluster-options-variables.html#sysvar_ndb_optimized_node_selection)

  <table frame="box" rules="all" summary="Properties for ndb-blob-read-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-blob-read-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_blob_read_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">65536</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">4294967295</code></td> </tr></tbody></table>3

  There are two forms of optimized node selection, described here:

  1. The SQL node uses promixity to determine the transaction coordinator; that is, the “closest” data node to the SQL node is chosen as the transaction coordinator. For this purpose, a data node having a shared memory connection with the SQL node is considered to be “closest” to the SQL node; the next closest (in order of decreasing proximity) are: TCP connection to `localhost`, followed by TCP connection from a host other than `localhost`.

  2. The SQL thread uses distribution awareness to select the data node. That is, the data node housing the cluster partition accessed by the first statement of a given transaction is used as the transaction coordinator for the entire transaction. (This is effective only if the first statement of the transaction accesses no more than one cluster partition.)

  This option takes one of the integer values `0`, `1`, `2`, or `3`. `3` is the default. These values affect node selection as follows:

  + `0`: Node selection is not optimized. Each data node is employed as the transaction coordinator 8 times before the SQL thread proceeds to the next data node.

  + `1`: Proximity to the SQL node is used to determine the transaction coordinator.

  + `2`: Distribution awareness is used to select the transaction coordinator. However, if the first statement of the transaction accesses more than one cluster partition, the SQL node reverts to the round-robin behavior seen when this option is set to `0`.

  + `3`: If distribution awareness can be employed to determine the transaction coordinator, then it is used; otherwise proximity is used to select the transaction coordinator. (This is the default behavior.)

  Proximity is determined as follows:

  1. Start with the value set for the [`Group`](mysql-cluster-tcp-definition.html#ndbparam-tcp-group) parameter (default 55).

  2. For an API node sharing the same host with other API nodes, decrement the value by 1. Assuming the default value for `Group`, the effective value for data nodes on same host as the API node is 54, and for remote data nodes 55.

  3. (*NDB 7.5.2 and later:*) Setting [`ndb_data_node_neighbour`](mysql-cluster-options-variables.html#sysvar_ndb_data_node_neighbour) further decreases the effective `Group` value by 50, causing this node to be regarded as the nearest node. This is needed only when all data nodes are on hosts other than that hosts the API node and it is desirable to dedicate one of them to the API node. In normal cases, the default adjustment described previously is sufficient.

  Frequent changes in `ndb_data_node_neighbour` are not advisable, since this changes the state of the cluster connection and thus may disrupt the selection algorithm for new transactions from each thread until it stablilizes.

* [`ndb_read_backup`](mysql-cluster-options-variables.html#sysvar_ndb_read_backup)

  <table frame="box" rules="all" summary="Properties for ndb-blob-read-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-blob-read-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_blob_read_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">65536</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">4294967295</code></td> </tr></tbody></table>4

  Enable read from any fragment replica for any `NDB` table subsequently created; doing so greatly improves the table read performance at a relatively small cost to writes.

  If the SQL node and the data node use the same host name or IP address, this fact is detected automatically, so that the preference is to send reads to the same host. If these nodes are on the same host but use different IP addresses, you can tell the SQL node to use the correct data node by setting the value of [`ndb_data_node_neighbour`](mysql-cluster-options-variables.html#sysvar_ndb_data_node_neighbour) on the SQL node to the node ID of the data node.

  To enable or disable read from any fragment replica for an individual table, you can set the `NDB_TABLE` option `READ_BACKUP` for the table accordingly, in a [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") or [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") statement; see [Section 13.1.18.9, “Setting NDB Comment Options”](create-table-ndb-comment-options.html "13.1.18.9 Setting NDB Comment Options"), for more information.

  Added in NDB 7.5.2.

* [`ndb_recv_thread_activation_threshold`](mysql-cluster-options-variables.html#sysvar_ndb_recv_thread_activation_threshold)

  <table frame="box" rules="all" summary="Properties for ndb-blob-read-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-blob-read-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_blob_read_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">65536</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">4294967295</code></td> </tr></tbody></table>5

  When this number of concurrently active threads is reached, the receive thread takes over polling of the cluster connection.

  This variable is global in scope. It can also be set at startup.

* [`ndb_recv_thread_cpu_mask`](mysql-cluster-options-variables.html#sysvar_ndb_recv_thread_cpu_mask)

  <table frame="box" rules="all" summary="Properties for ndb-blob-read-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-blob-read-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_blob_read_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">65536</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">4294967295</code></td> </tr></tbody></table>6

  CPU mask for locking receiver threads to specific CPUs. This is specified as a hexadecimal bitmask. For example, `0x33` means that one CPU is used per receiver thread. An empty string is the default; setting `ndb_recv_thread_cpu_mask` to this value removes any receiver thread locks previously set.

  This variable is global in scope. It can also be set at startup.

* [`ndb_report_thresh_binlog_epoch_slip`](mysql-cluster-options-variables.html#sysvar_ndb_report_thresh_binlog_epoch_slip)

  <table frame="box" rules="all" summary="Properties for ndb-blob-read-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-blob-read-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_blob_read_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">65536</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">4294967295</code></td> </tr></tbody></table>7

  In NDB 7.5.4 and later, this represents the threshold for the number of epochs completely buffered in the event buffer, but not yet consumed by the binlog injector thread. When this degree of slippage (lag) is exceeded, an event buffer status message is reported, with `BUFFERED_EPOCHS_OVER_THRESHOLD` supplied as the reason (see [Section 21.6.2.3, “Event Buffer Reporting in the Cluster Log”](mysql-cluster-logs-event-buffer.html "21.6.2.3 Event Buffer Reporting in the Cluster Log")). Slip is increased when an epoch is received from data nodes and buffered completely in the event buffer; it is decreased when an epoch is consumed by the binlog injector thread, it is reduced. Empty epochs are buffered and queued, and so included in this calculation only when this is enabled using the [`Ndb::setEventBufferQueueEmptyEpoch()`](/doc/ndbapi/en/ndb-ndb.html#ndb-ndb-seteventbufferqueueemptyepoch) method from the NDB API.

  Prior to NDB 7.5.4, the value of this vairable served as a threshold for the number of epochs to be behind before reporting binary log status. In these previous releases, a value of `3`—the default—means that if the difference between which epoch has been received from the storage nodes and which epoch has been applied to the binary log is 3 or more, a status message is then sent to the cluster log.

* [`ndb_report_thresh_binlog_mem_usage`](mysql-cluster-options-variables.html#sysvar_ndb_report_thresh_binlog_mem_usage)

  <table frame="box" rules="all" summary="Properties for ndb-blob-read-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-blob-read-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_blob_read_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">65536</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">4294967295</code></td> </tr></tbody></table>8

  This is a threshold on the percentage of free memory remaining before reporting binary log status. For example, a value of `10` (the default) means that if the amount of available memory for receiving binary log data from the data nodes falls below 10%, a status message is sent to the cluster log.

* [`ndb_row_checksum`](mysql-cluster-options-variables.html#sysvar_ndb_row_checksum)

  <table frame="box" rules="all" summary="Properties for ndb-blob-read-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-blob-read-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_blob_read_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">65536</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">4294967295</code></td> </tr></tbody></table>9

  Traditionally, `NDB` has created tables with row checksums, which checks for hardware issues at the expense of performance. Setting `ndb_row_checksum` to 0 means that row checksums are *not* used for new or altered tables, which has a significant impact on performance for all types of queries. This variable is set to 1 by default, to provide backward-compatible behavior.

* [`ndb_show_foreign_key_mock_tables`](mysql-cluster-options-variables.html#sysvar_ndb_show_foreign_key_mock_tables)

  <table frame="box" rules="all" summary="Properties for ndb-blob-write-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-blob-write-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_blob_write_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">65536</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>0

  Show the mock tables used by `NDB` to support [`foreign_key_checks=0`](server-system-variables.html#sysvar_foreign_key_checks). When this is enabled, extra warnings are shown when creating and dropping the tables. The real (internal) name of the table can be seen in the output of [`SHOW CREATE TABLE`](show-create-table.html "13.7.5.10 SHOW CREATE TABLE Statement").

* [`ndb_slave_conflict_role`](mysql-cluster-options-variables.html#sysvar_ndb_slave_conflict_role)

  <table frame="box" rules="all" summary="Properties for ndb-blob-write-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-blob-write-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_blob_write_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">65536</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>1

  Determine the role of this SQL node (and NDB Cluster) in a circular (“active-active”) replication setup. `ndb_slave_conflict_role` can take any one of the values `PRIMARY`, `SECONDARY`, `PASS`, or `NULL` (the default). The replica SQL thread must be stopped before you can change `ndb_slave_conflict_role`. In addition, it is not possible to change directly between `PASS` and either of `PRIMARY` or `SECONDARY` directly; in such cases, you must ensure that the SQL thread is stopped, then execute [`SET @@GLOBAL.ndb_slave_conflict_role = 'NONE'`](set-statement.html "13.7.4 SET Statements") first.

  For more information, see [Section 21.7.11, “NDB Cluster Replication Conflict Resolution”](mysql-cluster-replication-conflict-resolution.html "21.7.11 NDB Cluster Replication Conflict Resolution").

* [`ndb_table_no_logging`](mysql-cluster-options-variables.html#sysvar_ndb_table_no_logging)

  <table frame="box" rules="all" summary="Properties for ndb-blob-write-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-blob-write-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_blob_write_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">65536</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>2

  When this variable is set to `ON` or `1`, it causes all tables created or altered using `ENGINE NDB` to be nonlogging; that is, no data changes for this table are written to the redo log or checkpointed to disk, just as if the table had been created or altered using the `NOLOGGING` option for [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") or [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement").

  For more information about nonlogging `NDB` tables, see [NDB\_TABLE Options](create-table-ndb-comment-options.html#create-table-ndb-comment-table-options "NDB_TABLE Options").

  [`ndb_table_no_logging`](mysql-cluster-options-variables.html#sysvar_ndb_table_no_logging) has no effect on the creation of [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") table schema files; to suppress these, use [`ndb_table_temporary`](mysql-cluster-options-variables.html#sysvar_ndb_table_temporary) instead.

* [`ndb_table_temporary`](mysql-cluster-options-variables.html#sysvar_ndb_table_temporary)

  <table frame="box" rules="all" summary="Properties for ndb-blob-write-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-blob-write-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_blob_write_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">65536</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>3

  When set to `ON` or `1`, this variable causes [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") tables not to be written to disk: This means that no table schema files are created, and that the tables are not logged.

  Note

  Setting this variable currently has no effect. This is a known issue; see Bug #34036.

* [`ndb_use_copying_alter_table`](mysql-cluster-options-variables.html#sysvar_ndb_use_copying_alter_table)

  <table frame="box" rules="all" summary="Properties for ndb-blob-write-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-blob-write-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_blob_write_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">65536</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>4

  Forces [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") to use copying of tables in the event of problems with online [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") operations. The default value is `OFF`.

* [`ndb_use_exact_count`](mysql-cluster-options-variables.html#sysvar_ndb_use_exact_count)

  <table frame="box" rules="all" summary="Properties for ndb-blob-write-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-blob-write-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_blob_write_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">65536</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>5

  Forces [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") to use a count of records during `SELECT COUNT(*)` query planning to speed up this type of query. The default value is `OFF`, which allows for faster queries overall.

* [`ndb_use_transactions`](mysql-cluster-options-variables.html#sysvar_ndb_use_transactions)

  <table frame="box" rules="all" summary="Properties for ndb-blob-write-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-blob-write-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_blob_write_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">65536</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>6

  You can disable `NDB` transaction support by setting this variable's value to `OFF`. This is generally not recommended, although it may be useful to disable transaction support within a given client session when that session is used to import one or more dump files with large transactions; this allows a multi-row insert to be executed in parts, rather than as a single transaction. In such cases, once the import has been completed, you should either reset the variable value for this session to `ON`, or simply terminate the session.

* [`ndb_version`](mysql-cluster-options-variables.html#sysvar_ndb_version)

  <table frame="box" rules="all" summary="Properties for ndb-blob-write-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-blob-write-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_blob_write_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">65536</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>7

  `NDB` engine version, as a composite integer.

* [`ndb_version_string`](mysql-cluster-options-variables.html#sysvar_ndb_version_string)

  <table frame="box" rules="all" summary="Properties for ndb-blob-write-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-blob-write-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_blob_write_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">65536</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>8

  `NDB` engine version in `ndb-x.y.z` format.

* [`server_id_bits`](mysql-cluster-options-variables.html#sysvar_server_id_bits)

  <table frame="box" rules="all" summary="Properties for ndb-blob-write-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-blob-write-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code class="literal">ndb_blob_write_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">65536</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>9

  This variable indicates the number of least significant bits within the 32-bit [`server_id`](replication-options.html#sysvar_server_id) which actually identify the server. Indicating that the server is actually identified by fewer than 32 bits makes it possible for some of the remaining bits to be used for other purposes, such as storing user data generated by applications using the NDB API's Event API within the `AnyValue` of an [`OperationOptions`](/doc/ndbapi/en/ndb-ndboperation.html#ndb-ndboperation-operationoptions) structure (NDB Cluster uses the `AnyValue` to store the server ID).

  When extracting the effective server ID from [`server_id`](replication-options.html#sysvar_server_id) for purposes such as detection of replication loops, the server ignores the remaining bits. The [`server_id_bits`](mysql-cluster-options-variables.html#sysvar_server_id_bits) variable is used to mask out any irrelevant bits of [`server_id`](replication-options.html#sysvar_server_id) in the I/O and SQL threads when deciding whether an event should be ignored based on the server ID.

  This data can be read from the binary log by [**mysqlbinlog**](mysqlbinlog.html "4.6.7 mysqlbinlog — Utility for Processing Binary Log Files"), provided that it is run with its own [`server_id_bits`](mysql-cluster-options-variables.html#sysvar_server_id_bits) variable set to 32 (the default).

  If the value of [`server_id`](replication-options.html#sysvar_server_id) greater than or equal to 2 to the power of [`server_id_bits`](mysql-cluster-options-variables.html#sysvar_server_id_bits); otherwise, [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") refuses to start.

  This system variable is supported only by NDB Cluster. It is not supported in the standard MySQL 5.7 Server.

* [`slave_allow_batching`](mysql-cluster-options-variables.html#sysvar_slave_allow_batching)

  <table frame="box" rules="all" summary="Properties for ndb-connectstring"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-connectstring</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>0

  Whether or not batched updates are enabled on NDB Cluster replicas.

  Allowing batched updates on the replica greatly improves performance, particularly when replicating [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types"), [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types"), and [`JSON`](json.html "11.5 The JSON Data Type") columns. For this reason, you should always enable `slave_allow_batching` when using NDB replication. Beginning with NDB 7.6.23, a warning is issued whenever this variable is set to `OFF`.

  Setting this variable has an effect only when using replication with the `NDB` storage engine; in MySQL Server 5.7, it is present but does nothing. For more information, see [Section 21.7.6, “Starting NDB Cluster Replication (Single Replication Channel)”](mysql-cluster-replication-starting.html "21.7.6 Starting NDB Cluster Replication (Single Replication Channel)").

* [`transaction_allow_batching`](mysql-cluster-options-variables.html#sysvar_transaction_allow_batching)

  <table frame="box" rules="all" summary="Properties for ndb-connectstring"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-connectstring</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>1

  When set to `1` or `ON`, this variable enables batching of statements within the same transaction. To use this variable, [`autocommit`](server-system-variables.html#sysvar_autocommit) must first be disabled by setting it to `0` or `OFF`; otherwise, setting [`transaction_allow_batching`](mysql-cluster-options-variables.html#sysvar_transaction_allow_batching) has no effect.

  It is safe to use this variable with transactions that performs writes only, as having it enabled can lead to reads from the “before” image. You should ensure that any pending transactions are committed (using an explicit [`COMMIT`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") if desired) before issuing a [`SELECT`](select.html "13.2.9 SELECT Statement").

  Important

  [`transaction_allow_batching`](mysql-cluster-options-variables.html#sysvar_transaction_allow_batching) should not be used whenever there is the possibility that the effects of a given statement depend on the outcome of a previous statement within the same transaction.

  This variable is currently supported for NDB Cluster only.

The system variables in the following list all relate to the [`ndbinfo`](mysql-cluster-ndbinfo.html "21.6.15 ndbinfo: The NDB Cluster Information Database") information database.

* [`ndbinfo_database`](mysql-cluster-options-variables.html#sysvar_ndbinfo_database)

  <table frame="box" rules="all" summary="Properties for ndb-connectstring"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-connectstring</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>2

  Shows the name used for the `NDB` information database; the default is `ndbinfo`. This is a read-only variable whose value is determined at compile time.

* [`ndbinfo_max_bytes`](mysql-cluster-options-variables.html#sysvar_ndbinfo_max_bytes)

  <table frame="box" rules="all" summary="Properties for ndb-connectstring"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-connectstring</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>3

  Used in testing and debugging only.

* [`ndbinfo_max_rows`](mysql-cluster-options-variables.html#sysvar_ndbinfo_max_rows)

  <table frame="box" rules="all" summary="Properties for ndb-connectstring"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-connectstring</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>4

  Used in testing and debugging only.

* [`ndbinfo_offline`](mysql-cluster-options-variables.html#sysvar_ndbinfo_offline)

  <table frame="box" rules="all" summary="Properties for ndb-connectstring"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-connectstring</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>5

  Place the [`ndbinfo`](mysql-cluster-ndbinfo.html "21.6.15 ndbinfo: The NDB Cluster Information Database") database into offline mode, in which tables and views can be opened even when they do not actually exist, or when they exist but have different definitions in [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"). No rows are returned from such tables (or views).

* [`ndbinfo_show_hidden`](mysql-cluster-options-variables.html#sysvar_ndbinfo_show_hidden)

  <table frame="box" rules="all" summary="Properties for ndb-connectstring"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-connectstring</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>6

  Whether or not the [`ndbinfo`](mysql-cluster-ndbinfo.html "21.6.15 ndbinfo: The NDB Cluster Information Database") database's underlying internal tables are shown in the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client. The default is `OFF`.

  Note

  When `ndbinfo_show_hidden` is enabled, the internal tables are shown in the `ndbinfo` database only; they are not visible in [`TABLES`](information-schema-tables-table.html "24.3.25 The INFORMATION_SCHEMA TABLES Table") or other `INFORMATION_SCHEMA` tables, regardless of the variable's setting.

* [`ndbinfo_table_prefix`](mysql-cluster-options-variables.html#sysvar_ndbinfo_table_prefix)

  <table frame="box" rules="all" summary="Properties for ndb-connectstring"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-connectstring</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>7

  The prefix used in naming the ndbinfo database's base tables (normally hidden, unless exposed by setting [`ndbinfo_show_hidden`](mysql-cluster-options-variables.html#sysvar_ndbinfo_show_hidden)). This is a read-only variable whose default value is `ndb$`; the prefix itself is determined at compile time.

* [`ndbinfo_version`](mysql-cluster-options-variables.html#sysvar_ndbinfo_version)

  <table frame="box" rules="all" summary="Properties for ndb-connectstring"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb-connectstring</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>8

  Shows the version of the [`ndbinfo`](mysql-cluster-ndbinfo.html "21.6.15 ndbinfo: The NDB Cluster Information Database") engine in use; read-only.

##### 21.4.3.9.3 NDB Cluster Status Variables

This section provides detailed information about MySQL server status variables that relate to NDB Cluster and the [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engine. For status variables not specific to NDB Cluster, and for general information on using status variables, see [Section 5.1.9, “Server Status Variables”](server-status-variables.html "5.1.9 Server Status Variables").

* [`Handler_discover`](mysql-cluster-options-variables.html#statvar_Handler_discover)

  The MySQL server can ask the [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engine if it knows about a table with a given name. This is called discovery. [`Handler_discover`](mysql-cluster-options-variables.html#statvar_Handler_discover) indicates the number of times that tables have been discovered using this mechanism.

* [`Ndb_api_adaptive_send_deferred_count`](mysql-cluster-options-variables.html#statvar_Ndb_api_adaptive_send_deferred_count)

  Number of adaptive send calls that were not actually sent.

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_adaptive_send_deferred_count_session`](mysql-cluster-options-variables.html#statvar_Ndb_api_adaptive_send_deferred_count_session)

  Number of adaptive send calls that were not actually sent.

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_adaptive_send_deferred_count_slave`](mysql-cluster-options-variables.html#statvar_Ndb_api_adaptive_send_deferred_count_slave)

  Number of adaptive send calls that were not actually sent by this replica.

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_adaptive_send_forced_count`](mysql-cluster-options-variables.html#statvar_Ndb_api_adaptive_send_forced_count)

  Number of adaptive send calls using forced-send sent by this MySQL Server (SQL node).

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_adaptive_send_forced_count_session`](mysql-cluster-options-variables.html#statvar_Ndb_api_adaptive_send_forced_count_session)

  Number of adaptive send calls using forced-send sent in this client session.

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_adaptive_send_forced_count_slave`](mysql-cluster-options-variables.html#statvar_Ndb_api_adaptive_send_forced_count_slave)

  Number of adaptive send calls using forced-send sent by this replica.

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_adaptive_send_unforced_count`](mysql-cluster-options-variables.html#statvar_Ndb_api_adaptive_send_unforced_count)

  Number of adaptive send calls without forced-send sent by this MySQL server (SQL node).

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_adaptive_send_unforced_count_session`](mysql-cluster-options-variables.html#statvar_Ndb_api_adaptive_send_unforced_count_session)

  Number of adaptive send calls without forced-send sent in this client session.

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_adaptive_send_unforced_count_slave`](mysql-cluster-options-variables.html#statvar_Ndb_api_adaptive_send_unforced_count_slave)

  Number of adaptive send calls without forced-send sent by this replica.

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_bytes_sent_count_session`](mysql-cluster-options-variables.html#statvar_Ndb_api_bytes_sent_count_session)

  Amount of data (in bytes) sent to the data nodes in this client session.

  Although this variable can be read using either [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") or [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it relates to the current session only, and is not affected by any other clients of this [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server").

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_bytes_sent_count_slave`](mysql-cluster-options-variables.html#statvar_Ndb_api_bytes_sent_count_slave)

  Amount of data (in bytes) sent to the data nodes by this replica.

  Although this variable can be read using either [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") or [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it is effectively global in scope. If this MySQL server does not act as a replica, or does not use NDB tables, this value is always 0.

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_bytes_sent_count`](mysql-cluster-options-variables.html#statvar_Ndb_api_bytes_sent_count)

  Amount of data (in bytes) sent to the data nodes by this MySQL Server (SQL node).

  Although this variable can be read using either [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") or [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it is effectively global in scope.

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_bytes_received_count_session`](mysql-cluster-options-variables.html#statvar_Ndb_api_bytes_received_count_session)

  Amount of data (in bytes) received from the data nodes in this client session.

  Although this variable can be read using either [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") or [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it relates to the current session only, and is not affected by any other clients of this [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server").

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_bytes_received_count_slave`](mysql-cluster-options-variables.html#statvar_Ndb_api_bytes_received_count_slave)

  Amount of data (in bytes) received from the data nodes by this replica.

  Although this variable can be read using either [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") or [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it is effectively global in scope. If this MySQL server does not act as a replica, or does not use NDB tables, this value is always 0.

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_bytes_received_count`](mysql-cluster-options-variables.html#statvar_Ndb_api_bytes_received_count)

  Amount of data (in bytes) received from the data nodes by this MySQL Server (SQL node).

  Although this variable can be read using either [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") or [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it is effectively global in scope.

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_event_data_count_injector`](mysql-cluster-options-variables.html#statvar_Ndb_api_event_data_count_injector)

  The number of row change events received by the NDB binlog injector thread.

  Although this variable can be read using either [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") or [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it is effectively global in scope.

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_event_data_count`](mysql-cluster-options-variables.html#statvar_Ndb_api_event_data_count)

  The number of row change events received by this MySQL Server (SQL node).

  Although this variable can be read using either [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") or [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it is effectively global in scope.

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_event_nondata_count_injector`](mysql-cluster-options-variables.html#statvar_Ndb_api_event_nondata_count_injector)

  The number of events received, other than row change events, by the NDB binary log injector thread.

  Although this variable can be read using either [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") or [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it is effectively global in scope.

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_event_nondata_count`](mysql-cluster-options-variables.html#statvar_Ndb_api_event_nondata_count)

  The number of events received, other than row change events, by this MySQL Server (SQL node).

  Although this variable can be read using either [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") or [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it is effectively global in scope.

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_event_bytes_count_injector`](mysql-cluster-options-variables.html#statvar_Ndb_api_event_bytes_count_injector)

  The number of bytes of events received by the NDB binlog injector thread.

  Although this variable can be read using either [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") or [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it is effectively global in scope.

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_event_bytes_count`](mysql-cluster-options-variables.html#statvar_Ndb_api_event_bytes_count)

  The number of bytes of events received by this MySQL Server (SQL node).

  Although this variable can be read using either [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") or [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it is effectively global in scope.

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_pk_op_count_session`](mysql-cluster-options-variables.html#statvar_Ndb_api_pk_op_count_session)

  The number of operations in this client session based on or using primary keys. This includes operations on blob tables, implicit unlock operations, and auto-increment operations, as well as user-visible primary key operations.

  Although this variable can be read using either [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") or [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it relates to the current session only, and is not affected by any other clients of this [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server").

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_pk_op_count_slave`](mysql-cluster-options-variables.html#statvar_Ndb_api_pk_op_count_slave)

  The number of operations by this replica based on or using primary keys. This includes operations on blob tables, implicit unlock operations, and auto-increment operations, as well as user-visible primary key operations.

  Although this variable can be read using either [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") or [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it is effectively global in scope. If this MySQL server does not act as a replica, or does not use NDB tables, this value is always 0.

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_pk_op_count`](mysql-cluster-options-variables.html#statvar_Ndb_api_pk_op_count)

  The number of operations by this MySQL Server (SQL node) based on or using primary keys. This includes operations on blob tables, implicit unlock operations, and auto-increment operations, as well as user-visible primary key operations.

  Although this variable can be read using either [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") or [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it is effectively global in scope.

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_pruned_scan_count_session`](mysql-cluster-options-variables.html#statvar_Ndb_api_pruned_scan_count_session)

  The number of scans in this client session that have been pruned to a single partition.

  Although this variable can be read using either [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") or [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it relates to the current session only, and is not affected by any other clients of this [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server").

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_pruned_scan_count_slave`](mysql-cluster-options-variables.html#statvar_Ndb_api_pruned_scan_count_slave)

  The number of scans by this replica that have been pruned to a single partition.

  Although this variable can be read using either [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") or [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it is effectively global in scope. If this MySQL server does not act as a replica, or does not use NDB tables, this value is always 0.

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_pruned_scan_count`](mysql-cluster-options-variables.html#statvar_Ndb_api_pruned_scan_count)

  The number of scans by this MySQL Server (SQL node) that have been pruned to a single partition.

  Although this variable can be read using either [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") or [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it is effectively global in scope.

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_range_scan_count_session`](mysql-cluster-options-variables.html#statvar_Ndb_api_range_scan_count_session)

  The number of range scans that have been started in this client session.

  Although this variable can be read using either [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") or [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it relates to the current session only, and is not affected by any other clients of this [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server").

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_range_scan_count_slave`](mysql-cluster-options-variables.html#statvar_Ndb_api_range_scan_count_slave)

  The number of range scans that have been started by this replica.

  Although this variable can be read using either [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") or [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it is effectively global in scope. If this MySQL server does not act as a replica, or does not use NDB tables, this value is always 0.

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_range_scan_count`](mysql-cluster-options-variables.html#statvar_Ndb_api_range_scan_count)

  The number of range scans that have been started by this MySQL Server (SQL node).

  Although this variable can be read using either [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") or [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it is effectively global in scope.

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_read_row_count_session`](mysql-cluster-options-variables.html#statvar_Ndb_api_read_row_count_session)

  The total number of rows that have been read in this client session. This includes all rows read by any primary key, unique key, or scan operation made in this client session.

  Although this variable can be read using either [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") or [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it relates to the current session only, and is not affected by any other clients of this [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server").

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_read_row_count_slave`](mysql-cluster-options-variables.html#statvar_Ndb_api_read_row_count_slave)

  The total number of rows that have been read by this replica. This includes all rows read by any primary key, unique key, or scan operation made by this replica.

  Although this variable can be read using either [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") or [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it is effectively global in scope. If this MySQL server does not act as a replica, or does not use NDB tables, this value is always 0.

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_read_row_count`](mysql-cluster-options-variables.html#statvar_Ndb_api_read_row_count)

  The total number of rows that have been read by this MySQL Server (SQL node). This includes all rows read by any primary key, unique key, or scan operation made by this MySQL Server (SQL node).

  You should be aware that this value may not be completely accurate with regard to rows read by [`SELECT`](select.html "13.2.9 SELECT Statement") [`COUNT(*)`](aggregate-functions.html#function_count) queries, due to the fact that, in this case, the MySQL server actually reads pseudo-rows in the form `[table fragment ID]:[number of rows in fragment]` and sums the rows per fragment for all fragments in the table to derive an estimated count for all rows. `Ndb_api_read_row_count` uses this estimate and not the actual number of rows in the table.

  Although this variable can be read using either [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") or [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it is effectively global in scope.

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_scan_batch_count_session`](mysql-cluster-options-variables.html#statvar_Ndb_api_scan_batch_count_session)

  The number of batches of rows received in this client session. 1 batch is defined as 1 set of scan results from a single fragment.

  Although this variable can be read using either [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") or [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it relates to the current session only, and is not affected by any other clients of this [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server").

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_scan_batch_count_slave`](mysql-cluster-options-variables.html#statvar_Ndb_api_scan_batch_count_slave)

  The number of batches of rows received by this replica. 1 batch is defined as 1 set of scan results from a single fragment.

  Although this variable can be read using either [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") or [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it is effectively global in scope. If this MySQL server does not act as a replica, or does not use NDB tables, this value is always 0.

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_scan_batch_count`](mysql-cluster-options-variables.html#statvar_Ndb_api_scan_batch_count)

  The number of batches of rows received by this MySQL Server (SQL node). 1 batch is defined as 1 set of scan results from a single fragment.

  Although this variable can be read using either [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") or [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it is effectively global in scope.

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_table_scan_count_session`](mysql-cluster-options-variables.html#statvar_Ndb_api_table_scan_count_session)

  The number of table scans that have been started in this client session, including scans of internal tables,.

  Although this variable can be read using either [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") or [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it relates to the current session only, and is not affected by any other clients of this [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server").

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_table_scan_count_slave`](mysql-cluster-options-variables.html#statvar_Ndb_api_table_scan_count_slave)

  The number of table scans that have been started by this replica, including scans of internal tables,.

  Although this variable can be read using either [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") or [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it is effectively global in scope. If this MySQL server does not act as a replica, or does not use NDB tables, this value is always 0.

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_table_scan_count`](mysql-cluster-options-variables.html#statvar_Ndb_api_table_scan_count)

  The number of table scans that have been started by this MySQL Server (SQL node), including scans of internal tables,.

  Although this variable can be read using either [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") or [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it is effectively global in scope.

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_trans_abort_count_session`](mysql-cluster-options-variables.html#statvar_Ndb_api_trans_abort_count_session)

  The number of transactions aborted in this client session.

  Although this variable can be read using either [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") or [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it relates to the current session only, and is not affected by any other clients of this [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server").

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_trans_abort_count_slave`](mysql-cluster-options-variables.html#statvar_Ndb_api_trans_abort_count_slave)

  The number of transactions aborted by this replica.

  Although this variable can be read using either [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") or [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it is effectively global in scope. If this MySQL server does not act as a replica, or does not use NDB tables, this value is always 0.

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_trans_abort_count`](mysql-cluster-options-variables.html#statvar_Ndb_api_trans_abort_count)

  The number of transactions aborted by this MySQL Server (SQL node).

  Although this variable can be read using either [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") or [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it is effectively global in scope.

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_trans_close_count_session`](mysql-cluster-options-variables.html#statvar_Ndb_api_trans_close_count_session)

  The number of transactions closed in this client session. This value may be greater than the sum of [`Ndb_api_trans_commit_count_session`](mysql-cluster-options-variables.html#statvar_Ndb_api_trans_commit_count_session) and [`Ndb_api_trans_abort_count_session`](mysql-cluster-options-variables.html#statvar_Ndb_api_trans_abort_count_session), since some transactions may have been rolled back.

  Although this variable can be read using either [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") or [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it relates to the current session only, and is not affected by any other clients of this [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server").

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_trans_close_count_slave`](mysql-cluster-options-variables.html#statvar_Ndb_api_trans_close_count_slave)

  The number of transactions closed by this replica. This value may be greater than the sum of [`Ndb_api_trans_commit_count_slave`](mysql-cluster-options-variables.html#statvar_Ndb_api_trans_commit_count_slave) and [`Ndb_api_trans_abort_count_slave`](mysql-cluster-options-variables.html#statvar_Ndb_api_trans_abort_count_slave), since some transactions may have been rolled back.

  Although this variable can be read using either [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") or [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it is effectively global in scope. If this MySQL server does not act as a replica, or does not use NDB tables, this value is always 0.

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_trans_close_count`](mysql-cluster-options-variables.html#statvar_Ndb_api_trans_close_count)

  The number of transactions closed by this MySQL Server (SQL node). This value may be greater than the sum of [`Ndb_api_trans_commit_count`](mysql-cluster-options-variables.html#statvar_Ndb_api_trans_commit_count) and [`Ndb_api_trans_abort_count`](mysql-cluster-options-variables.html#statvar_Ndb_api_trans_abort_count), since some transactions may have been rolled back.

  Although this variable can be read using either [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") or [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it is effectively global in scope.

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_trans_commit_count_session`](mysql-cluster-options-variables.html#statvar_Ndb_api_trans_commit_count_session)

  The number of transactions committed in this client session.

  Although this variable can be read using either [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") or [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it relates to the current session only, and is not affected by any other clients of this [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server").

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_trans_commit_count_slave`](mysql-cluster-options-variables.html#statvar_Ndb_api_trans_commit_count_slave)

  The number of transactions committed by this replica.

  Although this variable can be read using either [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") or [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it is effectively global in scope. If this MySQL server does not act as a replica, or does not use NDB tables, this value is always 0.

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_trans_commit_count`](mysql-cluster-options-variables.html#statvar_Ndb_api_trans_commit_count)

  The number of transactions committed by this MySQL Server (SQL node).

  Although this variable can be read using either [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") or [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it is effectively global in scope.

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_trans_local_read_row_count_session`](mysql-cluster-options-variables.html#statvar_Ndb_api_trans_local_read_row_count_session)

  The total number of rows that have been read in this client session. This includes all rows read by any primary key, unique key, or scan operation made in this client session.

  Although this variable can be read using either [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") or [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it relates to the current session only, and is not affected by any other clients of this [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server").

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_trans_local_read_row_count_slave`](mysql-cluster-options-variables.html#statvar_Ndb_api_trans_local_read_row_count_slave)

  The total number of rows that have been read by this replica. This includes all rows read by any primary key, unique key, or scan operation made by this replica.

  Although this variable can be read using either [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") or [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it is effectively global in scope. If this MySQL server does not act as a replica, or does not use NDB tables, this value is always 0.

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_trans_local_read_row_count`](mysql-cluster-options-variables.html#statvar_Ndb_api_trans_local_read_row_count)

  The total number of rows that have been read by this MySQL Server (SQL node). This includes all rows read by any primary key, unique key, or scan operation made by this MySQL Server (SQL node).

  Although this variable can be read using either [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") or [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it is effectively global in scope.

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_trans_start_count_session`](mysql-cluster-options-variables.html#statvar_Ndb_api_trans_start_count_session)

  The number of transactions started in this client session.

  Although this variable can be read using either [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") or [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it relates to the current session only, and is not affected by any other clients of this [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server").

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_trans_start_count_slave`](mysql-cluster-options-variables.html#statvar_Ndb_api_trans_start_count_slave)

  The number of transactions started by this replica.

  Although this variable can be read using either [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") or [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it is effectively global in scope. If this MySQL server does not act as a replica, or does not use NDB tables, this value is always 0.

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_trans_start_count`](mysql-cluster-options-variables.html#statvar_Ndb_api_trans_start_count)

  The number of transactions started by this MySQL Server (SQL node).

  Although this variable can be read using either [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") or [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it is effectively global in scope.

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_uk_op_count_session`](mysql-cluster-options-variables.html#statvar_Ndb_api_uk_op_count_session)

  The number of operations in this client session based on or using unique keys.

  Although this variable can be read using either [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") or [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it relates to the current session only, and is not affected by any other clients of this [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server").

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_uk_op_count_slave`](mysql-cluster-options-variables.html#statvar_Ndb_api_uk_op_count_slave)

  The number of operations by this replica based on or using unique keys.

  Although this variable can be read using either [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") or [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it is effectively global in scope. If this MySQL server does not act as a replica, or does not use NDB tables, this value is always 0.

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_uk_op_count`](mysql-cluster-options-variables.html#statvar_Ndb_api_uk_op_count)

  The number of operations by this MySQL Server (SQL node) based on or using unique keys.

  Although this variable can be read using either [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") or [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it is effectively global in scope.

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_wait_exec_complete_count_session`](mysql-cluster-options-variables.html#statvar_Ndb_api_wait_exec_complete_count_session)

  The number of times a thread has been blocked in this client session while waiting for execution of an operation to complete. This includes all [`execute()`](/doc/ndbapi/en/ndb-ndbtransaction.html#ndb-ndbtransaction-execute) calls as well as implicit executes for blob and auto-increment operations not visible to clients.

  Although this variable can be read using either [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") or [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it relates to the current session only, and is not affected by any other clients of this [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server").

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_wait_exec_complete_count_slave`](mysql-cluster-options-variables.html#statvar_Ndb_api_wait_exec_complete_count_slave)

  The number of times a thread has been blocked by this replica while waiting for execution of an operation to complete. This includes all [`execute()`](/doc/ndbapi/en/ndb-ndbtransaction.html#ndb-ndbtransaction-execute) calls as well as implicit executes for blob and auto-increment operations not visible to clients.

  Although this variable can be read using either [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") or [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it is effectively global in scope. If this MySQL server does not act as a replica, or does not use NDB tables, this value is always 0.

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_wait_exec_complete_count`](mysql-cluster-options-variables.html#statvar_Ndb_api_wait_exec_complete_count)

  The number of times a thread has been blocked by this MySQL Server (SQL node) while waiting for execution of an operation to complete. This includes all [`execute()`](/doc/ndbapi/en/ndb-ndbtransaction.html#ndb-ndbtransaction-execute) calls as well as implicit executes for blob and auto-increment operations not visible to clients.

  Although this variable can be read using either [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") or [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it is effectively global in scope.

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_wait_meta_request_count_session`](mysql-cluster-options-variables.html#statvar_Ndb_api_wait_meta_request_count_session)

  The number of times a thread has been blocked in this client session waiting for a metadata-based signal, such as is expected for DDL requests, new epochs, and seizure of transaction records.

  Although this variable can be read using either [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") or [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it relates to the current session only, and is not affected by any other clients of this [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server").

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_wait_meta_request_count_slave`](mysql-cluster-options-variables.html#statvar_Ndb_api_wait_meta_request_count_slave)

  The number of times a thread has been blocked by this replica waiting for a metadata-based signal, such as is expected for DDL requests, new epochs, and seizure of transaction records.

  Although this variable can be read using either [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") or [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it is effectively global in scope. If this MySQL server does not act as a replica, or does not use NDB tables, this value is always 0.

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_wait_meta_request_count`](mysql-cluster-options-variables.html#statvar_Ndb_api_wait_meta_request_count)

  The number of times a thread has been blocked by this MySQL Server (SQL node) waiting for a metadata-based signal, such as is expected for DDL requests, new epochs, and seizure of transaction records.

  Although this variable can be read using either [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") or [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it is effectively global in scope.

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_wait_nanos_count_session`](mysql-cluster-options-variables.html#statvar_Ndb_api_wait_nanos_count_session)

  Total time (in nanoseconds) spent in this client session waiting for any type of signal from the data nodes.

  Although this variable can be read using either [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") or [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it relates to the current session only, and is not affected by any other clients of this [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server").

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_wait_nanos_count_slave`](mysql-cluster-options-variables.html#statvar_Ndb_api_wait_nanos_count_slave)

  Total time (in nanoseconds) spent by this replica waiting for any type of signal from the data nodes.

  Although this variable can be read using either [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") or [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it is effectively global in scope. If this MySQL server does not act as a replica, or does not use NDB tables, this value is always 0.

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_wait_nanos_count`](mysql-cluster-options-variables.html#statvar_Ndb_api_wait_nanos_count)

  Total time (in nanoseconds) spent by this MySQL Server (SQL node) waiting for any type of signal from the data nodes.

  Although this variable can be read using either [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") or [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it is effectively global in scope.

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_wait_scan_result_count_session`](mysql-cluster-options-variables.html#statvar_Ndb_api_wait_scan_result_count_session)

  The number of times a thread has been blocked in this client session while waiting for a scan-based signal, such as when waiting for more results from a scan, or when waiting for a scan to close.

  Although this variable can be read using either [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") or [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it relates to the current session only, and is not affected by any other clients of this [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server").

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_wait_scan_result_count_slave`](mysql-cluster-options-variables.html#statvar_Ndb_api_wait_scan_result_count_slave)

  The number of times a thread has been blocked by this replica while waiting for a scan-based signal, such as when waiting for more results from a scan, or when waiting for a scan to close.

  Although this variable can be read using either [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") or [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it is effectively global in scope. If this MySQL server does not act as a replica, or does not use NDB tables, this value is always 0.

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_api_wait_scan_result_count`](mysql-cluster-options-variables.html#statvar_Ndb_api_wait_scan_result_count)

  The number of times a thread has been blocked by this MySQL Server (SQL node) while waiting for a scan-based signal, such as when waiting for more results from a scan, or when waiting for a scan to close.

  Although this variable can be read using either [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") or [`SHOW SESSION STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it is effectively global in scope.

  For more information, see [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables").

* [`Ndb_cluster_node_id`](mysql-cluster-options-variables.html#statvar_Ndb_cluster_node_id)

  If the server is acting as an NDB Cluster node, then the value of this variable its node ID in the cluster.

  If the server is not part of an NDB Cluster, then the value of this variable is 0.

* [`Ndb_config_from_host`](mysql-cluster-options-variables.html#statvar_Ndb_config_from_host)

  If the server is part of an NDB Cluster, the value of this variable is the host name or IP address of the Cluster management server from which it gets its configuration data.

  If the server is not part of an NDB Cluster, then the value of this variable is an empty string.

* [`Ndb_config_from_port`](mysql-cluster-options-variables.html#statvar_Ndb_config_from_port)

  If the server is part of an NDB Cluster, the value of this variable is the number of the port through which it is connected to the Cluster management server from which it gets its configuration data.

  If the server is not part of an NDB Cluster, then the value of this variable is 0.

* [`Ndb_conflict_fn_epoch`](mysql-cluster-options-variables.html#statvar_Ndb_conflict_fn_epoch)

  Used in NDB Cluster Replication conflict resolution, this variable shows the number of rows found to be in conflict using `NDB$EPOCH()` conflict resolution on a given [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") since the last time it was restarted.

  For more information, see [Section 21.7.11, “NDB Cluster Replication Conflict Resolution”](mysql-cluster-replication-conflict-resolution.html "21.7.11 NDB Cluster Replication Conflict Resolution").

* [`Ndb_conflict_fn_epoch_trans`](mysql-cluster-options-variables.html#statvar_Ndb_conflict_fn_epoch_trans)

  Used in NDB Cluster Replication conflict resolution, this variable shows the number of rows found to be in conflict using `NDB$EPOCH_TRANS()` conflict resolution on a given [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") since the last time it was restarted.

  For more information, see [Section 21.7.11, “NDB Cluster Replication Conflict Resolution”](mysql-cluster-replication-conflict-resolution.html "21.7.11 NDB Cluster Replication Conflict Resolution").

* [`Ndb_conflict_fn_epoch2`](mysql-cluster-options-variables.html#statvar_Ndb_conflict_fn_epoch2)

  Shows the number of rows found to be in conflict in NDB Cluster Replication conflict resolution, when using `NDB$EPOCH2()`, on the source designated as the primary since the last time it was restarted.

  For more information, see [NDB$EPOCH2()](mysql-cluster-replication-conflict-resolution.html#mysql-cluster-replication-ndb-epoch2 "NDB$EPOCH2()").

* [`Ndb_conflict_fn_epoch2_trans`](mysql-cluster-options-variables.html#statvar_Ndb_conflict_fn_epoch2_trans)

  Used in NDB Cluster Replication conflict resolution, this variable shows the number of rows found to be in conflict using `NDB$EPOCH_TRANS2()` conflict resolution on a given [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") since the last time it was restarted.

  For more information, see [NDB$EPOCH2\_TRANS()](mysql-cluster-replication-conflict-resolution.html#mysql-cluster-replication-ndb-epoch2-trans "NDB$EPOCH2_TRANS()").

* [`Ndb_conflict_fn_max`](mysql-cluster-options-variables.html#statvar_Ndb_conflict_fn_max)

  Used in NDB Cluster Replication conflict resolution, this variable shows the number of times that a row was not applied on the current SQL node due to “greatest timestamp wins” conflict resolution since the last time that this [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") was started.

  For more information, see [Section 21.7.11, “NDB Cluster Replication Conflict Resolution”](mysql-cluster-replication-conflict-resolution.html "21.7.11 NDB Cluster Replication Conflict Resolution").

* [`Ndb_conflict_fn_max_del_win`](mysql-cluster-options-variables.html#statvar_Ndb_conflict_fn_max_del_win)

  Shows the number of times that a row was rejected on the current SQL node due to NDB Cluster Replication conflict resolution using `NDB$MAX_DELETE_WIN()`, since the last time that this [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") was started.

  For more information, see [Section 21.7.11, “NDB Cluster Replication Conflict Resolution”](mysql-cluster-replication-conflict-resolution.html "21.7.11 NDB Cluster Replication Conflict Resolution").

* [`Ndb_conflict_fn_old`](mysql-cluster-options-variables.html#statvar_Ndb_conflict_fn_old)

  Used in NDB Cluster Replication conflict resolution, this variable shows the number of times that a row was not applied as the result of “same timestamp wins” conflict resolution on a given [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") since the last time it was restarted.

  For more information, see [Section 21.7.11, “NDB Cluster Replication Conflict Resolution”](mysql-cluster-replication-conflict-resolution.html "21.7.11 NDB Cluster Replication Conflict Resolution").

* [`Ndb_conflict_last_conflict_epoch`](mysql-cluster-options-variables.html#statvar_Ndb_conflict_last_conflict_epoch)

  The most recent epoch in which a conflict was detected on this replica. You can compare this value with [`Ndb_slave_max_replicated_epoch`](mysql-cluster-options-variables.html#statvar_Ndb_slave_max_replicated_epoch); if `Ndb_slave_max_replicated_epoch` is greater than `Ndb_conflict_last_conflict_epoch`, no conflicts have yet been detected.

  See [Section 21.7.11, “NDB Cluster Replication Conflict Resolution”](mysql-cluster-replication-conflict-resolution.html "21.7.11 NDB Cluster Replication Conflict Resolution"), for more information.

* [`Ndb_conflict_reflected_op_discard_count`](mysql-cluster-options-variables.html#statvar_Ndb_conflict_reflected_op_discard_count)

  When using NDB Cluster Replication conflict resolution, this is the number of reflected operations that were not applied on the secondary, due to encountering an error during execution.

  See [Section 21.7.11, “NDB Cluster Replication Conflict Resolution”](mysql-cluster-replication-conflict-resolution.html "21.7.11 NDB Cluster Replication Conflict Resolution"), for more information.

* [`Ndb_conflict_reflected_op_prepare_count`](mysql-cluster-options-variables.html#statvar_Ndb_conflict_reflected_op_prepare_count)

  When using conflict resolution with NDB Cluster Replication, this status variable contains the number of reflected operations that have been defined (that is, prepared for execution on the secondary).

  See [Section 21.7.11, “NDB Cluster Replication Conflict Resolution”](mysql-cluster-replication-conflict-resolution.html "21.7.11 NDB Cluster Replication Conflict Resolution").

* [`Ndb_conflict_refresh_op_count`](mysql-cluster-options-variables.html#statvar_Ndb_conflict_refresh_op_count)

  When using conflict resolution with NDB Cluster Replication, this gives the number of refresh operations that have been prepared for execution on the secondary.

  See [Section 21.7.11, “NDB Cluster Replication Conflict Resolution”](mysql-cluster-replication-conflict-resolution.html "21.7.11 NDB Cluster Replication Conflict Resolution"), for more information.

* [`Ndb_conflict_last_stable_epoch`](mysql-cluster-options-variables.html#statvar_Ndb_conflict_last_stable_epoch)

  Number of rows found to be in conflict by a transactional conflict function

  See [Section 21.7.11, “NDB Cluster Replication Conflict Resolution”](mysql-cluster-replication-conflict-resolution.html "21.7.11 NDB Cluster Replication Conflict Resolution"), for more information.

* [`Ndb_conflict_trans_row_conflict_count`](mysql-cluster-options-variables.html#statvar_Ndb_conflict_trans_row_conflict_count)

  Used in NDB Cluster Replication conflict resolution, this status variable shows the number of rows found to be directly in-conflict by a transactional conflict function on a given [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") since the last time it was restarted.

  Currently, the only transactional conflict detection function supported by NDB Cluster is NDB$EPOCH\_TRANS(), so this status variable is effectively the same as [`Ndb_conflict_fn_epoch_trans`](mysql-cluster-options-variables.html#statvar_Ndb_conflict_fn_epoch_trans).

  For more information, see [Section 21.7.11, “NDB Cluster Replication Conflict Resolution”](mysql-cluster-replication-conflict-resolution.html "21.7.11 NDB Cluster Replication Conflict Resolution").

* [`Ndb_conflict_trans_row_reject_count`](mysql-cluster-options-variables.html#statvar_Ndb_conflict_trans_row_reject_count)

  Used in NDB Cluster Replication conflict resolution, this status variable shows the total number of rows realigned due to being determined as conflicting by a transactional conflict detection function. This includes not only [`Ndb_conflict_trans_row_conflict_count`](mysql-cluster-options-variables.html#statvar_Ndb_conflict_trans_row_conflict_count), but any rows in or dependent on conflicting transactions.

  For more information, see [Section 21.7.11, “NDB Cluster Replication Conflict Resolution”](mysql-cluster-replication-conflict-resolution.html "21.7.11 NDB Cluster Replication Conflict Resolution").

* [`Ndb_conflict_trans_reject_count`](mysql-cluster-options-variables.html#statvar_Ndb_conflict_trans_reject_count)

  Used in NDB Cluster Replication conflict resolution, this status variable shows the number of transactions found to be in conflict by a transactional conflict detection function.

  For more information, see [Section 21.7.11, “NDB Cluster Replication Conflict Resolution”](mysql-cluster-replication-conflict-resolution.html "21.7.11 NDB Cluster Replication Conflict Resolution").

* [`Ndb_conflict_trans_detect_iter_count`](mysql-cluster-options-variables.html#statvar_Ndb_conflict_trans_detect_iter_count)

  Used in NDB Cluster Replication conflict resolution, this shows the number of internal iterations required to commit an epoch transaction. Should be (slightly) greater than or equal to [`Ndb_conflict_trans_conflict_commit_count`](mysql-cluster-options-variables.html#statvar_Ndb_conflict_trans_conflict_commit_count).

  For more information, see [Section 21.7.11, “NDB Cluster Replication Conflict Resolution”](mysql-cluster-replication-conflict-resolution.html "21.7.11 NDB Cluster Replication Conflict Resolution").

* [`Ndb_conflict_trans_conflict_commit_count`](mysql-cluster-options-variables.html#statvar_Ndb_conflict_trans_conflict_commit_count)

  Used in NDB Cluster Replication conflict resolution, this shows the number of epoch transactions committed after they required transactional conflict handling.

  For more information, see [Section 21.7.11, “NDB Cluster Replication Conflict Resolution”](mysql-cluster-replication-conflict-resolution.html "21.7.11 NDB Cluster Replication Conflict Resolution").

* [`Ndb_epoch_delete_delete_count`](mysql-cluster-options-variables.html#statvar_Ndb_epoch_delete_delete_count)

  When using delete-delete conflict detection, this is the number of delete-delete conflicts detected, where a delete operation is applied, but the indicated row does not exist.

* [`Ndb_execute_count`](mysql-cluster-options-variables.html#statvar_Ndb_execute_count)

  Provides the number of round trips to the [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") kernel made by operations.

* [`Ndb_last_commit_epoch_server`](mysql-cluster-options-variables.html#statvar_Ndb_last_commit_epoch_server)

  The epoch most recently committed by `NDB`.

* [`Ndb_last_commit_epoch_session`](mysql-cluster-options-variables.html#statvar_Ndb_last_commit_epoch_session)

  The epoch most recently committed by this `NDB` client.

* [`Ndb_number_of_data_nodes`](mysql-cluster-options-variables.html#statvar_Ndb_number_of_data_nodes)

  If the server is part of an NDB Cluster, the value of this variable is the number of data nodes in the cluster.

  If the server is not part of an NDB Cluster, then the value of this variable is 0.

* [`Ndb_pushed_queries_defined`](mysql-cluster-options-variables.html#statvar_Ndb_pushed_queries_defined)

  The total number of joins pushed down to the NDB kernel for distributed handling on the data nodes.

  Note

  Joins tested using [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") that can be pushed down contribute to this number.

* [`Ndb_pushed_queries_dropped`](mysql-cluster-options-variables.html#statvar_Ndb_pushed_queries_dropped)

  The number of joins that were pushed down to the NDB kernel but that could not be handled there.

* [`Ndb_pushed_queries_executed`](mysql-cluster-options-variables.html#statvar_Ndb_pushed_queries_executed)

  The number of joins successfully pushed down to [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") and executed there.

* [`Ndb_pushed_reads`](mysql-cluster-options-variables.html#statvar_Ndb_pushed_reads)

  The number of rows returned to [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") from the NDB kernel by joins that were pushed down.

  Note

  Executing [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") on joins that can be pushed down to [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") does not add to this number.

* [`Ndb_pruned_scan_count`](mysql-cluster-options-variables.html#statvar_Ndb_pruned_scan_count)

  This variable holds a count of the number of scans executed by [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") since the NDB Cluster was last started where [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") was able to use partition pruning.

  Using this variable together with [`Ndb_scan_count`](mysql-cluster-options-variables.html#statvar_Ndb_scan_count) can be helpful in schema design to maximize the ability of the server to prune scans to a single table partition, thereby involving only a single data node.

* [`Ndb_scan_count`](mysql-cluster-options-variables.html#statvar_Ndb_scan_count)

  This variable holds a count of the total number of scans executed by [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") since the NDB Cluster was last started.

* [`Ndb_slave_max_replicated_epoch`](mysql-cluster-options-variables.html#statvar_Ndb_slave_max_replicated_epoch)

  The most recently committed epoch on this replica. You can compare this value with [`Ndb_conflict_last_conflict_epoch`](mysql-cluster-options-variables.html#statvar_Ndb_conflict_last_conflict_epoch); if `Ndb_slave_max_replicated_epoch` is the greater of the two, no conflicts have yet been detected.

  For more information, see [Section 21.7.11, “NDB Cluster Replication Conflict Resolution”](mysql-cluster-replication-conflict-resolution.html "21.7.11 NDB Cluster Replication Conflict Resolution").

* [`Ndb_system_name`](mysql-cluster-options-variables.html#statvar_Ndb_system_name)

  If this MySQL Server is connected to an NDB cluster, this read-only variable shows the cluster system name. Otherwise, the value is an empty string.
