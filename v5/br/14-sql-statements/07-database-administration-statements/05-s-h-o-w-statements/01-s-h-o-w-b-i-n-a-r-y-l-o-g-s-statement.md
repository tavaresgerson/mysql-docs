#### 13.7.5.1 Instrução SHOW BINARY LOGS

```sql
SHOW BINARY LOGS
SHOW MASTER LOGS
```

Lista os arquivos de BINARY LOG no servidor. Esta instrução é usada como parte do procedimento descrito na Section 13.4.1.1, “PURGE BINARY LOGS Statement”, que mostra como determinar quais logs podem ser PURGED. Um usuário com o privilégio `SUPER` ou `REPLICATION CLIENT` pode executar esta instrução.

```sql
mysql> SHOW BINARY LOGS;
+---------------+-----------+
| Log_name      | File_size |
+---------------+-----------+
| binlog.000015 |    724935 |
| binlog.000016 |    733481 |
+---------------+-----------+
```

`SHOW MASTER LOGS` é equivalente a `SHOW BINARY LOGS`.