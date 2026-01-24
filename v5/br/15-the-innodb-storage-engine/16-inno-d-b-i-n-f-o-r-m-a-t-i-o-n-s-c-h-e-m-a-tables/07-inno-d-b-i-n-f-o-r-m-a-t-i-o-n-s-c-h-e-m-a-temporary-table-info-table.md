### 14.16.7 InnoDB INFORMATION_SCHEMA Temporary Table Info Table

`INNODB_TEMP_TABLE_INFO` provides information about user-created `InnoDB` temporary tables that are active in the `InnoDB` instance. It does not provide information about internal `InnoDB` temporary tables used by the optimizer.

```sql
mysql> SHOW TABLES FROM INFORMATION_SCHEMA LIKE 'INNODB_TEMP%';
+---------------------------------------------+
| Tables_in_INFORMATION_SCHEMA (INNODB_TEMP%) |
+---------------------------------------------+
| INNODB_TEMP_TABLE_INFO                      |
+---------------------------------------------+
```

For the table definition, see Section 24.4.27, “The INFORMATION_SCHEMA INNODB_TEMP_TABLE_INFO Table”.

**Example 14.12 INNODB_TEMP_TABLE_INFO**

This example demonstrates characteristics of the `INNODB_TEMP_TABLE_INFO` table.

1. Create a simple `InnoDB` temporary table:

   ```sql
   mysql> CREATE TEMPORARY TABLE t1 (c1 INT PRIMARY KEY) ENGINE=INNODB;
   ```

2. Query `INNODB_TEMP_TABLE_INFO` to view the temporary table metadata.

   ```sql
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_TEMP_TABLE_INFO\G
   *************************** 1. row ***************************
               TABLE_ID: 194
                   NAME: #sql7a79_1_0
                 N_COLS: 4
                  SPACE: 182
   PER_TABLE_TABLESPACE: FALSE
          IS_COMPRESSED: FALSE
   ```

   The `TABLE_ID`  is a unique identifier for the temporary table. The `NAME` column displays the system-generated name for the temporary table, which is prefixed with “#sql”. The number of columns (`N_COLS`) is 4 rather than 1 because `InnoDB` always creates three hidden table columns (`DB_ROW_ID`, `DB_TRX_ID`, and `DB_ROLL_PTR`). `PER_TABLE_TABLESPACE` and `IS_COMPRESSED` report `TRUE` for compressed temporary tables. Otherwise, these fields report `FALSE`.

3. Create a compressed temporary table.

   ```sql
   mysql> CREATE TEMPORARY TABLE t2 (c1 INT) ROW_FORMAT=COMPRESSED ENGINE=INNODB;
   ```

4. Query `INNODB_TEMP_TABLE_INFO` again.

   ```sql
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_TEMP_TABLE_INFO\G
   *************************** 1. row ***************************
               TABLE_ID: 195
                   NAME: #sql7a79_1_1
                 N_COLS: 4
                  SPACE: 183
   PER_TABLE_TABLESPACE: TRUE
          IS_COMPRESSED: TRUE
   *************************** 2. row ***************************
               TABLE_ID: 194
                   NAME: #sql7a79_1_0
                 N_COLS: 4
                  SPACE: 182
   PER_TABLE_TABLESPACE: FALSE
          IS_COMPRESSED: FALSE
   ```

   `PER_TABLE_TABLESPACE` and `IS_COMPRESSED` report `TRUE` for the compressed temporary table. The `SPACE` ID for the compressed temporary table is different because compressed temporary tables are created in separate file-per-table tablespaces. Non-compressed temporary tables are created in the shared temporary tablespace (`ibtmp1`) and report the same `SPACE` ID.

5. Restart MySQL and query `INNODB_TEMP_TABLE_INFO`.

   ```sql
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_TEMP_TABLE_INFO\G
   Empty set (0.00 sec)
   ```

   An empty set is returned because `INNODB_TEMP_TABLE_INFO` and its data are not persisted to disk when the server is shut down.

6. Create a new temporary table.

   ```sql
   mysql> CREATE TEMPORARY TABLE t1 (c1 INT PRIMARY KEY) ENGINE=INNODB;
   ```

7. Query `INNODB_TEMP_TABLE_INFO` to view the temporary table metadata.

   ```sql
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_TEMP_TABLE_INFO\G
   *************************** 1. row ***************************
               TABLE_ID: 196
                   NAME: #sql7b0e_1_0
                 N_COLS: 4
                  SPACE: 184
   PER_TABLE_TABLESPACE: FALSE
          IS_COMPRESSED: FALSE
   ```

   The `SPACE` ID may be different because it is dynamically generated when the server is started.
