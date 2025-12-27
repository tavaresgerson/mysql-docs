#### 30.4.4.18 The ps\_setup\_show\_enabled() Procedure

Displays all currently enabled Performance Schema configuration.

##### Parameters

* `in_show_instruments BOOLEAN`: Whether to display enabled instruments. This might be a long list.

* `in_show_threads BOOLEAN`: Whether to display enabled threads.

##### Example

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
