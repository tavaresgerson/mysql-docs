### 16.1.6 Replication and Binary Logging Options and Variables

[16.1.6.1 Replication and Binary Logging Option and Variable Reference](replication-options-reference.html)

[16.1.6.2 Replication Source Options and Variables](replication-options-source.html)

[16.1.6.3 Replica Server Options and Variables](replication-options-replica.html)

[16.1.6.4 Binary Logging Options and Variables](replication-options-binary-log.html)

[16.1.6.5 Global Transaction ID System Variables](replication-options-gtids.html)

The following sections contain information about [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") options and server variables that are used in replication and for controlling the binary log. Options and variables for use on sources and replicas are covered separately, as are options and variables relating to binary logging and global transaction identifiers (GTIDs). A set of quick-reference tables providing basic information about these options and variables is also included.

Of particular importance is the [`server_id`](replication-options.html#sysvar_server_id) system variable.

<table frame="box" rules="all" summary="Properties for server_id"><tbody><tr><th>Command-Line Format</th> <td><code>--server-id=#</code></td> </tr><tr><th>System Variable</th> <td><code>server_id</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

This variable specifies the server ID. In MySQL 5.7, [`server_id`](replication-options.html#sysvar_server_id) must be specified if binary logging is enabled, otherwise the server is not allowed to start.

[`server_id`](replication-options.html#sysvar_server_id) is set to 0 by default. On a replication source server and each replica, you *must* specify [`server_id`](replication-options.html#sysvar_server_id) to establish a unique replication ID in the range from 1 to 232 − 1. “Unique”, means that each ID must be different from every other ID in use by any other source or replica in the replication topology. For additional information, see [Section 16.1.6.2, “Replication Source Options and Variables”](replication-options-source.html "16.1.6.2 Replication Source Options and Variables"), and [Section 16.1.6.3, “Replica Server Options and Variables”](replication-options-replica.html "16.1.6.3 Replica Server Options and Variables").

If the server ID is set to 0, binary logging takes place, but a source with a server ID of 0 refuses any connections from replicas, and a replica with a server ID of 0 refuses to connect to a source. Note that although you can change the server ID dynamically to a nonzero value, doing so does not enable replication to start immediately. You must change the server ID and then restart the server to initialize the replica.

For more information, see [Section 16.1.2.5.1, “Setting the Replica Configuration”](replication-setup-replicas.html#replication-howto-slavebaseconfig "16.1.2.5.1 Setting the Replica Configuration").

[`server_uuid`](replication-options.html#sysvar_server_uuid)

In MySQL 5.7, the server generates a true UUID in addition to the [`server_id`](replication-options.html#sysvar_server_id) value supplied by the user. This is available as the global, read-only [`server_uuid`](replication-options.html#sysvar_server_uuid) system variable.

Note

The presence of the [`server_uuid`](replication-options.html#sysvar_server_uuid) system variable in MySQL 5.7 does not change the requirement for setting a unique [`server_id`](replication-options.html#sysvar_server_id) value for each MySQL server as part of preparing and running MySQL replication, as described earlier in this section.

<table frame="box" rules="all" summary="Properties for server_uuid"><tbody><tr><th>System Variable</th> <td><code>server_uuid</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

When starting, the MySQL server automatically obtains a UUID as follows:

1. Attempt to read and use the UUID written in the file `data_dir/auto.cnf` (where *`data_dir`* is the server's data directory).

2. If `data_dir/auto.cnf` is not found, generate a new UUID and save it to this file, creating the file if necessary.

The `auto.cnf` file has a format similar to that used for `my.cnf` or `my.ini` files. In MySQL 5.7, `auto.cnf` has only a single `[auto]` section containing a single [`server_uuid`](replication-options.html#sysvar_server_uuid) setting and value; the file's contents appear similar to what is shown here:

```sql
[auto]
server_uuid=8a94f357-aab4-11df-86ab-c80aa9429562
```

Important

The `auto.cnf` file is automatically generated; do not attempt to write or modify this file.

When using MySQL replication, sources and replicas know each other's UUIDs. The value of a replica's UUID can be seen in the output of [`SHOW SLAVE HOSTS`](show-slave-hosts.html "13.7.5.33 SHOW SLAVE HOSTS Statement"). Once [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") has been executed, the value of the source's UUID is available on the replica in the output of [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement").

Note

Issuing a [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement") or [`RESET SLAVE`](reset-slave.html "13.4.2.3 RESET SLAVE Statement") statement does *not* reset the source's UUID as used on the replica.

A server's `server_uuid` is also used in GTIDs for transactions originating on that server. For more information, see [Section 16.1.3, “Replication with Global Transaction Identifiers”](replication-gtids.html "16.1.3 Replication with Global Transaction Identifiers").

When starting, the replication I/O thread generates an error and aborts if its source's UUID is equal to its own unless the [`--replicate-same-server-id`](replication-options-replica.html#option_mysqld_replicate-same-server-id) option has been set. In addition, the replication I/O thread generates a warning if either of the following is true:

* No source having the expected [`server_uuid`](replication-options.html#sysvar_server_uuid) exists.

* The source's [`server_uuid`](replication-options.html#sysvar_server_uuid) has changed, although no [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") statement has ever been executed.
