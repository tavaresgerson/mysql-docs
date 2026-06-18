#### 19.1.4.1 Replication Mode Concepts

Before setting the replication mode of an online server, it is
important to understand some key concepts of replication. This
section explains these concepts and is essential reading before
attempting to modify the replication mode of an online server.

The modes of replication available in MySQL rely on different
techniques for identifying logged transactions. The types of
transactions used by replication are listed here:

* GTID transactions are identified by a global transaction
  identifier (GTID) which takes the form
  `UUID:NUMBER`. Every GTID transaction in the
  binary log is preceded by a `Gtid_log_event`.
  A GTID transaction can be addressed either by its GTID, or by
  the name of the file in which it is logged and its position
  within that file.

* An anonymous transaction has no GTID; MySQL 8.0
  ensures that every anonymous transaction in a log is preceded
  by an `Anonymous_gtid_log_event`. (In
  previous versions of MySQL, an anonymous transaction was not
  preceded by any particular event.) An anonymous transaction
  can be addressed by file name and position only.

When using GTIDs you can take advantage of GTID auto-positioning
and automatic failover, and use
[`WAIT_FOR_EXECUTED_GTID_SET()`](gtid-functions.html#function_wait-for-executed-gtid-set),
[`session_track_gtids`](server-system-variables.html#sysvar_session_track_gtids), and
Performance Schema tables to monitor replicated transactions (see
[Section 29.12.11, “Performance Schema Replication Tables”](performance-schema-replication-tables.html "29.12.11 Performance Schema Replication Tables")).

A transaction in a relay log from a source running a previous
version of MySQL might not be preceded by any particular event,
but after being replayed and recorded in the replica's binary
log, it is preceded with an
`Anonymous_gtid_log_event`.

To change the replication mode online, it is necessary to set the
[`gtid_mode`](replication-options-gtids.html#sysvar_gtid_mode) and
[`enforce_gtid_consistency`](replication-options-gtids.html#sysvar_enforce_gtid_consistency)
variables using an account that has privileges sufficient to set
global system variables; see
[Section 7.1.9.1, “System Variable Privileges”](system-variable-privileges.html "7.1.9.1 System Variable Privileges"). Permitted values for
[`gtid_mode`](replication-options-gtids.html#sysvar_gtid_mode) are listed here, in
order, with their meanings:

* `OFF`: Only anonymous transactions can be
  replicated.

* `OFF_PERMISSIVE`: New transactions are
  anonymous; replicated transactions may be either GTID or
  anonymous.

* `ON_PERMISSIVE`: New transactions use GTIDs;
  replicated transactions may be either GTID or anonymous.

* `ON`: All transaction must have GTIDs;
  anonymous transactions cannot be replicated.

It is possible to have servers using anonymous and servers using
GTID transactions in the same replication topology. For example, a
source where [`gtid_mode=ON`](replication-options-gtids.html#sysvar_gtid_mode) can
replicate to a replica where
[`gtid_mode=ON_PERMISSIVE`](replication-options-gtids.html#sysvar_gtid_mode).

[`gtid_mode`](replication-options-gtids.html#sysvar_gtid_mode) can be changed only one
step at a time, based on the order of the values as shown in the
previous list. For example, if
[`gtid_mode`](replication-options-gtids.html#sysvar_gtid_mode) is set to
`OFF_PERMISSIVE`, it is possible to change it to
`OFF` or `ON_PERMISSIVE`, but
not to `ON`. This is to ensure that the process
of changing from anonymous transactions to GTID transactions
online is handled correctly by the server; the GTID state (in
other words the value of
[`gtid_executed`](replication-options-gtids.html#sysvar_gtid_executed)) is persistent.
This ensures that the GTID setting applied by the server is always
retained and is correct, regardless of any changes in the value of
[`gtid_mode`](replication-options-gtids.html#sysvar_gtid_mode).

System variables which display GTID sets, such as
[`gtid_executed`](replication-options-gtids.html#sysvar_gtid_executed) and
[`gtid_purged`](replication-options-gtids.html#sysvar_gtid_purged), the
`RECEIVED_TRANSACTION_SET` column of the
Performance Schema
[`replication_connection_status`](performance-schema-replication-connection-status-table.html "29.12.11.11 The replication_connection_status Table") table,
and results relating to GTIDs in the output of
[`SHOW REPLICA STATUS`](show-replica-status.html "15.7.7.35 SHOW REPLICA STATUS Statement") all return
empty strings when there are no GTIDs present. Sources of
information about a single GTID, such as the information shown in
the `CURRENT_TRANSACTION` column of the
Performance Schema
[`replication_applier_status_by_worker`](performance-schema-replication-applier-status-by-worker-table.html "29.12.11.5 The replication_applier_status_by_worker Table")
table, show `ANONYMOUS` when GTID transactions
are not in use.

Replication from a source using
[`gtid_mode=ON`](replication-options-gtids.html#sysvar_gtid_mode) provides the ability
to use GTID auto-positioning, configured using the
`SOURCE_AUTO_POSITION` option of the
[`CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement")
statement. The replication topology in use has an impact on
whether it is possible to enable auto-positioning or not, since
this feature relies on GTIDs and is not compatible with anonymous
transactions. It is strongly recommended to ensure there are no
anonymous transactions remaining in the topology before enabling
auto-positioning; see
[Section 19.1.4.2, “Enabling GTID Transactions Online”](replication-mode-change-online-enable-gtids.html "19.1.4.2 Enabling GTID Transactions Online").

Valid combinations of [`gtid_mode`](replication-options-gtids.html#sysvar_gtid_mode)
and auto-positioning on source and replica are shown in the next
table. The meaning of each entry is as follows:

* `Y`: The values of
  [`gtid_mode`](replication-options-gtids.html#sysvar_gtid_mode) on the source and
  on the replica are compatible.

* `N`: The values of
  [`gtid_mode`](replication-options-gtids.html#sysvar_gtid_mode) on the source and
  on the replica are not compatible.

* `*`: Auto-positioning can be used with this
  combination of values.

**Table 19.1 Valid Combinations of Source and Replica gtid\_mode**

<table summary="Explains compatible (Y) and incompatible (N) combinations of source and replica GTID mode. An asterisk (*) indicates that auto-positioning can be used with this combination of GTID modes."><col style="width: 26%"/><col style="width: 12%"/><col style="width: 24%"/><col style="width: 24%"/><col style="width: 12%"/><thead><tr>
<th scope="col"><p>
<a class="link" href="replication-options-gtids.html#sysvar_gtid_mode"><code class="literal">gtid_mode</code></a>
</p></th>
<th scope="col"><p>
              Source <code class="literal">OFF</code>
</p></th>
<th scope="col"><p>
              Source <code class="literal">OFF_PERMISSIVE</code>
</p></th>
<th scope="col"><p>
              Source <code class="literal">ON_PERMISSIVE</code>
</p></th>
<th scope="col"><p>
              Source <code class="literal">ON</code>
</p></th>
</tr></thead><tbody><tr>
<th scope="row"><p>
              Replica <code class="literal">OFF</code>
</p></th>
<td><p>
              Y
            </p></td>
<td><p>
              Y
            </p></td>
<td><p>
              N
            </p></td>
<td><p>
              N
            </p></td>
</tr><tr>
<th scope="row"><p>
              Replica <code class="literal">OFF_PERMISSIVE</code>
</p></th>
<td><p>
              Y
            </p></td>
<td><p>
              Y
            </p></td>
<td><p>
              Y
            </p></td>
<td><p>
              Y*
            </p></td>
</tr><tr>
<th scope="row"><p>
              Replica <code class="literal">ON_PERMISSIVE</code>
</p></th>
<td><p>
              Y
            </p></td>
<td><p>
              Y
            </p></td>
<td><p>
              Y
            </p></td>
<td><p>
              Y*
            </p></td>
</tr><tr>
<th scope="row"><p>
              Replica <code class="literal">ON</code>
</p></th>
<td><p>
              N
            </p></td>
<td><p>
              N
            </p></td>
<td><p>
              Y
            </p></td>
<td><p>
              Y*
            </p></td>
</tr></tbody></table>

The current value of [`gtid_mode`](replication-options-gtids.html#sysvar_gtid_mode)
also affects [`gtid_next`](replication-options-gtids.html#sysvar_gtid_next). The next
table shows the behavior of the server for combinations of
different values of [`gtid_mode`](replication-options-gtids.html#sysvar_gtid_mode) and
[`gtid_next`](replication-options-gtids.html#sysvar_gtid_next). The meaning of each
entry is as follows:

* `ANONYMOUS`: Generate an anonymous
  transaction.

* `Error`: Generate an error, and do not
  execute `SET GTID_NEXT`.

* `UUID:NUMBER`: Generate a GTID with the
  specified UUID:NUMBER.

* `New GTID`: Generate a GTID with an
  automatically generated number.

**Table 19.2 Valid Combinations of gtid\_mode and gtid\_next**

<table summary="Explains the behavior for each of the possible combinations of GTID mode and setting for the gtid_next variable. With gtid_next set to AUTOMATIC, the behavior also varies depending on whether binary logging is enabled or disabled."><col style="width: 20%"/><col style="width: 20%"/><col style="width: 20%"/><col style="width: 20%"/><col style="width: 20%"/><thead><tr>
<th scope="col"></th>
<th scope="col"><p>
<a class="link" href="replication-options-gtids.html#sysvar_gtid_next"><code class="literal">gtid_next</code></a> AUTOMATIC
            </p><p>
              binary log on
            </p></th>
<th scope="col"><p>
<a class="link" href="replication-options-gtids.html#sysvar_gtid_next"><code class="literal">gtid_next</code></a> AUTOMATIC
            </p><p>
              binary log off
            </p></th>
<th scope="col"><p>
<a class="link" href="replication-options-gtids.html#sysvar_gtid_next"><code class="literal">gtid_next</code></a> ANONYMOUS
            </p></th>
<th scope="col"><p>
<a class="link" href="replication-options-gtids.html#sysvar_gtid_next"><code class="literal">gtid_next</code></a> UUID:NUMBER
            </p></th>
</tr></thead><tbody><tr>
<th scope="row"><p>
<a class="link" href="replication-options-gtids.html#sysvar_gtid_mode"><code class="literal">gtid_mode</code></a>
<code class="literal">OFF</code>
</p></th>
<td><p>
              ANONYMOUS
            </p></td>
<td><p>
              ANONYMOUS
            </p></td>
<td>ANONYMOUS</td>
<td><p>
              Error
            </p></td>
</tr><tr>
<th scope="row"><p>
<a class="link" href="replication-options-gtids.html#sysvar_gtid_mode"><code class="literal">gtid_mode</code></a>
<code class="literal">OFF_PERMISSIVE</code>
</p></th>
<td><p>
              ANONYMOUS
            </p></td>
<td><p>
              ANONYMOUS
            </p></td>
<td><p>
              ANONYMOUS
            </p></td>
<td><p>
              UUID:NUMBER
            </p></td>
</tr><tr>
<th scope="row"><p>
<a class="link" href="replication-options-gtids.html#sysvar_gtid_mode"><code class="literal">gtid_mode</code></a>
<code class="literal">ON_PERMISSIVE</code>
</p></th>
<td><p>
              New GTID
            </p></td>
<td><p>
              ANONYMOUS
            </p></td>
<td><p>
              ANONYMOUS
            </p></td>
<td><p>
              UUID:NUMBER
            </p></td>
</tr><tr>
<th scope="row"><p>
<a class="link" href="replication-options-gtids.html#sysvar_gtid_mode"><code class="literal">gtid_mode</code></a>
<code class="literal">ON</code>
</p></th>
<td><p>
              New GTID
            </p></td>
<td><p>
              ANONYMOUS
            </p></td>
<td><p>
              Error
            </p></td>
<td><p>
              UUID:NUMBER
            </p></td>
</tr></tbody></table>

When binary logging is not in use and
[`gtid_next`](replication-options-gtids.html#sysvar_gtid_next) is
`AUTOMATIC`, then no GTID is generated, which is
consistent with the behavior of previous versions of MySQL.