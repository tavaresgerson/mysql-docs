### 17.15.3 InnoDB INFORMATION_SCHEMA Schema Object Tables

You can extract metadata about schema objects managed by `InnoDB` using `InnoDB` `INFORMATION_SCHEMA` tables. This information comes from the data dictionary. Traditionally, you would get this type of information using the techniques from Section 17.17, “InnoDB Monitors”, setting up `InnoDB` monitors and parsing the output from the `SHOW ENGINE INNODB STATUS` statement. The `InnoDB` `INFORMATION_SCHEMA` table interface allows you to query this data using SQL.

`InnoDB` `INFORMATION_SCHEMA` schema object tables include the tables listed below.

```
INNODB_DATAFILES
INNODB_TABLESTATS
INNODB_FOREIGN
INNODB_COLUMNS
INNODB_INDEXES
INNODB_FIELDS
INNODB_TABLESPACES
INNODB_TABLESPACES_BRIEF
INNODB_FOREIGN_COLS
INNODB_TABLES
```

The table names are indicative of the type of data provided:

* `INNODB_TABLES` provides metadata about `InnoDB` tables.

* `INNODB_COLUMNS` provides metadata about `InnoDB` table columns.

* `INNODB_INDEXES` provides metadata about `InnoDB` indexes.

* `INNODB_FIELDS` provides metadata about the key columns (fields) of `InnoDB` indexes.

* `INNODB_TABLESTATS` provides a view of low-level status information about `InnoDB` tables that is derived from in-memory data structures.

* `INNODB_DATAFILES` provides data file path information for `InnoDB` file-per-table and general tablespaces.

* `INNODB_TABLESPACES` provides metadata about `InnoDB` file-per-table, general, and undo tablespaces.

* `INNODB_TABLESPACES_BRIEF` provides a subset of metadata about `InnoDB` tablespaces.

* `INNODB_FOREIGN` provides metadata about foreign keys defined on `InnoDB` tables.

* `INNODB_FOREIGN_COLS` provides metadata about the columns of foreign keys that are defined on `InnoDB` tables.

`InnoDB` `INFORMATION_SCHEMA` schema object tables can be joined together through fields such as `TABLE_ID`, `INDEX_ID`, and `SPACE`, allowing you to easily retrieve all available data for an object you want to study or monitor.

Refer to the `InnoDB` INFORMATION_SCHEMA documentation for information about the columns of each table.

**Example 17.2 InnoDB INFORMATION_SCHEMA Schema Object Tables**

This example uses a simple table (`t1`) with a single index (`i1`) to demonstrate the type of metadata found in the `InnoDB` `INFORMATION_SCHEMA` schema object tables.

1. Create a test database and table `t1`:

   ```
   mysql> CREATE DATABASE test;

   mysql> USE test;

   mysql> CREATE TABLE t1 (
          col1 INT,
          col2 CHAR(10),
          col3 VARCHAR(10))
          ENGINE = InnoDB;

   mysql> CREATE INDEX i1 ON t1(col1);
   ```

2. After creating the table `t1`, query `INNODB_TABLES` to locate the metadata for `test/t1`:

   ```
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_TABLES WHERE NAME='test/t1' \G
   *************************** 1. row ***************************
        TABLE_ID: 71
            NAME: test/t1
            FLAG: 1
          N_COLS: 6
           SPACE: 57
      ROW_FORMAT: Compact
   ZIP_PAGE_SIZE: 0
    INSTANT_COLS: 0
   ```

   Table `t1` has a `TABLE_ID` of 71. The `FLAG` field provides bit level information about table format and storage characteristics. There are six columns, three of which are hidden columns created by `InnoDB` (`DB_ROW_ID`, `DB_TRX_ID`, and `DB_ROLL_PTR`). The ID of the table's `SPACE` is 57 (a value of 0 would indicate that the table resides in the system tablespace). The `ROW_FORMAT` is Compact. `ZIP_PAGE_SIZE` only applies to tables with a `Compressed` row format. `INSTANT_COLS` shows number of columns in the table prior to adding the first instant column using `ALTER TABLE ... ADD COLUMN` with `ALGORITHM=INSTANT`.

3. Using the `TABLE_ID` information from `INNODB_TABLES`, query the `INNODB_COLUMNS` table for information about the table's columns.

   ```
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_COLUMNS where TABLE_ID = 71\G
   *************************** 1. row ***************************
        TABLE_ID: 71
            NAME: col1
             POS: 0
           MTYPE: 6
          PRTYPE: 1027
             LEN: 4
     HAS_DEFAULT: 0
   DEFAULT_VALUE: NULL
   *************************** 2. row ***************************
        TABLE_ID: 71
            NAME: col2
             POS: 1
           MTYPE: 2
          PRTYPE: 524542
             LEN: 10
     HAS_DEFAULT: 0
   DEFAULT_VALUE: NULL
   *************************** 3. row ***************************
        TABLE_ID: 71
            NAME: col3
             POS: 2
           MTYPE: 1
          PRTYPE: 524303
             LEN: 10
     HAS_DEFAULT: 0
   DEFAULT_VALUE: NULL
   ```

   In addition to the `TABLE_ID` and column `NAME`, `INNODB_COLUMNS` provides the ordinal position (`POS`) of each column (starting from 0 and incrementing sequentially), the column `MTYPE` or “main type” (6 = INT, 2 = CHAR, 1 = VARCHAR), the `PRTYPE` or “precise type” (a binary value with bits that represent the MySQL data type, character set code, and nullability), and the column length (`LEN`). The `HAS_DEFAULT` and `DEFAULT_VALUE` columns only apply to columns added instantly using `ALTER TABLE ... ADD COLUMN` with `ALGORITHM=INSTANT`.

4. Using the `TABLE_ID` information from `INNODB_TABLES` once again, query `INNODB_INDEXES` for information about the indexes associated with table `t1`.

   ```
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_INDEXES WHERE TABLE_ID = 71 \G
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

   `INNODB_INDEXES` returns data for two indexes. The first index is `GEN_CLUST_INDEX`, which is a clustered index created by `InnoDB` if the table does not have a user-defined clustered index. The second index (`i1`) is the user-defined secondary index.

   The `INDEX_ID` is an identifier for the index that is unique across all databases in an instance. The `TABLE_ID` identifies the table that the index is associated with. The index `TYPE` value indicates the type of index (1 = Clustered Index, 0 = Secondary index). The `N_FILEDS` value is the number of fields that comprise the index. `PAGE_NO` is the root page number of the index B-tree, and `SPACE` is the ID of the tablespace where the index resides. A nonzero value indicates that the index does not reside in the system tablespace. `MERGE_THRESHOLD` defines a percentage threshold value for the amount of data in an index page. If the amount of data in an index page falls below the this value (the default is 50%) when a row is deleted or when a row is shortened by an update operation, `InnoDB` attempts to merge the index page with a neighboring index page.

5. Using the `INDEX_ID` information from `INNODB_INDEXES`, query `INNODB_FIELDS` for information about the fields of index `i1`.

   ```
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FIELDS where INDEX_ID = 112 \G
   *************************** 1. row ***************************
   INDEX_ID: 112
       NAME: col1
        POS: 0
   ```

   `INNODB_FIELDS` provides the `NAME` of the indexed field and its ordinal position within the index. If the index (i1) had been defined on multiple fields, `INNODB_FIELDS` would provide metadata for each of the indexed fields.

6. Using the `SPACE` information from `INNODB_TABLES`, query `INNODB_TABLESPACES` table for information about the table's tablespace.

   ```
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_TABLESPACES WHERE SPACE = 57 \G
   *************************** 1. row ***************************
             SPACE: 57
             NAME: test/t1
             FLAG: 16417
       ROW_FORMAT: Dynamic
        PAGE_SIZE: 16384
    ZIP_PAGE_SIZE: 0
       SPACE_TYPE: Single
    FS_BLOCK_SIZE: 4096
        FILE_SIZE: 114688
   ALLOCATED_SIZE: 98304
   AUTOEXTEND_SIZE: 0
   SERVER_VERSION: 8.0.23
    SPACE_VERSION: 1
       ENCRYPTION: N
            STATE: normal
   ```

   In addition to the `SPACE` ID of the tablespace and the `NAME` of the associated table, `INNODB_TABLESPACES` provides tablespace `FLAG` data, which is bit level information about tablespace format and storage characteristics. Also provided are tablespace `ROW_FORMAT`, `PAGE_SIZE`, and several other tablespace metadata items.

7. Using the `SPACE` information from `INNODB_TABLES` once again, query `INNODB_DATAFILES` for the location of the tablespace data file.

   ```
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_DATAFILES WHERE SPACE = 57 \G
   *************************** 1. row ***************************
   SPACE: 57
    PATH: ./test/t1.ibd
   ```

   The datafile is located in the `test` directory under MySQL's `data` directory. If a file-per-table tablespace were created in a location outside the MySQL data directory using the `DATA DIRECTORY` clause of the `CREATE TABLE` statement, the tablespace `PATH` would be a fully qualified directory path.

8. As a final step, insert a row into table `t1` (`TABLE_ID = 71`) and view the data in the `INNODB_TABLESTATS` table. The data in this table is used by the MySQL optimizer to calculate which index to use when querying an `InnoDB` table. This information is derived from in-memory data structures.

   ```
   mysql> INSERT INTO t1 VALUES(5, 'abc', 'def');
   Query OK, 1 row affected (0.06 sec)

   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_TABLESTATS where TABLE_ID = 71 \G
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

**Example 17.3 Foreign Key INFORMATION_SCHEMA Schema Object Tables**

The `INNODB_FOREIGN` and `INNODB_FOREIGN_COLS` tables provide data about foreign key relationships. This example uses a parent table and child table with a foreign key relationship to demonstrate the data found in the `INNODB_FOREIGN` and `INNODB_FOREIGN_COLS` tables.

1. Create the test database with parent and child tables:

   ```
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

2. After the parent and child tables are created, query `INNODB_FOREIGN` and locate the foreign key data for the `test/child` and `test/parent` foreign key relationship:

   ```
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FOREIGN \G
   *************************** 1. row ***************************
         ID: test/fk1
   FOR_NAME: test/child
   REF_NAME: test/parent
     N_COLS: 1
       TYPE: 1
   ```

   Metadata includes the foreign key `ID` (`fk1`), which is named for the `CONSTRAINT` that was defined on the child table. The `FOR_NAME` is the name of the child table where the foreign key is defined. `REF_NAME` is the name of the parent table (the “referenced” table). `N_COLS` is the number of columns in the foreign key index. `TYPE` is a numerical value representing bit flags that provide additional information about the foreign key column. In this case, the `TYPE` value is 1, which indicates that the `ON DELETE CASCADE` option was specified for the foreign key. See the `INNODB_FOREIGN` table definition for more information about `TYPE` values.

3. Using the foreign key `ID`, query `INNODB_FOREIGN_COLS` to view data about the columns of the foreign key.

   ```
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FOREIGN_COLS WHERE ID = 'test/fk1' \G
   *************************** 1. row ***************************
             ID: test/fk1
   FOR_COL_NAME: parent_id
   REF_COL_NAME: id
            POS: 0
   ```

   `FOR_COL_NAME` is the name of the foreign key column in the child table, and `REF_COL_NAME` is the name of the referenced column in the parent table. The `POS` value is the ordinal position of the key field within the foreign key index, starting at zero.

**Example 17.4 Joining InnoDB INFORMATION_SCHEMA Schema Object Tables**

This example demonstrates joining three `InnoDB` `INFORMATION_SCHEMA` schema object tables (`INNODB_TABLES`, `INNODB_TABLESPACES`, and `INNODB_TABLESTATS`) to gather file format, row format, page size, and index size information about tables in the employees sample database.

The following table aliases are used to shorten the query string:

* `INFORMATION_SCHEMA.INNODB_TABLES`: a

* `INFORMATION_SCHEMA.INNODB_TABLESPACES`: b

* `INFORMATION_SCHEMA.INNODB_TABLESTATS`: c

An `IF()` control flow function is used to account for compressed tables. If a table is compressed, the index size is calculated using `ZIP_PAGE_SIZE` rather than `PAGE_SIZE`. `CLUST_INDEX_SIZE` and `OTHER_INDEX_SIZE`, which are reported in bytes, are divided by `1024*1024` to provide index sizes in megabytes (MBs). MB values are rounded to zero decimal spaces using the `ROUND()` function.

```
mysql> SELECT a.NAME, a.ROW_FORMAT,
        @page_size :=
         IF(a.ROW_FORMAT='Compressed',
          b.ZIP_PAGE_SIZE, b.PAGE_SIZE)
          AS page_size,
         ROUND((@page_size * c.CLUST_INDEX_SIZE)
          /(1024*1024)) AS pk_mb,
         ROUND((@page_size * c.OTHER_INDEX_SIZE)
          /(1024*1024)) AS secidx_mb
       FROM INFORMATION_SCHEMA.INNODB_TABLES a
       INNER JOIN INFORMATION_SCHEMA.INNODB_TABLESPACES b on a.NAME = b.NAME
       INNER JOIN INFORMATION_SCHEMA.INNODB_TABLESTATS c on b.NAME = c.NAME
       WHERE a.NAME LIKE 'employees/%'
       ORDER BY a.NAME DESC;
+------------------------+------------+-----------+-------+-----------+
| NAME                   | ROW_FORMAT | page_size | pk_mb | secidx_mb |
+------------------------+------------+-----------+-------+-----------+
| employees/titles       | Dynamic    |     16384 |    20 |        11 |
| employees/salaries     | Dynamic    |     16384 |    93 |        34 |
| employees/employees    | Dynamic    |     16384 |    15 |         0 |
| employees/dept_manager | Dynamic    |     16384 |     0 |         0 |
| employees/dept_emp     | Dynamic    |     16384 |    12 |        10 |
| employees/departments  | Dynamic    |     16384 |     0 |         0 |
+------------------------+------------+-----------+-------+-----------+
```
