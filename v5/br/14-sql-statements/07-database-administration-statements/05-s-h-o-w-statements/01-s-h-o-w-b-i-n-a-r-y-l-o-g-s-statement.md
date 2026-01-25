#### 13.7.5.1 Instrução SHOW BINARY LOGS

```sql
SHOW BINARY LOGS
SHOW MASTER LOGS
```

Lista os arquivos de BINARY LOG no servidor. Esta instrução é usada como parte do procedimento descrito na [Section 13.4.1.1, “PURGE BINARY LOGS Statement”](purge-binary-logs.html "13.4.1.1 PURGE BINARY LOGS Statement"), que mostra como determinar quais logs podem ser PURGED. Um usuário com o privilégio [`SUPER`](privileges-provided.html#priv_super) ou [`REPLICATION CLIENT`](privileges-provided.html#priv_replication-client) pode executar esta instrução.

```sql
mysql> SHOW BINARY LOGS;
+---------------+-----------+
| Log_name      | File_size |
+---------------+-----------+
| binlog.000015 |    724935 |
| binlog.000016 |    733481 |
+---------------+-----------+
```

[`SHOW MASTER LOGS`](show-binary-logs.html "13.7.5.1 SHOW BINARY LOGS Statement") é equivalente a [`SHOW BINARY LOGS`](show-binary-logs.html "13.7.5.1 SHOW BINARY LOGS Statement").