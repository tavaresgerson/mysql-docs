#### 26.4.4.24 The ps\_truncate\_all\_tables() Procedure

Truncates all Performance Schema summary tables, resetting all aggregated instrumentation as a snapshot. Produces a result set indicating how many tables were truncated.

##### Parameters

* `in_verbose BOOLEAN`: Whether to display each `TRUNCATE TABLE` statement before executing it.

##### Example

```sql
mysql> CALL sys.ps_truncate_all_tables(FALSE);
+---------------------+
| summary             |
+---------------------+
| Truncated 44 tables |
+---------------------+
```
