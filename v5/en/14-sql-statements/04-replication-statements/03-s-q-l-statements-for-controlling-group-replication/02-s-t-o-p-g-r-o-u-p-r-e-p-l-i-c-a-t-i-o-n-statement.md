#### 13.4.3.2 STOP GROUP\_REPLICATION Statement

```sql
STOP GROUP_REPLICATION
```

Stops Group Replication. This statement requires the [`GROUP_REPLICATION_ADMIN`](/doc/refman/8.0/en/privileges-provided.html#priv_group-replication-admin) or [`SUPER`](privileges-provided.html#priv_super) privilege. As soon as you issue [`STOP GROUP_REPLICATION`](stop-group-replication.html "13.4.3.2 STOP GROUP_REPLICATION Statement") the member is set to [`super_read_only=ON`](server-system-variables.html#sysvar_super_read_only), which ensures that no writes can be made to the member while Group Replication stops. Any other replication channels running on the member are also stopped.

Warning

Use this statement with extreme caution because it removes the server instance from the group, meaning it is no longer protected by Group Replication's consistency guarantee mechanisms. To be completely safe, ensure that your applications can no longer connect to the instance before issuing this statement to avoid any chance of stale reads.
