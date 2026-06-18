### 9.6.5 Setting Up a MyISAM Table Maintenance Schedule

It is a good idea to perform table checks on a regular basis
rather than waiting for problems to occur. One way to check and
repair `MyISAM` tables is with the
[`CHECK TABLE`](check-table.html "15.7.3.2 CHECK TABLE Statement") and
[`REPAIR TABLE`](repair-table.html "15.7.3.5 REPAIR TABLE Statement") statements. See
[Section 15.7.3, “Table Maintenance Statements”](table-maintenance-statements.html "15.7.3 Table Maintenance Statements").

Another way to check tables is to use
[**myisamchk**](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility"). For maintenance purposes, you can
use [**myisamchk -s**](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility"). The `-s`
option (short for [`--silent`](myisamchk-general-options.html#option_myisamchk_silent))
causes [**myisamchk**](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility") to run in silent mode,
printing messages only when errors occur.

It is also a good idea to enable automatic
`MyISAM` table checking. For example, whenever
the machine has done a restart in the middle of an update, you
usually need to check each table that could have been affected
before it is used further. (These are “expected crashed
tables.”) To cause the server to check
`MyISAM` tables automatically, start it with
the [`myisam_recover_options`](server-system-variables.html#sysvar_myisam_recover_options)
system variable set. See
[Section 7.1.8, “Server System Variables”](server-system-variables.html "7.1.8 Server System Variables").

You should also check your tables regularly during normal system
operation. For example, you can run a **cron**
job to check important tables once a week, using a line like
this in a `crontab` file:

```
35 0 * * 0 /path/to/myisamchk --fast --silent /path/to/datadir/*/*.MYI
```

This prints out information about crashed tables so that you can
examine and repair them as necessary.

To start with, execute [**myisamchk -s**](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility") each
night on all tables that have been updated during the last 24
hours. As you see that problems occur infrequently, you can back
off the checking frequency to once a week or so.

Normally, MySQL tables need little maintenance. If you are
performing many updates to `MyISAM` tables with
dynamic-sized rows (tables with
[`VARCHAR`](char.html "13.3.2 The CHAR and VARCHAR Types"),
[`BLOB`](blob.html "13.3.4 The BLOB and TEXT Types"), or
[`TEXT`](blob.html "13.3.4 The BLOB and TEXT Types") columns) or have tables with
many deleted rows you may want to defragment/reclaim space from
the tables from time to time. You can do this by using
[`OPTIMIZE TABLE`](optimize-table.html "15.7.3.4 OPTIMIZE TABLE Statement") on the tables in
question. Alternatively, if you can stop the
[**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server") server for a while, change location
into the data directory and use this command while the server is
stopped:

```
$> myisamchk -r -s --sort-index --myisam_sort_buffer_size=16M */*.MYI
```