#### 15.1.24.11 Generated Invisible Primary Keys

MySQL 9.5 supports generated invisible primary keys for any `InnoDB` table that is created without an explicit primary key. When the `sql_generate_invisible_primary_key` server system variable is set to `ON`, the MySQL server automatically adds a generated invisible primary key (GIPK) to any such table. This setting has no effect on tables created using any other storage engine than `InnoDB`.

By default, the value of `sql_generate_invisible_primary_key` is `OFF`, meaning that the automatic addition of GIPKs is disabled. To illustrate how this affects table creation, we begin by creating two identical tables, neither having a primary key, the only difference being that the first (table `auto_0`) is created with `sql_generate_invisible_primary_key` set to `OFF`, and the second (`auto_1`) after setting it to `ON`, as shown here:

```
mysql> SELECT @@sql_generate_invisible_primary_key;
+--------------------------------------+
| @@sql_generate_invisible_primary_key |
+--------------------------------------+
|                                    0 |
+--------------------------------------+
1 row in set (0.00 sec)

mysql> CREATE TABLE auto_0 (c1 VARCHAR(50), c2 INT);
Query OK, 0 rows affected (0.02 sec)

mysql> SET sql_generate_invisible_primary_key=ON;
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT @@sql_generate_invisible_primary_key;
+--------------------------------------+
| @@sql_generate_invisible_primary_key |
+--------------------------------------+
|                                    1 |
+--------------------------------------+
1 row in set (0.00 sec)

mysql> CREATE TABLE auto_1 (c1 VARCHAR(50), c2 INT);
Query OK, 0 rows affected (0.04 sec)
```

Compare the output of these `SHOW CREATE TABLE` statements to see the difference in how the tables were actually created:

```
mysql> SHOW CREATE TABLE auto_0\G
*************************** 1. row ***************************
       Table: auto_0
Create Table: CREATE TABLE `auto_0` (
  `c1` varchar(50) DEFAULT NULL,
  `c2` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
1 row in set (0.00 sec)

mysql> SHOW CREATE TABLE auto_1\G
*************************** 1. row ***************************
       Table: auto_1
Create Table: CREATE TABLE `auto_1` (
  `my_row_id` bigint unsigned NOT NULL AUTO_INCREMENT /*!80023 INVISIBLE */,
  `c1` varchar(50) DEFAULT NULL,
  `c2` int DEFAULT NULL,
  PRIMARY KEY (`my_row_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
1 row in set (0.00 sec)
```

Since `auto_1` had no primary key specified by the `CREATE TABLE` statement used to create it, setting `sql_generate_invisible_primary_key = ON` causes MySQL to add both the invisible column `my_row_id` to this table and a primary key on that column. Since `sql_generate_invisible_primary_key` was `OFF` at the time that `auto_0` was created, no such additions were performed on that table.

When a primary key is added to a table by the server, the column and key name is always `my_row_id`. For this reason, when enabling generated invisible primary keys in this way, you cannot create a table having a column named `my_row_id` unless the table creation statement also specifies an explicit primary key. (You are not required to name the column or key `my_row_id` in such cases.)

`my_row_id` is an invisible column, which means it is not shown in the output of `SELECT *` or `TABLE`; the column must be selected explicitly by name. See Section 15.1.24.10, “Invisible Columns”.

When GIPKs are enabled, a generated primary key cannot be altered other than to switch it between `VISIBLE` and `INVISIBLE`. To make the generated invisible primary key on `auto_1` visible, execute this `ALTER TABLE` statement:

```
mysql> ALTER TABLE auto_1 ALTER COLUMN my_row_id SET VISIBLE;
Query OK, 0 rows affected (0.02 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> SHOW CREATE TABLE auto_1\G
*************************** 1. row ***************************
       Table: auto_1
Create Table: CREATE TABLE `auto_1` (
  `my_row_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `c1` varchar(50) DEFAULT NULL,
  `c2` int DEFAULT NULL,
  PRIMARY KEY (`my_row_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
1 row in set (0.01 sec)
```

To make this generated primary key invisible again, issue `ALTER TABLE auto_1 ALTER COLUMN my_row_id SET INVISIBLE`.

A generated invisible primary key is always invisible by default.

Whenever GIPKs are enabled, you cannot drop a generated primary key if either of the following 2 conditions would result:

* The table is left with no primary key.
* The primary key is dropped, but not the primary key column.

The effects of `sql_generate_invisible_primary_key` apply to tables using the `InnoDB` storage engine only. You can use an `ALTER TABLE` statement to change the storage engine used by a table that has a generated invisible primary key; in this case, the primary key and column remain in place, but the table and key no longer receive any special treatment.

By default, GIPKs are shown in the output of `SHOW CREATE TABLE`, `SHOW COLUMNS`, and `SHOW INDEX`, and are visible in the Information Schema `COLUMNS` and `STATISTICS` tables. You can cause generated invisible primary keys to be hidden instead in such cases by setting the `show_gipk_in_create_table_and_information_schema` system variable to `OFF`. By default, this variable is `ON`, as shown here:

```
mysql> SELECT @@show_gipk_in_create_table_and_information_schema;
+----------------------------------------------------+
| @@show_gipk_in_create_table_and_information_schema |
+----------------------------------------------------+
|                                                  1 |
+----------------------------------------------------+
1 row in set (0.00 sec)
```

As can be seen from the following query against the `COLUMNS` table, `my_row_id` is visible among the columns of `auto_1`:

```
mysql> SELECT COLUMN_NAME, ORDINAL_POSITION, DATA_TYPE, COLUMN_KEY
    -> FROM INFORMATION_SCHEMA.COLUMNS
    -> WHERE TABLE_NAME = "auto_1";
+-------------+------------------+-----------+------------+
| COLUMN_NAME | ORDINAL_POSITION | DATA_TYPE | COLUMN_KEY |
+-------------+------------------+-----------+------------+
| my_row_id   |                1 | bigint    | PRI        |
| c1          |                2 | varchar   |            |
| c2          |                3 | int       |            |
+-------------+------------------+-----------+------------+
3 rows in set (0.01 sec)
```

After `show_gipk_in_create_table_and_information_schema` is set to `OFF`, `my_row_id` can no longer be seen in the `COLUMNS` table, as shown here:

```
mysql> SET show_gipk_in_create_table_and_information_schema = OFF;
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT @@show_gipk_in_create_table_and_information_schema;
+----------------------------------------------------+
| @@show_gipk_in_create_table_and_information_schema |
+----------------------------------------------------+
|                                                  0 |
+----------------------------------------------------+
1 row in set (0.00 sec)

mysql> SELECT COLUMN_NAME, ORDINAL_POSITION, DATA_TYPE, COLUMN_KEY
    -> FROM INFORMATION_SCHEMA.COLUMNS
    -> WHERE TABLE_NAME = "auto_1";
+-------------+------------------+-----------+------------+
| COLUMN_NAME | ORDINAL_POSITION | DATA_TYPE | COLUMN_KEY |
+-------------+------------------+-----------+------------+
| c1          |                2 | varchar   |            |
| c2          |                3 | int       |            |
+-------------+------------------+-----------+------------+
2 rows in set (0.00 sec)
```

The setting for `sql_generate_invisible_primary_key` is not replicated, and is ignored by replication applier threads. This means that the setting of this variable on the source has no effect on the replica. You can cause the replica to add a GIPK for tables replicated without primary keys on a given replication channel using `REQUIRE_TABLE_PRIMARY_KEY_CHECK = GENERATE` as part of a `CHANGE REPLICATION SOURCE TO` statement.

GIPKs work with row-based replication of `CREATE TABLE ... SELECT`; the information written to the binary log for this statement in such cases includes the GIPK definition, and thus is replicated correctly. Statement-based replication of `CREATE TABLE ... SELECT` is not supported with `sql_generate_invisible_primary_key = ON`.

When creating or importing backups of installations where GIPKs are in use, it is possible to exclude generated invisible primary key columns and values. The `--skip-generated-invisible-primary-key` option for **mysqldump** causes GIPK information to be excluded in the program's output.
