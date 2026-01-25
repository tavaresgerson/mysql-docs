#### 26.4.4.11 O Procedure ps_setup_enable_thread()

Dado um Connection ID, habilita a instrumentação do Performance Schema para o Thread. Produz um result set indicando quantos Threads foram habilitados. Threads que já estão habilitados não são contados.

##### Parâmetros

* `in_connection_id BIGINT`: O Connection ID. Este é um valor do tipo fornecido na coluna `PROCESSLIST_ID` da tabela `threads` do Performance Schema ou na coluna `Id` da saída de `SHOW PROCESSLIST`.

##### Exemplo

Habilita uma Connection específica pelo seu Connection ID:

```sql
mysql> CALL sys.ps_setup_enable_thread(225);
+------------------+
| summary          |
+------------------+
| Enabled 1 thread |
+------------------+
```

Habilita a Connection atual:

```sql
mysql> CALL sys.ps_setup_enable_thread(CONNECTION_ID());
+------------------+
| summary          |
+------------------+
| Enabled 1 thread |
+------------------+
```