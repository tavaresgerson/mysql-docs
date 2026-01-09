### 14.16.3 InnoDB INFORMATION_SCHEMA System Tables

You can extract metadata about schema objects managed by `InnoDB` using `InnoDB` `INFORMATION_SCHEMA` system tables. This information comes from the `InnoDB` internal system tables (also referred to as the `InnoDB` data dictionary), which cannot be queried directly like regular `InnoDB` tables. Traditionally, you would get this type of information using the techniques from Section 14.18, “InnoDB Monitors”, setting up `InnoDB` monitors and parsing the output from the `SHOW ENGINE INNODB STATUS` statement. The `InnoDB` `INFORMATION_SCHEMA` table interface allows you to query this data using SQL.

With the exception of `INNODB_SYS_TABLESTATS`, for which there is no corresponding internal system table, `InnoDB` `INFORMATION_SCHEMA` system tables are populated with data read directly from internal `InnoDB` system tables rather than from metadata that is cached in memory.

`InnoDB` `INFORMATION_SCHEMA` system tables include the tables listed below.

```sql
mysql> SHOW TABLES FROM INFORMATION_SCHEMA LIKE 'INNODB_SYS%';
+--------------------------------------------+
| Tables_in_information_schema (INNODB_SYS%) |
+--------------------------------------------+
| INNODB_SYS_DATAFILES                       |
| INNODB_SYS_TABLESTATS                      |
| INNODB_SYS_FOREIGN                         |
| INNODB_SYS_COLUMNS                         |
| INNODB_SYS_INDEXES                         |
| INNODB_SYS_FIELDS                          |
| INNODB_SYS_TABLESPACES                     |
| INNODB_SYS_FOREIGN_COLS                    |
| INNODB_SYS_TABLES                          |
+--------------------------------------------+
```

The table names are indicative of the type of data provided:

* `INNODB_SYS_TABLES` provides metadata about `InnoDB` tables, equivalent to the information in the `SYS_TABLES` table in the `InnoDB` data dictionary.

* `INNODB_SYS_COLUMNS` provides metadata about `InnoDB` table columns, equivalent to the information in the `SYS_COLUMNS` table in the `InnoDB` data dictionary.

* `INNODB_SYS_INDEXES` provides metadata about `InnoDB` indexes, equivalent to the information in the `SYS_INDEXES` table in the `InnoDB` data dictionary.

* `INNODB_SYS_FIELDS` provides metadata about the key columns (fields) of `InnoDB` indexes, equivalent to the information in the `SYS_FIELDS` table in the `InnoDB` data dictionary.

* `INNODB_SYS_TABLESTATS` provides a view of low-level status information about `InnoDB` tables that is derived from in-memory data structures. There is no corresponding internal `InnoDB` system table.

* `INNODB_SYS_DATAFILES` provides data file path information for `InnoDB` file-per-table and general tablespaces, equivalent to information in the `SYS_DATAFILES` table in the `InnoDB` data dictionary.

* `INNODB_SYS_TABLESPACES` provides metadata about `InnoDB` file-per-table and general tablespaces, equivalent to the information in the `SYS_TABLESPACES` table in the `InnoDB` data dictionary.

* `INNODB_SYS_FOREIGN` provides metadata about foreign keys defined on `InnoDB` tables, equivalent to the information in the `SYS_FOREIGN` table in the `InnoDB` data dictionary.

* `INNODB_SYS_FOREIGN_COLS` provides metadata about the columns of foreign keys that are defined on `InnoDB` tables, equivalent to the information in the `SYS_FOREIGN_COLS` table in the `InnoDB` data dictionary.

`InnoDB` `INFORMATION_SCHEMA` system tables can be joined together through fields such as `TABLE_ID`, `INDEX_ID`, and `SPACE`, allowing you to easily retrieve all available data for an object you want to study or monitor.

Refer to the `InnoDB` INFORMATION_SCHEMA documentation for information about the columns of each table.

**Example 14.2 InnoDB INFORMATION_SCHEMA System Tables**

This example uses a simple table (`t1`) with a single index (`i1`) to demonstrate the type of metadata found in the `InnoDB` `INFORMATION_SCHEMA` system tables.

1. Create a test database and table `t1`:

   ```sql
   mysql> CREATE DATABASE test;

   mysql> USE test;

   mysql> CREATE TABLE t1 (
          col1 INT,
          col2 CHAR(10),
          col3 VARCHAR(10))
          ENGINE = InnoDB;

   mysql> CREATE INDEX i1 ON t1(col1);
   ```

2. After creating the table `t1`, query `INNODB_SYS_TABLES` to locate the metadata for `test/t1`:

   ```sql
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_TABLES WHERE NAME='test/t1' \G
   *************************** 1. row ***************************
        TABLE_ID: 71
            NAME: test/t1
            FLAG: 1
          N_COLS: 6
           SPACE: 57
     FILE_FORMAT: Antelope
      ROW_FORMAT: Compact
   ZIP_PAGE_SIZE: 0
   ...
   ```

   Table `t1` has a `TABLE_ID` of 71. The `FLAG` field provides bit level information about table format and storage characteristics. There are six columns, three of which are hidden columns created by `InnoDB` (`DB_ROW_ID`, `DB_TRX_ID`, and `DB_ROLL_PTR`). The ID of the table's `SPACE` is 57 (a value of 0 would indicate that the table resides in the system tablespace). The `FILE_FORMAT` is Antelope, and the `ROW_FORMAT` is Compact. `ZIP_PAGE_SIZE` only applies to tables with a `Compressed` row format.

3. Using the `TABLE_ID` information from `INNODB_SYS_TABLES`, query the `INNODB_SYS_COLUMNS` table for information about the table's columns.

   ```sql
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_COLUMNS where TABLE_ID = 71 \G
   *************************** 1. row ***************************
   TABLE_ID: 71
       NAME: col1
        POS: 0
      MTYPE: 6
     PRTYPE: 1027
        LEN: 4
   *************************** 2. row ***************************
   TABLE_ID: 71
       NAME: col2
        POS: 1
      MTYPE: 2
     PRTYPE: 524542
        LEN: 10
   *************************** 3. row ***************************
   TABLE_ID: 71
       NAME: col3
        POS: 2
      MTYPE: 1
     PRTYPE: 524303
        LEN: 10
   ```

   In addition to the `TABLE_ID` and column `NAME`, `INNODB_SYS_COLUMNS` provides the ordinal position (`POS`) of each column (starting from 0 and incrementing sequentially), the column `MTYPE` or “main type” (6 = INT, 2 = CHAR, 1 = VARCHAR), the `PRTYPE` or “precise type” (a binary value with bits that represent the MySQL data type, character set code, and nullability), and the column length (`LEN`).

4. Using the `TABLE_ID` information from `INNODB_SYS_TABLES` once again, query `INNODB_SYS_INDEXES` for information about the indexes associated with table `t1`.

   ```sql
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_INDEXES WHERE TABLE_ID = 71 \G
   *************************** 1. row ***************************
          INDEX_ID: 111
              NAME: GEN_CLUST_INDEX
          TABLE_ID: 71
              TYPE: 1
          N_FIELDS: 0
           PAGE_NO: 3
             SPACE: 57
   MERGE_THRESHOLD: 50
   *************************** 2. row ***************************
          INDEX_ID: 112
              NAME: i1
          TABLE_ID: 71
              TYPE: 0
          N_FIELDS: 1
           PAGE_NO: 4
             SPACE: 57
   MERGE_THRESHOLD: 50
   ```

   `INNODB_SYS_INDEXES` returns data for two indexes. The first index is `GEN_CLUST_INDEX`, which is a clustered index created by `InnoDB` if the table does not have a user-defined clustered index. The second index (`i1`) is the user-defined secondary index.

   The `INDEX_ID` is an identifier for the index that is unique across all databases in an instance. The `TABLE_ID` identifies the table that the index is associated with. The index `TYPE` value indicates the type of index (1 = Clustered Index, 0 = Secondary index). The `N_FILEDS` value is the number of fields that comprise the index. `PAGE_NO` is the root page number of the index B-tree, and `SPACE` is the ID of the tablespace where the index resides. A nonzero value indicates that the index does not reside in the system tablespace. `MERGE_THRESHOLD` defines a percentage threshold value for the amount of data in an index page. If the amount of data in an index page falls below the this value (the default is 50%) when a row is deleted or when a row is shortened by an update operation, `InnoDB` attempts to merge the index page with a neighboring index page.

5. Using the `INDEX_ID` information from `INNODB_SYS_INDEXES`, query `INNODB_SYS_FIELDS` for information about the fields of index `i1`.

   ```sql
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_FIELDS where INDEX_ID = 112 \G
   *************************** 1. row ***************************
   INDEX_ID: 112
       NAME: col1
        POS: 0
   ```

   `INNODB_SYS_FIELDS` provides the `NAME` of the indexed field and its ordinal position within the index. If the index (i1) had been defined on multiple fields, `INNODB_SYS_FIELDS` would provide metadata for each of the indexed fields.

6. Using the `SPACE` information from `INNODB_SYS_TABLES`, query `INNODB_SYS_TABLESPACES` table for information about the table's tablespace.

   ```sql
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_TABLESPACES WHERE SPACE = 57 \G
   *************************** 1. row ***************************
           SPACE: 57
            NAME: test/t1
            FLAG: 0
     FILE_FORMAT: Antelope
      ROW_FORMAT: Compact or Redundant
       PAGE_SIZE: 16384
   ZIP_PAGE_SIZE: 0
   ```

   In addition to the `SPACE` ID of the tablespace and the `NAME` of the associated table, `INNODB_SYS_TABLESPACES` provides tablespace `FLAG` data, which is bit level information about tablespace format and storage characteristics. Also provided are tablespace `FILE_FORMAT`, `ROW_FORMAT`, `PAGE_SIZE`, and several other tablespace metadata items.

7. Using the `SPACE` information from `INNODB_SYS_TABLES` once again, query `INNODB_SYS_DATAFILES` for the location of the tablespace data file.

   ```sql
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_DATAFILES WHERE SPACE = 57 \G
   *************************** 1. row ***************************
   SPACE: 57
    PATH: ./test/t1.ibd
   ```

   The datafile is located in the `test` directory under MySQL's `data` directory. If a file-per-table tablespace were created in a location outside the MySQL data directory using the `DATA DIRECTORY` clause of the `CREATE TABLE` statement, the tablespace `PATH` would be a fully qualified directory path.

8. As a final step, insert a row into table `t1` (`TABLE_ID = 71`) and view the data in the `INNODB_SYS_TABLESTATS` table. The data in this table is used by the MySQL optimizer to calculate which index to use when querying an `InnoDB` table. This information is derived from in-memory data structures. There is no corresponding internal `InnoDB` system table.

   ```sql
   mysql> INSERT INTO t1 VALUES(5, 'abc', 'def');
   Query OK, 1 row affected (0.06 sec)

   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_TABLESTATS where TABLE_ID = 71 \G
   *************************** 1. row ***************************
            TABLE_ID: 71
                NAME: test/t1
   STATS_INITIALIZED: Initialized
            NUM_ROWS: 1
    CLUST_INDEX_SIZE: 1
    OTHER_INDEX_SIZE: 0
    MODIFIED_COUNTER: 1
             AUTOINC: 0
           REF_COUNT: 1
   ```

   The `STATS_INITIALIZED` field indicates whether or not statistics have been collected for the table. `NUM_ROWS` is the current estimated number of rows in the table. The `CLUST_INDEX_SIZE` and `OTHER_INDEX_SIZE` fields report the number of pages on disk that store clustered and secondary indexes for the table, respectively. The `MODIFIED_COUNTER` value shows the number of rows modified by DML operations and cascade operations from foreign keys. The `AUTOINC` value is the next number to be issued for any autoincrement-based operation. There are no autoincrement columns defined on table `t1`, so the value is 0. The `REF_COUNT` value is a counter. When the counter reaches 0, it signifies that the table metadata can be evicted from the table cache.

**Example 14.3 Foreign Key INFORMATION_SCHEMA System Tables**

The `INNODB_SYS_FOREIGN` and `INNODB_SYS_FOREIGN_COLS` tables provide data about foreign key relationships. This example uses a parent table and child table with a foreign key relationship to demonstrate the data found in the `INNODB_SYS_FOREIGN` and `INNODB_SYS_FOREIGN_COLS` tables.

1. Create the test database with parent and child tables:

   ```sql
   mysql> CREATE DATABASE test;

   mysql> USE test;

   mysql> CREATE TABLE parent (id INT NOT NULL,
          PRIMARY KEY (id)) ENGINE=INNODB;

   mysql> CREATE TABLE child (id INT, parent_id INT,
          INDEX par_ind (parent_id),
          CONSTRAINT fk1
          FOREIGN KEY (parent_id) REFERENCES parent(id)
          ON DELETE CASCADE) ENGINE=INNODB;
   ```

2. After the parent and child tables are created, query `INNODB_SYS_FOREIGN` and locate the foreign key data for the `test/child` and `test/parent` foreign key relationship:

   ```sql
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_FOREIGN \G
   *************************** 1. row ***************************
         ID: test/fk1
   FOR_NAME: test/child
   REF_NAME: test/parent
     N_COLS: 1
       TYPE: 1
   ```

   Metadata includes the foreign key `ID` (`fk1`), which is named for the `CONSTRAINT` that was defined on the child table. The `FOR_NAME` is the name of the child table where the foreign key is defined. `REF_NAME` is the name of the parent table (the “referenced” table). `N_COLS` is the number of columns in the foreign key index. `TYPE` is a numerical value representing bit flags that provide additional information about the foreign key column. In this case, the `TYPE` value is 1, which indicates that the `ON DELETE CASCADE` option was specified for the foreign key. See the `INNODB_SYS_FOREIGN` table definition for more information about `TYPE` values.

3. Using the foreign key `ID`, query `INNODB_SYS_FOREIGN_COLS` to view data about the columns of the foreign key.

   ```sql
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_FOREIGN_COLS WHERE ID = 'test/fk1' \G
   *************************** 1. row ***************************
             ID: test/fk1
   FOR_COL_NAME: parent_id
   REF_COL_NAME: id
            POS: 0
   ```

   `FOR_COL_NAME` is the name of the foreign key column in the child table, and `REF_COL_NAME` is the name of the referenced column in the parent table. The `POS` value is the ordinal position of the key field within the foreign key index, starting at zero.

**Example 14.4 Joining InnoDB INFORMATION_SCHEMA System Tables**

This example demonstrates joining three `InnoDB` `INFORMATION_SCHEMA` system tables (`INNODB_SYS_TABLES`, `INNODB_SYS_TABLESPACES`, and `INNODB_SYS_TABLESTATS`) to gather file format, row format, page size, and index size information about tables in the employees sample database.

The following table name aliases are used to shorten the query string:

* `INFORMATION_SCHEMA.INNODB_SYS_TABLES`: a

* `INFORMATION_SCHEMA.INNODB_SYS_TABLESPACES`: b

* `INFORMATION_SCHEMA.INNODB_SYS_TABLESTATS`: c

An `IF()` control flow function is used to account for compressed tables. If a table is compressed, the index size is calculated using `ZIP_PAGE_SIZE` rather than `PAGE_SIZE`. `CLUST_INDEX_SIZE` and `OTHER_INDEX_SIZE`, which are reported in bytes, are divided by `1024*1024` to provide index sizes in megabytes (MBs). MB values are rounded to zero decimal spaces using the `ROUND()` function.

```sql
mysql> SELECT a.NAME, a.FILE_FORMAT, a.ROW_FORMAT,
        @page_size :=
         IF(a.ROW_FORMAT='Compressed',
          b.ZIP_PAGE_SIZE, b.PAGE_SIZE)
          AS page_size,
         ROUND((@page_size * c.CLUST_INDEX_SIZE)
          /(1024*1024)) AS pk_mb,
         ROUND((@page_size * c.OTHER_INDEX_SIZE)
          /(1024*1024)) AS secidx_mb
       FROM INFORMATION_SCHEMA.INNODB_SYS_TABLES a
       INNER JOIN INFORMATION_SCHEMA.INNODB_SYS_TABLESPACES b on a.NAME = b.NAME
       INNER JOIN INFORMATION_SCHEMA.INNODB_SYS_TABLESTATS c on b.NAME = c.NAME
       WHERE a.NAME LIKE 'employees/%'
       ORDER BY a.NAME DESC;
+------------------------+-------------+------------+-----------+-------+-----------+
| NAME                   | FILE_FORMAT | ROW_FORMAT | page_size | pk_mb | secidx_mb |
+------------------------+-------------+------------+-----------+-------+-----------+
| employees/titles       | Antelope    | Compact    |     16384 |    20 |        11 |
| employees/salaries     | Antelope    | Compact    |     16384 |    91 |        33 |
| employees/employees    | Antelope    | Compact    |     16384 |    15 |         0 |
| employees/dept_manager | Antelope    | Compact    |     16384 |     0 |         0 |
| employees/dept_emp     | Antelope    | Compact    |     16384 |    12 |        10 |
| employees/departments  | Antelope    | Compact    |     16384 |     0 |         0 |
+------------------------+-------------+------------+-----------+-------+-----------+
```
