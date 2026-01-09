## 18.2 The MyISAM Storage Engine

18.2.1 MyISAM Startup Options

18.2.2 Space Needed for Keys

18.2.3 MyISAM Table Storage Formats

18.2.4 MyISAM Table Problems

`MyISAM` is based on the older (and no longer available) `ISAM` storage engine but has many useful extensions.

**Table 18.2 MyISAM Storage Engine Features**

<table frame="box" rules="all" summary="Features supported by the MyISAM storage engine."><col style="width: 60%"/><col style="width: 40%"/><thead><tr><th>Feature</th> <th>Support</th> </tr></thead><tbody><tr><td><span><strong>B-tree indexes</strong></span></td> <td>Yes</td> </tr><tr><td><span><strong>Backup/point-in-time recovery</strong></span> (Implemented in the server, rather than in the storage engine.)</td> <td>Yes</td> </tr><tr><td><span><strong>Cluster database support</strong></span></td> <td>No</td> </tr><tr><td><span><strong>Clustered indexes</strong></span></td> <td>No</td> </tr><tr><td><span><strong>Compressed data</strong></span></td> <td>Yes (Compressed MyISAM tables are supported only when using the compressed row format. Tables using the compressed row format with MyISAM are read only.)</td> </tr><tr><td><span><strong>Data caches</strong></span></td> <td>No</td> </tr><tr><td><span><strong>Encrypted data</strong></span></td> <td>Yes (Implemented in the server via encryption functions.)</td> </tr><tr><td><span><strong>Foreign key support</strong></span></td> <td>No</td> </tr><tr><td><span><strong>Full-text search indexes</strong></span></td> <td>Yes</td> </tr><tr><td><span><strong>Geospatial data type support</strong></span></td> <td>Yes</td> </tr><tr><td><span><strong>Geospatial indexing support</strong></span></td> <td>Yes</td> </tr><tr><td><span><strong>Hash indexes</strong></span></td> <td>No</td> </tr><tr><td><span><strong>Index caches</strong></span></td> <td>Yes</td> </tr><tr><td><span><strong>Locking granularity</strong></span></td> <td>Table</td> </tr><tr><td><span><strong>MVCC</strong></span></td> <td>No</td> </tr><tr><td><span><strong>Replication support</strong></span> (Implemented in the server, rather than in the storage engine.)</td> <td>Yes</td> </tr><tr><td><span><strong>Storage limits</strong></span></td> <td>256TB</td> </tr><tr><td><span><strong>T-tree indexes</strong></span></td> <td>No</td> </tr><tr><td><span><strong>Transactions</strong></span></td> <td>No</td> </tr><tr><td><span><strong>Update statistics for data dictionary</strong></span></td> <td>Yes</td> </tr></tbody></table>

Each `MyISAM` table is stored on disk in two files. The files have names that begin with the table name and have an extension to indicate the file type. The data file has an `.MYD` (`MYData`) extension. The index file has an `.MYI` (`MYIndex`) extension. The table definition is stored in the MySQL data dictionary.

To specify explicitly that you want a `MyISAM` table, indicate that with an `ENGINE` table option:

```
CREATE TABLE t (i INT) ENGINE = MYISAM;
```

In MySQL 9.5, it is normally necessary to use `ENGINE` to specify the `MyISAM` storage engine because `InnoDB` is the default engine.

You can check or repair `MyISAM` tables with the **mysqlcheck** client or **myisamchk** utility. You can also compress `MyISAM` tables with **myisampack** to take up much less space. See Section 6.5.3, “mysqlcheck — A Table Maintenance Program”, Section 6.6.4, “myisamchk — MyISAM Table-Maintenance Utility”, and Section 6.6.6, “myisampack — Generate Compressed, Read-Only MyISAM Tables”.

In MySQL 9.5, the `MyISAM` storage engine provides no partitioning support. *Partitioned `MyISAM` tables created in previous versions of MySQL cannot be used in MySQL 9.5*. For more information, see Section 26.6.2, “Partitioning Limitations Relating to Storage Engines”. For help with upgrading such tables so that they can be used in MySQL 9.5, see Section 3.5, “Changes in MySQL 9.5”.

`MyISAM` tables have the following characteristics:

* All data values are stored with the low byte first. This makes the data machine and operating system independent. The only requirements for binary portability are that the machine uses two's-complement signed integers and IEEE floating-point format. These requirements are widely used among mainstream machines. Binary compatibility might not be applicable to embedded systems, which sometimes have peculiar processors.

  There is no significant speed penalty for storing data low byte first; the bytes in a table row normally are unaligned and it takes little more processing to read an unaligned byte in order than in reverse order. Also, the code in the server that fetches column values is not time critical compared to other code.

* All numeric key values are stored with the high byte first to permit better index compression.

* Large files (up to 63-bit file length) are supported on file systems and operating systems that support large files.

* There is a limit of (232)2 (1.844E+19) rows in a `MyISAM` table.

* The maximum number of indexes per `MyISAM` table is 64.

  The maximum number of columns per index is 16.

* The maximum key length is 1000 bytes. This can also be changed by changing the source and recompiling. For the case of a key longer than 250 bytes, a larger key block size than the default of 1024 bytes is used.

* When rows are inserted in sorted order (as when you are using an `AUTO_INCREMENT` column), the index tree is split so that the high node only contains one key. This improves space utilization in the index tree.

* Internal handling of one `AUTO_INCREMENT` column per table is supported. `MyISAM` automatically updates this column for `INSERT` and `UPDATE` operations. This makes `AUTO_INCREMENT` columns faster (at least 10%). Values at the top of the sequence are not reused after being deleted. (When an `AUTO_INCREMENT` column is defined as the last column of a multiple-column index, reuse of values deleted from the top of a sequence does occur.) The `AUTO_INCREMENT` value can be reset with `ALTER TABLE` or **myisamchk**.

* Dynamic-sized rows are much less fragmented when mixing deletes with updates and inserts. This is done by automatically combining adjacent deleted blocks and by extending blocks if the next block is deleted.

* `MyISAM` supports concurrent inserts: If a table has no free blocks in the middle of the data file, you can `INSERT` new rows into it at the same time that other threads are reading from the table. A free block can occur as a result of deleting rows or an update of a dynamic length row with more data than its current contents. When all free blocks are used up (filled in), future inserts become concurrent again. See Section 10.11.3, “Concurrent Inserts”.

* You can put the data file and index file in different directories on different physical devices to get more speed with the `DATA DIRECTORY` and `INDEX DIRECTORY` table options to `CREATE TABLE`. See Section 15.1.24, “CREATE TABLE Statement”.

* `BLOB` and `TEXT` columns can be indexed.

* `NULL` values are permitted in indexed columns. This takes 0 to 1 bytes per key.

* Each character column can have a different character set. See Chapter 12, *Character Sets, Collations, Unicode*.

* There is a flag in the `MyISAM` index file that indicates whether the table was closed correctly. If **mysqld** is started with the `myisam_recover_options` system variable set, `MyISAM` tables are automatically checked when opened, and are repaired if the table wasn't closed properly.

* **myisamchk** marks tables as checked if you run it with the `--update-state` option. **myisamchk --fast** checks only those tables that don't have this mark.

* **myisamchk --analyze** stores statistics for portions of keys, as well as for entire keys.

* **myisampack** can pack `BLOB` and `VARCHAR` columns.

`MyISAM` also supports the following features:

* Support for a true `VARCHAR` type; a `VARCHAR` column starts with a length stored in one or two bytes.

* Tables with `VARCHAR` columns may have fixed or dynamic row length.

* The sum of the lengths of the `VARCHAR` and `CHAR` columns in a table may be up to 64KB.

* Arbitrary length `UNIQUE` constraints.

### Additional Resources

* A forum dedicated to the `MyISAM` storage engine is available at <https://forums.mysql.com/list.php?21>.
