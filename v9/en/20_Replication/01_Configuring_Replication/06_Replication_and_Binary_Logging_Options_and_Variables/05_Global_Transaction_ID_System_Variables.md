#### 19.1.6.5 Global Transaction ID System Variables

The MySQL Server system variables described in this section are used to monitor and control Global Transaction Identifiers (GTIDs). For additional information, see Section 19.1.3, “Replication with Global Transaction Identifiers”.

* `binlog_gtid_simple_recovery`

  <table frame="box" rules="all" summary="Properties for binlog_gtid_simple_recovery"><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-gtid-simple-recovery[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>binlog_gtid_simple_recovery</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>

  This variable controls how binary log files are iterated during the search for GTIDs when MySQL starts or restarts.

  When `binlog_gtid_simple_recovery=TRUE` (the default), the values of `gtid_executed` and `gtid_purged` are computed at startup based on the values of `Previous_gtids_log_event` in the most recent and oldest binary log files. For a description of the computation, see The `gtid_purged` System Variable. This setting accesses only two binary log files during server restart. If all binary logs on the server were generated using MySQL 5.7.8 or later, `binlog_gtid_simple_recovery=TRUE` can always safely be used.

  When `binlog_gtid_simple_recovery=FALSE` is set, the method of computing `gtid_executed` and `gtid_purged` as described in The `gtid_purged` System Variable is changed to iterate the binary log files as follows:

  + Instead of using the value of `Previous_gtids_log_event` and GTID log events from the newest binary log file, the computation for `gtid_executed` iterates from the newest binary log file, and uses the value of `Previous_gtids_log_event` and any GTID log events from the first binary log file where it finds a `Previous_gtids_log_event` value. If the server's most recent binary log files do not have GTID log events, for example if `gtid_mode=ON` was used but the server was later changed to `gtid_mode=OFF`, this process can take a long time.

  + Instead of using the value of `Previous_gtids_log_event` from the oldest binary log file, the computation for `gtid_purged` iterates from the oldest binary log file, and uses the value of `Previous_gtids_log_event` from the first binary log file where it finds either a nonempty `Previous_gtids_log_event` value, or at least one GTID log event (indicating that the use of GTIDs starts at that point). If the server's older binary log files do not have GTID log events, for example if `gtid_mode=ON` was only set recently on the server, this process can take a long time.

* `enforce_gtid_consistency`

  <table frame="box" rules="all" summary="Properties for enforce_gtid_consistency"><tbody><tr><th>Command-Line Format</th> <td><code>--enforce-gtid-consistency[=value]</code></td> </tr><tr><th>System Variable</th> <td><code>enforce_gtid_consistency</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valid Values</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>WARN</code></p></td> </tr></tbody></table>

  Depending on the value of this variable, the server enforces GTID consistency by allowing execution of only statements that can be safely logged using a GTID. You *must* set this variable to `ON` before enabling GTID based replication.

  The values that `enforce_gtid_consistency` can be configured to are:

  + `OFF`: all transactions are allowed to violate GTID consistency.

  + `ON`: no transaction is allowed to violate GTID consistency.

  + `WARN`: all transactions are allowed to violate GTID consistency, but a warning is generated in this case.

  `--enforce-gtid-consistency` only takes effect if binary logging takes place for a statement. If binary logging is disabled on the server, or if statements are not written to the binary log because they are removed by a filter, GTID consistency is not checked or enforced for the statements that are not logged.

  Only statements that can be logged using GTID safe statements can be logged when `enforce_gtid_consistency` is set to `ON`, so the operations listed here cannot be used with this option:

  + `CREATE TEMPORARY TABLE` or `DROP TEMPORARY TABLE` statements inside transactions.

  + Transactions or statements that update both transactional and nontransactional tables. There is an exception that nontransactional DML is allowed in the same transaction or in the same statement as transactional DML, if all *nontransactional* tables are temporary.

  + `CREATE TABLE ... SELECT` statements are supported for storage engines that support atomic DDL.

  For more information, see Section 19.1.3.7, “Restrictions on Replication with GTIDs”.

  Prior to MySQL 5.7 and in early releases in that release series, the boolean `enforce_gtid_consistency` defaulted to `OFF`. To maintain compatibility with these earlier releases, the enumeration defaults to `OFF`, and setting `--enforce-gtid-consistency` without a value is interpreted as setting the value to `ON`. The variable also has multiple textual aliases for the values: `0=OFF=FALSE`, `1=ON=TRUE`,`2=WARN`. This differs from other enumeration types but maintains compatibility with the boolean type used in previous releases. These changes impact on what is returned by the variable. Using `SELECT @@ENFORCE_GTID_CONSISTENCY`, `SHOW VARIABLES LIKE 'ENFORCE_GTID_CONSISTENCY'`, and `SELECT * FROM INFORMATION_SCHEMA.VARIABLES WHERE 'VARIABLE_NAME' = 'ENFORCE_GTID_CONSISTENCY'`, all return the textual form, not the numeric form. This is an incompatible change, since `@@ENFORCE_GTID_CONSISTENCY` returns the numeric form for booleans but returns the textual form for `SHOW` and the Information Schema.

* `gtid_executed`

  <table frame="box" rules="all" summary="Properties for gtid_executed"><tbody><tr><th>System Variable</th> <td><code>gtid_executed</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Unit</th> <td>set of GTIDs</td> </tr></tbody></table>

  When used with global scope, this variable contains a representation of the set of all transactions executed on the server and GTIDs that have been set by a `SET` `gtid_purged` statement. This is the same as the value of the `Executed_Gtid_Set` column in the output of `SHOW BINARY LOG STATUS` and `SHOW REPLICA STATUS`. The value of this variable is a GTID set, see GTID Sets for more information.

  When the server starts, `@@GLOBAL.gtid_executed` is initialized. See `binlog_gtid_simple_recovery` for more information on how binary logs are iterated to populate `gtid_executed`. GTIDs are then added to the set as transactions are executed, or if any `SET` `gtid_purged` statement is executed.

  The set of transactions that can be found in the binary logs at any given time is equal to `GTID_SUBTRACT(@@GLOBAL.gtid_executed, @@GLOBAL.gtid_purged)`; that is, to all transactions in the binary log that have not yet been purged.

  Issuing `RESET BINARY LOGS AND GTIDS` causes this variable to be reset to an empty string. GTIDs are not otherwise removed from this set other than when the set is cleared due to `RESET BINARY LOGS AND GTIDS`.

* `gtid_executed_compression_period`

  <table frame="box" rules="all" summary="Properties for gtid_executed_compression_period"><tbody><tr><th>Command-Line Format</th> <td><code>--gtid-executed-compression-period=#</code></td> </tr><tr><th>System Variable</th> <td><code>gtid_executed_compression_period</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Compress the `mysql.gtid_executed` table each time this many transactions have been processed. When binary logging is enabled on the server, this compression method is not used, and instead the `mysql.gtid_executed` table is compressed on each binary log rotation. When binary logging is disabled on the server, the compression thread sleeps until the specified number of transactions have been executed, then wakes up to perform compression of the `mysql.gtid_executed` table. Setting the value of this system variable to 0 means that the thread never wakes up, so this explicit compression method is not used. Instead, compression occurs implicitly as required.

  `InnoDB` transactions are written to the `mysql.gtid_executed` table by a separate process to non-`InnoDB` transactions. If the server has a mix of `InnoDB` transactions and non-`InnoDB` transactions, the compression controlled by this system variable interferes with the work of this process and can slow it significantly. For this reason, from that release it is recommended that you set `gtid_executed_compression_period` to 0.

  All transactions (regardless of storage engine) are written to the `mysql.gtid_executed` table by the same process, and the `gtid_executed_compression_period` default value is 0.

  See mysql.gtid\_executed Table Compression for more information.

* `gtid_mode`

  <table frame="box" rules="all" summary="Properties for gtid_mode"><tbody><tr><th>Command-Line Format</th> <td><code>--gtid-mode=MODE</code></td> </tr><tr><th>System Variable</th> <td><code>gtid_mode</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valid Values</th> <td><p><code>OFF</code></p><p><code>OFF_PERMISSIVE</code></p><p><code>ON_PERMISSIVE</code></p><p><code>ON</code></p></td> </tr></tbody></table>

  Controls whether GTID based logging is enabled and what type of transactions the logs can contain. You must have privileges sufficient to set global system variables. See Section 7.1.9.1, “System Variable Privileges”. `enforce_gtid_consistency` must be set to `ON` before you can set `gtid_mode=ON`. Before modifying this variable, see Section 19.1.4, “Changing GTID Mode on Online Servers”.

  Logged transactions can be either anonymous or use GTIDs. Anonymous transactions rely on binary log file and position to identify specific transactions. GTID transactions have a unique identifier that is used to refer to transactions. The different modes are:

  + `OFF`: Both new and replicated transactions must be anonymous.

  + `OFF_PERMISSIVE`: New transactions are anonymous. Replicated transactions can be either anonymous or GTID transactions.

  + `ON_PERMISSIVE`: New transactions are GTID transactions. Replicated transactions can be either anonymous or GTID transactions.

  + `ON`: Both new and replicated transactions must be GTID transactions.

  Changes from one value to another can only be one step at a time. For example, if `gtid_mode` is currently set to `OFF_PERMISSIVE`, it is possible to change to `OFF` or `ON_PERMISSIVE` but not to `ON`.

  The values of `gtid_purged` and `gtid_executed` are persistent regardless of the value of `gtid_mode`. Therefore even after changing the value of `gtid_mode`, these variables contain the correct values.

* `gtid_next`

  <table frame="box" rules="all" summary="Properties for gtid_next"><tbody><tr><th>System Variable</th> <td><code>gtid_next</code></td> </tr><tr><th>Scope</th> <td>Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>AUTOMATIC</code></td> </tr><tr><th>Valid Values</th> <td><p><code>AUTOMATIC</code></p><p><code>AUTOMATIC:&lt;TAG&gt;</code></p><p><code>ANONYMOUS</code></p><p><code>&lt;UUID&gt;:&lt;NUMBER&gt;</code></p><p><code>&lt;UUID&gt;:&lt;TAG&gt;:&lt;NUMBER&gt;</code></p></td> </tr></tbody></table>

  This variable is used to specify whether and how to otain the next GTID (see Section 19.1.3, “Replication with Global Transaction Identifiers”).

  Setting the session value of this system variable is a restricted operation. The session user must have either the `REPLICATION_APPLIER` privilege (see Section 19.3.3, “Replication Privilege Checks”), or privileges sufficient to set restricted session variables (see Section 7.1.9.1, “System Variable Privileges”).

  `gtid_next` can take any of the following values:

  + `AUTOMATIC`: Use the next automatically-generated global transaction ID.

  + `AUTOMATIC:TAG`: Use the next automatically-generated global transaction ID, with the addition of a user-specified tag, in UUID:*`TAG`*:NUMBER format.

    The tag must match the regular expression `[a-z_][a-z0-9_]{0,7}`; in other words, it must conform to the following rules:

    - The tag must consist of 1-8 characters (inclusive).
    - The first character can be any letter `a` through `z`, or an underscore (`_`).

    - Each of the remaining characters can be any of the letters `a` through `z`, the digits `0` through `9`, or an underscore (`_`).

    Setting `gtid_next` on the replication source to `AUTOMATIC:TAG` or `UUID:TAG:NUMBER` requires the `TRANSACTION_GTID_TAG` privilege plus at least one of the privileges `SYSTEM_VARIABLES_ADMIN`, `SESSION_VARIABLES_ADMIN`, or `REPLICATION_APPLIER`. For the `REPLICATION_CHECKS_APPLIER` this privilege is also required to set `gtid_next` to either of these values, in addition to the `REPLICATION_APPLIER` privilege; these privileges are checked when starting the replication applier thread.

  + `ANONYMOUS`: Transactions do not have global identifiers, and are identified by file and position only.

  + A global transaction ID in either of the formats *`UUID`*:*`NUMBER`* or *`UUID`*:*`TAG`*:*`NUMBER`*.

  Exactly which of the options just listed are valid depends on the setting of `gtid_mode`; see Section 19.1.4.1, “Replication Mode Concepts” for more information. Setting this variable has no effect if `gtid_mode` is `OFF`.

  After this variable has been set to `UUID:NUMBER` or `UUID:TAG:NUMBER`, and a transaction has been committed or rolled back, an explicit `SET gtid_next` statement must again be issued before any other statement.

  `DROP TABLE` or `DROP TEMPORARY TABLE` fails with an explicit error when used on a combination of nontemporary tables with temporary tables, or of temporary tables using transactional storage engines with temporary tables using nontransactional storage engines.

  For more information, see The gtid\_next System Variable, as well as Section 19.1.4, “Changing GTID Mode on Online Servers”.

* `gtid_owned`

  <table frame="box" rules="all" summary="Properties for gtid_owned"><tbody><tr><th>System Variable</th> <td><code>gtid_owned</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Unit</th> <td>set of GTIDs</td> </tr></tbody></table>

  This read-only variable is primarily for internal use. Its contents depend on its scope.

  + When used with global scope, `gtid_owned` holds a list of all the GTIDs that are currently in use on the server, with the IDs of the threads that own them. This variable is mainly useful for a multi-threaded replica to check whether a transaction is already being applied on another thread. An applier thread takes ownership of a transaction's GTID all the time it is processing the transaction, so `@@global.gtid_owned` shows the GTID and owner for the duration of processing. When a transaction has been committed (or rolled back), the applier thread releases ownership of the GTID.

  + When used with session scope, `gtid_owned` holds a single GTID that is currently in use by and owned by this session. This variable is mainly useful for testing and debugging the use of GTIDs when the client has explicitly assigned a GTID for the transaction by setting `gtid_next`. In this case, `@@session.gtid_owned` displays the GTID all the time the client is processing the transaction, until the transaction has been committed (or rolled back). When the client has finished processing the transaction, the variable is cleared. If `gtid_next=AUTOMATIC` is used for the session, `gtid_owned` is populated only briefly during the execution of the commit statement for the transaction, so it cannot be observed from the session concerned, although it is listed if `@@global.gtid_owned` is read at the right point. If you have a requirement to track the GTIDs that are handled by a client in a session, you can enable the session state tracker controlled by the `session_track_gtids` system variable.

* `gtid_purged`

  <table frame="box" rules="all" summary="Properties for gtid_purged"><tbody><tr><th>System Variable</th> <td><code>gtid_purged</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Unit</th> <td>set of GTIDs</td> </tr></tbody></table>

  The global value of the `gtid_purged` system variable (`@@GLOBAL.gtid_purged`) is a GTID set consisting of the GTIDs of all the transactions that have been committed on the server, but do not exist in any binary log file on the server. `gtid_purged` is a subset of `gtid_executed`. The following categories of GTIDs are in `gtid_purged`:

  + GTIDs of replicated transactions that were committed with binary logging disabled on the replica.

  + GTIDs of transactions that were written to a binary log file that has now been purged.

  + GTIDs that were added explicitly to the set by the statement `SET @@GLOBAL.gtid_purged`.

  When the server starts, the global value of `gtid_purged` is initialized to a set of GTIDs. For information on how this GTID set is computed, see The `gtid_purged` System Variable.

  You must have the `TRANSACTION_GTID_TAG` to set `gtid_purged`.

  Issuing `RESET BINARY LOGS AND GTIDS` causes the value of `gtid_purged` to be reset to an empty string.

  You can set the value of `gtid_purged` in order to record on the server that the transactions in a certain GTID set have been applied, although they do not exist in any binary log on the server. An example use case for this action is when you are restoring a backup of one or more databases on a server, but you do not have the relevant binary logs containing the transactions on the server.

  Important

  The maximum number of GTIDs available on a given server instance is equal to the number of non-negative values for a signed 64-bit integer (263 - 1). If you set the value of `gtid_purged` to a number that approaches this limit, subsequent commits can cause the server to run out of GTIDs and so take the action specified by `binlog_error_action`. A warning message is issued when the server approaches this limit.

  There are two ways to set the value of `gtid_purged`. You can either replace the value of `gtid_purged` with a specified GTID set, or you can append a specified GTID set to the GTID set that is already held by `gtid_purged`.

  If the server has no existing GTIDs, as in the case of an empty server that you are provisioning with a backup of an existing database, both methods have the same result. If you are restoring a backup that overlaps the transactions that are already on the server, for example replacing a corrupted table with a partial dump from the source made using **mysqldump** (which includes the GTIDs of all the transactions on the server, even though the dump is partial), use the first method of replacing the value of `gtid_purged`. If you are restoring a backup that is disjoint from the transactions that are already on the server, for example provisioning a multi-source replica using dumps from two different servers, use the second method of adding to the value of `gtid_purged`.

  + To replace the value of `gtid_purged` with a specified GTID set, use the following statement:

    ```
    SET @@GLOBAL.gtid_purged = 'gtid_set';
    ```

    Group Replication must be stopped before changing the value of `gtid_purged`.

    `gtid_set` must be a superset of the current value of `gtid_purged`, and must not intersect with `gtid_subtract(gtid_executed,gtid_purged)`. In other words, the new GTID set **must** include any GTIDs that were already in `gtid_purged`, and **must not** include any GTIDs in `gtid_executed` that have not yet been purged. `gtid_set` also cannot include any GTIDs that are in `@@global.gtid_owned`, that is, the GTIDs for transactions that are currently being processed on the server.

    The result is that the global value of `gtid_purged` is set equal to `gtid_set`, and the value of `gtid_executed` becomes the union of `gtid_set` and the previous value of `gtid_executed`.

  + To append a specified GTID set to `gtid_purged`, use the following statement with a plus sign (+) before the GTID set:

    ```
    SET @@GLOBAL.gtid_purged = '+gtid_set';
    ```

    `gtid_set` **must not** intersect with the current value of `gtid_executed`. In other words, the new GTID set must not include any GTIDs in `gtid_executed`, including transactions that are already also in `gtid_purged`. `gtid_set` also cannot include any GTIDs that are in `@@global.gtid_owned`, that is, the GTIDs for transactions that are currently being processed on the server.

    The result is that `gtid_set` is added to both `gtid_executed` and `gtid_purged`.
