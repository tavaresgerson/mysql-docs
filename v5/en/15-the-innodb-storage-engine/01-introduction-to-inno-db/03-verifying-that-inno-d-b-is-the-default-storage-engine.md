### 14.1.3 Verifying that InnoDB is the Default Storage Engine

Issue the `SHOW ENGINES` statement to view the available MySQL storage engines. Look for `DEFAULT` in the `SUPPORT` column.

```sql
mysql> SHOW ENGINES;
```

Alternatively, query the Information Schema `ENGINES` table.

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.ENGINES;
```
