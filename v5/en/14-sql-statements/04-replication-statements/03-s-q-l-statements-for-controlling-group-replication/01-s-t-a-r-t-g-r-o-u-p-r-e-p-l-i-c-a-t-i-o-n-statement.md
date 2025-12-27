#### 13.4.3.1 START GROUP\_REPLICATION Statement

```sql
START GROUP_REPLICATION
```

Starts Group Replication on this server instance. This statement requires the [`SUPER`](privileges-provided.html#priv_super) privilege. If [`super_read_only=ON`](server-system-variables.html#sysvar_super_read_only) and the member should join as a primary, [`super_read_only`](server-system-variables.html#sysvar_super_read_only) is set to `OFF` once Group Replication successfully starts.

A server that participates in a group in single-primary mode should use [`skip_replica_start=ON`](/doc/refman/8.0/en/replication-options-replica.html#sysvar_skip_replica_start). Otherwise, the server is not allowed to join a group as a secondary.
