## 9.6 MyISAM Table Maintenance and Crash Recovery

This section discusses how to use **myisamchk** to check or repair `MyISAM` tables (tables that have `.MYD` and `.MYI` files for storing data and indexes). For general **myisamchk** background, see Section 6.6.4, “myisamchk — MyISAM Table-Maintenance Utility”. Other table-repair information can be found at Section 3.14, “Rebuilding or Repairing Tables or Indexes”.

You can use **myisamchk** to check, repair, or optimize database tables. The following sections describe how to perform these operations and how to set up a table maintenance schedule. For information about using **myisamchk** to get information about your tables, see Section 6.6.4.5, “Obtaining Table Information with myisamchk”.

Even though table repair with **myisamchk** is quite secure, it is always a good idea to make a backup *before* doing a repair or any maintenance operation that could make a lot of changes to a table.

**myisamchk** operations that affect indexes can cause `MyISAM` `FULLTEXT` indexes to be rebuilt with full-text parameters that are incompatible with the values used by the MySQL server. To avoid this problem, follow the guidelines in Section 6.6.4.1, “myisamchk General Options”.

`MyISAM` table maintenance can also be done using the SQL statements that perform operations similar to what **myisamchk** can do:

* To check `MyISAM` tables, use `CHECK TABLE`.

* To repair `MyISAM` tables, use `REPAIR TABLE`.

* To optimize `MyISAM` tables, use `OPTIMIZE TABLE`.

* To analyze `MyISAM` tables, use `ANALYZE TABLE`.

For additional information about these statements, see Section 15.7.3, “Table Maintenance Statements”.

These statements can be used directly or by means of the **mysqlcheck** client program. One advantage of these statements over **myisamchk** is that the server does all the work. With **myisamchk**, you must make sure that the server does not use the tables at the same time so that there is no unwanted interaction between **myisamchk** and the server.


### 9.6.1 Using myisamchk for Crash Recovery

This section describes how to check for and deal with data corruption in MySQL databases. If your tables become corrupted frequently, you should try to find the reason why. See Section B.3.3.3, “What to Do If MySQL Keeps Crashing”.

For an explanation of how `MyISAM` tables can become corrupted, see Section 18.2.4, “MyISAM Table Problems”.

If you run **mysqld** with external locking disabled (which is the default), you cannot reliably use **myisamchk** to check a table when **mysqld** is using the same table. If you can be certain that no one can access the tables using **mysqld** while you run **myisamchk**, you only have to execute **mysqladmin flush-tables** before you start checking the tables. If you cannot guarantee this, you must stop **mysqld** while you check the tables. If you run **myisamchk** to check tables that **mysqld** is updating at the same time, you may get a warning that a table is corrupt even when it is not.

If the server is run with external locking enabled, you can use **myisamchk** to check tables at any time. In this case, if the server tries to update a table that **myisamchk** is using, the server waits for **myisamchk** to finish before it continues.

If you use **myisamchk** to repair or optimize tables, you *must* always ensure that the **mysqld** server is not using the table (this also applies if external locking is disabled). If you do not stop **mysqld**, you should at least do a **mysqladmin flush-tables** before you run **myisamchk**. Your tables *may become corrupted* if the server and **myisamchk** access the tables simultaneously.

When performing crash recovery, it is important to understand that each `MyISAM` table *`tbl_name`* in a database corresponds to the three files in the database directory shown in the following table.

<table summary="The two files in the database directory that correspond to each MyISAM table."><col style="width: 20%"/><col style="width: 40%"/><thead><tr> <th>File</th> <th>Purpose</th> </tr></thead><tbody><tr> <td><code class="filename"><em class="replaceable"><code>tbl_name</code></em>.MYD</code></td> <td>Data file</td> </tr><tr> <td><code class="filename"><em class="replaceable"><code>tbl_name</code></em>.MYI</code></td> <td>Index file</td> </tr></tbody></table>

Each of these three file types is subject to corruption in various ways, but problems occur most often in data files and index files.

**myisamchk** works by creating a copy of the `.MYD` data file row by row. It ends the repair stage by removing the old `.MYD` file and renaming the new file to the original file name. If you use `--quick`, **myisamchk** does not create a temporary `.MYD` file, but instead assumes that the `.MYD` file is correct and generates only a new index file without touching the `.MYD` file. This is safe, because **myisamchk** automatically detects whether the `.MYD` file is corrupt and aborts the repair if it is. You can also specify the `--quick` option twice to **myisamchk**. In this case, **myisamchk** does not abort on some errors (such as duplicate-key errors) but instead tries to resolve them by modifying the `.MYD` file. Normally the use of two `--quick` options is useful only if you have too little free disk space to perform a normal repair. In this case, you should at least make a backup of the table before running **myisamchk**.


### 9.6.2 How to Check MyISAM Tables for Errors

To check a `MyISAM` table, use the following commands:

* [**myisamchk *`tbl_name`***](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility")

  This finds 99.99% of all errors. What it cannot find is corruption that involves *only* the data file (which is very unusual). If you want to check a table, you should normally run **myisamchk** without options or with the `-s` (silent) option.

* [**myisamchk -m *`tbl_name`***](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility")

  This finds 99.999% of all errors. It first checks all index entries for errors and then reads through all rows. It calculates a checksum for all key values in the rows and verifies that the checksum matches the checksum for the keys in the index tree.

* [**myisamchk -e *`tbl_name`***](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility")

  This does a complete and thorough check of all data (`-e` means “extended check”). It does a check-read of every key for each row to verify that they indeed point to the correct row. This may take a long time for a large table that has many indexes. Normally, **myisamchk** stops after the first error it finds. If you want to obtain more information, you can add the `-v` (verbose) option. This causes **myisamchk** to keep going, up through a maximum of 20 errors.

* [**myisamchk -e -i *`tbl_name`***](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility")

  This is like the previous command, but the `-i` option tells **myisamchk** to print additional statistical information.

In most cases, a simple **myisamchk** command with no arguments other than the table name is sufficient to check a table.


### 9.6.3 How to Repair MyISAM Tables

The discussion in this section describes how to use **myisamchk** on `MyISAM` tables (extensions `.MYI` and `.MYD`).

You can also use the `CHECK TABLE` and `REPAIR TABLE` statements to check and repair `MyISAM` tables. See Section 15.7.3.2, “CHECK TABLE Statement”, and Section 15.7.3.5, “REPAIR TABLE Statement”.

Symptoms of corrupted tables include queries that abort unexpectedly and observable errors such as these:

* Can't find file `tbl_name.MYI` (Errcode: *`nnn`*)

* Unexpected end of file
* Record file is crashed
* Got error *`nnn`* from table handler

To get more information about the error, run **perror** *`nnn`*, where *`nnn`* is the error number. The following example shows how to use **perror** to find the meanings for the most common error numbers that indicate a problem with a table:

```
$> perror 126 127 132 134 135 136 141 144 145
MySQL error code 126 = Index file is crashed
MySQL error code 127 = Record-file is crashed
MySQL error code 132 = Old database file
MySQL error code 134 = Record was already deleted (or record file crashed)
MySQL error code 135 = No more room in record file
MySQL error code 136 = No more room in index file
MySQL error code 141 = Duplicate unique key or constraint on write or update
MySQL error code 144 = Table is crashed and last repair failed
MySQL error code 145 = Table was marked as crashed and should be repaired
```

Note that error 135 (no more room in record file) and error 136 (no more room in index file) are not errors that can be fixed by a simple repair. In this case, you must use `ALTER TABLE` to increase the `MAX_ROWS` and `AVG_ROW_LENGTH` table option values:

```
ALTER TABLE tbl_name MAX_ROWS=xxx AVG_ROW_LENGTH=yyy;
```

If you do not know the current table option values, use `SHOW CREATE TABLE`.

For the other errors, you must repair your tables. **myisamchk** can usually detect and fix most problems that occur.

The repair process involves up to three stages, described here. Before you begin, you should change location to the database directory and check the permissions of the table files. On Unix, make sure that they are readable by the user that **mysqld** runs as (and to you, because you need to access the files you are checking). If it turns out you need to modify files, they must also be writable by you.

This section is for the cases where a table check fails (such as those described in Section 9.6.2, “How to Check MyISAM Tables for Errors”), or you want to use the extended features that **myisamchk** provides.

The **myisamchk** options used for table maintenance with are described in Section 6.6.4, “myisamchk — MyISAM Table-Maintenance Utility”. **myisamchk** also has variables that you can set to control memory allocation that may improve performance. See Section 6.6.4.6, “myisamchk Memory Usage”.

If you are going to repair a table from the command line, you must first stop the **mysqld** server. Note that when you do **mysqladmin shutdown** on a remote server, the **mysqld** server is still available for a while after **mysqladmin** returns, until all statement-processing has stopped and all index changes have been flushed to disk.

**Stage 1: Checking your tables**

Run **myisamchk \*.MYI** or [**myisamchk -e \*.MYI**](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility") if you have more time. Use the `-s` (silent) option to suppress unnecessary information.

If the **mysqld** server is stopped, you should use the `--update-state` option to tell **myisamchk** to mark the table as “checked.”

You have to repair only those tables for which **myisamchk** announces an error. For such tables, proceed to Stage 2.

If you get unexpected errors when checking (such as `out of memory` errors), or if **myisamchk** crashes, go to Stage 3.

**Stage 2: Easy safe repair**

First, try [**myisamchk -r -q *`tbl_name`***](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility") (`-r -q` means “quick recovery mode”). This attempts to repair the index file without touching the data file. If the data file contains everything that it should and the delete links point at the correct locations within the data file, this should work, and the table is fixed. Start repairing the next table. Otherwise, use the following procedure:

1. Make a backup of the data file before continuing.
2. Use [**myisamchk -r *`tbl_name`***](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility") (`-r` means “recovery mode”). This removes incorrect rows and deleted rows from the data file and reconstructs the index file.

3. If the preceding step fails, use [**myisamchk --safe-recover *`tbl_name`***](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility"). Safe recovery mode uses an old recovery method that handles a few cases that regular recovery mode does not (but is slower).

Note

If you want a repair operation to go much faster, you should set the values of the `sort_buffer_size` and `key_buffer_size` variables each to about 25% of your available memory when running **myisamchk**.

If you get unexpected errors when repairing (such as `out of memory` errors), or if **myisamchk** crashes, go to Stage 3.

**Stage 3: Difficult repair**

You should reach this stage only if the first 16KB block in the index file is destroyed or contains incorrect information, or if the index file is missing. In this case, it is necessary to create a new index file. Do so as follows:

1. Move the data file to a safe place.
2. Use the table description file to create new (empty) data and index files:

   ```
   $> mysql db_name
   ```

   ```
   mysql> SET autocommit=1;
   mysql> TRUNCATE TABLE tbl_name;
   mysql> quit
   ```

3. Copy the old data file back onto the newly created data file. (Do not just move the old file back onto the new file. You want to retain a copy in case something goes wrong.)

Important

If you are using replication, you should stop it prior to performing the above procedure, since it involves file system operations, and these are not logged by MySQL.

Go back to Stage 2. **myisamchk -r -q** should work. (This should not be an endless loop.)

You can also use the `REPAIR TABLE tbl_name USE_FRM` SQL statement, which performs the whole procedure automatically. There is also no possibility of unwanted interaction between a utility and the server, because the server does all the work when you use `REPAIR TABLE`. See Section 15.7.3.5, “REPAIR TABLE Statement”.


### 9.6.4 MyISAM Table Optimization

To coalesce fragmented rows and eliminate wasted space that results from deleting or updating rows, run **myisamchk** in recovery mode:

```
$> myisamchk -r tbl_name
```

You can optimize a table in the same way by using the `OPTIMIZE TABLE` SQL statement. `OPTIMIZE TABLE` does a table repair and a key analysis, and also sorts the index tree so that key lookups are faster. There is also no possibility of unwanted interaction between a utility and the server, because the server does all the work when you use [`OPTIMIZE TABLE`](optimize-table.html "15.7.3.4 OPTIMIZE TABLE Statement"). See Section 15.7.3.4, “OPTIMIZE TABLE Statement”.

**myisamchk** has a number of other options that you can use to improve the performance of a table:

* `--analyze` or `-a`: Perform key distribution analysis. This improves join performance by enabling the join optimizer to better choose the order in which to join the tables and which indexes it should use.

* `--sort-index` or `-S`: Sort the index blocks. This optimizes seeks and makes table scans that use indexes faster.

* `--sort-records=index_num` or `-R index_num`: Sort data rows according to a given index. This makes your data much more localized and may speed up range-based `SELECT` and `ORDER BY` operations that use this index.

For a full description of all available options, see Section 6.6.4, “myisamchk — MyISAM Table-Maintenance Utility”.


### 9.6.5 Setting Up a MyISAM Table Maintenance Schedule

It is a good idea to perform table checks on a regular basis rather than waiting for problems to occur. One way to check and repair `MyISAM` tables is with the `CHECK TABLE` and `REPAIR TABLE` statements. See Section 15.7.3, “Table Maintenance Statements”.

Another way to check tables is to use **myisamchk**. For maintenance purposes, you can use **myisamchk -s**. The `-s` option (short for `--silent`) causes **myisamchk** to run in silent mode, printing messages only when errors occur.

It is also a good idea to enable automatic `MyISAM` table checking. For example, whenever the machine has done a restart in the middle of an update, you usually need to check each table that could have been affected before it is used further. (These are “expected crashed tables.”) To cause the server to check `MyISAM` tables automatically, start it with the `myisam_recover_options` system variable set. See Section 7.1.8, “Server System Variables”.

You should also check your tables regularly during normal system operation. For example, you can run a **cron** job to check important tables once a week, using a line like this in a `crontab` file:

```
35 0 * * 0 /path/to/myisamchk --fast --silent /path/to/datadir/*/*.MYI
```

This prints out information about crashed tables so that you can examine and repair them as necessary.

To start with, execute **myisamchk -s** each night on all tables that have been updated during the last 24 hours. As you see that problems occur infrequently, you can back off the checking frequency to once a week or so.

Normally, MySQL tables need little maintenance. If you are performing many updates to `MyISAM` tables with dynamic-sized rows (tables with `VARCHAR`, `BLOB`, or `TEXT` columns) or have tables with many deleted rows you may want to defragment/reclaim space from the tables from time to time. You can do this by using `OPTIMIZE TABLE` on the tables in question. Alternatively, if you can stop the **mysqld** server for a while, change location into the data directory and use this command while the server is stopped:

```
$> myisamchk -r -s --sort-index --myisam_sort_buffer_size=16M */*.MYI
```
