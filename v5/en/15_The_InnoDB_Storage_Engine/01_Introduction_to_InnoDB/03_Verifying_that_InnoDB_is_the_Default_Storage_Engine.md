### 14.1.3 Verifying that InnoDB is the Default Storage Engine

Issue the [`SHOW ENGINES`](show-engines.html "13.7.5.16 SHOW ENGINES Statement") statement to
view the available MySQL storage engines. Look for
`DEFAULT` in the `SUPPORT`
column.

```sql
mysql> SHOW ENGINES;
```

Alternatively, query the Information Schema
[`ENGINES`](information-schema-engines-table.html "24.3.7 The INFORMATION_SCHEMA ENGINES Table") table.

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.ENGINES;
```