#### 16.4.1.11 Replication and DIRECTORY Table Options

If a `DATA DIRECTORY` or `INDEX DIRECTORY` table option is used in a [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") statement on the source server, the table option is also used on the replica. This can cause problems if no corresponding directory exists in the replica host's file system or if it exists but is not accessible to the replica server. This can be overridden by using the [`NO_DIR_IN_CREATE`](sql-mode.html#sqlmode_no_dir_in_create) server SQL mode on the replica, which causes the replica to ignore the `DATA DIRECTORY` and `INDEX DIRECTORY` table options when replicating [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") statements. The result is that `MyISAM` data and index files are created in the table's database directory.

For more information, see [Section 5.1.10, “Server SQL Modes”](sql-mode.html "5.1.10 Server SQL Modes").
