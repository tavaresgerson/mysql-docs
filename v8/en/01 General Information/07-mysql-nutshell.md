## 1.4 What Is New in MySQL 8.4 since MySQL 8.0

This section summarizes what has been added to, deprecated in, changed, and removed from MySQL 8.4 since MySQL 8.0. A companion section lists MySQL server options and variables that have been added, deprecated, or removed in MySQL 8.4; see Section 1.5, “Server and Status Variables and Options Added, Deprecated, or Removed in MySQL 8.4 since 8.0”.

*  Features Added or Changed in MySQL 8.4
*  Features Deprecated in MySQL 8.4
*  Features Removed in MySQL 8.4

### Features Added or Changed in MySQL 8.4

The following features have been added to MySQL 8.4:

**MySQL native password authentication changes.**: Beginning with MySQL 8.4.0, the deprecated `mysql_native_password` authentication plugin is no longer enabled by default. To enable it, start the server with `--mysql-native-password=ON` (added in MySQL 8.4.0), or by including `mysql_native_password=ON` in the `[mysqld]` section of your MySQL configuration file (added in MySQL 8.4.0).

For more information about enabling, using, and disabling `mysql_native_password`, see Section 8.4.1.1, “Native Pluggable Authentication”.

**InnoDB system variable default value changes.**: The default values for a number of server system variables relating to the  `InnoDB` storage engine were changed in MySQL 8.4.0, as shown in the following table:

**Table 1.1 InnoDB system variable default values in MySQL 8.4 differing from MySQL 8.0**

<table>
   <thead>
      <tr>
         <th>InnoDB System Variable Name</th>
         <th>New Default Value (MySQL 8.4)</th>
         <th>Previous Default Value (MySQL 8.0)</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <th><code>innodb_buffer_pool_in_core_file</code></th>
         <td><code>OFF</code> if <code>MADV_DONTDUMP</code> is supported, otherwise <code>ON</code></td>
         <td>ON</td>
      </tr>
      <tr>
         <th><code>innodb_buffer_pool_instances</code></th>
         <td>
            <p> If <code>innodb_buffer_pool_size</code> &lt;= 1 GiB, then <code>innodb_buffer_pool_instances=1</code> </p>
            <p> If <code>innodb_buffer_pool_size</code> &gt; 1 GiB, then this is the minimum value from the following two calculated hints in the range of 1-64: </p>
            <div>
               <ul style="list-style-type: circle; ">
                  <li>
                     <p> Buffer pool hint: Calculated as 1/2 of (<code>innodb_buffer_pool_size</code> / <code>innodb_buffer_pool_chunk_size</code>) </p>
                  </li>
                  <li>
                     <p> CPU hint: Calculated as 1/4 of the number of available logical processors </p>
                  </li>
               </ul>
            </div>
         </td>
         <td>8 (or 1 if <code>innodb_buffer_pool_size</code> &lt; 1 GiB)</td>
      </tr>
      <tr>
         <th><code>innodb_change_buffering</code></th>
         <td><code>none</code></td>
         <td><code>all</code></td>
      </tr>
      <tr>
         <th><code>--innodb-dedicated-server</code></th>
         <td>If <code>ON</code>, the value of <code>innodb_flush_method</code> is no longer changed as in MySQL 8.0, but the calculation of <code>innodb_redo_log_capacity</code> is changed from memory-based to CPU-based. For more information, see Section 17.8.12, “Enabling Automatic InnoDB Configuration for a Dedicated MySQL Server”. (The actual default value of this variable is <code>OFF</code>; this is unchanged from MySQL 8.0.)</td>
         <td><code>OFF</code></td>
      </tr>
      <tr>
         <th><code>innodb_adaptive_hash_index</code></th>
         <td><code>OFF</code></td>
         <td><code>ON</code></td>
      </tr>
      <tr>
         <th><code>innodb_doublewrite_files</code></th>
         <td>2</td>
         <td><code>innodb_buffer_pool_instances</code> * 2</td>
      </tr>
      <tr>
         <th><code>innodb_doublewrite_pages</code></th>
         <td>128</td>
         <td><code>innodb_write_io_threads</code>, which meant a default of 4</td>
      </tr>
      <tr>
         <th><code>innodb_flush_method</code> on Linux</th>
         <td><code>O_DIRECT</code> if supported, otherwise <code>fsync</code></td>
         <td>fsync</td>
      </tr>
      <tr>
         <th><code>innodb_io_capacity</code></th>
         <td>10000</td>
         <td>200</td>
      </tr>
      <tr>
         <th><code>innodb_io_capacity_max</code></th>
         <td>2 * <code>innodb_io_capacity</code></td>
         <td>2 * <code>innodb_io_capacity</code>, with a minimum default value of 2000</td>
      </tr>
      <tr>
         <th><code>innodb_log_buffer_size</code></th>
         <td>67108864 (64 MiB)</td>
         <td>16777216 (16 MiB)</td>
      </tr>
      <tr>
         <th><code>innodb_numa_interleave</code></th>
         <td><code>ON</code></td>
         <td><code>OFF</code></td>
      </tr>
      <tr>
         <th><code>innodb_page_cleaners</code></th>
         <td><code>innodb_buffer_pool_instances</code></td>
         <td>4</td>
      </tr>
      <tr>
         <th><code>innodb_parallel_read_threads</code></th>
         <td>available logical processors / 8, with a minimum default value of 4</td>
         <td>4</td>
      </tr>
      <tr>
         <th><code>innodb_purge_threads</code></th>
         <td>1 if available logical processors is &lt;= 16, otherwise 4</td>
         <td>4</td>
      </tr>
      <tr>
         <th><code>innodb_read_io_threads</code></th>
         <td>available logical processors / 2, with a minimum default value of 4</td>
         <td>4</td>
      </tr>
      <tr>
         <th><code>innodb_use_fdatasync</code></th>
         <td><code>ON</code></td>
         <td><code>OFF</code></td>
      </tr>
      <tr>
         <th><code>temptable_max_ram</code></th>
         <td>3% of total memory, with a default value within a range of 1-4 GiB</td>
         <td>1073741824 (1 GiB)</td>
      </tr>
      <tr>
         <th><code>temptable_max_mmap</code></th>
         <td>0, which means <code>OFF</code></td>
         <td>1073741824 (1 GiB)</td>
      </tr>
      <tr>
         <th><code>temptable_use_mmap</code> (Deprecated in MySQL 8.0.26)</th>
         <td><code>OFF</code></td>
         <td><code>ON</code></td>
      </tr>
   </tbody>
</table>

**Clone plugin**: The  clone plugin versioning requirement was relaxed to allow cloning between different point releases in the same series. In other words, only the major and minor version numbers must match when previously the point release number also had to match.

For example, clone functionality now permits cloning 8.4.0 to 8.4.14 and vice-versa.

**SASL-based LDAP authentication on Windows**: On Microsoft Windows, the server plugin for SASL-based LDAP authentication is now supported. This means that Windows clients can now use GSSAPI/Kerberos for authenticating with the `authentication_ldap_sasl_client` plugin.

For more information, see SASL-Based LDAP Authentication (Without Proxying).

**MySQL Replication: SOURCE_RETRY_COUNT change**: The default value for the `SOURCE_RETRY_COUNT` option of the `CHANGE REPLICATION SOURCE TO` statement was changed to 10. This means that, using the default values for this option and for `SOURCE_CONNECT_RETRY` (60), the replica waits 60 seconds between reconnection attempts, and keeps attempting to reconnect at this rate for 10 minutes before timing out and failing over.

This change also applies to the default value of the deprecated `--master-retry-count` server option. (You should use `SOURCE_RETRY_COUNT`, instead.)

For more information, see Section 19.4.9.1, "Asynchronous Connection Failover for Sources".

**MySQL Replication: tagged `GTIDs`**: The format of global transaction identifiers (GIDs) used in MySQL Replication and Group Replication has been extended to enable identification of groups of transactions, making it possible to assign a unique name to the GTIDs which belong to a specific group of transactions. For example, transactions containing data operations can easily be distinguished from those arising from administrative operations simply by comparing their GTIDs.

The new GTID format is `UUID:TAG:NUMBER`, where `TAG` is a string of up to 8 characters, which is enabled by setting the value of the `gtid_next` system variable to `AUTOMATIC:TAG`, added in this release (see the description of the variable for tag format and other information). This tag persists for all transactions originating in the current session (unless changed using `SET gtid_next`), and is applied at commit time for such transactions, or, when using Group Replication, at certification time. It is also possible to set `gtid_next` to `UUID:TAG:NUMBER` to set the UUID of a single transaction to an arbitrary value, along with assigning it a custom tag. The assignments of `UUID` and `NUMBER` are otherwise unchanged from previous MySQL releases. In either case, the user is responsible for making sure that the tag is unique to a given replication topology.

The original `UUID:NUMBER` format for GTIDs continues to be supported unchanged, as implemented in previous versions of MySQL; changes to existing replication setups using GTIDs are not required.

Setting `gtid_next` to `AUTOMATIC:TAG` or `UUID:TAG:NUMBER` requires a new `TRANSACTION_GTID_TAG` privilege which is added in this release; this is true both on the originating server as well as for the `PRIVILEGE_CHECKS_APPLIER` for the replica applier thread. This also means that an administrator can now restrict the use of `SET @gtid_next=AUTOMATIC:TAG` or `UUID:TAG:NUMBER` to a desired set of MySQL users or roles so that that only those users related to a given data or operational domain can commit new transactions with assigned tags.

::: info Note

When upgrading from a previous version of MySQL to MySQL 8.4, any user accounts or roles which already have the `BINLOG_ADMIN` privilege are automatically granted the `TRANSACTION_GTID_TAG` privilege.

:::

The built-in functions `GTID_SUBSET()`, `GTID_SUBTRACT()`, and `WAIT_FOR_EXECUTED_GTID_SET()` are compatible with tagged GTIDs.

For more information, see the descriptions of the `gtid_next` system variable and the  `TRANSACTION_GTID_TAG` privilege, as well as Section 19.1.4, "Changing GTID Mode on Online Servers".

**Replication: `SQL_AFTER_GTIDS` and `MTA`**: The `START REPLICA` statement option `SQL_AFTER_GTIDS` is now compatible with the multi-threaded applier. (Previously, when MTA was enabled and the user attempted to use this option, the statement raised the warning `ER_MTA_FEATURE_IS_NOT_SUPPORTED`, and the replica was switched to single-threaded mode.) This means that a replica which needs to catch up with missing transactions can now do so without losing the performance advantage from multithreading.

For more information, see  Section 15.4.2.4, `START REPLICA` Statement, as well as the documentation for the `replica_parallel_workers` system variable. See also Section 19.2.3.2, "Monitoring Replication Applier Worker Threads", and Section 25.7.11, "NDB Cluster Replication Using the Multithreaded Applier".

**Replication terminology backwards compatibility.**: This release adds the `--output-as-version` option for `mysqldump`. This option allows you to create a dump from a MySQL 8.2 or newer server that is compatible with older versions of MySQL; its value, one of those listed here, determines the compatibility of replication terminology used in the dump:

* `SERVER`: Gets the version of the server and uses the latest versions of replication statements and variable names compatible with that MySQL version.
* `BEFORE_8_2_0`: Output is compatible with MySQL servers running versions 8.0.23 through 8.1.0, inclusive.
* `BEFORE_8_0_23`: Output is compatible with MySQL servers running versions prior to 8.0.23.

See the description of this option for more information.

In addition a new value is added to those already allowed for the `terminology_use_previous` system variable. `BEFORE_8_2_0` causes the server to print `DISABLE ON SLAVE` (now deprecated) instead of `DISABLE ON REPLICA` in the output of `SHOW CREATE EVENT`. The existing value `BEFORE_8_0_26` now also has this effect in addition to those it already had previously.

The MySQL version number used in version-specific comments supports a major version consisting of one or two digits; this means that the entire version can be either five or six digits long. For more information about how this change affects handling of versioned comments in MySQL, see Section 11.7, “Comments”.

**`group_replication_set_as_primary()` and `DDL` statements**: The `group_replication_set_as_primary()` function waits for ongoing DDL statements such as `ALTER TABLE` when waiting for all transactions to complete, prior to electing a new primary.

For more information, see the description of this function.

**DDL and DCL statement tracking for `group_replication_set_as_primary()`**: `group_replication_set_as_primary()` now waits for the following statements to complete before a new primary is elected:

* `ALTER DATABASE`
* `ALTER FUNCTION`
* `ALTER INSTANCE`
* `ALTER PROCEDURE`
* `ALTER SERVER`
* `ALTER TABLESPACE`
* `ALTER USER`
* `ALTER VIEW`
* `CREATE DATABASE`
* `CREATE FUNCTION`
* `CREATE PROCEDURE`
* `CREATE ROLE`
* `CREATE SERVER`
* `CREATE SPATIAL REFERENCE SYSTEM`
* `CREATE TABLESPACE`
* `CREATE TRIGGER`
* `CREATE USER`
* `CREATE VIEW`
* `DROP DATABASE`
* `DROP FUNCTION`
* `DROP PROCEDURE`
* `DROP ROLE`
* `DROP SERVER`
* `DROP SPATIAL REFERENCE SYSTEM`
* `DROP TABLESPACE`
* `DROP TRIGGER`
* `DROP USER`
* `DROP VIEW`
* `GRANT`
* `RENAME TABLE`
* `REVOKE`

These are in addition to those statements added in MySQL 8.1 or otherwise already supported in this regard. For more information, including a listing of all such statements supported in MySQL 8.3, see the description of the `group_replication_set_as_primary()` function.

**Group Replication version compatibility**: Version compatibility for servers within groups has been extended as follows:

In-place downgrades of servers within groups are supported within the MySQL 8.4 LTS series. For example, a member of a group running MySQL 8.4.2 can be downgraded to MySQL 8.4.0.

Similarly, cross-version group membership is also supported within the 8.4 release series. For example, a server running MySQL 8.4.0 can join a group all of whose members currently run MySQL 8.4.2, as can a server running MySQL 8.4.3.

**Group Replication variable defaults**: The default values of two server system variables relating to Group Replication have been changed in MySQL 8.4:

* The default value of the `group_replication_consistency` system variable was changed to `BEFORE_ON_PRIMARY_FAILOVER` in MySQL 8.4.0. (Previously, it was `EVENTUAL`.)
* The default value of the `group_replication_exit_state_action` system variable was changed to `OFFLINE_MODE` in MySQL 8.4.0. (Previously, it was `READ_ONLY`.)

  For more information, see Section 20.5.3.2, “Configuring Transaction Consistency Guarantees”, and  Section 20.7.7, “Responses to Failure Detection and Network Partitioning”, as well as the descriptions of the variables listed.


**Group Replication Status Variables**: Added a number of status variables specific to the Group Replication plugin that improve diagnosis and troubleshooting of network instabilities, providing statistics about network usage, control messages, and data messages for each group member.

See  Section 20.9.2, “Group Replication Status Variables”, for more information.

As part of this work, a new `MEMBER_FAILURE_SUSPICIONS_COUNT` column was added to the Performance Schema `replication_group_communication_information` table. The contents of this column are formatted as a JSON array whose keys are group members ID and whose values are the number of times the group member has been considered suspect. See the description of this table for more information.

**`FLUSH_PRIVILEGES` privilege**: A new privilege is added in MySQL 8.4.0 specifically to allow use of `FLUSH PRIVILEGES` statements. Unlike the `RELOAD` privilege, the `FLUSH_PRIVILEGES` privilege applies only to `FLUSH PRIVILEGES` statements.

In MySQL 8.4, the `RELOAD` privilege continues to be supported in this capacity to provide backwards compatibility.

When upgrading, a check is performed to see whether there are any users having the `FLUSH_PRIVILEGES` privilege; if there are none, any users having the `RELOAD` privilege are automatically assigned the new privilege as well.

If you downgrade from MySQL 8.4 (or later) to a version of MySQL which does not support the `FLUSH_PRIVILEGES` privilege, a user previously granted this privilege is unable to execute `FLUSH PRIVILEGES` statements unless the user has the `RELOAD` privilege.

**`OPTIMIZE_LOCAL_TABLE` privilege**: MySQL 8.4.0 adds a new `OPTIMIZE_LOCAL_TABLE` privilege. Users must have this privilege to execute `OPTIMIZE LOCAL TABLE` and `OPTIMIZE NO_WRITE_TO_BINLOG TABLE` statements.

When upgrading from a previous release series, users having the  `SYSTEM_USER` privilege are automatically granted the `OPTIMIZE_LOCAL_TABLE` privilege.

**MySQL Enterprise Data Masking and De-Identification**: Data-masking components added support for specifying a dedicated schema to store the related internal table and masking functions. Previously, the `mysql` system schema provided the only storage option. The new `component_masking.masking_database` read-only variable enables setting and persisting an alternative schema name at server startup.

**Flushing of data masking dictionaries**: The MySQL Enterprise Data Masking and De-Identification component now includes the ability to flush the data on the secondary or replica into memory. This can be done in either of the ways described here:

* A flush can be performed by the user at any time using the `masking_dictionaries_flush()` function added in this release.
* The component can be configured to flush the memory periodically, leveraging the Scheduler component, by setting the new `component_masking.dictionaries_flush_interval_seconds` system variable to an appropriate value.

For more information, see  Section 8.5, “MySQL Enterprise Data Masking and De-Identification”, and the descriptions of these items.

**Automatic histogram updates**: MySQL 8.4.0 adds support for automatic updates of histograms. When this feature is enabled for a given histogram, it is updated whenever `ANALYZE TABLE` is run on the table to which it belongs. In addition, automatic recalculation of persistent statistics by `InnoDB` (see Section 17.8.10.1, “Configuring Persistent Optimizer Statistics Parameters”) also updates the histogram. Histogram updates continue to use the same number of buckets as they were originally specified with, if any.

You can enable this feature when specifying the histogram by including the `AUTO UPDATE` option for the `ANALYZE TABLE` statement. To disable it, include `MANUAL UPDATE` instead. `MANUAL UPDATE` (no automatic updates) is the default if neither option is specified.

For more information, see Histogram Statistics Analysis.

* Added the `tls-certificates-enforced-validation` system variable, which permits a DBA to enforce certificate validation at server startup or when using the `ALTER INSTANCE RELOAD TLS` statement to reload certificates at runtime. With enforcement enabled, discovering an invalid certificate halts server invocation at startup, prevents loading invalid certificates at runtime, and emits warnings. For more information, see Configuring Certificate Validation Enforcement.

* Added server system variables to control the amount of time MySQL accounts that connect to a MySQL server using LDAP pluggable authentication must wait when the LDAP server is down or unresponsive. The default timeout became 30 seconds for the following simple and SASL-based LDAP authentication variables:

* `authentication_ldap_simple_connect_timeout`
* `authentication_ldap_simple_response_timeout`
* `authentication_ldap_sasl_connect_timeout`
* `authentication_ldap_sasl_response_timeout`

Connection and response timeouts are configurable through the system variables on Linux platforms only. For more information, see Setting Timeouts for LDAP Pluggable Authentication.

* Logging of the shutdown process was enhanced, with the addition of startup and shutdown messages for the MySQL server, plugins, and components. Such messages are now also logged for closing connections. These additions should facilitate troubleshooting and debugging problems, particularly in the event that the server takes an excessively long time to shut down. For more information, see  Section 7.4.2, “The Error Log”.

**Additions to server startup and shutdown messages**: Added the following types of messages to the server startup and shutdown processes as noted in this list:

* Start and end messages for server initialization when the server is started with `--initialize` or `--initialize-insecure`; these are in addition to and distinct from those shown during normal server startup and shutdown.
* Start and end messages for `InnoDB` initialization.
* Start and end messages for init file execution during server initialization.
* Start and end messages for for execution of compiled-in statements during server initialization.
* Start and end mesages for crash recovery during server startup (if crash recovery occurs).
* Start and end messages for initialization of dynamic plugins during server startup.
* Start and end messages for compoenents initialization step (apparent during server startup).
* Messages for shutdown of replica threads, as well as graceful and forceful shutdown of connection threads, during server shutdown.
* Start and end messages for shutdown of plugins and components during server shutdown.
* Exit code (return value) information with shutdown messages during initialization or server shutdown and end

In addition, if the server was built using `WITH_SYSTEMD`, the server now includes every `systemd` message in the error log.

* Added the  `SHOW PARSE_TREE` statement, which shows the JSON-formatted parse tree for a `SELECT` statement. This statement is intended for testing and development use only, and not in production. It is available only in debug builds, or if MySQL was built from source using the CMake `-DWITH_SHOW_PARSE_TREE` option, and is not included or supported in release builds.


**Thread pool plugin connection information**: Added thread pool connection information to the MySQL Performance Schema, as follows:

* Added a `tp_connections` table, with information about each thread pool connection.
* Added the following columns to the `tp_thread_state` table: `TIME_OF_ATTACH`, `MARKED_STALLED`, `STATE`, `EVENT_COUNT`, `ACCUMULATED_EVENT_TIME`, `EXEC_COUNT`, and `ACCUMULATED_EXEC_TIME`
* Added the following columns to the `tp_thread_group_state` table: `EFFECTIVE_MAX_TRANSACTIONS_LIMIT`, `NUM_QUERY_THREADS`, `TIME_OF_LAST_THREAD_CREATION`, `NUM_CONNECT_HANDLER_THREAD_IN_SLEEP`, `THREADS_BOUND_TO_TRANSACTION`, `QUERY_THREADS_COUNT`, and `TIME_OF_EARLIEST_CON_EXPIRE`.

For more information, see  Section 7.6.3, “MySQL Enterprise Thread Pool”, and Section 29.12.16, “Performance Schema Thread Pool Tables”.

**Information Schema PROCESSLIST table usage**: Although the `INFORMATION_SCHEMA.PROCESSLIST` table was deprecated in MySQL 8.0.35 and 8.2.0, interest remains in tracking its usage. This release adds two system status variables providing information about accesses to the `PROCESSLIST` table, listed here:

* `Deprecated_use_i_s_processlist_count` provides a count of the number of references to the `PROCESSLIST` table in queries since the server was last started.
* `Deprecated_use_i_s_processlist_last_timestamp` stores the time the `PROCESSLIST` table was last accessed. This is a timestamp value (number of microseconds since the Unix Epoch).

**Hash table optimization for set operations**: MySQL 8.2 improves performance of statements using the set operations  `EXCEPT` and `INTERSECT` by means of a new hash table optimization which is enabled automatically for such statements, and controlled by setting the `hash_set_operations` optimizer switch; to disable this optimization and cause the optimizer to used the old temporary table optimization from previous versions of MySQL, set this flag to `off`.

The amount of memory allocated for this optimization can be controlled by setting the value of the `set_operations_buffer_size` server system variable; increasing the buffer size can further improve execution times of some statements using these operations.

See  Section 10.9.2, “Switchable Optimizations”, for more information.

**WITH_LD CMake option** `WITH_LD` define whether to use the llvm lld or mold linker, otherwise use the standard linker. `WITH_LD` also replaces the `USE_LD_LLD` CMake option that was removed in MySQL 8.3.0.

**MySQL Enterprise Firewall enhancements**: A number of enhancements were made since MySQL 8.0 to MySQL Enterprise Firewall. These are listed here:

* Stored procedures provided by MySQL Enterprise Firewall now behave in transactional fashion. When an error occurs during execution of a firewall stored procedure, an error is reported, and all changes made by the stored procedure up to that point in time are rolled back.
* Firewall stored procedures now avoid performing unnecessary combinations of `DELETE` plus `INSERT` statements, as well as those of `INSERT IGNORE` plus `UPDATE` operations, thus consuming less time and fewer resources, making them faster and more efficient.
* User-based stored procedures and UDFs, deprecated in MySQL 8.0.26, now raise a deprecation warning. Specifically calling either of `sp_set_firewall_mode()` or `sp_reload_firewall_rules()` generates such a warning. See Firewall Account Profile Stored Procedures, as well as Migrating Account Profiles to Group Profiles, for more information.
* MySQL Enterprise Firewall now permits its memory cache to be reloaded periodically with data stored in the firewall tables. The `mysql_firewall_reload_interval_seconds` system variable sets the periodic-reload schedule to use at runtime or it disables reloads by default. Previous implementations reloaded the cache only at server startup or when the server-side plugin was reinstalled.
* Added the `mysql_firewall_database` server system variable to enable storing internal tables, functions, and stored procedures in a custom schema.
* Added the `uninstall_firewall.sql` script to simplify removing an installed firewall.

For more information about firewall stored procedures, see MySQL Enterprise Firewall Stored Procedures.

**Pluggable authentication**: Added support for authentication to MySQL Server using devices such as smart cards, security keys, and biometric readers in a WebAuthn context. The new WebAuthn authentication method is based on the FIDO and FIDO2 standards. It uses a pair of plugins, `authentication_webauthn` on the server side and `authentication_webauthn_client` on the client side. The server-side WebAuthn authentication plugin is included only in MySQL Enterprise Edition distributions.
**Keyring migration**: Migration from a keyring component to a keyring plugin is supported. To perform such a migration, use the `--keyring-migration-from-component` server option introduced in MySQL 8.4.0, setting `--keyring-migration-source` to the name of the source component, and `--keyring-migration-destination` the name of the target plugin.

See Key Migration Using a Migration Server, for more information.

**MySQL Enterprise Audit**: Added the `audit_log_filter_uninstall.sql` script to simplify removing MySQL Enterprise Audit.
**New Keywords**: Keywords added in MySQL 8.4 since MySQL 8.0. Reserved keywords are marked with (R).

`AUTO`, `BERNOULLI`, `GTIDS`, `LOG`, `MANUAL` (R), `PARALLEL` (R), `PARSE_TREE`, `QUALIFY` (R), `S3`, and `TABLESAMPLE` (R).

**Preemptive group replication certification garbage collection**: A system variable added in MySQL 8.4.0 `group_replication_preemptive_garbage_collection` enables preemptive garbage collection for group replication running in single-primary mode, keeping only the write sets for those transactions that have not yet been committed. This can save time and memory consumption. An additional system variable `group_replication_preemptive_garbage_collection_rows_threshold` (also introduced in MySQL 8.4.0) sets a lower limit on the number of certification rows needed to trigger preemptive garbage collection if it is enabled; the default is 100000.

In multi-primary mode, each write set in the certification information is required from the moment a transaction is certified until it is committed on all members, which makes it necessary to detect conflicts between transactions. In single-primary mode, where we need be concerned only about transaction dependencies, this is not an issue; this means write sets need be kept only until certification is complete.

It is not possible to change the group replication mode between single-primary and multi-primary when `group_replication_preemptive_garbage_collection` is enabled.

See Section 20.7.9, “Monitoring Group Replication Memory Usage with Performance Schema Memory Instrumentation”, for help with obtaining information about memory consumed by this process.

**Sanitized relay log recovery**: In MySQL 8.4.0 and later, it is possible to recover the relay log with any incomplete transactions removed. The relay log is now sanitized when the server is started with `--relay-log-recovery=OFF` (the default), meaning that all of the following items are removed:

* Transactions which remain uncompleted at the end of the relay log
* Relay log files containing incomplete transactions or parts thereof only
* References in the relay log index file to relay log files which have thus been removed

For more information, see the description of the `relay_log_recovery` server system variable.

**MySQL upgrade history file**: As part of the installation process in MySQL 8.4.0 and later, a file in JSON format named `mysql_upgrade_history` is created in the server's data directory, or updated if it already exists. This file includes information about the MySQL server version installed, when it was installed, and whether the release was part of an LTS series or an Innovation series.

A typical `mysql_upgrade_history` file might look something like this (formatting adjusted for readability):

  ```
  {
    "file_format":"1",

    "upgrade_history":
    [
      {
        "date":"2024-03-15 22:02:35",
        "version":"8.4.0",
        "maturity":"LTS",
        "initialize":true
      },

      {
        "date":"2024-05-17 17:46:12",
        "version":"8.4.1",
        "maturity":"LTS",
        "initialize":false
      }
    ]

  }
  ```

In addition, the installation process now checks for the presence of a `mysql_upgrade_info` file (deprecated in MySQL 8.0, and is no longer used). If found, the file is removed.

**mysql client `--system-command` option.**: The  `--system-command` option for the `mysql` client, available in MySQL 8.4.3 and later, enables or disables the `system` command.

This option is enabled by default. To disable it, use `--system-command=OFF` or `--skip-system-command`, which causes the `system` command to be rejected with an error.

**mysql client `--commands` option**: The `mysql` client `--commands` option, introduced in MySQL 8.4.6, enables or disables most `mysql` client commands.

This option is enabled by default. To disable it, start the `mysql` client with `--commands=OFF` or `--skip-commands`.

For more information, see Section 6.5.1.1, “mysql Client Options”.

**Scalar correlated subqueries to derived tables**: MySQL 8.4.0 lifts a previous restriction on transforming a correlated scalar subquery to a derived table such that an operand of the equality expression which did not contain an outer reference could be a simple column reference only.

This means that inner columns can be contained in deterministic expressions, as shown here:

```
func1(.., funcN(.., inner-column-a, ..), inner-column-b) = outside-expression

inner-column-a + inner-column-b = outside-expression
```

For example, the following query is now supported for optimization:

```
SELECT * FROM t1
  WHERE ( SELECT func(t2.a) FROM t2
            WHERE func(t2.a) = t1.a ) > 0;
```

The inner operand cannot contain outer column references; likewise, the outer operand cannot contain inner column references. In addition, the inner operand cannot contain a subquery.

If the transformed subquery has explicit grouping, functional dependency analysis may be excessively pessimistic, resulting in an error such as `ERROR 1055 (42000): Expression #2 of SELECT list is not in GROUP BY clause and contains nonaggregated column`.... For the  `InnoDB` storage engine, the transform is disabled by default (that is, the `subquery_to_derived` flag of the  `optimizer_switch` variable is not enabled); in this case, such queries pass without raising any errors, but are also not transformed.

See  Section 15.2.15.7, “Correlated Subqueries”, for more information.

### Features Deprecated in MySQL 8.4

The following features are deprecated in MySQL 8.4 and may be removed in a future series. Where alternatives are shown, applications should be updated to use them.

For applications that use features deprecated in MySQL 8.4 that have been removed in a later MySQL version, statements may fail when replicated from a MySQL 8.4 source to a replica running a later version, or may have different effects on source and replica. To avoid such problems, applications that use features deprecated in 8.4 should be revised to avoid them and use alternatives when possible.

**`group_replication_allow_local_lower_version_join` system variable**: The `group_replication_allow_local_lower_version_join` system variable is deprecated, and setting it causes a warning ( `ER_WARN_DEPRECATED_SYNTAX_NO_REPLACEMENT`) to be logged.

You should expect this variable to be removed in a future version of MySQL. Since the functionality enabled by setting `group_replication_allow_local_lower_version_join` is no longer useful, no replacement for it is planned.

**Group Replication recovery metadata**: Group Replication recovery no longer depends on writing of view change events to the binary log to mark changes in group membership; instead, when all members of a group are MySQL version 8.3.0 or later, members share compressed recovery metadata, and no such event is logged (or assigned a GTID) when a new member joins the group.

Recovery metadata includes the GCS view ID, `GTID_SET` of certified transactions, and certification information, as well as a list of online members.

Since `View_change_log_event` no longer plays a role in recovery, the `group_replication_view_change_uuid` system variable is no longer needed, and so is now deprecated; expect its removal in a future MySQL release. You should be aware that no replacement or alternative for this variable or its functionality is planned, and develop your applications accordingly.

**`WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS()` function**: The `WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS()` SQL function was deprecated in MySQL 8.0, and is no longer supported as of MySQL 8.2. Attempting to invoke this function now causes a syntax error.

Instead of `WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS()`, it is recommended that you use `WAIT_FOR_EXECUTED_GTID_SET()`, which allows you to wait for specific GTIDS. This works regardless of the replication channel or the user client through which the specified transactions arrive on the server.

**`GTID-based` replication and `IGNORE_SERVER_IDS`**: When global transaction identifiers (GTIDs) are used for replication, transactions that have already been applied are automatically ignored. This means that `IGNORE_SERVER_IDS` is not compatible with GTID mode. If `gtid_mode` is `ON`, `CHANGE REPLICATION SOURCE TO` with a non-empty `IGNORE_SERVER_IDS` list is rejected with an error. Likewise, if any existing replication channel was created with a list of server IDs to be ignored, `SET gtid_mode=ON` is also rejected. Before starting GTID-based replication, check for and clear any ignored server ID lists on the servers involved; you can do this by checking the output from `SHOW REPLICA STATUS`. In such cases, you can clear the list by issuing `CHANGE REPLICATION SOURCE TO` with an empty list of server IDs, as shown here:

```
CHANGE REPLICATION SOURCE TO IGNORE_SERVER_IDS = ();
```

See  Section 19.1.3.7, “Restrictions on Replication with GTIDs”, for more information.

**Binary log transaction dependency tracking and logging format**: Using writeset information for conflict detection has been found to cause issues with dependency tracking; for this reason, we now limit the usage of writesets for conflict checks to when row-based logging is in effect.

This means that, in such cases, `binlog_format` must be `ROW`, and `MIXED` is no longer supported.

**`expire_logs_days` system variable**: The `expire_logs_days` server system variable, deprecated in MySQL 8.0, has been removed. Attempting to get or set this variable at runtime, or to start  `mysqld` with the equivalent option (`--expire-logs-days`), now results in an error.

In place of `expire_logs_days`, use `binlog_expire_logs_seconds`, which allows you to specify expiration periods other than (only) in an integral number of days.

**Wildcard characters in database grants**: The use of the characters `%` and `_` as wildcards in database grants was deprecated in MySQL 8.2.0. You should expect for the wildcard functionality to removed in a future MySQL release and for these characters always to be treated as literals, as they are already whenever the value of the `partial_revokes` server system variable is `ON`.

In addition, the treatment of `%` by the server as a synonym for `localhost` when checking privileges is now also deprecated as of MySQL 8.2.0 and thus subject to removal in a future version of MySQL.

**`--character-set-client-handshake` option**: The `--character-set-client-handshake` server option, originally intended for use with upgrades from very old versions of MySQL, is now deprecated and a warning is issued whenever it is used. You should expect this option to be removed in a future version of MySQL; applications depending on this option should begin migration away from it as soon as possible.

**Nonstandard foreign keys**: The use of non-unique or partial keys as foreign keys is nonstandard, and is deprecated in MySQL. Beginning with MySQL 8.4.0, you must explicitly enable such keys by setting `restrict_fk_on_non_standard_key` to `OFF`, or by starting the server with `--skip-restrict-fk-on-non-standard-key`.

`restrict_fk_on_non_standard_key` is `ON` by default, which means that trying to use a nonstandard key as a foreign key in a `CREATE TABLE` or other SQL statement is rejected with `ER_WARN_DEPRECATED_NON_STANDARD_KEY`. Setting it to `ON` allows such statements to run, but they raise the same error as a warning.

Upgrades from MySQL 8.0 are supported even if there are tables containing foreign keys referring to non-unique or partial keys. In such cases, the server writes a list of warning messages containing the names of any foreign keys which refer to nonstandard keys.

### Features Removed in MySQL 8.4

The following items are obsolete and have been removed in MySQL 8.4. Where alternatives are shown, applications should be updated to use them.

For MySQL 8.3 applications that use features removed in MySQL 8.4, statements may fail when replicated from a MySQL 8.3 source to a MySQL 8.4 replica, or may have different effects on source and replica. To avoid such problems, applications that use features removed in MySQL 8.4 should be revised to avoid them and use alternatives when possible.

**Server options and variables removed**: A number of server options and variables supported in previous versions of MySQL have been removed in MySQL 8.4. Attempting to set any of them in MySQL 8.4 raises an error. These options and variables are listed here:

  * `binlog_transaction_dependency_tracking`: Deprecated in MySQL 8.0.35 and MySQL 8.2.0. There are no plans to replace this variable or its functionality, which has been made internal to the server. In MySQL 8.4 (and later), when multithreaded replicas are in use, the source  `mysqld` uses always writesets to generate dependency information for the binary log; this has the same effect as setting `binlog_transaction_dependency_tracking` to `WRITESET` in previous versions of MySQL.
  * `group_replication_recovery_complete_at`: Deprecated in MySQL 8.0.34. In MySQL 8.4 and later, the policy applied during the distributed recovery process is always to mark a new member online only after it has received, certified, and applied all transactions that took place before it joined the group; this is equivalent to setting `group_replication_recovery_complete_at` to `TRANSACTIONS_APPLIED` in previous versions of MySQL.
  * `avoid_temporal_upgrade` and `show_old_temporals`: Both of these variables were deprecated in MySQL 5.6; neither of them had any effect in recent versions of MySQL. Both variables have been removed; there are no plans to replace either of them.
  * `--no-dd-upgrade`: Deprecated in MySQL 8.0.16, now removed. Use `--upgrade=NONE` instead.
  * `--old` and `--new`: Both deprecated in MySQL 8.0.35 and MySQL 8.2.0, and now removed.
  * `--language`: Deprecated in MySQL 5.5, and now removed.
  * The `--ssl` and `--admin-ssl` server options, as well as the `have_ssl` and `have_openssl` server system variables, were deprecated in MySQL 8.0.26. They are all removed in this release. Use `--tls-version` and `--admin-tls-version` instead.
  * The `default_authentication_plugin` system variable, deprecated in MySQL 8.0.27, is removed as of MySQL 8.4.0. Use `authentication_policy` instead.

As part of the removal of `default_authentication_plugin`, the syntax for `authentication_policy` has been changed. See the description of `authentication_policy` for more information.

**`--skip-host-cache` server option**: This option has been removed; start the server with `--host-cache-size=0` instead. See  Section 7.1.12.3, “DNS Lookups and the Host Cache”.

**`--innodb` and `--skip-innodb` server options**: These options have been removed. The `InnoDB` storage engine is always enabled, and it is not possible to disable it.

**`--character-set-client-handshake` and `--old-style-user-limits` server options**: These options were formerly used for compatibility with very old versions of MySQL which are no longer supported or maintained, and thus no longer serve any useful purpose.

**`FLUSH HOSTS` statement**: The `FLUSH HOSTS` statement, deprecated in MySQL 8.0.23, has been removed. To clear the host cache, issue `TRUNCATE TABLE` `performance_schema.host_cache` or `mysqladmin flush-hosts`.

**Obsolete replication options and variables**: A number of options and variables relating to MySQL Replication were deprecated in previous versions of MySQL, and have been removed from MySQL 8.4. Attempting to use any of these now causes the server to raise a syntax error. These options and variables are listed here:

  * `--slave-rows-search-algorithms`: The algorithm used by the replication applier to look up table rows when applying updates or deletes is now always `HASH_SCAN,INDEX_SCAN`, and is no longer configurable by the user.
  * `log_bin_use_v1_events`: This allowed source servers running MySQL 5.7 and newer to replicate to earlier versions of MySQL which are no longer supported or maintained.
  * `--relay-log-info-file`, `--relay-log-info-repository`, `--master-info-file`, `--master-info-repository`: The use of files for the applier metadata repository and the connection metadata repository has been superseded by crash-safe tables, and is no longer supported. See Section 19.2.4.2, “Replication Metadata Repositories”.
  * `transaction_write_set_extraction`
  * `group_replication_ip_whitelist`: Use `group_replication_ip_allowlist` instead.
  * `group_replication_primary_member`: No longer needed; check the `MEMBER_ROLE` column of the Performance Schema `replication_group_members` table instead.

**Replication SQL syntax**: A number of SQL statements used in MySQL Replication which were deprecated in earlier versions of MySQL are no longer supported in MySQL 8.4. Attempting to use any of these statements now produces a syntax error. These statements can be divided into two groups those relating to source servers, and those referring to replicas, as shown here:

As part of this work, the `DISABLE ON SLAVE` option for `CREATE EVENT` and `ALTER EVENT` is now deprecated, and is superseded by `DISABLE ON REPLICA`. The corresponding term `SLAVESIDE_DISABLED` is also now deprecated,and no longer used in event descriptions such as in the Information Schema `EVENTS` table; `REPLICA_SIDE_DISABLED` is now shown instead.

Statements which have been removed, which relate to replication source servers, are listed here:
  * `CHANGE MASTER TO`: Use `CHANGE REPLICATION SOURCE TO`.
  * `RESET MASTER`: Use `RESET BINARY LOGS AND GTIDS`.
  * `SHOW MASTER STATUS`: Use `SHOW BINARY LOG STATUS`.
  * `PURGE MASTER LOGS`: Use `PURGE BINARY LOGS`.
  * `SHOW MASTER LOGS`: Use `SHOW BINARY LOGS`.

Removed SQL statements relating to replicas are listed here:
  * `START SLAVE`: Use `START REPLICA`.
  * `STOP SLAVE`: Use `STOP REPLICA`.
  * `SHOW SLAVE STATUS`: Use `SHOW REPLICA STATUS`.
  * `SHOW SLAVE HOSTS`: Use `SHOW REPLICAS`.
  * `RESET SLAVE`: Use `RESET REPLICA`.

All of the statements listed previously were removed from MySQL test programs and files, as well as from any other internal use.

In addition, a number of deprecated options formerly supported by `CHANGE REPLICATION SOURCE TO` and `START REPLICA` have been removed and are no longer accepted by the server. The removed options for each of these SQL statements are listed next.

Options removed from `CHANGE REPLICATION SOURCE TO` are listed here:
  * `MASTER_AUTO_POSITION`: Use `SOURCE_AUTO_POSITION`.
  * `MASTER_HOST`: Use `SOURCE_HOST`.
  * `MASTER_BIND`: Use `SOURCE_BIND`.
  * `MASTER_UseR`: Use `SOURCE_UseR`.
  * `MASTER_PASSWORD`: Use `SOURCE_PASSWORD`.
  * `MASTER_PORT`: Use `SOURCE_PORT`.
  * `MASTER_CONNECT_RETRY`: Use `SOURCE_CONNECT_RETRY`.
  * `MASTER_RETRY_COUNT`: Use `SOURCE_RETRY_COUNT`.
  * `MASTER_DELAY`: Use `SOURCE_DELAY`.
  * `MASTER_SSL`: Use `SOURCE_SSL`.
  * `MASTER_SSL_CA`: Use `SOURCE_SSL_CA`.
  * `MASTER_SSL_CAPATH`: Use `SOURCE_SSL_CAPATH`.
  * `MASTER_SSL_CIPHER`: Use `SOURCE_SSL_CIPHER`.
  * `MASTER_SSL_CRL`: Use `SOURCE_SSL_CRL`.
  * `MASTER_SSL_CRLPATH`: Use `SOURCE_SSL_CRLPATH`.
  * `MASTER_SSL_KEY`: Use `SOURCE_SSL_KEY`.
  * `MASTER_SSL_VERIFY_SERVER_CERT`: Use `SOURCE_SSL_VERIFY_SERVER_CERT`.
  * `MASTER_TLS_VERSION`: Use `SOURCE_TLS_VERSION`.
  * `MASTER_TLS_CIPHERSUITES`: Use `SOURCE_TLS_CIPHERSUITES`.
  * `MASTER_SSL_CERT`: Use `SOURCE_SSL_CERT`.
  * `MASTER_PUBLIC_KEY_PATH`: Use `SOURCE_PUBLIC_KEY_PATH`.
  * `GET_MASTER_PUBLIC_KEY`: Use `GET_SOURCE_PUBLIC_KEY`.
  * `MASTER_HEARTBEAT_PERIOD`: Use `SOURCE_HEARTBEAT_PERIOD`.
  * `MASTER_COMPRESSION_ALGORITHMS`: Use `SOURCE_COMPRESSION_ALGORITHMS`.
  * `MASTER_ZSTD_COMPRESSION_LEVEL`: Use `SOURCE_ZSTD_COMPRESSION_LEVEL`.
  * `MASTER_LOG_FILE`: Use `SOURCE_LOG_FILE`.
  * `MASTER_LOG_POS`: Use `SOURCE_LOG_POS`.

Options removed from the `START REPLICA` statement are listed here:

  * `MASTER_LOG_FILE`: Use `SOURCE_LOG_FILE`.
  * `MASTER_LOG_POS`: Use `SOURCE_LOG_POS`.
  
**System variables and `NULL`**: It is not intended or supported for a MySQL server startup option to be set to `NULL` (`--my-option=NULL`) and have it interpreted by the server as SQL `NULL`, and should not be possible. MySQL 8.1 (and later) specifically disallows setting startup options to `NULL` in this fashion, and rejects an attempt to do with an error. Attempts to set the corresponding server system variables to `NULL` using `SET` or similar in the `mysql` client are also rejected.

The server system variables in the following list are excepted from the restriction just described:

  * `admin_ssl_ca`
  * `admin_ssl_capath`
  * `admin_ssl_cert`
  * `admin_ssl_cipher`
  * `admin_tls_ciphersuites`
  * `admin_ssl_key`
  * `admin_ssl_crl`
  * `admin_ssl_crlpath`
  * `basedir`
  * `character_sets_dir`
  * `ft_stopword_file`
  * `group_replication_recovery_tls_ciphersuites`
  * `init_file`
  * `lc_messages_dir`
  * `plugin_dir`
  * `relay_log`
  * `relay_log_info_file`
  * `replica_load_tmpdir`
  * `ssl_ca`
  * `ssl_capath`
  * `ssl_cert`
  * `ssl_cipher`
  * `ssl_crl`
  * `ssl_crlpath`
  * `ssl_key`
  * `socket`
  * `tls_ciphersuites`
  * `tmpdir`

See also  Section 7.1.8, “Server System Variables”.

**Identifiers with an initial dollar sign**: The use of the dollar sign (`$`) as the initial character of an unquoted identifier was deprecated in MySQL 8.0, and is restricted in MySQL 8.1 and later; using an unquoted identifier beginning with a dollar sign and containing one or more dollar signs (in addition to the first one) now generates a syntax error.

Unquoted identifiers starting with `$` are not affected by this restriction if they do not contain any additional `$` characters.

See  Section 11.2, “Schema Object Names”.

Also as part of this work, the following server status variables, previously deprecated, have been removed. They are listed here, along with their replacements:

  * `Com_slave_start`: Use `Com_replica_start`.
  * `Com_slave_stop`: Use `Com_replica_stop`.
  * `Com_show_slave_status`: Use `Com_show_replica_status`.
  * `Com_show_slave_hosts`: Use `Com_show_replicas`.
  * `Com_show_master_status`: Use `Com_show_binary_log_status`.
  * `Com_change_master`: Use `Com_change_replication_source`.

The variables just listed as removed no longer appear in the output of statements such as `SHOW STATUS`. See also `Com_xxx` Variables.

**Plugins**: A number of plugins were removed in MySQL 8.4.0, and are listed here, along with any system variables and other features associated with them which were also removed or otherwise affected by the plugin removal:

  * `authentication_fido` and `authentication_fido_client` plugins: Use the `authentication_webauthn` plugin instead. See Section 8.4.1.11, “WebAuthn Pluggable Authentication”. The `authentication_fido_rp_id` server system variable, `mysql` client `--fido-register-factor` option, and the `-DWITH_FIDO` CMake option were also removed.
  * `keyring_file` plugin: Use the `component_keyring_file` component instead. See  Section 8.4.4.4, “Using the `component_keyring_file` File-Based Keyring Component”. The `keyring_file_data` system variable was also removed. In addition, the CMake options `-DINSTALL_MYSQLKEYRINGDIR` and `-DWITH_KEYRING_TEST` were removed.
  * `keyring_encrypted_file` plugin: Use the `component_keyring_encrypted_file` component instead. See Section 8.4.4.5, “Using the component_keyring_encrypted_file Encrypted File-Based Keyring Component”. The `keyring_encrypted_file_data` and `keyring_encrypted_file_password` system variables were also removed.
  * `keyring_oci` plugin: Use the `component_keyring_oci` component instead. See Section 8.4.4.9, “Using the Oracle Cloud Infrastructure Vault Keyring Component”. The following server system variables were also removed: `keyring_oci_ca_certificate`, `keyring_oci_compartment`, `keyring_oci_encryption_endpoint`, `keyring_oci_key_file`, `keyring_oci_key_fingerprint`, `keyring_oci_management_endpoint`, `keyring_oci_master_key`, `keyring_oci_secrets_endpoint`, `keyring_oci_tenancy`, `keyring_oci_user`, `keyring_oci_vaults_endpoint`, and `keyring_oci_virtual_vault`.
  * `openssl_udf` plugin: Use the MySQL Enterprise Encryption (`component_enterprise_encryption`) component instead; see Section 8.6, “MySQL Enterprise Encryption”.

**Support for weak ciphers**: When configuring encrypted connections, MySQL 8.4.0 and later no longer allow specifying any cipher that does not meet the following requirements:

  * Conforms to proper TLS version (TLS v1.2 or TLSv1.3, as appropriate)
  * Provides perfect forward secrecy
  * Uses SHA2 in cipher, certificate, or both
  * Uses AES in GCM or any other AEAD algorithms or modes

This has implications for setting the following system variables:

  * `ssl_cipher`
  * `admin_ssl_cipher`
  * `tls_ciphersuites`
  * `admin_tls_ciphersuites`

See the descriptions of these variables for their permitted values in MySQL 8.4, and more information.

::: info Note

`libmysqlclient` continues to support additional ciphers that do not satisfy these conditions in order to retain the ability to connect to older versions of MySQL.

:::

**`INFORMATION_SCHEMA.TABLESPACES`**: The `INFORMATION_SCHEMA.TABLESPACES` table, which was not actually used, was deprecated in MySQL 8.0.22 and has now been removed.

::: info Note

For `NDB` tables, the Information Schema `FILES` table provides tablespace-related information.

For `InnoDB` tables, the Information Schema `INNODB_TABLESPACES` and `INNODB_DATAFILES` tables provide tablespace metadata.

:::

**`DROP TABLESPACE` and `ALTER TABLESPACE: ENGINE` clause**: The `ENGINE` clause for `DROP TABLESPACE` and `ALTER TABLESPACE` statements was deprecated in MySQL 8.0. In MySQL 8.4, it is no longer supported, and causes an error if you attempt to use it with `DROP TABLESPACE` or `ALTER TABLESPACE ... DROP DATAFILE`. `ENGINE` is also no longer supported for all other variants of `ALTER TABLESPACE`, with the two exceptions listed here:

  * `ALTER TABLESPACE ... ADD DATAFILE ENGINE={NDB|NDBCLUSTER}`
  * `ALTER UNDO TABLESPACE ... SET {ACTIVE|INACTIVE} ENGINE=INNODB`


For more information, see the documentation for these statements.

**`LOW_PRIORITY with LOCK TABLES ... WRITE`**: The `LOW_PRIORITY` clause of the `LOCK TABLES ... WRITE` statement had had no effect since MySQL 5.5, and was deprecated in MySQL 5.6. It is no longer supported in MySQL 8.4; including it in `LOCK TABLES` now causes a syntax error.

**`EXPLAIN FORMAT=JSON format` versioning**: It is now possible to choose between 2 versions of the JSON output format used by `EXPLAIN FORMAT=JSON` statements using the `explain_json_format_version` server system variable introduced in this release. Setting this variable to `1` causes the server to use Version 1, which is the linear format which was always used for output from such statements in MySQL 8.2 and earlier. This is the default value and format in MySQL 8.4. Setting `explain_json_format_version` to `2` causes the Version 2 format to be used; this JSON output format is based on access paths, and is intended to provide better compatibility with future versions of the MySQL Optimizer.

See  Obtaining Execution Plan Information, for more information and examples.

**Capturing `EXPLAIN FORMAT=JSON output`**: `EXPLAIN FORMAT=JSON` was extended with an `INTO` option, which provides the ability to store JSON-formatted `EXPLAIN` output in a user variable where it can be worked with using MySQL JSON functions, like this:

```sql
mysql> EXPLAIN FORMAT=JSON INTO @myex SELECT name FROM a WHERE id = 2;
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT JSON_EXTRACT(@myex, "$.query_block.table.key");
+------------------------------------------------+
| JSON_EXTRACT(@myex, "$.query_block.table.key") |
+------------------------------------------------+
| "PRIMARY"                                      |
+------------------------------------------------+
1 row in set (0.01 sec)
```

This option can be used only if the `EXPLAIN` statement also contains `FORMAT=JSON`; otherwise, a syntax error results. This requirement is not affected by the value of `explain_format`.

`INTO` can be used with any explainable statement with the exception of `EXPLAIN FOR CONNECTION`. It cannot be used with `EXPLAIN ANALYZE`.

For more information and examples, see Obtaining Execution Plan Information.

**`EXPLAIN FOR SCHEMA`**: Added a `FOR SCHEMA` option to the `EXPLAIN` statement. The syntax is as shown here, where *`stmt`* is an explainable statement:

```sql
EXPLAIN [options] FOR SCHEMA schema_name stmt
```

This causes `stmt` to be run as if in the named schema.

`FOR DATABASE` is also supported as a synonym.

This option is not compatible with `FOR CONNECTION`.

See  Obtaining Execution Plan Information, for more information.

**Client comments preserved**: In MySQL 8.0, the stripping of comments from the `mysql` client was the default behavior; the default was changed to preserve such comments.

To enable the stripping of comments as was performed in MySQL 8.0 and earlier, start the `mysql` client with `--skip-comments`.

**`AUTO_INCREMENT` and floating-point columns**: The use of the `AUTO_INCREMENT` modifier with `FLOAT` and `DOUBLE` columns in `CREATE TABLE` and `ALTER TABLE` statements was deprecated in MySQL 8.0; support for it is removed altogether in MySQL 8.4, where it raises `ER_WRONG_FIELD_SPEC` (Incorrect column specifier for column).

Before upgrading to MySQL 8.4 from a previous series, you *must* fix any table that contains a `FLOAT` or `DOUBLE` column with `AUTO_INCREMENT` so that the table no longer uses either of these. Otherwise, the upgrade fails .

**`mysql_ssl_rsa_setup` utility**: The `mysql_ssl_rsa_setup` utility, deprecated in MySQL 8.0.34, has been removed. For MySQL distributions compiled using OpenSSL, the MySQL server can perform automatic generation of missing SSL and RSA files at startup. See Section 8.3.3.1, “Creating SSL and RSA Certificates and Keys using MySQL”, for more information.

**MySQL Privileges**: Added the  `SET_ANY_DEFINER` privilege for definer object creation and the `ALLOW_NONEXISTENT_DEFINER` privilege for orphan object protection. Together these privileges coexist with the deprecated `SET_USER_ID` privilege.

**`SET_USER_ID` privilege**: The `SET_USER_ID` privilege, deprecated in MySQL 8.2.0, has been removed. use in `GRANT` statements now causes a syntax error

Instead of `SET_USER_ID`, you can use the `SET_ANY_DEFINER` privilege for definer object creation, and the `ALLOW_NONEXISTENT_DEFINER` privileges for orphan object protection.

Both privileges are required to produce orphaned SQL objects using  `CREATE PROCEDURE`, `CREATE FUNCTION`, `CREATE TRIGGER`, `CREATE EVENT`, or `CREATE VIEW`.

**`--abort-slave-event-count` and `--disconnect-slave-event-count` server options**: The MySQL server startup options `--abort-slave-event-count` and `--disconnect-slave-event-count`, formerly used in testing, were deprecated in MySQL 8.0, and have been removed in this release. Attempting to start `mysqld` with either of these options now results in an error.

**`mysql_upgrade` utility**: The `mysql_upgrade` utility, deprecated in MySQL 8.0.16, has been removed.

**`mysqlpump` utility.** The `mysqlpump` utility along with its helper utilities **lz4_decompress** and **zlib_decompress**, deprecated in MySQL 8.0.34, were removed. Instead, use `mysqldump` or MySQL Shell's dump utilities.

**Obsolete `CMake` options**: The following options for compiling the server with CMake were obsolete and have been removed:

  * `USE_LD_LLD`: Use `WITH_LD=lld` instead.
  * `WITH_BOOST`, `DOWNLOAD_BOOST`, `DOWNLOAD_BOOST_TIMEOUT`: These options are no longer necessary; MySQL now includes and uses a bundled version of Boost when compiling from source.

**Removed Keywords**: Keywords removed in MySQL 8.4 since MySQL 8.0. Reserved keywords are marked with (R).

`GET_MASTER_PUBLIC_KEY`, `MASTER_AUTO_POSITION`, `MASTER_BIND` (R), `MASTER_COMPRESSION_ALGORITHMS`, `MASTER_CONNECT_RETRY`, `MASTER_DELAY`, `MASTER_HEARTBEAT_PERIOD`, `MASTER_HOST`, `MASTER_LOG_FILE`, `MASTER_LOG_POS`, `MASTER_PASSWORD`, `MASTER_PORT`, `MASTER_PUBLIC_KEY_PATH`, `MASTER_RETRY_COUNT`, `MASTER_SSL`, `MASTER_SSL_CA`, `MASTER_SSL_CAPATH`, `MASTER_SSL_CERT`, `MASTER_SSL_CIPHER`, `MASTER_SSL_CRL`, `MASTER_SSL_CRLPATH`, `MASTER_SSL_KEY`, `MASTER_SSL_VERIFY_SERVER_CERT` (R), `MASTER_TLS_CIPHERSUITES`, `MASTER_TLS_VERSION`, `MASTER_USER`, and `MASTER_ZSTD_COMPRESSION_LEVEL`.

**Index prefixes in partitioning key**: Columns with index prefixes were allowed in the partitioning key for a partitioned table in MySQL 8.0, and raised a warning with no other effects when creating, altering, or upgrading a partitioned table. Such columns are no longer permitted in partitioned tables, and using any such columns in the partitioning key causes the `CREATE TABLE` or `ALTER TABLE` statement in they occur to be rejected with an error.

For more information, see Column index prefixes not supported for key partitioning.
