### 7.6.1 Using myisamchk for Crash Recovery

This section describes how to check for and deal with data
corruption in MySQL databases. If your tables become corrupted
frequently, you should try to find the reason why. See
[Section B.3.3.3, “What to Do If MySQL Keeps Crashing”](crashing.html "B.3.3.3 What to Do If MySQL Keeps Crashing").

For an explanation of how `MyISAM` tables can
become corrupted, see [Section 15.2.4, “MyISAM Table Problems”](myisam-table-problems.html "15.2.4 MyISAM Table Problems").

If you run [`mysqld`](mysqld.html "4.3.1 mysqld — The MySQL Server") with external locking
disabled (which is the default), you cannot reliably use
[**myisamchk**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility") to check a table when
[`mysqld`](mysqld.html "4.3.1 mysqld — The MySQL Server") is using the same table. If you can be
certain that no one can access the tables through
[`mysqld`](mysqld.html "4.3.1 mysqld — The MySQL Server") while you run
[**myisamchk**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility"), you have only to execute
[**mysqladmin flush-tables**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") before you start
checking the tables. If you cannot guarantee this, you must stop
[`mysqld`](mysqld.html "4.3.1 mysqld — The MySQL Server") while you check the tables. If you run
[**myisamchk**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility") to check tables that
[`mysqld`](mysqld.html "4.3.1 mysqld — The MySQL Server") is updating at the same time, you may
get a warning that a table is corrupt even when it is not.

If the server is run with external locking enabled, you can use
[**myisamchk**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility") to check tables at any time. In
this case, if the server tries to update a table that
[**myisamchk**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility") is using, the server waits for
[**myisamchk**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility") to finish before it continues.

If you use [**myisamchk**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility") to repair or optimize
tables, you *must* always ensure that the
[`mysqld`](mysqld.html "4.3.1 mysqld — The MySQL Server") server is not using the table (this
also applies if external locking is disabled). If you do not
stop [`mysqld`](mysqld.html "4.3.1 mysqld — The MySQL Server"), you should at least do a
[**mysqladmin flush-tables**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") before you run
[**myisamchk**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility"). Your tables *may become
corrupted* if the server and
[**myisamchk**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility") access the tables simultaneously.

When performing crash recovery, it is important to understand
that each `MyISAM` table
*`tbl_name`* in a database corresponds to
the three files in the database directory shown in the following
table.

<table summary="The three files in the database directory that correspond to each MyISAM table."><col style="width: 20%"/><col style="width: 40%"/><thead><tr>
<th>File</th>
<th>Purpose</th>
</tr></thead><tbody><tr>
<td><code><code>tbl_name</code>.frm</code></td>
<td>Definition (format) file</td>
</tr><tr>
<td><code><code>tbl_name</code>.MYD</code></td>
<td>Data file</td>
</tr><tr>
<td><code><code>tbl_name</code>.MYI</code></td>
<td>Index file</td>
</tr></tbody></table>

Each of these three file types is subject to corruption in
various ways, but problems occur most often in data files and
index files.

[**myisamchk**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility") works by creating a copy of the
`.MYD` data file row by row. It ends the
repair stage by removing the old `.MYD` file
and renaming the new file to the original file name. If you use
[`--quick`](myisamchk-repair-options.html#option_myisamchk_quick),
[**myisamchk**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility") does not create a temporary
`.MYD` file, but instead assumes that the
`.MYD` file is correct and generates only a
new index file without touching the `.MYD`
file. This is safe, because [**myisamchk**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility")
automatically detects whether the `.MYD` file
is corrupt and aborts the repair if it is. You can also specify
the [`--quick`](myisamchk-repair-options.html#option_myisamchk_quick) option twice to
[**myisamchk**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility"). In this case,
[**myisamchk**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility") does not abort on some errors (such
as duplicate-key errors) but instead tries to resolve them by
modifying the `.MYD` file. Normally the use
of two [`--quick`](myisamchk-repair-options.html#option_myisamchk_quick) options is
useful only if you have too little free disk space to perform a
normal repair. In this case, you should at least make a backup
of the table before running [**myisamchk**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility").