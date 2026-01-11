### 17.15.7 InnoDB INFORMATION_SCHEMA Temporary Table Info Table

`INNODB_TEMP_TABLE_INFO` provides information about user-created `InnoDB` temporary tables that are active in the `InnoDB` instance. It does not provide information about internal `InnoDB` temporary tables used by the optimizer.

```
mysql> SHOW TABLES FROM INFORMATION_SCHEMA LIKE 'INNODB_TEMP%';
+---------------------------------------------+
| Tables_in_INFORMATION_SCHEMA (INNODB_TEMP%) |
+---------------------------------------------+
| INNODB_TEMP_TABLE_INFO                      |
+---------------------------------------------+
```

For the table definition, see Section 28.4.27, “The INFORMATION_SCHEMA INNODB_TEMP_TABLE_INFO Table”.

**Example 17.12 INNODB_TEMP_TABLE_INFO**

This example demonstrates characteristics of the `INNODB_TEMP_TABLE_INFO` table.

1. Create a simple `InnoDB` temporary table:

   ```
   mysql> CREATE TEMPORARY TABLE t1 (c1 INT PRIMARY KEY) ENGINE=INNODB;
   ```

2. Query `INNODB_TEMP_TABLE_INFO` to view the temporary table metadata.

   ```
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_TEMP_TABLE_INFO\G
   *************************** 1. row ***************************
               TABLE_ID: 194
                   NAME: #sql7a79_1_0
                 N_COLS: 4
                  SPACE: 182
   ```

   The `TABLE_ID`  is a unique identifier for the temporary table. The `NAME` column displays the system-generated name for the temporary table, which is prefixed with “#sql”. The number of columns (`N_COLS`) is 4 rather than 1 because `InnoDB` always creates three hidden table columns (`DB_ROW_ID`, `DB_TRX_ID`, and `DB_ROLL_PTR`).

3. Restart MySQL and query `INNODB_TEMP_TABLE_INFO`.

   ```
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_TEMP_TABLE_INFO\G
   ```

   An empty set is returned because `INNODB_TEMP_TABLE_INFO` and its data are not persisted to disk when the server is shut down.

4. Create a new temporary table.

   ```
   mysql> CREATE TEMPORARY TABLE t1 (c1 INT PRIMARY KEY) ENGINE=INNODB;
   ```

5. Query `INNODB_TEMP_TABLE_INFO` to view the temporary table metadata.

   ```
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_TEMP_TABLE_INFO\G
   *************************** 1. row ***************************
               TABLE_ID: 196
                   NAME: #sql7b0e_1_0
                 N_COLS: 4
                  SPACE: 184
   ```

   The `SPACE` ID may be different because it is dynamically generated when the server is started.
