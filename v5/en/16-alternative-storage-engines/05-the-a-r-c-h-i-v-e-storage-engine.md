## 15.5 The ARCHIVE Storage Engine

The `ARCHIVE` storage engine produces special-purpose tables that store large amounts of unindexed data in a very small footprint.

**Table 15.5 ARCHIVE Storage Engine Features**

<table frame="box" rules="all" summary="Features supported by the ARCHIVE storage engine."><col style="width: 60%"/><col style="width: 40%"/><thead><tr><th>Feature</th> <th>Support</th> </tr></thead><tbody><tr><td><span class="bold"><strong>B-tree indexes</strong></span></td> <td>No</td> </tr><tr><td><span class="bold"><strong>Backup/point-in-time recovery</strong></span> (Implemented in the server, rather than in the storage engine.)</td> <td>Yes</td> </tr><tr><td><span class="bold"><strong>Cluster database support</strong></span></td> <td>No</td> </tr><tr><td><span class="bold"><strong>Clustered indexes</strong></span></td> <td>No</td> </tr><tr><td><span class="bold"><strong>Compressed data</strong></span></td> <td>Yes</td> </tr><tr><td><span class="bold"><strong>Data caches</strong></span></td> <td>No</td> </tr><tr><td><span class="bold"><strong>Encrypted data</strong></span></td> <td>Yes (Implemented in the server via encryption functions.)</td> </tr><tr><td><span class="bold"><strong>Foreign key support</strong></span></td> <td>No</td> </tr><tr><td><span class="bold"><strong>Full-text search indexes</strong></span></td> <td>No</td> </tr><tr><td><span class="bold"><strong>Geospatial data type support</strong></span></td> <td>Yes</td> </tr><tr><td><span class="bold"><strong>Geospatial indexing support</strong></span></td> <td>No</td> </tr><tr><td><span class="bold"><strong>Hash indexes</strong></span></td> <td>No</td> </tr><tr><td><span class="bold"><strong>Index caches</strong></span></td> <td>No</td> </tr><tr><td><span class="bold"><strong>Locking granularity</strong></span></td> <td>Row</td> </tr><tr><td><span class="bold"><strong>MVCC</strong></span></td> <td>No</td> </tr><tr><td><span class="bold"><strong>Replication support</strong></span> (Implemented in the server, rather than in the storage engine.)</td> <td>Yes</td> </tr><tr><td><span class="bold"><strong>Storage limits</strong></span></td> <td>None</td> </tr><tr><td><span class="bold"><strong>T-tree indexes</strong></span></td> <td>No</td> </tr><tr><td><span class="bold"><strong>Transactions</strong></span></td> <td>No</td> </tr><tr><td><span class="bold"><strong>Update statistics for data dictionary</strong></span></td> <td>Yes</td> </tr></tbody></table>

The `ARCHIVE` storage engine is included in MySQL binary distributions. To enable this storage engine if you build MySQL from source, invoke **CMake** with the `-DWITH_ARCHIVE_STORAGE_ENGINE` option.

To examine the source for the `ARCHIVE` engine, look in the `storage/archive` directory of a MySQL source distribution.

You can check whether the `ARCHIVE` storage engine is available with the `SHOW ENGINES` statement.

When you create an `ARCHIVE` table, the server creates a table format file in the database directory. The file begins with the table name and has an `.frm` extension. The storage engine creates other files, all having names beginning with the table name. The data file has an extension of `.ARZ`. An `.ARN` file may appear during optimization operations.

The `ARCHIVE` engine supports `INSERT`, `REPLACE`, and `SELECT`, but not `DELETE` or `UPDATE`. It does support `ORDER BY` operations, `BLOB` columns, and basically all data types including spatial data types (see Section 11.4.1, “Spatial Data Types”). Geographic spatial reference systems are not supported. The `ARCHIVE` engine uses row-level locking.

The `ARCHIVE` engine supports the `AUTO_INCREMENT` column attribute. The `AUTO_INCREMENT` column can have either a unique or nonunique index. Attempting to create an index on any other column results in an error. The `ARCHIVE` engine also supports the `AUTO_INCREMENT` table option in `CREATE TABLE` statements to specify the initial sequence value for a new table or reset the sequence value for an existing table, respectively.

`ARCHIVE` does not support inserting a value into an `AUTO_INCREMENT` column less than the current maximum column value. Attempts to do so result in an `ER_DUP_KEY` error.

The `ARCHIVE` engine ignores `BLOB` columns if they are not requested and scans past them while reading.

**Storage:** Rows are compressed as they are inserted. The `ARCHIVE` engine uses `zlib` lossless data compression (see <http://www.zlib.net/>). You can use `OPTIMIZE TABLE` to analyze the table and pack it into a smaller format (for a reason to use `OPTIMIZE TABLE`, see later in this section). The engine also supports `CHECK TABLE`. There are several types of insertions that are used:

* An `INSERT` statement just pushes rows into a compression buffer, and that buffer flushes as necessary. The insertion into the buffer is protected by a lock. A `SELECT` forces a flush to occur.

* A bulk insert is visible only after it completes, unless other inserts occur at the same time, in which case it can be seen partially. A `SELECT` never causes a flush of a bulk insert unless a normal insert occurs while it is loading.

**Retrieval**: On retrieval, rows are uncompressed on demand; there is no row cache. A `SELECT` operation performs a complete table scan: When a `SELECT` occurs, it finds out how many rows are currently available and reads that number of rows. `SELECT` is performed as a consistent read. Note that lots of `SELECT` statements during insertion can deteriorate the compression, unless only bulk or delayed inserts are used. To achieve better compression, you can use `OPTIMIZE TABLE` or `REPAIR TABLE`. The number of rows in `ARCHIVE` tables reported by `SHOW TABLE STATUS` is always accurate. See Section 13.7.2.4, “OPTIMIZE TABLE Statement”, Section 13.7.2.5, “REPAIR TABLE Statement”, and Section 13.7.5.36, “SHOW TABLE STATUS Statement”.

### Additional Resources

* A forum dedicated to the `ARCHIVE` storage engine is available at <https://forums.mysql.com/list.php?112>.
