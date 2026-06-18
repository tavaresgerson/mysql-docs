### 17.1.3 Verifying that InnoDB is the Default Storage Engine

Issue a [`SHOW ENGINES`](show-engines.html "15.7.7.18 SHOW ENGINES Statement") statement to
view the available MySQL storage engines. Look for
`DEFAULT` in the `SUPPORT`
column.

```
mysql> SHOW ENGINES;
```

Alternatively, query the Information Schema
[`ENGINES`](information-schema-engines-table.html "28.3.13 The INFORMATION_SCHEMA ENGINES Table") table.

```
mysql> SELECT * FROM INFORMATION_SCHEMA.ENGINES;
```