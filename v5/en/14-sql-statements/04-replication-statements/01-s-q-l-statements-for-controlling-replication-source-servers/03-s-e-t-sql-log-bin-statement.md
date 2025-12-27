#### 13.4.1.3 SET sql\_log\_bin Statement

```sql
SET sql_log_bin = {OFF|ON}
```

The [`sql_log_bin`](replication-options-binary-log.html#sysvar_sql_log_bin) variable controls whether logging to the binary log is enabled for the current session (assuming that the binary log itself is enabled). The default value is `ON`. To disable or enable binary logging for the current session, set the session [`sql_log_bin`](replication-options-binary-log.html#sysvar_sql_log_bin) variable to `OFF` or `ON`.

Set this variable to `OFF` for a session to temporarily disable binary logging while making changes to the source you do not want replicated to the replica.

Setting the session value of this system variable is a restricted operation. The session user must have privileges sufficient to set restricted session variables. See [Section 5.1.8.1, “System Variable Privileges”](system-variable-privileges.html "5.1.8.1 System Variable Privileges").

It is not possible to set the session value of [`sql_log_bin`](replication-options-binary-log.html#sysvar_sql_log_bin) within a transaction or subquery.

*Setting this variable to `OFF` prevents GTIDs from being assigned to transactions in the binary log*. If you are using GTIDs for replication, this means that even when binary logging is later enabled again, the GTIDs written into the log from this point do not account for any transactions that occurred in the meantime, so in effect those transactions are lost.

The global [`sql_log_bin`](replication-options-binary-log.html#sysvar_sql_log_bin) variable is read only and cannot be modified. The global scope is deprecated; expect it to be removed in a future MySQL release.
