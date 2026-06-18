#### 26.4.4.18 O Procedure ps_setup_show_enabled()

Exibe toda a configuração atualmente habilitada do Performance Schema.

##### Parâmetros

* `in_show_instruments BOOLEAN`: Se deve exibir os instruments habilitados. Esta pode ser uma lista longa.

* `in_show_threads BOOLEAN`: Se deve exibir os threads habilitados.

##### Exemplo

```sql
mysql> CALL sys.ps_setup_show_enabled(FALSE, FALSE);
+----------------------------+
| performance_schema_enabled |
+----------------------------+
|                          1 |
+----------------------------+
1 row in set (0.00 sec)

+---------------+
| enabled_users |
+---------------+
| '%'@'%'       |
+---------------+
1 row in set (0.00 sec)

+-------------+---------+---------+-------+
| object_type | objects | enabled | timed |
+-------------+---------+---------+-------+
| EVENT       | %.%     | YES     | YES   |
| FUNCTION    | %.%     | YES     | YES   |
| PROCEDURE   | %.%     | YES     | YES   |
| TABLE       | %.%     | YES     | YES   |
| TRIGGER     | %.%     | YES     | YES   |
+-------------+---------+---------+-------+
5 rows in set (0.00 sec)

+---------------------------+
| enabled_consumers         |
+---------------------------+
| events_statements_current |
| events_statements_history |
| global_instrumentation    |
| statements_digest         |
| thread_instrumentation    |
+---------------------------+
```