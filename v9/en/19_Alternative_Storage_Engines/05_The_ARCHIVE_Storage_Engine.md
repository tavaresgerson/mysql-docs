## 18.5 The ARCHIVE Storage Engine

The `ARCHIVE` storage engine produces
special-purpose tables that store large amounts of unindexed data in
a very small footprint.

**Table 18.5 ARCHIVE Storage Engine Features**

<table frame="box" rules="all" summary="Features supported by the ARCHIVE storage engine."><col style="width: 60%"/><col style="width: 40%"/><thead><tr><th>Feature</th>
<th>Support</th>
</tr></thead><tbody><tr><td><span class="bold"><strong>B-tree indexes</strong></span></td>
<td>No</td>
</tr><tr><td><span class="bold"><strong>Backup/point-in-time recovery</strong></span> (Implemented in the server, rather than in the storage engine.)</td>
<td>Yes</td>
</tr><tr><td><span class="bold"><strong>Cluster database support</strong></span></td>
<td>No</td>
</tr><tr><td><span class="bold"><strong>Clustered indexes</strong></span></td>
<td>No</td>
</tr><tr><td><span class="bold"><strong>Compressed data</strong></span></td>
<td>Yes</td>
</tr><tr><td><span class="bold"><strong>Data caches</strong></span></td>
<td>No</td>
</tr><tr><td><span class="bold"><strong>Encrypted data</strong></span></td>
<td>Yes (Implemented in the server via encryption functions.)</td>
</tr><tr><td><span class="bold"><strong>Foreign key support</strong></span></td>
<td>No</td>
</tr><tr><td><span class="bold"><strong>Full-text search indexes</strong></span></td>
<td>No</td>
</tr><tr><td><span class="bold"><strong>Geospatial data type support</strong></span></td>
<td>Yes</td>
</tr><tr><td><span class="bold"><strong>Geospatial indexing support</strong></span></td>
<td>No</td>
</tr><tr><td><span class="bold"><strong>Hash indexes</strong></span></td>
<td>No</td>
</tr><tr><td><span class="bold"><strong>Index caches</strong></span></td>
<td>No</td>
</tr><tr><td><span class="bold"><strong>Locking granularity</strong></span></td>
<td>Row</td>
</tr><tr><td><span class="bold"><strong>MVCC</strong></span></td>
<td>No</td>
</tr><tr><td><span class="bold"><strong>Replication support</strong></span> (Implemented in the server, rather than in the storage engine.)</td>
<td>Yes</td>
</tr><tr><td><span class="bold"><strong>Storage limits</strong></span></td>
<td>None</td>
</tr><tr><td><span class="bold"><strong>T-tree indexes</strong></span></td>
<td>No</td>
</tr><tr><td><span class="bold"><strong>Transactions</strong></span></td>
<td>No</td>
</tr><tr><td><span class="bold"><strong>Update statistics for data dictionary</strong></span></td>
<td>Yes</td>
</tr></tbody></table>

The `ARCHIVE` storage engine is included in MySQL
binary distributions. To enable this storage engine if you build
MySQL from source, invoke **CMake** with the
[`-DWITH_ARCHIVE_STORAGE_ENGINE`](source-configuration-options.html#option_cmake_storage_engine_options "Storage Engine Options")
option.

To examine the source for the `ARCHIVE` engine,
look in the `storage/archive` directory of a
MySQL source distribution.

You can check whether the `ARCHIVE` storage engine
is available with the [`SHOW ENGINES`](show-engines.html "15.7.7.18 SHOW ENGINES Statement")
statement.

When you create an `ARCHIVE` table, the storage
engine creates files with names that begin with the table name. The
data file has an extension of `.ARZ`. An
`.ARN` file may appear during optimization
operations.

The `ARCHIVE` engine supports
[`INSERT`](insert.html "15.2.7 INSERT Statement"),
[`REPLACE`](replace.html "15.2.12 REPLACE Statement"), and
[`SELECT`](select.html "15.2.13 SELECT Statement"), but not
[`DELETE`](delete.html "15.2.2 DELETE Statement") or
[`UPDATE`](update.html "15.2.17 UPDATE Statement"). It does support
`ORDER BY` operations,
[`BLOB`](blob.html "13.3.4 The BLOB and TEXT Types") columns, and spatial data types
(see [Section 13.4.1, “Spatial Data Types”](spatial-type-overview.html "13.4.1 Spatial Data Types")). Geographic spatial
reference systems are not supported. The `ARCHIVE`
engine uses row-level locking.

The `ARCHIVE` engine supports the
`AUTO_INCREMENT` column attribute. The
`AUTO_INCREMENT` column can have either a unique or
nonunique index. Attempting to create an index on any other column
results in an error. The `ARCHIVE` engine also
supports the `AUTO_INCREMENT` table option in
[`CREATE TABLE`](create-table.html "15.1.24 CREATE TABLE Statement") statements to specify
the initial sequence value for a new table or reset the sequence
value for an existing table, respectively.

`ARCHIVE` does not support inserting a value into
an `AUTO_INCREMENT` column less than the current
maximum column value. Attempts to do so result in an
[`ER_DUP_KEY`](/doc/mysql-errors/9.5/en/server-error-reference.html#error_er_dup_key) error.

The `ARCHIVE` engine ignores
[`BLOB`](blob.html "13.3.4 The BLOB and TEXT Types") columns if they are not
requested and scans past them while reading.

The `ARCHIVE` storage engine does not support
partitioning.

**Storage:** Rows are compressed as
they are inserted. The `ARCHIVE` engine uses
`zlib` lossless data compression (see
<http://www.zlib.net/>). You can use
[`OPTIMIZE TABLE`](optimize-table.html "15.7.3.4 OPTIMIZE TABLE Statement") to analyze the table
and pack it into a smaller format (for a reason to use
[`OPTIMIZE TABLE`](optimize-table.html "15.7.3.4 OPTIMIZE TABLE Statement"), see later in this
section). The engine also supports [`CHECK
TABLE`](check-table.html "15.7.3.2 CHECK TABLE Statement"). There are several types of insertions that are
used:

* An [`INSERT`](insert.html "15.2.7 INSERT Statement") statement just pushes
  rows into a compression buffer, and that buffer flushes as
  necessary. The insertion into the buffer is protected by a lock.
  A [`SELECT`](select.html "15.2.13 SELECT Statement") forces a flush to occur.

* A bulk insert is visible only after it completes, unless other
  inserts occur at the same time, in which case it can be seen
  partially. A [`SELECT`](select.html "15.2.13 SELECT Statement") never causes
  a flush of a bulk insert unless a normal insert occurs while it
  is loading.

**Retrieval**: On retrieval, rows are
uncompressed on demand; there is no row cache. A
[`SELECT`](select.html "15.2.13 SELECT Statement") operation performs a complete
table scan: When a [`SELECT`](select.html "15.2.13 SELECT Statement") occurs, it
finds out how many rows are currently available and reads that
number of rows. [`SELECT`](select.html "15.2.13 SELECT Statement") is performed
as a consistent read. Note that lots of
[`SELECT`](select.html "15.2.13 SELECT Statement") statements during insertion
can deteriorate the compression, unless only bulk inserts are used.
To achieve better compression, you can use
[`OPTIMIZE TABLE`](optimize-table.html "15.7.3.4 OPTIMIZE TABLE Statement") or
[`REPAIR TABLE`](repair-table.html "15.7.3.5 REPAIR TABLE Statement"). The number of rows in
`ARCHIVE` tables reported by
[`SHOW TABLE STATUS`](show-table-status.html "15.7.7.39 SHOW TABLE STATUS Statement") is always accurate.
See [Section 15.7.3.4, “OPTIMIZE TABLE Statement”](optimize-table.html "15.7.3.4 OPTIMIZE TABLE Statement"),
[Section 15.7.3.5, “REPAIR TABLE Statement”](repair-table.html "15.7.3.5 REPAIR TABLE Statement"), and
[Section 15.7.7.39, “SHOW TABLE STATUS Statement”](show-table-status.html "15.7.7.39 SHOW TABLE STATUS Statement").

### Additional Resources

* A forum dedicated to the `ARCHIVE` storage
  engine is available at <https://forums.mysql.com/list.php?112>.