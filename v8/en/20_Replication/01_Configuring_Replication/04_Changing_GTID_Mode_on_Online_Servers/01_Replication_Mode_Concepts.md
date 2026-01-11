#### 19.1.4.1 Replication Mode Concepts

Before setting the replication mode of an online server, it is important to understand some key concepts of replication. This section explains these concepts and is essential reading before attempting to modify the replication mode of an online server.

The modes of replication available in MySQL rely on different techniques for identifying logged transactions. The types of transactions used by replication are listed here:

* GTID transactions are identified by a global transaction identifier (GTID) which takes the form `UUID:NUMBER`. Every GTID transaction in the binary log is preceded by a `Gtid_log_event`. A GTID transaction can be addressed either by its GTID, or by the name of the file in which it is logged and its position within that file.

* An anonymous transaction has no GTID; MySQL 8.0 ensures that every anonymous transaction in a log is preceded by an `Anonymous_gtid_log_event`. (In previous versions of MySQL, an anonymous transaction was not preceded by any particular event.) An anonymous transaction can be addressed by file name and position only.

When using GTIDs you can take advantage of GTID auto-positioning and automatic failover, and use `WAIT_FOR_EXECUTED_GTID_SET()`, `session_track_gtids`, and Performance Schema tables to monitor replicated transactions (see Section 29.12.11, “Performance Schema Replication Tables”).

A transaction in a relay log from a source running a previous version of MySQL might not be preceded by any particular event, but after being replayed and recorded in the replica's binary log, it is preceded with an `Anonymous_gtid_log_event`.

To change the replication mode online, it is necessary to set the `gtid_mode` and `enforce_gtid_consistency` variables using an account that has privileges sufficient to set global system variables; see Section 7.1.9.1, “System Variable Privileges”. Permitted values for `gtid_mode` are listed here, in order, with their meanings:

* `OFF`: Only anonymous transactions can be replicated.

* `OFF_PERMISSIVE`: New transactions are anonymous; replicated transactions may be either GTID or anonymous.

* `ON_PERMISSIVE`: New transactions use GTIDs; replicated transactions may be either GTID or anonymous.

* `ON`: All transaction must have GTIDs; anonymous transactions cannot be replicated.

It is possible to have servers using anonymous and servers using GTID transactions in the same replication topology. For example, a source where `gtid_mode=ON` can replicate to a replica where `gtid_mode=ON_PERMISSIVE`.

`gtid_mode` can be changed only one step at a time, based on the order of the values as shown in the previous list. For example, if `gtid_mode` is set to `OFF_PERMISSIVE`, it is possible to change it to `OFF` or `ON_PERMISSIVE`, but not to `ON`. This is to ensure that the process of changing from anonymous transactions to GTID transactions online is handled correctly by the server; the GTID state (in other words the value of `gtid_executed`) is persistent. This ensures that the GTID setting applied by the server is always retained and is correct, regardless of any changes in the value of `gtid_mode`.

System variables which display GTID sets, such as `gtid_executed` and `gtid_purged`, the `RECEIVED_TRANSACTION_SET` column of the Performance Schema `replication_connection_status` table, and results relating to GTIDs in the output of `SHOW REPLICA STATUS` all return empty strings when there are no GTIDs present. Sources of information about a single GTID, such as the information shown in the `CURRENT_TRANSACTION` column of the Performance Schema `replication_applier_status_by_worker` table, show `ANONYMOUS` when GTID transactions are not in use.

Replication from a source using `gtid_mode=ON` provides the ability to use GTID auto-positioning, configured using the `SOURCE_AUTO_POSITION` option of the `CHANGE REPLICATION SOURCE TO` statement. The replication topology in use has an impact on whether it is possible to enable auto-positioning or not, since this feature relies on GTIDs and is not compatible with anonymous transactions. It is strongly recommended to ensure there are no anonymous transactions remaining in the topology before enabling auto-positioning; see Section 19.1.4.2, “Enabling GTID Transactions Online”.

Valid combinations of `gtid_mode` and auto-positioning on source and replica are shown in the next table. The meaning of each entry is as follows:

* `Y`: The values of `gtid_mode` on the source and on the replica are compatible.

* `N`: The values of `gtid_mode` on the source and on the replica are not compatible.

* `*`: Auto-positioning can be used with this combination of values.

**Table 19.1 Valid Combinations of Source and Replica gtid_mode**

<table summary="Explains compatible (Y) and incompatible (N) combinations of source and replica GTID mode. An asterisk (*) indicates that auto-positioning can be used with this combination of GTID modes."><thead><tr> <th scope="col"><p> <code>gtid_mode</code> </p></th> <th scope="col"><p> Source <code>OFF</code> </p></th> <th scope="col"><p> Source <code>OFF_PERMISSIVE</code> </p></th> <th scope="col"><p> Source <code>ON_PERMISSIVE</code> </p></th> <th scope="col"><p> Source <code>ON</code> </p></th> </tr></thead><tbody><tr> <th><p> Replica <code>OFF</code> </p></th> <td><p> Y </p></td> <td><p> Y </p></td> <td><p> N </p></td> <td><p> N </p></td> </tr><tr> <th><p> Replica <code>OFF_PERMISSIVE</code> </p></th> <td><p> Y </p></td> <td><p> Y </p></td> <td><p> Y </p></td> <td><p> Y* </p></td> </tr><tr> <th><p> Replica <code>ON_PERMISSIVE</code> </p></th> <td><p> Y </p></td> <td><p> Y </p></td> <td><p> Y </p></td> <td><p> Y* </p></td> </tr><tr> <th><p> Replica <code>ON</code> </p></th> <td><p> N </p></td> <td><p> N </p></td> <td><p> Y </p></td> <td><p> Y* </p></td> </tr></tbody></table>

The current value of `gtid_mode` also affects `gtid_next`. The next table shows the behavior of the server for combinations of different values of `gtid_mode` and `gtid_next`. The meaning of each entry is as follows:

* `ANONYMOUS`: Generate an anonymous transaction.

* `Error`: Generate an error, and do not execute `SET GTID_NEXT`.

* `UUID:NUMBER`: Generate a GTID with the specified UUID:NUMBER.

* `New GTID`: Generate a GTID with an automatically generated number.

**Table 19.2 Valid Combinations of gtid_mode and gtid_next**

<table summary="Explains the behavior for each of the possible combinations of GTID mode and setting for the gtid_next variable. With gtid_next set to AUTOMATIC, the behavior also varies depending on whether binary logging is enabled or disabled."><thead><tr> <th scope="col"></th> <th scope="col"><p> <code>gtid_next</code> AUTOMATIC </p><p> binary log on </p></th> <th scope="col"><p> <code>gtid_next</code> AUTOMATIC </p><p> binary log off </p></th> <th scope="col"><p> <code>gtid_next</code> ANONYMOUS </p></th> <th scope="col"><p> <code>gtid_next</code> UUID:NUMBER </p></th> </tr></thead><tbody><tr> <th><p> <code>gtid_mode</code> <code>OFF</code> </p></th> <td><p> ANONYMOUS </p></td> <td><p> ANONYMOUS </p></td> <td>ANONYMOUS</td> <td><p> Error </p></td> </tr><tr> <th><p> <code>gtid_mode</code> <code>OFF_PERMISSIVE</code> </p></th> <td><p> ANONYMOUS </p></td> <td><p> ANONYMOUS </p></td> <td><p> ANONYMOUS </p></td> <td><p> UUID:NUMBER </p></td> </tr><tr> <th><p> <code>gtid_mode</code> <code>ON_PERMISSIVE</code> </p></th> <td><p> New GTID </p></td> <td><p> ANONYMOUS </p></td> <td><p> ANONYMOUS </p></td> <td><p> UUID:NUMBER </p></td> </tr><tr> <th><p> <code>gtid_mode</code> <code>ON</code> </p></th> <td><p> New GTID </p></td> <td><p> ANONYMOUS </p></td> <td><p> Error </p></td> <td><p> UUID:NUMBER </p></td> </tr></tbody></table>

When binary logging is not in use and `gtid_next` is `AUTOMATIC`, then no GTID is generated, which is consistent with the behavior of previous versions of MySQL.
