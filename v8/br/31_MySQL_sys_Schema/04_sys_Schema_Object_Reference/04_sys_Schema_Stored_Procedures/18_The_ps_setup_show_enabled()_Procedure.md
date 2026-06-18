#### 30.4.4.18 O procedimento ps\_setup\_show\_enabled()

Exibe todas as configurações da Schema de Desempenho atualmente habilitadas.

##### Parâmetros

- `in_show_instruments BOOLEAN`: Se os instrumentos habilitados devem ser exibidos. Isso pode ser uma longa lista.

- `in_show_threads BOOLEAN`: Se deve exibir threads habilitadas.

##### Exemplo

```
mysql> CALL sys.ps_setup_show_enabled(FALSE, FALSE);
+----------------------------+
| performance_schema_enabled |
+----------------------------+
|                          1 |
+----------------------------+
1 row in set (0.01 sec)

+---------------+
| enabled_users |
+---------------+
| '%'@'%'       |
+---------------+
1 row in set (0.01 sec)

+-------------+---------+---------+-------+
| object_type | objects | enabled | timed |
+-------------+---------+---------+-------+
| EVENT       | %.%     | YES     | YES   |
| FUNCTION    | %.%     | YES     | YES   |
| PROCEDURE   | %.%     | YES     | YES   |
| TABLE       | %.%     | YES     | YES   |
| TRIGGER     | %.%     | YES     | YES   |
+-------------+---------+---------+-------+
5 rows in set (0.02 sec)

+-----------------------------+
| enabled_consumers           |
+-----------------------------+
| events_statements_current   |
| events_statements_history   |
| events_transactions_current |
| events_transactions_history |
| global_instrumentation      |
| statements_digest           |
| thread_instrumentation      |
+-----------------------------+
```
