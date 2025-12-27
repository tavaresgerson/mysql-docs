### 13.5.3 DEALLOCATE PREPARE Statement

```sql
{DEALLOCATE | DROP} PREPARE stmt_name
```

To deallocate a prepared statement produced with [`PREPARE`](prepare.html "13.5.1 PREPARE Statement"), use a [`DEALLOCATE PREPARE`](deallocate-prepare.html "13.5.3 DEALLOCATE PREPARE Statement") statement that refers to the prepared statement name. Attempting to execute a prepared statement after deallocating it results in an error. If too many prepared statements are created and not deallocated by either the `DEALLOCATE PREPARE` statement or the end of the session, you might encounter the upper limit enforced by the [`max_prepared_stmt_count`](server-system-variables.html#sysvar_max_prepared_stmt_count) system variable.

For examples, see [Section 13.5, “Prepared Statements”](sql-prepared-statements.html "13.5 Prepared Statements").
