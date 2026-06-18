## 18.2 The MyISAM Storage Engine

[18.2.1 MyISAM Startup Options](myisam-start.html)

[18.2.2 Space Needed for Keys](key-space.html)

[18.2.3 MyISAM Table Storage Formats](myisam-table-formats.html)

[18.2.4 MyISAM Table Problems](myisam-table-problems.html)

`MyISAM` is based on the older (and no longer
available) `ISAM` storage engine but has many
useful extensions.

**Table 18.2 MyISAM Storage Engine Features**

<table frame="box" rules="all" summary="Features supported by the MyISAM storage engine."><col style="width: 60%"/><col style="width: 40%"/><thead><tr><th>Feature</th>
<th>Support</th>
</tr></thead><tbody><tr><td><span class="bold"><strong>B-tree indexes</strong></span></td>
<td>Yes</td>
</tr><tr><td><span class="bold"><strong>Backup/point-in-time recovery</strong></span> (Implemented in the server, rather than in the storage engine.)</td>
<td>Yes</td>
</tr><tr><td><span class="bold"><strong>Cluster database support</strong></span></td>
<td>No</td>
</tr><tr><td><span class="bold"><strong>Clustered indexes</strong></span></td>
<td>No</td>
</tr><tr><td><span class="bold"><strong>Compressed data</strong></span></td>
<td>Yes (Compressed MyISAM tables are supported only when using the compressed row format. Tables using the compressed row format with MyISAM are read only.)</td>
</tr><tr><td><span class="bold"><strong>Data caches</strong></span></td>
<td>No</td>
</tr><tr><td><span class="bold"><strong>Encrypted data</strong></span></td>
<td>Yes (Implemented in the server via encryption functions.)</td>
</tr><tr><td><span class="bold"><strong>Foreign key support</strong></span></td>
<td>No</td>
</tr><tr><td><span class="bold"><strong>Full-text search indexes</strong></span></td>
<td>Yes</td>
</tr><tr><td><span class="bold"><strong>Geospatial data type support</strong></span></td>
<td>Yes</td>
</tr><tr><td><span class="bold"><strong>Geospatial indexing support</strong></span></td>
<td>Yes</td>
</tr><tr><td><span class="bold"><strong>Hash indexes</strong></span></td>
<td>No</td>
</tr><tr><td><span class="bold"><strong>Index caches</strong></span></td>
<td>Yes</td>
</tr><tr><td><span class="bold"><strong>Locking granularity</strong></span></td>
<td>Table</td>
</tr><tr><td><span class="bold"><strong>MVCC</strong></span></td>
<td>No</td>
</tr><tr><td><span class="bold"><strong>Replication support</strong></span> (Implemented in the server, rather than in the storage engine.)</td>
<td>Yes</td>
</tr><tr><td><span class="bold"><strong>Storage limits</strong></span></td>
<td>256TB</td>
</tr><tr><td><span class="bold"><strong>T-tree indexes</strong></span></td>
<td>No</td>
</tr><tr><td><span class="bold"><strong>Transactions</strong></span></td>
<td>No</td>
</tr><tr><td><span class="bold"><strong>Update statistics for data dictionary</strong></span></td>
<td>Yes</td>
</tr></tbody></table>

Each `MyISAM` table is stored on disk in two files.
The files have names that begin with the table name and have an
extension to indicate the file type. The data file has an
`.MYD` (`MYData`) extension. The
index file has an `.MYI`
(`MYIndex`) extension. The table definition is
stored in the MySQL data dictionary.

To specify explicitly that you want a `MyISAM`
table, indicate that with an `ENGINE` table option:

```
CREATE TABLE t (i INT) ENGINE = MYISAM;
```

In MySQL 8.0, it is normally necessary to use
`ENGINE` to specify the `MyISAM`
storage engine because `InnoDB` is the default
engine.

You can check or repair `MyISAM` tables with the
[**mysqlcheck**](mysqlcheck.html "6.5.3 mysqlcheck — A Table Maintenance Program") client or [**myisamchk**](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility")
utility. You can also compress `MyISAM` tables with
[**myisampack**](myisampack.html "6.6.6 myisampack — Generate Compressed, Read-Only MyISAM Tables") to take up much less space. See
[Section 6.5.3, “mysqlcheck — A Table Maintenance Program”](mysqlcheck.html "6.5.3 mysqlcheck — A Table Maintenance Program"), [Section 6.6.4, “myisamchk — MyISAM Table-Maintenance Utility”](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility"), and
[Section 6.6.6, “myisampack — Generate Compressed, Read-Only MyISAM Tables”](myisampack.html "6.6.6 myisampack — Generate Compressed, Read-Only MyISAM Tables").

In MySQL 8.0, the `MyISAM` storage
engine provides no partitioning support. *Partitioned
`MyISAM` tables created in previous versions of
MySQL cannot be used in MySQL 8.0*. For more
information, see
[Section 26.6.2, “Partitioning Limitations Relating to Storage Engines”](partitioning-limitations-storage-engines.html "26.6.2 Partitioning Limitations Relating to Storage Engines"). For help
with upgrading such tables so that they can be used in MySQL
8.0, see
[Section 3.5, “Changes in MySQL 8.0”](upgrading-from-previous-series.html "3.5 Changes in MySQL 8.0").

`MyISAM` tables have the following characteristics:

* All data values are stored with the low byte first. This makes
  the data machine and operating system independent. The only
  requirements for binary portability are that the machine uses
  two's-complement signed integers and IEEE floating-point format.
  These requirements are widely used among mainstream machines.
  Binary compatibility might not be applicable to embedded
  systems, which sometimes have peculiar processors.

  There is no significant speed penalty for storing data low byte
  first; the bytes in a table row normally are unaligned and it
  takes little more processing to read an unaligned byte in order
  than in reverse order. Also, the code in the server that fetches
  column values is not time critical compared to other code.

* All numeric key values are stored with the high byte first to
  permit better index compression.

* Large files (up to 63-bit file length) are supported on file
  systems and operating systems that support large files.

* There is a limit of
  (232)2
  (1.844E+19) rows in a `MyISAM` table.

* The maximum number of indexes per `MyISAM`
  table is 64.

  The maximum number of columns per index is 16.

* The maximum key length is 1000 bytes. This can also be changed
  by changing the source and recompiling. For the case of a key
  longer than 250 bytes, a larger key block size than the default
  of 1024 bytes is used.

* When rows are inserted in sorted order (as when you are using an
  `AUTO_INCREMENT` column), the index tree is
  split so that the high node only contains one key. This improves
  space utilization in the index tree.

* Internal handling of one `AUTO_INCREMENT`
  column per table is supported. `MyISAM`
  automatically updates this column for
  [`INSERT`](insert.html "15.2.7 INSERT Statement") and
  [`UPDATE`](update.html "15.2.17 UPDATE Statement") operations. This makes
  `AUTO_INCREMENT` columns faster (at least 10%).
  Values at the top of the sequence are not reused after being
  deleted. (When an `AUTO_INCREMENT` column is
  defined as the last column of a multiple-column index, reuse of
  values deleted from the top of a sequence does occur.) The
  `AUTO_INCREMENT` value can be reset with
  [`ALTER TABLE`](alter-table.html "15.1.9 ALTER TABLE Statement") or
  [**myisamchk**](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility").

* Dynamic-sized rows are much less fragmented when mixing deletes
  with updates and inserts. This is done by automatically
  combining adjacent deleted blocks and by extending blocks if the
  next block is deleted.

* `MyISAM` supports concurrent inserts: If a
  table has no free blocks in the middle of the data file, you can
  [`INSERT`](insert.html "15.2.7 INSERT Statement") new rows into it at the
  same time that other threads are reading from the table. A free
  block can occur as a result of deleting rows or an update of a
  dynamic length row with more data than its current contents.
  When all free blocks are used up (filled in), future inserts
  become concurrent again. See
  [Section 10.11.3, “Concurrent Inserts”](concurrent-inserts.html "10.11.3 Concurrent Inserts").

* You can put the data file and index file in different
  directories on different physical devices to get more speed with
  the `DATA DIRECTORY` and `INDEX
  DIRECTORY` table options to [`CREATE
  TABLE`](create-table.html "15.1.20 CREATE TABLE Statement"). See [Section 15.1.20, “CREATE TABLE Statement”](create-table.html "15.1.20 CREATE TABLE Statement").

* [`BLOB`](blob.html "13.3.4 The BLOB and TEXT Types") and
  [`TEXT`](blob.html "13.3.4 The BLOB and TEXT Types") columns can be indexed.

* `NULL` values are permitted in indexed columns.
  This takes 0 to 1 bytes per key.

* Each character column can have a different character set. See
  [Chapter 12, *Character Sets, Collations, Unicode*](charset.html "Chapter 12 Character Sets, Collations, Unicode").

* There is a flag in the `MyISAM` index file that
  indicates whether the table was closed correctly. If
  [**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server") is started with the
  [`myisam_recover_options`](server-system-variables.html#sysvar_myisam_recover_options) system
  variable set, `MyISAM` tables are automatically
  checked when opened, and are repaired if the table wasn't closed
  properly.

* [**myisamchk**](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility") marks tables as checked if you run
  it with the [`--update-state`](myisamchk-check-options.html#option_myisamchk_update-state)
  option. [**myisamchk --fast**](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility") checks only those
  tables that don't have this mark.

* [**myisamchk --analyze**](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility") stores statistics for
  portions of keys, as well as for entire keys.

* [**myisampack**](myisampack.html "6.6.6 myisampack — Generate Compressed, Read-Only MyISAM Tables") can pack
  [`BLOB`](blob.html "13.3.4 The BLOB and TEXT Types") and
  [`VARCHAR`](char.html "13.3.2 The CHAR and VARCHAR Types") columns.

`MyISAM` also supports the following features:

* Support for a true [`VARCHAR`](char.html "13.3.2 The CHAR and VARCHAR Types") type;
  a [`VARCHAR`](char.html "13.3.2 The CHAR and VARCHAR Types") column starts with a
  length stored in one or two bytes.

* Tables with [`VARCHAR`](char.html "13.3.2 The CHAR and VARCHAR Types") columns may
  have fixed or dynamic row length.

* The sum of the lengths of the
  [`VARCHAR`](char.html "13.3.2 The CHAR and VARCHAR Types") and
  [`CHAR`](char.html "13.3.2 The CHAR and VARCHAR Types") columns in a table may be up
  to 64KB.

* Arbitrary length `UNIQUE` constraints.

### Additional Resources

* A forum dedicated to the `MyISAM` storage
  engine is available at <https://forums.mysql.com/list.php?21>.