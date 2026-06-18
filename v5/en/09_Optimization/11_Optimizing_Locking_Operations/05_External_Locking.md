### 8.11.5 External Locking

External locking is the use of file system locking to manage
contention for [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") database
tables by multiple processes. External locking is used in
situations where a single process such as the MySQL server
cannot be assumed to be the only process that requires access to
tables. Here are some examples:

* If you run multiple servers that use the same database
  directory (not recommended), each server must have external
  locking enabled.

* If you use [**myisamchk**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility") to perform table
  maintenance operations on
  [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") tables, you must either
  ensure that the server is not running, or that the server
  has external locking enabled so that it locks table files as
  necessary to coordinate with [**myisamchk**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility")
  for access to the tables. The same is true for use of
  [**myisampack**](myisampack.html "4.6.5 myisampack — Generate Compressed, Read-Only MyISAM Tables") to pack
  [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") tables.

  If the server is run with external locking enabled, you can
  use [**myisamchk**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility") at any time for read
  operations such a checking tables. In this case, if the
  server tries to update a table that
  [**myisamchk**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility") is using, the server waits for
  [**myisamchk**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility") to finish before it continues.

  If you use [**myisamchk**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility") for write operations
  such as repairing or optimizing tables, or if you use
  [**myisampack**](myisampack.html "4.6.5 myisampack — Generate Compressed, Read-Only MyISAM Tables") to pack tables, you
  *must* always ensure that the
  [`mysqld`](mysqld.html "4.3.1 mysqld — The MySQL Server") server is not using the table. If
  you do not stop [`mysqld`](mysqld.html "4.3.1 mysqld — The MySQL Server"), at least do a
  [**mysqladmin flush-tables**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") before you run
  [**myisamchk**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility"). Your tables *may
  become corrupted* if the server and
  [**myisamchk**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility") access the tables
  simultaneously.

With external locking in effect, each process that requires
access to a table acquires a file system lock for the table
files before proceeding to access the table. If all necessary
locks cannot be acquired, the process is blocked from accessing
the table until the locks can be obtained (after the process
that currently holds the locks releases them).

External locking affects server performance because the server
must sometimes wait for other processes before it can access
tables.

External locking is unnecessary if you run a single server to
access a given data directory (which is the usual case) and if
no other programs such as [**myisamchk**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility") need to
modify tables while the server is running. If you only
*read* tables with other programs, external
locking is not required, although [**myisamchk**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility")
might report warnings if the server changes tables while
[**myisamchk**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility") is reading them.

With external locking disabled, to use
[**myisamchk**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility"), you must either stop the server
while [**myisamchk**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility") executes or else lock and
flush the tables before running [**myisamchk**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility").
(See [Section 8.12.1, “System Factors”](system-optimization.html "8.12.1 System Factors").) To avoid this
requirement, use the [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement")
and [`REPAIR TABLE`](repair-table.html "13.7.2.5 REPAIR TABLE Statement") statements to
check and repair [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") tables.

For [`mysqld`](mysqld.html "4.3.1 mysqld — The MySQL Server"), external locking is controlled by
the value of the
[`skip_external_locking`](server-system-variables.html#sysvar_skip_external_locking) system
variable. When this variable is enabled, external locking is
disabled, and vice versa. External locking is disabled by
default.

Use of external locking can be controlled at server startup by
using the [`--external-locking`](server-options.html#option_mysqld_external-locking) or
[`--skip-external-locking`](server-options.html#option_mysqld_external-locking)
option.

If you do use external locking option to enable updates to
[`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") tables from many MySQL
processes, you must ensure that the following conditions are
satisfied:

* Do not use the query cache for queries that use tables that
  are updated by another process.

* Do not start the server with the
  [`delay_key_write`](server-system-variables.html#sysvar_delay_key_write) system
  variable set to `ALL` or use the
  `DELAY_KEY_WRITE=1` table option for any
  shared tables. Otherwise, index corruption can occur.

The easiest way to satisfy these conditions is to always use
[`--external-locking`](server-options.html#option_mysqld_external-locking) together with
[`--delay-key-write=OFF`](server-system-variables.html#sysvar_delay_key_write) and
[`--query-cache-size=0`](server-system-variables.html#sysvar_query_cache_size). (This is
not done by default because in many setups it is useful to have
a mixture of the preceding options.)