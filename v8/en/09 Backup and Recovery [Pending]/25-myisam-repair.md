--- title: MySQL 8.4 Reference Manual :: 9.6.3 How to Repair MyISAM Tables url: https://dev.mysql.com/doc/refman/8.4/en/myisam-repair.html order: 25 ---



### 9.6.3 How to Repair MyISAM Tables

The discussion in this section describes how to use `myisamchk` on `MyISAM` tables (extensions `.MYI` and `.MYD`).

You can also use the  `CHECK TABLE` and  `REPAIR TABLE` statements to check and repair `MyISAM` tables. See Section 15.7.3.2, “CHECK TABLE Statement”, and Section 15.7.3.5, “REPAIR TABLE Statement”.

Symptoms of corrupted tables include queries that abort unexpectedly and observable errors such as these:

* Can't find file `tbl_name.MYI` (Errcode: *`nnn`*)
* Unexpected end of file
* Record file is crashed
* Got error *`nnn`* from table handler

To get more information about the error, run **perror** *`nnn`*, where *`nnn`* is the error number. The following example shows how to use  **perror** to find the meanings for the most common error numbers that indicate a problem with a table:

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

For the other errors, you must repair your tables. `myisamchk` can usually detect and fix most problems that occur.

The repair process involves up to three stages, described here. Before you begin, you should change location to the database directory and check the permissions of the table files. On Unix, make sure that they are readable by the user that `mysqld` runs as (and to you, because you need to access the files you are checking). If it turns out you need to modify files, they must also be writable by you.

This section is for the cases where a table check fails (such as those described in  Section 9.6.2, “How to Check MyISAM Tables for Errors”), or you want to use the extended features that  `myisamchk` provides.

The  `myisamchk` options used for table maintenance with are described in  Section 6.6.4, “myisamchk — MyISAM Table-Maintenance Utility”. `myisamchk` also has variables that you can set to control memory allocation that may improve performance. See Section 6.6.4.6, “myisamchk Memory Usage”.

If you are going to repair a table from the command line, you must first stop the  `mysqld` server. Note that when you do  **mysqladmin shutdown** on a remote server, the  `mysqld` server is still available for a while after  `mysqladmin` returns, until all statement-processing has stopped and all index changes have been flushed to disk.

**Stage 1: Checking your tables**

Run  **myisamchk \*.MYI** or [**myisamchk -e \*.MYI**](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility") if you have more time. Use the `-s` (silent) option to suppress unnecessary information.

If the  `mysqld` server is stopped, you should use the  `--update-state` option to tell  `myisamchk` to mark the table as “checked.”

You have to repair only those tables for which `myisamchk` announces an error. For such tables, proceed to Stage 2.

If you get unexpected errors when checking (such as `out of memory` errors), or if  `myisamchk` crashes, go to Stage 3.

**Stage 2: Easy safe repair**

First, try [**myisamchk -r -q *`tbl_name`***](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility") (`-r -q` means “quick recovery mode”). This attempts to repair the index file without touching the data file. If the data file contains everything that it should and the delete links point at the correct locations within the data file, this should work, and the table is fixed. Start repairing the next table. Otherwise, use the following procedure:

1. Make a backup of the data file before continuing.
2. Use [**myisamchk -r *`tbl_name`***](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility") (`-r` means “recovery mode”). This removes incorrect rows and deleted rows from the data file and reconstructs the index file.
3. If the preceding step fails, use [**myisamchk --safe-recover *`tbl_name`***](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility"). Safe recovery mode uses an old recovery method that handles a few cases that regular recovery mode does not (but is slower). ::: info Note

If you want a repair operation to go much faster, you should set the values of the `sort_buffer_size` and `key_buffer_size` variables each to about 25% of your available memory when running `myisamchk`.


:::

If you get unexpected errors when repairing (such as `out of memory` errors), or if `myisamchk` crashes, go to Stage 3.

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
3. Copy the old data file back onto the newly created data file. (Do not just move the old file back onto the new file. You want to retain a copy in case something goes wrong.) Important

If you are using replication, you should stop it prior to performing the above procedure, since it involves file system operations, and these are not logged by MySQL.

Go back to Stage 2.  **myisamchk -r -q** should work. (This should not be an endless loop.)

You can also use the `REPAIR TABLE tbl_name USE_FRM` SQL statement, which performs the whole procedure automatically. There is also no possibility of unwanted interaction between a utility and the server, because the server does all the work when you use  `REPAIR TABLE`. See Section 15.7.3.5, “REPAIR TABLE Statement”.


