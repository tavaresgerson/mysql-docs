#### 30.4.4.19 The ps\_setup\_show\_enabled\_consumers() Procedure

Displays all currently enabled Performance Schema consumers.

##### Parameters

None.

##### Example

```
mysql> CALL sys.ps_setup_show_enabled_consumers();
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
