### 10.6.2 Bulk Data Loading for MyISAM Tables

These performance tips supplement the general guidelines for fast inserts in Section 10.2.5.1, “Optimizing INSERT Statements”.

* For a `MyISAM` table, you can use concurrent inserts to add rows at the same time that `SELECT` statements are running, if there are no deleted rows in middle of the data file. See Section 10.11.3, “Concurrent Inserts”.

* With some extra work, it is possible to make `LOAD DATA` run even faster for a `MyISAM` table when the table has many indexes. Use the following procedure:

  1. Execute a `FLUSH TABLES` statement or a **mysqladmin flush-tables** command.

  2. Use **myisamchk --keys-used=0 -rq *`/path/to/db/tbl_name`*** to remove all use of indexes for the table.

  3. Insert data into the table with `LOAD DATA`. This does not update any indexes and therefore is very fast.

  4. If you intend only to read from the table in the future, use **myisampack** to compress it. See Section 18.2.3.3, “Compressed Table Characteristics”.

  5. Re-create the indexes with **myisamchk -rq *`/path/to/db/tbl_name`***. This creates the index tree in memory before writing it to disk, which is much faster than updating the index during `LOAD DATA` because it avoids lots of disk seeks. The resulting index tree is also perfectly balanced.

  6. Execute a `FLUSH TABLES` statement or a **mysqladmin flush-tables** command.

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

  `INSERT`, `UPDATE`, and `DELETE` operations are very fast in MySQL, but you can obtain better overall performance by adding locks around everything that does more than about five successive inserts or updates. If you do very many successive inserts, you could do a `LOCK TABLES` followed by an `UNLOCK TABLES` once in a while (each 1,000 rows or so) to permit other threads to access table. This would still result in a nice performance gain.

  `INSERT` is still much slower for loading data than `LOAD DATA`, even when using the strategies just outlined.

* To increase performance for `MyISAM` tables, for both `LOAD DATA` and `INSERT`, enlarge the key cache by increasing the `key_buffer_size` system variable. See Section 7.1.1, “Configuring the Server”.
