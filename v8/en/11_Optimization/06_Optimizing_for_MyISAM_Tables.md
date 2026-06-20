## 10.6 Optimizing for MyISAM Tables

The `MyISAM` storage engine performs best with read-mostly data or with low-concurrency operations, because table locks limit the ability to perform simultaneous updates. In MySQL, `InnoDB` is the default storage engine rather than `MyISAM`.


### 10.6.1 Optimizing MyISAM Queries

Some general tips for speeding up queries on `MyISAM` tables:

* To help MySQL better optimize queries, use `ANALYZE TABLE` or run **myisamchk --analyze** on a table after it has been loaded with data. This updates a value for each index part that indicates the average number of rows that have the same value. (For unique indexes, this is always 1.) MySQL uses this to decide which index to choose when you join two tables based on a nonconstant expression. You can check the result from the table analysis by using `SHOW INDEX FROM tbl_name` and examining the `Cardinality` value. [**myisamchk --description --verbose**](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility") shows index distribution information.

* To sort an index and data according to an index, use **myisamchk --sort-index --sort-records=1** (assuming that you want to sort on index 1). This is a good way to make queries faster if you have a unique index from which you want to read all rows in order according to the index. The first time you sort a large table this way, it may take a long time.

* Try to avoid complex `SELECT` queries on `MyISAM` tables that are updated frequently, to avoid problems with table locking that occur due to contention between readers and writers.

* `MyISAM` supports concurrent inserts: If a table has no free blocks in the middle of the data file, you can `INSERT` new rows into it at the same time that other threads are reading from the table. If it is important to be able to do this, consider using the table in ways that avoid deleting rows. Another possibility is to run [`OPTIMIZE TABLE`](optimize-table.html "15.7.3.4 OPTIMIZE TABLE Statement") to defragment the table after you have deleted a lot of rows from it. This behavior is altered by setting the `concurrent_insert` variable. You can force new rows to be appended (and therefore permit concurrent inserts), even in tables that have deleted rows. See Section 10.11.3, “Concurrent Inserts”.

* For `MyISAM` tables that change frequently, try to avoid all variable-length columns (`VARCHAR`, `BLOB`, and `TEXT`). The table uses dynamic row format if it includes even a single variable-length column. See Chapter 18, *Alternative Storage Engines*.

* It is normally not useful to split a table into different tables just because the rows become large. In accessing a row, the biggest performance hit is the disk seek needed to find the first byte of the row. After finding the data, most modern disks can read the entire row fast enough for most applications. The only cases where splitting up a table makes an appreciable difference is if it is a `MyISAM` table using dynamic row format that you can change to a fixed row size, or if you very often need to scan the table but do not need most of the columns. See Chapter 18, *Alternative Storage Engines*.

* Use `ALTER TABLE ... ORDER BY expr1, expr2, ...` if you usually retrieve rows in `expr1, expr2, ...` order. By using this option after extensive changes to the table, you may be able to get higher performance.

* If you often need to calculate results such as counts based on information from a lot of rows, it may be preferable to introduce a new table and update the counter in real time. An update of the following form is very fast:

  ```
  UPDATE tbl_name SET count_col=count_col+1 WHERE key_col=constant;
  ```

  This is very important when you use MySQL storage engines such as `MyISAM` that has only table-level locking (multiple readers with single writers). This also gives better performance with most database systems, because the row locking manager in this case has less to do.

* Use `OPTIMIZE TABLE` periodically to avoid fragmentation with dynamic-format `MyISAM` tables. See Section 18.2.3, “MyISAM Table Storage Formats”.

* Declaring a `MyISAM` table with the `DELAY_KEY_WRITE=1` table option makes index updates faster because they are not flushed to disk until the table is closed. The downside is that if something kills the server while such a table is open, you must ensure that the table is okay by running the server with the `myisam_recover_options` system variable set, or by running **myisamchk** before restarting the server. (However, even in this case, you should not lose anything by using `DELAY_KEY_WRITE`, because the key information can always be generated from the data rows.)

* Strings are automatically prefix- and end-space compressed in `MyISAM` indexes. See Section 15.1.15, “CREATE INDEX Statement”.

* You can increase performance by caching queries or answers in your application and then executing many inserts or updates together. Locking the table during this operation ensures that the index cache is only flushed once after all updates.


### 10.6.2 Bulk Data Loading for MyISAM Tables

These performance tips supplement the general guidelines for fast inserts in Section 10.2.5.1, “Optimizing INSERT Statements”.

* For a `MyISAM` table, you can use concurrent inserts to add rows at the same time that `SELECT` statements are running, if there are no deleted rows in middle of the data file. See Section 10.11.3, “Concurrent Inserts”.

* With some extra work, it is possible to make `LOAD DATA` run even faster for a `MyISAM` table when the table has many indexes. Use the following procedure:

  1. Execute a `FLUSH TABLES` statement or a [**mysqladmin flush-tables**](mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program") command.

  2. Use [**myisamchk --keys-used=0 -rq *`/path/to/db/tbl_name`***](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility") to remove all use of indexes for the table.

  3. Insert data into the table with `LOAD DATA`. This does not update any indexes and therefore is very fast.

  4. If you intend only to read from the table in the future, use **myisampack** to compress it. See Section 18.2.3.3, “Compressed Table Characteristics”.

  5. Re-create the indexes with [**myisamchk -rq *`/path/to/db/tbl_name`***](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility"). This creates the index tree in memory before writing it to disk, which is much faster than updating the index during `LOAD DATA` because it avoids lots of disk seeks. The resulting index tree is also perfectly balanced.

  6. Execute a `FLUSH TABLES` statement or a [**mysqladmin flush-tables**](mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program") command.

  `LOAD DATA` performs the preceding optimization automatically if the `MyISAM` table into which you insert data is empty. The main difference between automatic optimization and using the procedure explicitly is that you can let **myisamchk** allocate much more temporary memory for the index creation than you might want the server to allocate for index re-creation when it executes the `LOAD DATA` statement.

  You can also disable or enable the nonunique indexes for a `MyISAM` table by using the following statements rather than **myisamchk**. If you use these statements, you can skip the `FLUSH TABLES` operations:

  ```
  ALTER TABLE tbl_name DISABLE KEYS;
  ALTER TABLE tbl_name ENABLE KEYS;
  ```

* To speed up `INSERT` operations that are performed with multiple statements for nontransactional tables, lock your tables:

  ```
  LOCK TABLES a WRITE;
  INSERT INTO a VALUES (1,23),(2,34),(4,33);
  INSERT INTO a VALUES (8,26),(6,29);
  ...
  UNLOCK TABLES;
  ```

  This benefits performance because the index buffer is flushed to disk only once, after all `INSERT` statements have completed. Normally, there would be as many index buffer flushes as there are `INSERT` statements. Explicit locking statements are not needed if you can insert all rows with a single `INSERT`.

  Locking also lowers the total time for multiple-connection tests, although the maximum wait time for individual connections might go up because they wait for locks. Suppose that five clients attempt to perform inserts simultaneously as follows:

  + Connection 1 does 1000 inserts
  + Connections 2, 3, and 4 do 1 insert
  + Connection 5 does 1000 inserts

  If you do not use locking, connections 2, 3, and 4 finish before 1 and 5. If you use locking, connections 2, 3, and 4 probably do not finish before 1 or 5, but the total time should be about 40% faster.

  `INSERT`, `UPDATE`, and `DELETE` operations are very fast in MySQL, but you can obtain better overall performance by adding locks around everything that does more than about five successive inserts or updates. If you do very many successive inserts, you could do a [`LOCK TABLES`](lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements") followed by an [`UNLOCK TABLES`](lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements") once in a while (each 1,000 rows or so) to permit other threads to access table. This would still result in a nice performance gain.

  `INSERT` is still much slower for loading data than [`LOAD DATA`](load-data.html "15.2.9 LOAD DATA Statement"), even when using the strategies just outlined.

* To increase performance for `MyISAM` tables, for both `LOAD DATA` and `INSERT`, enlarge the key cache by increasing the `key_buffer_size` system variable. See Section 7.1.1, “Configuring the Server”.


### 10.6.3 Optimizing REPAIR TABLE Statements

`REPAIR TABLE` for `MyISAM` tables is similar to using **myisamchk** for repair operations, and some of the same performance optimizations apply:

* **myisamchk** has variables that control memory allocation. You may be able to its improve performance by setting these variables, as described in Section 6.6.4.6, “myisamchk Memory Usage”.

* For `REPAIR TABLE`, the same principle applies, but because the repair is done by the server, you set server system variables instead of **myisamchk** variables. Also, in addition to setting memory-allocation variables, increasing the `myisam_max_sort_file_size` system variable increases the likelihood that the repair uses the faster filesort method and avoids the slower repair by key cache method. Set the variable to the maximum file size for your system, after checking to be sure that there is enough free space to hold a copy of the table files. The free space must be available in the file system containing the original table files.

Suppose that a **myisamchk** table-repair operation is done using the following options to set its memory-allocation variables:

```
--key_buffer_size=128M --myisam_sort_buffer_size=256M
--read_buffer_size=64M --write_buffer_size=64M
```

Some of those **myisamchk** variables correspond to server system variables:

<table summary="myisamchk variables and corresponding server system variables."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>myisamchk Variable</th> <th>System Variable</th> </tr></thead><tbody><tr> <td><code>key_buffer_size</code></td> <td><code>key_buffer_size</code></td> </tr><tr> <td><code>myisam_sort_buffer_size</code></td> <td><code>myisam_sort_buffer_size</code></td> </tr><tr> <td><code>read_buffer_size</code></td> <td><code>read_buffer_size</code></td> </tr><tr> <td><code>write_buffer_size</code></td> <td>none</td> </tr></tbody></table>

Each of the server system variables can be set at runtime, and some of them (`myisam_sort_buffer_size`, `read_buffer_size`) have a session value in addition to a global value. Setting a session value limits the effect of the change to your current session and does not affect other users. Changing a global-only variable (`key_buffer_size`, `myisam_max_sort_file_size`) affects other users as well. For `key_buffer_size`, you must take into account that the buffer is shared with those users. For example, if you set the **myisamchk** `key_buffer_size` variable to 128MB, you could set the corresponding `key_buffer_size` system variable larger than that (if it is not already set larger), to permit key buffer use by activity in other sessions. However, changing the global key buffer size invalidates the buffer, causing increased disk I/O and slowdown for other sessions. An alternative that avoids this problem is to use a separate key cache, assign to it the indexes from the table to be repaired, and deallocate it when the repair is complete. See Section 10.10.2.2, “Multiple Key Caches”.

Based on the preceding remarks, a [`REPAIR TABLE`](repair-table.html "15.7.3.5 REPAIR TABLE Statement") operation can be done as follows to use settings similar to the **myisamchk** command. Here a separate 128MB key buffer is allocated and the file system is assumed to permit a file size of at least 100GB.

```
SET SESSION myisam_sort_buffer_size = 256*1024*1024;
SET SESSION read_buffer_size = 64*1024*1024;
SET GLOBAL myisam_max_sort_file_size = 100*1024*1024*1024;
SET GLOBAL repair_cache.key_buffer_size = 128*1024*1024;
CACHE INDEX tbl_name IN repair_cache;
LOAD INDEX INTO CACHE tbl_name;
REPAIR TABLE tbl_name ;
SET GLOBAL repair_cache.key_buffer_size = 0;
```

If you intend to change a global variable but want to do so only for the duration of a [`REPAIR TABLE`](repair-table.html "15.7.3.5 REPAIR TABLE Statement") operation to minimally affect other users, save its value in a user variable and restore it afterward. For example:

```
SET @old_myisam_sort_buffer_size = @@GLOBAL.myisam_max_sort_file_size;
SET GLOBAL myisam_max_sort_file_size = 100*1024*1024*1024;
REPAIR TABLE tbl_name ;
SET GLOBAL myisam_max_sort_file_size = @old_myisam_max_sort_file_size;
```

The system variables that affect [`REPAIR TABLE`](repair-table.html "15.7.3.5 REPAIR TABLE Statement") can be set globally at server startup if you want the values to be in effect by default. For example, add these lines to the server `my.cnf` file:

```
[mysqld]
myisam_sort_buffer_size=256M
key_buffer_size=1G
myisam_max_sort_file_size=100G
```

These settings do not include `read_buffer_size`. Setting `read_buffer_size` globally to a large value does so for all sessions and can cause performance to suffer due to excessive memory allocation for a server with many simultaneous sessions.
