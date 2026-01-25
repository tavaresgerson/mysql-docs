#### 26.4.4.7 O Procedure ps_setup_disable_thread()

Dado um Connection ID, desabilita a instrumentação do Performance Schema para o Thread. Gera um conjunto de resultados (result set) que indica quantos Threads foram desabilitados. Threads que já estavam desabilitados não são contabilizados.

##### Parâmetros

* `in_connection_id BIGINT`: O Connection ID. Este é um valor do tipo fornecido na coluna `PROCESSLIST_ID` da tabela `threads` do Performance Schema ou na coluna `Id` da saída de `SHOW PROCESSLIST`.

##### Exemplo

Desabilita uma Connection específica usando seu Connection ID:

```sql
mysql> CALL sys.ps_setup_disable_thread(225);
+-------------------+
| summary           |
+-------------------+
| Disabled 1 thread |
+-------------------+
```

Desabilita a Connection atual:

```sql
mysql> CALL sys.ps_setup_disable_thread(CONNECTION_ID());
+-------------------+
| summary           |
+-------------------+
| Disabled 1 thread |
+-------------------+
```