#### 14.6.1.1 Creating InnoDB Tables

`InnoDB` tables are created using the `CREATE TABLE` statement; for example:

```sql
CREATE TABLE t1 (a INT, b CHAR (20), PRIMARY KEY (a)) ENGINE=InnoDB;
```

The `ENGINE=InnoDB` clause is not required when `InnoDB` is defined as the default storage engine, which it is by default. However, the `ENGINE` clause is useful if the `CREATE TABLE` statement is to be replayed on a different MySQL Server instance where the default storage engine is not `InnoDB` or is unknown. You can determine the default storage engine on a MySQL Server instance by issuing the following statement:

```sql
mysql> SELECT @@default_storage_engine;
+--------------------------+
| @@default_storage_engine |
+--------------------------+
| InnoDB                   |
+--------------------------+
```

`InnoDB` tables are created in file-per-table tablespaces by default. To create an `InnoDB` table in the `InnoDB` system tablespace, disable the `innodb_file_per_table` variable before creating the table. To create an `InnoDB` table in a general tablespace, use `CREATE TABLE ... TABLESPACE` syntax. For more information, see Section 14.6.3, “Tablespaces”.

##### .frm Files

MySQL stores data dictionary information for tables in .frm files in database directories. Unlike other MySQL storage engines, `InnoDB` also encodes information about the table in its own internal data dictionary inside the system tablespace. When MySQL drops a table or a database, it deletes one or more `.frm` files as well as the corresponding entries inside the `InnoDB` data dictionary. You cannot move `InnoDB` tables between databases simply by moving the `.frm` files. For information about moving `InnoDB` tables, see Section 14.6.1.4, “Moving or Copying InnoDB Tables”.

##### Row Formats

The row format of an `InnoDB` table determines how its rows are physically stored on disk. `InnoDB` supports four row formats, each with different storage characteristics. Supported row formats include `REDUNDANT`, `COMPACT`, `DYNAMIC`, and `COMPRESSED`. The `DYNAMIC` row format is the default. For information about row format characteristics, see Section 14.11, “InnoDB Row Formats”.

The `innodb_default_row_format` variable defines the default row format. The row format of a table can also be defined explicitly using the `ROW_FORMAT` table option in a `CREATE TABLE` or `ALTER TABLE` statement. See Defining the Row Format of a Table.

##### Primary Keys

It is recommended that you define a primary key for each table that you create. When selecting primary key columns, choose columns with the following characteristics:

* Columns that are referenced by the most important queries.
* Columns that are never left blank.
* Columns that never have duplicate values.
* Columns that rarely if ever change value once inserted.

For example, in a table containing information about people, you would not create a primary key on `(firstname, lastname)` because more than one person can have the same name, a name column may be left blank, and sometimes people change their names. With so many constraints, often there is not an obvious set of columns to use as a primary key, so you create a new column with a numeric ID to serve as all or part of the primary key. You can declare an auto-increment column so that ascending values are filled in automatically as rows are inserted:

```sql
# The value of ID can act like a pointer between related items in different tables.
CREATE TABLE t5 (id INT AUTO_INCREMENT, b CHAR (20), PRIMARY KEY (id));

# The primary key can consist of more than one column. Any autoinc column must come first.
CREATE TABLE t6 (id INT AUTO_INCREMENT, a INT, b CHAR (20), PRIMARY KEY (id,a));
```

For more information about auto-increment columns, see Section 14.6.1.6, “AUTO_INCREMENT Handling in InnoDB”.

Although a table works correctly without defining a primary key, the primary key is involved with many aspects of performance and is a crucial design aspect for any large or frequently used table. It is recommended that you always specify a primary key in the `CREATE TABLE` statement. If you create the table, load data, and then run `ALTER TABLE` to add a primary key later, that operation is much slower than defining the primary key when creating the table. For more information about primary keys, see Section 14.6.2.1, “Clustered and Secondary Indexes”.

##### Viewing InnoDB Table Properties

To view the properties of an `InnoDB` table, issue a `SHOW TABLE STATUS` statement:

```sql
mysql> SHOW TABLE STATUS FROM test LIKE 't%' \G;
*************************** 1. row ***************************
           Name: t1
         Engine: InnoDB
        Version: 10
     Row_format: Dynamic
           Rows: 0
 Avg_row_length: 0
    Data_length: 16384
Max_data_length: 0
   Index_length: 0
      Data_free: 0
 Auto_increment: NULL
    Create_time: 2021-02-18 12:18:28
    Update_time: NULL
     Check_time: NULL
      Collation: utf8mb4_0900_ai_ci
       Checksum: NULL
 Create_options:
        Comment:
```

For information about `SHOW TABLE STATUS` output, see Section 13.7.5.36, “SHOW TABLE STATUS Statement”.

You can also access `InnoDB` table properties by querying the `InnoDB` Information Schema system tables:

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_TABLES WHERE NAME='test/t1' \G
*************************** 1. row ***************************
     TABLE_ID: 45
         NAME: test/t1
         FLAG: 1
       N_COLS: 5
        SPACE: 35
  FILE_FORMAT: Barracuda
   ROW_FORMAT: Dynamic
ZIP_PAGE_SIZE: 0
   SPACE_TYPE: Single
```

For more information, see Section 14.16.3, “InnoDB INFORMATION_SCHEMA System Tables”.
