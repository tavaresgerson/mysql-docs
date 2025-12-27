#### 26.4.4.16 The ps\_setup\_show\_disabled\_consumers() Procedure

Displays all currently disabled Performance Schema consumers.

##### Parameters

None.

##### Example

```sql
mysql> CALL sys.ps_setup_show_disabled_consumers();
+----------------------------------+
| disabled_consumers               |
+----------------------------------+
| events_stages_current            |
| events_stages_history            |
| events_stages_history_long       |
| events_statements_history        |
| events_statements_history_long   |
| events_transactions_history      |
| events_transactions_history_long |
| events_waits_current             |
| events_waits_history             |
| events_waits_history_long        |
+----------------------------------+
```
