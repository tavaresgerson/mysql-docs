#### 13.7.5.1 Declaração de registro binário de exibição

```sql
SHOW BINARY LOGS
SHOW MASTER LOGS
```

Lista os arquivos de log binário no servidor. Esta declaração é usada como parte do procedimento descrito na Seção 13.4.1.1, “Declaração PURGE BINARY LOGS”, que mostra como determinar quais logs podem ser excluídos. Um usuário com o privilégio `SUPER` ou `REPLICATION CLIENT` pode executar esta declaração.

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
