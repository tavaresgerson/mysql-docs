--- title: MySQL 8.4 Reference Manual :: 9.6.1 Using myisamchk for Crash Recovery url: https://dev.mysql.com/doc/refman/8.4/en/myisam-crash-recovery.html order: 23 ---



### 9.6.1 Using myisamchk for Crash Recovery

This section describes how to check for and deal with data corruption in MySQL databases. If your tables become corrupted frequently, you should try to find the reason why. See Section B.3.3.3, “What to Do If MySQL Keeps Crashing”.

For an explanation of how `MyISAM` tables can become corrupted, see  Section 18.2.4, “MyISAM Table Problems”.

If you run  `mysqld` with external locking disabled (which is the default), you cannot reliably use `myisamchk` to check a table when `mysqld` is using the same table. If you can be certain that no one can access the tables using `mysqld` while you run `myisamchk`, you only have to execute **mysqladmin flush-tables** before you start checking the tables. If you cannot guarantee this, you must stop `mysqld` while you check the tables. If you run `myisamchk` to check tables that `mysqld` is updating at the same time, you may get a warning that a table is corrupt even when it is not.

If the server is run with external locking enabled, you can use `myisamchk` to check tables at any time. In this case, if the server tries to update a table that `myisamchk` is using, the server waits for `myisamchk` to finish before it continues.

If you use  `myisamchk` to repair or optimize tables, you *must* always ensure that the `mysqld` server is not using the table (this also applies if external locking is disabled). If you do not stop  `mysqld`, you should at least do a **mysqladmin flush-tables** before you run `myisamchk`. Your tables *may become corrupted* if the server and `myisamchk` access the tables simultaneously.

When performing crash recovery, it is important to understand that each `MyISAM` table *`tbl_name`* in a database corresponds to the three files in the database directory shown in the following table.

<table><col style="width: 20%"/><col style="width: 40%"/><thead><tr> <th>File</th> <th>Purpose</th> </tr></thead><tbody><tr> <td><code><em><code>tbl_name</code></em>.MYD</code></td> <td>Data file</td> </tr><tr> <td><code><em><code>tbl_name</code></em>.MYI</code></td> <td>Index file</td> </tr></tbody></table>

Each of these three file types is subject to corruption in various ways, but problems occur most often in data files and index files.

 `myisamchk` works by creating a copy of the `.MYD` data file row by row. It ends the repair stage by removing the old `.MYD` file and renaming the new file to the original file name. If you use `--quick`, `myisamchk` does not create a temporary `.MYD` file, but instead assumes that the `.MYD` file is correct and generates only a new index file without touching the `.MYD` file. This is safe, because  `myisamchk` automatically detects whether the `.MYD` file is corrupt and aborts the repair if it is. You can also specify the  `--quick` option twice to `myisamchk`. In this case, `myisamchk` does not abort on some errors (such as duplicate-key errors) but instead tries to resolve them by modifying the `.MYD` file. Normally the use of two  `--quick` options is useful only if you have too little free disk space to perform a normal repair. In this case, you should at least make a backup of the table before running  `myisamchk`.


