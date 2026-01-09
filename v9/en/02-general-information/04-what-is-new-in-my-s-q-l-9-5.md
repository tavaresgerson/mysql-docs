## 1.4 What Is New in MySQL 9.5

This section summarizes what has been added to, deprecated in, changed, and removed from MySQL 9.5 since MySQL 9.4. A companion section lists MySQL server options and variables that have been added, deprecated, or removed in MySQL 9.5; see Section 1.5, “Server and Status Variables and Options Added, Deprecated, or Removed in MySQL 9.5”.

* Features Added or Changed in MySQL 9.5
* Features Deprecated in MySQL 9.5
* Features Removed in MySQL 9.5

### Features Added or Changed in MySQL 9.5

The following features have been added to MySQL 9.5:

* **innodb_log_writer_threads default behavior change.** The default value for `innodb_log_writer_threads` is now determined in part by whether binary logging is enabled on the server, as shown here:

  ```
  if (log_bin = OFF)
  {
    if ([number of logical CPUs] <= 4)
    {
      innodb_log_writer_threads = OFF
    }
    else
    {
      innodb_log_writer_threads = ON
    }
  }
  else
  {
    /* Same as in MySQL 9.4 and earlier: */
    if ([number of logical CPUs] < 32)
    {
      innodb_log_writer_threads = OFF
    }
    else
    {
      innodb_log_writer_threads = ON
    }
  }
  ```

  In other words, if binary logging is enabled (`log_bin` is `ON`) and the number of logical CPUs available is 32 or more, `innodb_log_writer_threads` defaults to `ON`; if binary logging is disabled and the number of CPUs available is greater than 4, it (also) defaults to `ON`; in all other cases, the default value of `innodb_log_writer_threads` is `OFF`. This does not affect the variable's configured value, if set.

  For further information, see the description of `innodb_log_writer_threads` in the documentation, as well as Section 10.5.4, “Optimizing InnoDB Redo Logging”.

* **Increased binlog_transaction_dependency_history_size.** The default value for the `binlog_transaction_dependency_history_size` server system variable was increased in MySQL 9.5.0 from 25000 to 1000000 (one million). In addition, this variable's maximum value has been increased from 1000000 to 10000000 (ten million).

  This change does not affect any value currently set for this variable, and thus should not have any effect on existing setups.

### Features Deprecated in MySQL 9.5

The following features are deprecated in MySQL 9.5 and may be removed in a future series. Where alternatives are shown, applications should be updated to use them.

For applications that use features deprecated in MySQL 9.5 that have been removed in a later MySQL version, statements may fail when replicated from a MySQL 9.5 source to a replica running a later version, or may have different effects on source and replica. To avoid such problems, applications that use features deprecated in 9.5 should be revised to avoid them and use alternatives when possible.

* **SCRAM-SHA-1 authentication.** The `SCRAM-SHA-1` authentication method for SASL LDAP authentication is deprecated as of MySQL 9.5.0. Use `SCRAM-SHA-256` instead; this is also now the default value for `authentication_ldap_sasl_auth_method_name`.

  See Section 8.4.1.6, “LDAP Pluggable Authentication”, for more information.

### Features Removed in MySQL 9.5

The following items are obsolete and have been removed in MySQL 9.5. Where alternatives are shown, applications should be updated to use them.

For MySQL 9.4 applications that use features removed in MySQL 9.5, statements may fail when replicated from a MySQL 9.4 source to a MySQL 9.5 replica, or may have different effects on source and replica. To avoid such problems, applications that use features removed in MySQL 9.5 should be revised to avoid them and use alternatives when possible.

* **Server system and status variables removed.** Server system and status variables removed in MySQL 9.5 are shown in the following list:

  + `group_replication_allow_local_lower_version_join`
  + `replica_parallel_type`
