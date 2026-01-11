#### 15.1.24.12 Setting NDB Comment Options

* NDB\_COLUMN Options
* NDB\_TABLE Options

It is possible to set a number of options specific to NDB Cluster in the table comment or column comments of an `NDB` table. Table-level options for controlling read from any replica and partition balance can be embedded in a table comment using `NDB_TABLE`.

`NDB_COLUMN` can be used in a column comment to set the size of the blob parts table column used for storing parts of blob values by `NDB` to its maximum. This works for `BLOB`, `MEDIUMBLOB`, `LONGBLOB`, `TEXT`, `MEDIUMTEXT`, `LONGTEXT`, and `JSON` columns. A column comment can also be used to control the inline size of a blob column. `NDB_COLUMN` comments do not support `TINYBLOB` or `TINYTEXT` columns, since these have an inline part (only) of fixed size, and no separate parts to store elsewhere.

`NDB_TABLE` can be used in a table comment to set options relating to partition balance and whether the table is fully replicated, among others.

The remainder of this section describes these options and their use.

##### NDB\_COLUMN Options

In NDB Cluster, a column comment in a `CREATE TABLE` or `ALTER TABLE` statement can also be used to specify an `NDB_COLUMN` option. `NDB` supports two column comment options `BLOB_INLINE_SIZE` and `MAX_BLOB_PART_SIZE`. Syntax for these options is shown here:

```
COMMENT 'NDB_COLUMN=speclist'

speclist := spec[,spec]

spec :=
    BLOB_INLINE_SIZE=value
  | MAX_BLOB_PART_SIZE[={0|1}]
```

`BLOB_INLINE_SIZE` specifies the number of bytes to be stored inline by the column; its expected value is an integer in the range 1 - 29980, inclusive. Setting a value greater than 29980 raises an error; setting a value less than 1 is allowed, but causes the default inline size for the column type to be used.

You should be aware that the maximum value for this option is actually the maximum number of bytes that can be stored in one row of an `NDB` table; every column in the row contributes to this total.

You should also keep in mind, especially when working with `TEXT` columns, that the value set by `MAX_BLOB_PART_SIZE` or `BLOB_INLINE_SIZE` represents column size in bytes. It does not indicate the number of characters, which varies according to the character set and collation used by the column.

To see the effects of this option, first create a table with two `BLOB` columns, one (`b1`) with no extra options, and another (`b2`) with a setting for `BLOB_INLINE_SIZE`, as shown here:

```
mysql> CREATE TABLE t1 (
    ->    a INT NOT NULL PRIMARY KEY,
    ->    b1 BLOB,
    ->    b2 BLOB COMMENT 'NDB_COLUMN=BLOB_INLINE_SIZE=8000'
    ->  ) ENGINE NDB;
Query OK, 0 rows affected (0.32 sec)
```

You can see the `BLOB_INLINE_SIZE` settings for the `BLOB` columns by querying the `ndbinfo.blobs` table, like this:

```
mysql> SELECT
    ->   column_name AS 'Column Name',
    ->   inline_size AS 'Inline Size',
    ->   part_size AS 'Blob Part Size'
    -> FROM ndbinfo.blobs
    -> WHERE table_name = 't1';
+-------------+-------------+----------------+
| Column Name | Inline Size | Blob Part Size |
+-------------+-------------+----------------+
| b1          |         256 |           2000 |
| b2          |        8000 |           2000 |
+-------------+-------------+----------------+
2 rows in set (0.01 sec)
```

You can also check the output from the **ndb\_desc** utility, as shown here, with the relevant lines displayed using emphasized text:

```
$> ndb_desc -d test t1
-- t --
Version: 1
Fragment type: HashMapPartition
K Value: 6
Min load factor: 78
Max load factor: 80
Temporary table: no
Number of attributes: 3
Number of primary keys: 1
Length of frm data: 945
Max Rows: 0
Row Checksum: 1
Row GCI: 1
SingleUserMode: 0
ForceVarPart: 1
PartitionCount: 2
FragmentCount: 2
PartitionBalance: FOR_RP_BY_LDM
ExtraRowGciBits: 0
ExtraRowAuthorBits: 0
TableStatus: Retrieved
Table options: readbackup
HashMap: DEFAULT-HASHMAP-3840-2
-- Attributes --
a Int PRIMARY KEY DISTRIBUTION KEY AT=FIXED ST=MEMORY
b1 Blob(256,2000,0) NULL AT=MEDIUM_VAR ST=MEMORY BV=2 BT=NDB$BLOB_64_1
b2 Blob(8000,2000,0) NULL AT=MEDIUM_VAR ST=MEMORY BV=2 BT=NDB$BLOB_64_2
-- Indexes --
PRIMARY KEY(a) - UniqueHashIndex
PRIMARY(a) - OrderedIndex
```

`BLOB_INLINE_SIZE` is not permitted with `TINYBLOB` columns, and causes a warning if used.

For `MAX_BLOB_PART_SIZE`, the `=` sign and the value following it are optional. Using any value other than 0 or 1 results in a syntax error.

The effect of using `MAX_BLOB_PART_SIZE` in a column comment is to set the blob part size of a `TEXT` or `BLOB` column to the maximum number of bytes supported for this by `NDB` (13948). This option can be applied to any blob column type supported by MySQL except `TINYBLOB` or `TINYTEXT` (`BLOB`, `MEDIUMBLOB`, `LONGBLOB`, `TEXT`, `MEDIUMTEXT`, `LONGTEXT`). Unlike `BLOB_INLINE_SIZE`, `MAX_BLOB_PART_SIZE` has no effect on `JSON` columns.

To see the effects of this option, we first run the following SQL statement in the **mysql** client to create a table with two `BLOB` columns, one (`c1`) with no extra options, and another (`c2`) with `MAX_BLOB_PART_SIZE`:

```
mysql> CREATE TABLE test.t2 (
    ->   p INT PRIMARY KEY,
    ->   c1 BLOB,
    ->   c2 BLOB COMMENT 'NDB_COLUMN=MAX_BLOB_PART_SIZE'
    -> ) ENGINE NDB;
Query OK, 0 rows affected (0.32 sec)
```

From the system shell, run the **ndb\_desc** utility to obtain information about the table just created, as shown in this example:

```
$> ndb_desc -d test t2
-- t --
Version: 1
Fragment type: HashMapPartition
K Value: 6
Min load factor: 78
Max load factor: 80
Temporary table: no
Number of attributes: 3
Number of primary keys: 1
Length of frm data: 324
Row Checksum: 1
Row GCI: 1
SingleUserMode: 0
ForceVarPart: 1
FragmentCount: 2
ExtraRowGciBits: 0
ExtraRowAuthorBits: 0
TableStatus: Retrieved
HashMap: DEFAULT-HASHMAP-3840-2
-- Attributes --
p Int PRIMARY KEY DISTRIBUTION KEY AT=FIXED ST=MEMORY
c1 Blob(256,2000,0) NULL AT=MEDIUM_VAR ST=MEMORY BV=2 BT=NDB$BLOB_22_1
c2 Blob(256,13948,0) NULL AT=MEDIUM_VAR ST=MEMORY BV=2 BT=NDB$BLOB_22_2
-- Indexes --
PRIMARY KEY(p) - UniqueHashIndex
PRIMARY(p) - OrderedIndex
```

Column information in the output is listed under `Attributes`; for columns `c1` and `c2` it is displayed here in emphasized text. For `c1`, the blob part size is 2000, the default value; for `c2`, it is 13948, as set by `MAX_BLOB_PART_SIZE`.

You can also query the `ndbinfo.blobs` table to see this, as shown here:

```
mysql> SELECT
    ->   column_name AS 'Column Name',
    ->   inline_size AS 'Inline Size',
    ->   part_size AS 'Blob Part Size'
    -> FROM ndbinfo.blobs
    -> WHERE table_name = 't2';
+-------------+-------------+----------------+
| Column Name | Inline Size | Blob Part Size |
+-------------+-------------+----------------+
| c1          |         256 |           2000 |
| c2          |         256 |          13948 |
+-------------+-------------+----------------+
2 rows in set (0.00 sec)
```

You can change the blob part size for a given blob column of an `NDB` table using an `ALTER TABLE` statement such as this one, and verifying the changes afterwards using `SHOW CREATE TABLE`:

```
mysql> ALTER TABLE test.t2
    ->    DROP COLUMN c1,
    ->     ADD COLUMN c1 BLOB COMMENT 'NDB_COLUMN=MAX_BLOB_PART_SIZE',
    ->     CHANGE COLUMN c2 c2 BLOB AFTER c1;
Query OK, 0 rows affected (0.47 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> SHOW CREATE TABLE test.t2\G
*************************** 1. row ***************************
       Table: t
Create Table: CREATE TABLE `t2` (
  `p` int(11) NOT NULL,
  `c1` blob COMMENT 'NDB_COLUMN=MAX_BLOB_PART_SIZE',
  `c2` blob,
  PRIMARY KEY (`p`)
) ENGINE=ndbcluster DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
1 row in set (0.00 sec)

mysql> EXIT
Bye
```

The output of **ndb\_desc** shows that the blob part sizes of the columns have been changed as expected:

```
$> ndb_desc -d test t2
-- t --
Version: 16777220
Fragment type: HashMapPartition
K Value: 6
Min load factor: 78
Max load factor: 80
Temporary table: no
Number of attributes: 3
Number of primary keys: 1
Length of frm data: 324
Row Checksum: 1
Row GCI: 1
SingleUserMode: 0
ForceVarPart: 1
FragmentCount: 2
ExtraRowGciBits: 0
ExtraRowAuthorBits: 0
TableStatus: Retrieved
HashMap: DEFAULT-HASHMAP-3840-2
-- Attributes --
p Int PRIMARY KEY DISTRIBUTION KEY AT=FIXED ST=MEMORY
c1 Blob(256,13948,0) NULL AT=MEDIUM_VAR ST=MEMORY BV=2 BT=NDB$BLOB_26_1
c2 Blob(256,2000,0) NULL AT=MEDIUM_VAR ST=MEMORY BV=2 BT=NDB$BLOB_26_2
-- Indexes --
PRIMARY KEY(p) - UniqueHashIndex
PRIMARY(p) - OrderedIndex
```

You can also see the change by running the query against `ndbinfo.blobs` again:

```
mysql> SELECT
    ->   column_name AS 'Column Name',
    ->   inline_size AS 'Inline Size',
    ->   part_size AS 'Blob Part Size'
    -> FROM ndbinfo.blobs
    -> WHERE table_name = 't2';
+-------------+-------------+----------------+
| Column Name | Inline Size | Blob Part Size |
+-------------+-------------+----------------+
| c1          |         256 |          13948 |
| c2          |         256 |           2000 |
+-------------+-------------+----------------+
2 rows in set (0.00 sec)
```

It is possible to set both `BLOB_INLINE_SIZE` and `MAX_BLOB_PART_SIZE` for a blob column, as shown in this `CREATE TABLE` statement:

```
mysql> CREATE TABLE test.t3 (
    ->   p INT NOT NULL PRIMARY KEY,
    ->   c1 JSON,
    ->   c2 JSON COMMENT 'NDB_COLUMN=BLOB_INLINE_SIZE=5000,MAX_BLOB_PART_SIZE'
    -> ) ENGINE NDB;
Query OK, 0 rows affected (0.28 sec)
```

Querying the `blobs` table shows us that the statement worked as expected:

```
mysql> SELECT
    ->   column_name AS 'Column Name',
    ->   inline_size AS 'Inline Size',
    ->   part_size AS 'Blob Part Size'
    -> FROM ndbinfo.blobs
    -> WHERE table_name = 't3';
+-------------+-------------+----------------+
| Column Name | Inline Size | Blob Part Size |
+-------------+-------------+----------------+
| c1          |        4000 |           8100 |
| c2          |        5000 |           8100 |
+-------------+-------------+----------------+
2 rows in set (0.00 sec)
```

You can also verify that the statement worked by checking the output of **ndb\_desc**.

Changing a column's blob part size must be done using a copying `ALTER TABLE`; this operation cannot be performed online (see Section 25.6.12, “Online Operations with ALTER TABLE in NDB Cluster”).

For more information about how `NDB` stores columns of blob types, see String Type Storage Requirements.

##### NDB\_TABLE Options

For an NDB Cluster table, the table comment in a `CREATE TABLE` or `ALTER TABLE` statement can also be used to specify an `NDB_TABLE` option, which consists of one or more name-value pairs, separated by commas if need be, following the string `NDB_TABLE=`. Complete syntax for names and values syntax is shown here:

```
COMMENT="NDB_TABLE=ndb_table_option[,ndb_table_option[,..."

ndb_table_option: {
    NOLOGGING={1 | 0}
  | READ_BACKUP={1 | 0}
  | PARTITION_BALANCE={FOR_RP_BY_NODE | FOR_RA_BY_NODE | FOR_RP_BY_LDM
                      | FOR_RA_BY_LDM | FOR_RA_BY_LDM_X_2
                      | FOR_RA_BY_LDM_X_3 | FOR_RA_BY_LDM_X_4}
  | FULLY_REPLICATED={1 | 0}
}
```

Spaces are not permitted within the quoted string. The string is case-insensitive.

The four `NDB` table options that can be set as part of a comment in this way are described in more detail in the next few paragraphs.

`NOLOGGING`: By default, `NDB` tables are logged, and checkpointed. This makes them durable to whole cluster failures. Using `NOLOGGING` when creating or altering a table means that this table is not redo logged or included in local checkpoints. In this case, the table is still replicated across the data nodes for high availability, and updated using transactions, but changes made to it are not recorded in the data node's redo logs, and its content is not checkpointed to disk; when recovering from a cluster failure, the cluster retains the table definition, but none of its rows—that is, the table is empty.

Using such nonlogging tables reduces the data node's demands on disk I/O and storage, as well as CPU for checkpointing CPU. This may be suitable for short-lived data which is frequently updated, and where the loss of all data in the unlikely event of a total cluster failure is acceptable.

It is also possible to use the `ndb_table_no_logging` system variable to cause any NDB tables created or altered while this variable is in effect to behave as though it had been created with the `NOLOGGING` comment. Unlike when using the comment directly, there is nothing in this case in the output of `SHOW CREATE TABLE` to indicate that it is a nonlogging table. Using the table comment approach is recommended since it offers per-table control of the feature, and this aspect of the table schema is embedded in the table creation statement where it can be found easily by SQL-based tools.

`READ_BACKUP`: Setting this option to 1 has the same effect as though `ndb_read_backup` were enabled; enables reading from any replica. Doing so greatly improves the performance of reads from the table at a relatively small cost to write performance. 1 is the default for `READ_BACKUP`, and the default for `ndb_read_backup` is `ON` (previously, read from any replica was disabled by default).

You can set `READ_BACKUP` for an existing table online, using an `ALTER TABLE` statement similar to one of those shown here:

```
ALTER TABLE ... ALGORITHM=INPLACE, COMMENT="NDB_TABLE=READ_BACKUP=1";

ALTER TABLE ... ALGORITHM=INPLACE, COMMENT="NDB_TABLE=READ_BACKUP=0";
```

For more information about the `ALGORITHM` option for `ALTER TABLE`, see Section 25.6.12, “Online Operations with ALTER TABLE in NDB Cluster”.

`PARTITION_BALANCE`: Provides additional control over assignment and placement of partitions. The following four schemes are supported:

1. `FOR_RP_BY_NODE`: One partition per node.

   Only one LDM on each node stores a primary partition. Each partition is stored in the same LDM (same ID) on all nodes.

2. `FOR_RA_BY_NODE`: One partition per node group.

   Each node stores a single partition, which can be either a primary replica or a backup replica. Each partition is stored in the same LDM on all nodes.

3. `FOR_RP_BY_LDM`: One partition for each LDM on each node; the default.

   This is the setting used if `READ_BACKUP` is set to 1.

4. `FOR_RA_BY_LDM`: One partition per LDM in each node group.

   These partitions can be primary or backup partitions.

5. `FOR_RA_BY_LDM_X_2`: Two partitions per LDM in each node group.

   These partitions can be primary or backup partitions.

6. `FOR_RA_BY_LDM_X_3`: Three partitions per LDM in each node group.

   These partitions can be primary or backup partitions.

7. `FOR_RA_BY_LDM_X_4`: Four partitions per LDM in each node group.

   These partitions can be primary or backup partitions.

`PARTITION_BALANCE` is the preferred interface for setting the number of partitions per table. Using `MAX_ROWS` to force the number of partitions is deprecated but continues to be supported for backward compatibility; it is subject to removal in a future release of MySQL NDB Cluster. (Bug #81759, Bug #23544301)

`FULLY_REPLICATED` controls whether the table is fully replicated, that is, whether each data node has a complete copy of the table. To enable full replication of the table, use `FULLY_REPLICATED=1`.

This setting can also be controlled using the `ndb_fully_replicated` system variable. Setting it to `ON` enables the option by default for all new `NDB` tables; the default is `OFF`. The `ndb_data_node_neighbour` system variable is also used for fully replicated tables, to ensure that when a fully replicated table is accessed, we access the data node which is local to this MySQL Server.

An example of a `CREATE TABLE` statement using such a comment when creating an `NDB` table is shown here:

```
mysql> CREATE TABLE t1 (
     >     c1 INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
     >     c2 VARCHAR(100),
     >     c3 VARCHAR(100) )
     > ENGINE=NDB
     >
COMMENT="NDB_TABLE=READ_BACKUP=0,PARTITION_BALANCE=FOR_RP_BY_NODE";
```

The comment is displayed as part of the output of `SHOW CREATE TABLE`. The text of the comment is also available from querying the MySQL Information Schema `TABLES` table, as in this example:

```
mysql> SELECT TABLE_NAME, TABLE_SCHEMA, TABLE_COMMENT
     > FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME="t1"\G
*************************** 1. row ***************************
   TABLE_NAME: t1
 TABLE_SCHEMA: test
TABLE_COMMENT: NDB_TABLE=READ_BACKUP=0,PARTITION_BALANCE=FOR_RP_BY_NODE
1 row in set (0.01 sec)
```

This comment syntax is also supported with `ALTER TABLE` statements for `NDB` tables, as shown here:

```
mysql> ALTER TABLE t1 COMMENT="NDB_TABLE=PARTITION_BALANCE=FOR_RA_BY_NODE";
Query OK, 0 rows affected (0.40 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

The `TABLE_COMMENT` column displays the comment that is required to re-create the table as it is following the `ALTER TABLE` statement, like this:

```
mysql> SELECT TABLE_NAME, TABLE_SCHEMA, TABLE_COMMENT
    ->     FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME="t1"\G
*************************** 1. row ***************************
   TABLE_NAME: t1
 TABLE_SCHEMA: test
TABLE_COMMENT: NDB_TABLE=READ_BACKUP=0,PARTITION_BALANCE=FOR_RP_BY_NODE
1 row in set (0.01 sec)
```

```
mysql> SELECT TABLE_NAME, TABLE_SCHEMA, TABLE_COMMENT
     > FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME="t1";
+------------+--------------+--------------------------------------------------+
| TABLE_NAME | TABLE_SCHEMA | TABLE_COMMENT                                    |
+------------+--------------+--------------------------------------------------+
| t1         | c            | NDB_TABLE=PARTITION_BALANCE=FOR_RA_BY_NODE       |
| t1         | d            |                                                  |
+------------+--------------+--------------------------------------------------+
2 rows in set (0.01 sec)
```

Keep in mind that a table comment used with `ALTER TABLE` replaces any existing comment which the table might have.

```
mysql> ALTER TABLE t1 COMMENT="NDB_TABLE=PARTITION_BALANCE=FOR_RA_BY_NODE";
Query OK, 0 rows affected (0.40 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> SELECT TABLE_NAME, TABLE_SCHEMA, TABLE_COMMENT
     > FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME="t1";
+------------+--------------+--------------------------------------------------+
| TABLE_NAME | TABLE_SCHEMA | TABLE_COMMENT                                    |
+------------+--------------+--------------------------------------------------+
| t1         | c            | NDB_TABLE=PARTITION_BALANCE=FOR_RA_BY_NODE       |
| t1         | d            |                                                  |
+------------+--------------+--------------------------------------------------+
2 rows in set (0.01 sec)
```

You can also see the value of the `PARTITION_BALANCE` option in the output of **ndb\_desc**. **ndb\_desc** also shows whether the `READ_BACKUP` and `FULLY_REPLICATED` options are set for the table. See the description of this program for more information.
