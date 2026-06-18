#### 10.12.2.2 Using Symbolic Links for MyISAM Tables on Unix

Note

Symbolic link support as described here, along with the
[`--symbolic-links`](server-options.html#option_mysqld_symbolic-links) option that
controls it, and is deprecated; expect these to be removed
in a future version of MySQL. In addition, the option is
disabled by default.

Symlinks are fully supported only for
`MyISAM` tables. For files used by tables for
other storage engines, you may get strange problems if you try
to use symbolic links. For `InnoDB` tables,
use the alternative technique explained in
[Section 17.6.1.2, “Creating Tables Externally”](innodb-create-table-external.html "17.6.1.2 Creating Tables Externally") instead.

Do not symlink tables on systems that do not have a fully
operational `realpath()` call. (Linux and
Solaris support `realpath()`). To determine
whether your system supports symbolic links, check the value
of the [`have_symlink`](server-system-variables.html#sysvar_have_symlink) system
variable using this statement:

```
SHOW VARIABLES LIKE 'have_symlink';
```

The handling of symbolic links for `MyISAM`
tables works as follows:

* In the data directory, you always have the data
  (`.MYD`) file and the index
  (`.MYI`) file. The data file and index
  file can be moved elsewhere and replaced in the data
  directory by symlinks.

* You can symlink the data file and the index file
  independently to different directories.

* To instruct a running MySQL server to perform the
  symlinking, use the `DATA DIRECTORY` and
  `INDEX DIRECTORY` options to
  [`CREATE TABLE`](create-table.html "15.1.20 CREATE TABLE Statement"). See
  [Section 15.1.20, “CREATE TABLE Statement”](create-table.html "15.1.20 CREATE TABLE Statement"). Alternatively, if
  [**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server") is not running, symlinking can
  be accomplished manually using **ln -s**
  from the command line.

  Note

  The path used with either or both of the `DATA
  DIRECTORY` and `INDEX
  DIRECTORY` options may not include the MySQL
  `data` directory. (Bug #32167)

* [**myisamchk**](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility") does not replace a symlink
  with the data file or index file. It works directly on the
  file to which the symlink points. Any temporary files are
  created in the directory where the data file or index file
  is located. The same is true for the
  [`ALTER TABLE`](alter-table.html "15.1.9 ALTER TABLE Statement"),
  [`OPTIMIZE TABLE`](optimize-table.html "15.7.3.4 OPTIMIZE TABLE Statement"), and
  [`REPAIR TABLE`](repair-table.html "15.7.3.5 REPAIR TABLE Statement") statements.

* Note

  When you drop a table that is using symlinks,
  *both the symlink and the file to which the
  symlink points are dropped*. This is an
  extremely good reason *not* to run
  [**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server") as the `root`
  operating system user or permit operating system users
  to have write access to MySQL database directories.

* If you rename a table with
  [`ALTER TABLE
  ... RENAME`](alter-table.html "15.1.9 ALTER TABLE Statement") or [`RENAME
  TABLE`](rename-table.html "15.1.36 RENAME TABLE Statement") and you do not move the table to another
  database, the symlinks in the database directory are
  renamed to the new names and the data file and index file
  are renamed accordingly.

* If you use
  [`ALTER TABLE
  ... RENAME`](alter-table.html "15.1.9 ALTER TABLE Statement") or [`RENAME
  TABLE`](rename-table.html "15.1.36 RENAME TABLE Statement") to move a table to another database, the
  table is moved to the other database directory. If the
  table name changed, the symlinks in the new database
  directory are renamed to the new names and the data file
  and index file are renamed accordingly.

* If you are not using symlinks, start
  [**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server") with the
  [`--skip-symbolic-links`](server-options.html#option_mysqld_symbolic-links)
  option to ensure that no one can use
  [**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server") to drop or rename a file outside
  of the data directory.

These table symlink operations are not supported:

* [`ALTER TABLE`](alter-table.html "15.1.9 ALTER TABLE Statement") ignores the
  `DATA DIRECTORY` and `INDEX
  DIRECTORY` table options.