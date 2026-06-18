#### 15.7.7.1 SHOW BINARY LOGS Statement

```
SHOW BINARY LOGS
SHOW MASTER LOGS
```

Lists the binary log files on the server. This statement is used
as part of the procedure described in
[Section 15.4.1.1, “PURGE BINARY LOGS Statement”](purge-binary-logs.html "15.4.1.1 PURGE BINARY LOGS Statement"), that shows how to determine
which logs can be purged. [`SHOW BINARY
LOGS`](show-binary-logs.html "15.7.7.1 SHOW BINARY LOGS Statement") requires the [`REPLICATION
CLIENT`](privileges-provided.html#priv_replication-client) privilege (or the deprecated
[`SUPER`](privileges-provided.html#priv_super) privilege).

Encrypted binary log files have a 512-byte file header that
stores information required for encryption and decryption of the
file. This is included in the file size displayed by
[`SHOW BINARY LOGS`](show-binary-logs.html "15.7.7.1 SHOW BINARY LOGS Statement"). The
`Encrypted` column shows whether or not the
binary log file is encrypted. Binary log encryption is active if
[`binlog_encryption=ON`](replication-options-binary-log.html#sysvar_binlog_encryption) is set for
the server. Existing binary log files are not encrypted or
decrypted if binary log encryption is activated or deactivated
while the server is running.

```
mysql> SHOW BINARY LOGS;
+---------------+-----------+-----------+
| Log_name      | File_size | Encrypted |
+---------------+-----------+-----------+
| binlog.000015 |    724935 |       Yes |
| binlog.000016 |    733481 |       Yes |
+---------------+-----------+-----------+
```

[`SHOW MASTER
LOGS`](show-binary-logs.html "15.7.7.1 SHOW BINARY LOGS Statement") is equivalent to [`SHOW BINARY
LOGS`](show-binary-logs.html "15.7.7.1 SHOW BINARY LOGS Statement").