#### 13.7.5.1 SHOW BINARY LOGS Statement

```sql
SHOW BINARY LOGS
SHOW MASTER LOGS
```

Lists the binary log files on the server. This statement is used as part of the procedure described in [Section 13.4.1.1, “PURGE BINARY LOGS Statement”](purge-binary-logs.html "13.4.1.1 PURGE BINARY LOGS Statement"), that shows how to determine which logs can be purged. A user with the [`SUPER`](privileges-provided.html#priv_super) or [`REPLICATION CLIENT`](privileges-provided.html#priv_replication-client) privilege may execute this statement.

```sql
mysql> SHOW BINARY LOGS;
+---------------+-----------+
| Log_name      | File_size |
+---------------+-----------+
| binlog.000015 |    724935 |
| binlog.000016 |    733481 |
+---------------+-----------+
```

[`SHOW MASTER LOGS`](show-binary-logs.html "13.7.5.1 SHOW BINARY LOGS Statement") is equivalent to [`SHOW BINARY LOGS`](show-binary-logs.html "13.7.5.1 SHOW BINARY LOGS Statement").
