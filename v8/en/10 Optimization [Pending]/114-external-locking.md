--- title: MySQL 8.4 Reference Manual :: 10.11.5 External Locking url: https://dev.mysql.com/doc/refman/8.4/en/external-locking.html order: 114 ---



### 10.11.5 External Locking

External locking is the use of file system locking to manage contention for  `MyISAM` database tables by multiple processes. External locking is used in situations where a single process such as the MySQL server cannot be assumed to be the only process that requires access to tables. Here are some examples:

* If you run multiple servers that use the same database directory (not recommended), each server must have external locking enabled.
* If you use  `myisamchk` to perform table maintenance operations on `MyISAM` tables, you must either ensure that the server is not running, or that the server has external locking enabled so that it locks table files as necessary to coordinate with  `myisamchk` for access to the tables. The same is true for use of  `myisampack` to pack `MyISAM` tables.

  If the server is run with external locking enabled, you can use  `myisamchk` at any time for read operations such a checking tables. In this case, if the server tries to update a table that `myisamchk` is using, the server waits for `myisamchk` to finish before it continues.

  If you use  `myisamchk` for write operations such as repairing or optimizing tables, or if you use  `myisampack` to pack tables, you *must* always ensure that the `mysqld` server is not using the table. If you do not stop  `mysqld`, at least do a **mysqladmin flush-tables** before you run `myisamchk`. Your tables *may become corrupted* if the server and `myisamchk` access the tables simultaneously.

With external locking in effect, each process that requires access to a table acquires a file system lock for the table files before proceeding to access the table. If all necessary locks cannot be acquired, the process is blocked from accessing the table until the locks can be obtained (after the process that currently holds the locks releases them).

External locking affects server performance because the server must sometimes wait for other processes before it can access tables.

External locking is unnecessary if you run a single server to access a given data directory (which is the usual case) and if no other programs such as  `myisamchk` need to modify tables while the server is running. If you only *read* tables with other programs, external locking is not required, although  `myisamchk` might report warnings if the server changes tables while `myisamchk` is reading them.

With external locking disabled, to use `myisamchk`, you must either stop the server while  `myisamchk` executes or else lock and flush the tables before running  `myisamchk`. To avoid this requirement, use the [`CHECK TABLE`](check-table.html "15.7.3.2 CHECK TABLE Statement") and  `REPAIR TABLE` statements to check and repair `MyISAM` tables.

For  `mysqld`, external locking is controlled by the value of the `skip_external_locking` system variable. When this variable is enabled, external locking is disabled, and vice versa. External locking is disabled by default.

Use of external locking can be controlled at server startup by using the  `--external-locking` or `--skip-external-locking` option.

If you do use external locking option to enable updates to `MyISAM` tables from many MySQL processes, do not start the server with the `delay_key_write` system variable set to `ALL` or use the `DELAY_KEY_WRITE=1` table option for any shared tables. Otherwise, index corruption can occur.

The easiest way to satisfy this condition is to always use `--external-locking` together with `--delay-key-write=OFF`. (This is not done by default because in many setups it is useful to have a mixture of the preceding options.)


