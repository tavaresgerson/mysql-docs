## 15.2 The MyISAM Storage Engine

`MyISAM` is based on the older (and no longer available) `ISAM` storage engine but has many useful extensions.

**Table 15.2 MyISAM Storage Engine Features**

<table frame="box" rules="all" summary="Features supported by the MyISAM storage engine."><col style="width: 60%"/><col style="width: 40%"/><thead><tr><th>Feature</th> <th>Support</th> </tr></thead><tbody><tr><td><strong>B-tree indexes</strong></td> <td>Yes</td> </tr><tr><td><strong>Backup/point-in-time recovery</strong> (Implemented in the server, rather than in the storage engine.)</td> <td>Yes</td> </tr><tr><td><strong>Cluster database support</strong></td> <td>No</td> </tr><tr><td><strong>Clustered indexes</strong></td> <td>No</td> </tr><tr><td><strong>Compressed data</strong></td> <td>Yes (Compressed MyISAM tables are supported only when using the compressed row format. Tables using the compressed row format with MyISAM are read only.)</td> </tr><tr><td><strong>Data caches</strong></td> <td>No</td> </tr><tr><td><strong>Encrypted data</strong></td> <td>Yes (Implemented in the server via encryption functions.)</td> </tr><tr><td><strong>Foreign key support</strong></td> <td>No</td> </tr><tr><td><strong>Full-text search indexes</strong></td> <td>Yes</td> </tr><tr><td><strong>Geospatial data type support</strong></td> <td>Yes</td> </tr><tr><td><strong>Geospatial indexing support</strong></td> <td>Yes</td> </tr><tr><td><strong>Hash indexes</strong></td> <td>No</td> </tr><tr><td><strong>Index caches</strong></td> <td>Yes</td> </tr><tr><td><strong>Locking granularity</strong></td> <td>Table</td> </tr><tr><td><strong>MVCC</strong></td> <td>No</td> </tr><tr><td><strong>Replication support</strong> (Implemented in the server, rather than in the storage engine.)</td> <td>Yes</td> </tr><tr><td><strong>Storage limits</strong></td> <td>256TB</td> </tr><tr><td><strong>T-tree indexes</strong></td> <td>No</td> </tr><tr><td><strong>Transactions</strong></td> <td>No</td> </tr><tr><td><strong>Update statistics for data dictionary</strong></td> <td>Yes</td> </tr></tbody></table>

Each `MyISAM` table is stored on disk in three files. The files have names that begin with the table name and have an extension to indicate the file type. An `.frm` file stores the table format. The data file has an `.MYD` (`MYData`) extension. The index file has an `.MYI` (`MYIndex`) extension.

To specify explicitly that you want a `MyISAM` table, indicate that with an `ENGINE` table option:

```sql
CREATE TABLE t (i INT) ENGINE = MYISAM;
```

In MySQL 5.7, it is normally necessary to use `ENGINE` to specify the `MyISAM` storage engine because `InnoDB` is the default engine.

You can check or repair `MyISAM` tables with the **mysqlcheck** client or **myisamchk** utility. You can also compress `MyISAM` tables with **myisampack** to take up much less space. See Section 4.5.3, “mysqlcheck — A Table Maintenance Program”, Section 4.6.3, “myisamchk — MyISAM Table-Maintenance Utility”, and Section 4.6.5, “myisampack — Generate Compressed, Read-Only MyISAM Tables”.

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

* `MyISAM` supports concurrent inserts: If a table has no free blocks in the middle of the data file, you can `INSERT` new rows into it at the same time that other threads are reading from the table. A free block can occur as a result of deleting rows or an update of a dynamic length row with more data than its current contents. When all free blocks are used up (filled in), future inserts become concurrent again. See Section 8.11.3, “Concurrent Inserts”.

* You can put the data file and index file in different directories on different physical devices to get more speed with the `DATA DIRECTORY` and `INDEX DIRECTORY` table options to [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement"). See Section 13.1.18, “CREATE TABLE Statement”.

* `BLOB` and `TEXT` columns can be indexed.

* `NULL` values are permitted in indexed columns. This takes 0 to 1 bytes per key.

* Each character column can have a different character set. See Chapter 10, *Character Sets, Collations, Unicode*.

* There is a flag in the `MyISAM` index file that indicates whether the table was closed correctly. If `mysqld` is started with the `myisam_recover_options` system variable set, `MyISAM` tables are automatically checked when opened, and are repaired if the table wasn't closed properly.

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


### 15.2.1 MyISAM Startup Options

The following options to `mysqld` can be used to change the behavior of `MyISAM` tables. For additional information, see Section 5.1.6, “Server Command Options”.

**Table 15.3 MyISAM Option and Variable Reference**

<table frame="box" rules="all" summary="Reference for MyISAM command-line options and system variables."><col style="width: 20%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><thead><tr><th>Name</th> <th>Cmd-Line</th> <th>Option File</th> <th>System Var</th> <th>Status Var</th> <th>Var Scope</th> <th>Dynamic</th> </tr></thead><tbody><tr><th>bulk_insert_buffer_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Both</td> <td>Yes</td> </tr><tr><th>concurrent_insert</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th>delay_key_write</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th>have_rtree_keys</th> <td></td> <td></td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th>key_buffer_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th>log-isam</th> <td>Yes</td> <td>Yes</td> <td></td> <td></td> <td></td> <td></td> </tr><tr><th>myisam-block-size</th> <td>Yes</td> <td>Yes</td> <td></td> <td></td> <td></td> <td></td> </tr><tr><th>myisam_data_pointer_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th>myisam_max_sort_file_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th>myisam_mmap_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th>myisam_recover_options</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th>myisam_repair_threads</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Both</td> <td>Yes</td> </tr><tr><th>myisam_sort_buffer_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Both</td> <td>Yes</td> </tr><tr><th>myisam_stats_method</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Both</td> <td>Yes</td> </tr><tr><th>myisam_use_mmap</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th>tmp_table_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Both</td> <td>Yes</td> </tr></tbody></table>

The following system variables affect the behavior of `MyISAM` tables. For additional information, see Section 5.1.7, “Server System Variables”.

* `bulk_insert_buffer_size`

  The size of the tree cache used in bulk insert optimization.

  Note

  This is a limit *per thread*!

* `delay_key_write=ALL`

  Don't flush key buffers between writes for any `MyISAM` table.

  Note

  If you do this, you should not access `MyISAM` tables from another program (such as from another MySQL server or with **myisamchk**) when the tables are in use. Doing so risks index corruption. Using `--external-locking` does not eliminate this risk.

* `myisam_max_sort_file_size`

  The maximum size of the temporary file that MySQL is permitted to use while re-creating a `MyISAM` index (during `REPAIR TABLE`, `ALTER TABLE`, or `LOAD DATA`). If the file size would be larger than this value, the index is created using the key cache instead, which is slower. The value is given in bytes.

* `myisam_recover_options=mode`

  Set the mode for automatic recovery of crashed `MyISAM` tables.

* `myisam_sort_buffer_size`

  Set the size of the buffer used when recovering tables.

Automatic recovery is activated if you start `mysqld` with the `myisam_recover_options` system variable set. In this case, when the server opens a `MyISAM` table, it checks whether the table is marked as crashed or whether the open count variable for the table is not 0 and you are running the server with external locking disabled. If either of these conditions is true, the following happens:

* The server checks the table for errors.
* If the server finds an error, it tries to do a fast table repair (with sorting and without re-creating the data file).

* If the repair fails because of an error in the data file (for example, a duplicate-key error), the server tries again, this time re-creating the data file.

* If the repair still fails, the server tries once more with the old repair option method (write row by row without sorting). This method should be able to repair any type of error and has low disk space requirements.

If the recovery wouldn't be able to recover all rows from previously completed statements and you didn't specify `FORCE` in the value of the `myisam_recover_options` system variable, automatic repair aborts with an error message in the error log:

```sql
Error: Couldn't repair table: test.g00pages
```

If you specify `FORCE`, a warning like this is written instead:

```sql
Warning: Found 344 of 354 rows when repairing ./test/g00pages
```

If the automatic recovery value includes `BACKUP`, the recovery process creates files with names of the form `tbl_name-datetime.BAK`. You should have a **cron** script that automatically moves these files from the database directories to backup media.


### 15.2.2 Space Needed for Keys

`MyISAM` tables use B-tree indexes. You can roughly calculate the size for the index file as `(key_length+4)/0.67`, summed over all keys. This is for the worst case when all keys are inserted in sorted order and the table does not have any compressed keys.

String indexes are space compressed. If the first index part is a string, it is also prefix compressed. Space compression makes the index file smaller than the worst-case figure if a string column has a lot of trailing space or is a `VARCHAR` column that is not always used to the full length. Prefix compression is used on keys that start with a string. Prefix compression helps if there are many strings with an identical prefix.

In `MyISAM` tables, you can also prefix compress numbers by specifying the `PACK_KEYS=1` table option when you create the table. Numbers are stored with the high byte first, so this helps when you have many integer keys that have an identical prefix.


### 15.2.3 MyISAM Table Storage Formats

`MyISAM` supports three different storage formats. Two of them, fixed and dynamic format, are chosen automatically depending on the type of columns you are using. The third, compressed format, can be created only with the **myisampack** utility (see Section 4.6.5, “myisampack — Generate Compressed, Read-Only MyISAM Tables”).

When you use `CREATE TABLE` or `ALTER TABLE` for a table that has no `BLOB` or `TEXT` columns, you can force the table format to `FIXED` or `DYNAMIC` with the `ROW_FORMAT` table option.

See Section 13.1.18, “CREATE TABLE Statement”, for information about `ROW_FORMAT`.

You can decompress (unpack) compressed `MyISAM` tables using **myisamchk** `--unpack`; see Section 4.6.3, “myisamchk — MyISAM Table-Maintenance Utility”, for more information.


#### 15.2.3.1 Static (Fixed-Length) Table Characteristics

Static format is the default for `MyISAM` tables. It is used when the table contains no variable-length columns (`VARCHAR`, `VARBINARY`, `BLOB`, or `TEXT`). Each row is stored using a fixed number of bytes.

Of the three `MyISAM` storage formats, static format is the simplest and most secure (least subject to corruption). It is also the fastest of the on-disk formats due to the ease with which rows in the data file can be found on disk: To look up a row based on a row number in the index, multiply the row number by the row length to calculate the row position. Also, when scanning a table, it is very easy to read a constant number of rows with each disk read operation.

The security is evidenced if your computer crashes while the MySQL server is writing to a fixed-format `MyISAM` file. In this case, **myisamchk** can easily determine where each row starts and ends, so it can usually reclaim all rows except the partially written one. `MyISAM` table indexes can always be reconstructed based on the data rows.

Note

Fixed-length row format is only available for tables without `BLOB` or `TEXT` columns. Creating a table with these columns with an explicit `ROW_FORMAT` clause does not raise an error or warning; the format specification is ignored.

Static-format tables have these characteristics:

* `CHAR` and `VARCHAR` columns are space-padded to the specified column width, although the column type is not altered. `BINARY` and `VARBINARY` columns are padded with `0x00` bytes to the column width.

* `NULL` columns require additional space in the row to record whether their values are `NULL`. Each `NULL` column takes one bit extra, rounded up to the nearest byte.

* Very quick.
* Easy to cache.
* Easy to reconstruct after a crash, because rows are located in fixed positions.

* Reorganization is unnecessary unless you delete a huge number of rows and want to return free disk space to the operating system. To do this, use `OPTIMIZE TABLE` or **myisamchk -r**.

* Usually require more disk space than dynamic-format tables.
* The expected row length in bytes for static-sized rows is calculated using the following expression:

  ```sql
  row length = 1
               + (sum of column lengths)
               + (number of NULL columns + delete_flag + 7)/8
               + (number of variable-length columns)
  ```

  *`delete_flag`* is 1 for tables with static row format. Static tables use a bit in the row record for a flag that indicates whether the row has been deleted. *`delete_flag`* is 0 for dynamic tables because the flag is stored in the dynamic row header.


#### 15.2.3.2 Dynamic Table Characteristics

Dynamic storage format is used if a `MyISAM` table contains any variable-length columns (`VARCHAR`, `VARBINARY`, `BLOB`, or `TEXT`), or if the table was created with the `ROW_FORMAT=DYNAMIC` table option.

Dynamic format is a little more complex than static format because each row has a header that indicates how long it is. A row can become fragmented (stored in noncontiguous pieces) when it is made longer as a result of an update.

You can use `OPTIMIZE TABLE` or **myisamchk -r** to defragment a table. If you have fixed-length columns that you access or change frequently in a table that also contains some variable-length columns, it might be a good idea to move the variable-length columns to other tables just to avoid fragmentation.

Dynamic-format tables have these characteristics:

* All string columns are dynamic except those with a length less than four.

* Each row is preceded by a bitmap that indicates which columns contain the empty string (for string columns) or zero (for numeric columns). This does not include columns that contain `NULL` values. If a string column has a length of zero after trailing space removal, or a numeric column has a value of zero, it is marked in the bitmap and not saved to disk. Nonempty strings are saved as a length byte plus the string contents.

* `NULL` columns require additional space in the row to record whether their values are `NULL`. Each `NULL` column takes one bit extra, rounded up to the nearest byte.

* Much less disk space usually is required than for fixed-length tables.

* Each row uses only as much space as is required. However, if a row becomes larger, it is split into as many pieces as are required, resulting in row fragmentation. For example, if you update a row with information that extends the row length, the row becomes fragmented. In this case, you may have to run `OPTIMIZE TABLE` or **myisamchk -r** from time to time to improve performance. Use **myisamchk -ei** to obtain table statistics.

* More difficult than static-format tables to reconstruct after a crash, because rows may be fragmented into many pieces and links (fragments) may be missing.

* The expected row length for dynamic-sized rows is calculated using the following expression:

  ```sql
  3
  + (number of columns + 7) / 8
  + (number of char columns)
  + (packed size of numeric columns)
  + (length of strings)
  + (number of NULL columns + 7) / 8
  ```

  There is a penalty of 6 bytes for each link. A dynamic row is linked whenever an update causes an enlargement of the row. Each new link is at least 20 bytes, so the next enlargement probably goes in the same link. If not, another link is created. You can find the number of links using **myisamchk -ed**. All links may be removed with `OPTIMIZE TABLE` or **myisamchk -r**.


#### 15.2.3.3 Compressed Table Characteristics

Compressed storage format is a read-only format that is generated with the **myisampack** tool. Compressed tables can be uncompressed with **myisamchk**.

Compressed tables have the following characteristics:

* Compressed tables take very little disk space. This minimizes disk usage, which is helpful when using slow disks (such as CD-ROMs).

* Each row is compressed separately, so there is very little access overhead. The header for a row takes up one to three bytes depending on the biggest row in the table. Each column is compressed differently. There is usually a different Huffman tree for each column. Some of the compression types are:

  + Suffix space compression.
  + Prefix space compression.
  + Numbers with a value of zero are stored using one bit.
  + If values in an integer column have a small range, the column is stored using the smallest possible type. For example, a `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") column (eight bytes) can be stored as a `TINYINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") column (one byte) if all its values are in the range from `-128` to `127`.

  + If a column has only a small set of possible values, the data type is converted to `ENUM`.

  + A column may use any combination of the preceding compression types.

* Can be used for fixed-length or dynamic-length rows.

Note

While a compressed table is read only, and you cannot therefore update or add rows in the table, DDL (Data Definition Language) operations are still valid. For example, you may still use `DROP` to drop the table, and `TRUNCATE TABLE` to empty the table.


### 15.2.4 MyISAM Table Problems

The file format that MySQL uses to store data has been extensively tested, but there are always circumstances that may cause database tables to become corrupted. The following discussion describes how this can happen and how to handle it.


#### 15.2.4.1 Corrupted MyISAM Tables

Even though the `MyISAM` table format is very reliable (all changes to a table made by an SQL statement are written before the statement returns), you can still get corrupted tables if any of the following events occur:

* The `mysqld` process is killed in the middle of a write.

* An unexpected computer shutdown occurs (for example, the computer is turned off).

* Hardware failures.
* You are using an external program (such as **myisamchk**) to modify a table that is being modified by the server at the same time.

* A software bug in the MySQL or `MyISAM` code.

Typical symptoms of a corrupt table are:

* You get the following error while selecting data from the table:

  ```sql
  Incorrect key file for table: '...'. Try to repair it
  ```

* Queries don't find rows in the table or return incomplete results.

You can check the health of a `MyISAM` table using the `CHECK TABLE` statement, and repair a corrupted `MyISAM` table with `REPAIR TABLE`. When `mysqld` is not running, you can also check or repair a table with the **myisamchk** command. See Section 13.7.2.2, “CHECK TABLE Statement”, Section 13.7.2.5, “REPAIR TABLE Statement”, and Section 4.6.3, “myisamchk — MyISAM Table-Maintenance Utility”.

If your tables become corrupted frequently, you should try to determine why this is happening. The most important thing to know is whether the table became corrupted as a result of an unexpected server exit. You can verify this easily by looking for a recent `restarted mysqld` message in the error log. If there is such a message, it is likely that table corruption is a result of the server dying. Otherwise, corruption may have occurred during normal operation. This is a bug. You should try to create a reproducible test case that demonstrates the problem. See Section B.3.3.3, “What to Do If MySQL Keeps Crashing”, and Section 5.8, “Debugging MySQL”.


#### 15.2.4.2 Problems from Tables Not Being Closed Properly

Each `MyISAM` index file (`.MYI` file) has a counter in the header that can be used to check whether a table has been closed properly. If you get the following warning from `CHECK TABLE` or **myisamchk**, it means that this counter has gone out of sync:

```sql
clients are using or haven't closed the table properly
```

This warning does not necessarily mean that the table is corrupted, but you should at least check the table.

The counter works as follows:

* The first time a table is updated in MySQL, a counter in the header of the index files is incremented.

* The counter is not changed during further updates.
* When the last instance of a table is closed (because a `FLUSH TABLES` operation was performed or because there is no room in the table cache), the counter is decremented if the table has been updated at any point.

* When you repair the table or check the table and it is found to be okay, the counter is reset to zero.

* To avoid problems with interaction with other processes that might check the table, the counter is not decremented on close if it was zero.

In other words, the counter can become incorrect only under these conditions:

* A `MyISAM` table is copied without first issuing `LOCK TABLES` and `FLUSH TABLES`.

* MySQL has crashed between an update and the final close. (The table may still be okay because MySQL always issues writes for everything between each statement.)

* A table was modified by [**myisamchk --recover**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility") or [**myisamchk --update-state**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility") at the same time that it was in use by `mysqld`.

* Multiple `mysqld` servers are using the table and one server performed a [`REPAIR TABLE`](repair-table.html "13.7.2.5 REPAIR TABLE Statement") or [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") on the table while it was in use by another server. In this setup, it is safe to use `CHECK TABLE`, although you might get the warning from other servers. However, `REPAIR TABLE` should be avoided because when one server replaces the data file with a new one, this is not known to the other servers.

  In general, it is a bad idea to share a data directory among multiple servers. See Section 5.7, “Running Multiple MySQL Instances on One Machine”, for additional discussion.
