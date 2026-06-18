## 7.2 Database Backup Methods

This section summarizes some general methods for making backups.

### Making a Hot Backup with MySQL Enterprise Backup

Customers of MySQL Enterprise Edition can use the
[MySQL Enterprise Backup](glossary.html#glos_mysql_enterprise_backup "MySQL Enterprise Backup") product
to do [physical](glossary.html#glos_physical "physical") backups of
entire instances or selected databases, tables, or both. This
product includes features for
[incremental](glossary.html#glos_incremental_backup "incremental backup") and
[compressed](glossary.html#glos_compressed_backup "compressed backup") backups.
Backing up the physical database files makes restore much faster
than logical techniques such as the `mysqldump`
command. `InnoDB` tables are copied using a
[hot backup](glossary.html#glos_hot_backup "hot backup") mechanism.
(Ideally, the `InnoDB` tables should represent a
substantial majority of the data.) Tables from other storage
engines are copied using a [warm
backup](glossary.html#glos_warm_backup "warm backup") mechanism. For an overview of the MySQL Enterprise Backup product, see
[Section 28.1, “MySQL Enterprise Backup Overview”](mysql-enterprise-backup.html "28.1 MySQL Enterprise Backup Overview").

### Making Backups with mysqldump

The [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") program can make backups. It can
back up all kinds of tables. (See
[Section 7.4, “Using mysqldump for Backups”](using-mysqldump.html "7.4 Using mysqldump for Backups").)

For `InnoDB` tables, it is possible to perform an
online backup that takes no locks on tables using the
[`--single-transaction`](mysqldump.html#option_mysqldump_single-transaction) option to
[**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program"). See [Section 7.3.1, “Establishing a Backup Policy”](backup-policy.html "7.3.1 Establishing a Backup Policy").

### Making Backups by Copying Table Files

For storage engines that represent each table using its own files,
tables can be backed up by copying those files. For example,
`MyISAM` tables are stored as files, so it is
easy to do a backup by copying files (`*.frm`,
`*.MYD`, and `*.MYI` files).
To get a consistent backup, stop the server or lock and flush the
relevant tables:

```sql
FLUSH TABLES tbl_list WITH READ LOCK;
```

You need only a read lock; this enables other clients to continue
to query the tables while you are making a copy of the files in
the database directory. The flush is needed to ensure that the all
active index pages are written to disk before you start the
backup. See [Section 13.3.5, “LOCK TABLES and UNLOCK TABLES Statements”](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements"), and
[Section 13.7.6.3, “FLUSH Statement”](flush.html "13.7.6.3 FLUSH Statement").

You can also create a binary backup simply by copying all table
files, as long as the server is not updating anything. (But note
that table file copying methods do not work if your database
contains `InnoDB` tables. Also, even if the
server is not actively updating data, `InnoDB`
may still have modified data cached in memory and not flushed to
disk.)

### Making Delimited-Text File Backups

To create a text file containing a table's data, you can use
[`SELECT * INTO OUTFILE
'file_name' FROM
tbl_name`](select-into.html "13.2.9.1 SELECT ... INTO Statement"). The file is created
on the MySQL server host, not the client host. For this statement,
the output file cannot already exist because permitting files to
be overwritten constitutes a security risk. See
[Section 13.2.9, “SELECT Statement”](select.html "13.2.9 SELECT Statement"). This method works for any kind of data
file, but saves only table data, not the table structure.

Another way to create text data files (along with files containing
[`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") statements for the
backed up tables) is to use [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") with the
[`--tab`](mysqldump.html#option_mysqldump_tab) option. See
[Section 7.4.3, “Dumping Data in Delimited-Text Format with mysqldump”](mysqldump-delimited-text.html "7.4.3 Dumping Data in Delimited-Text Format with mysqldump").

To reload a delimited-text data file, use
[`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") or
[**mysqlimport**](mysqlimport.html "4.5.5 mysqlimport — A Data Import Program").

### Making Incremental Backups by Enabling the Binary Log

MySQL supports incremental backups: You must start the server with
the [`--log-bin`](replication-options-binary-log.html#option_mysqld_log-bin) option to enable
binary logging; see [Section 5.4.4, “The Binary Log”](binary-log.html "5.4.4 The Binary Log"). The binary log
files provide you with the information you need to replicate
changes to the database that are made subsequent to the point at
which you performed a backup. At the moment you want to make an
incremental backup (containing all changes that happened since the
last full or incremental backup), you should rotate the binary log
by using [`FLUSH LOGS`](flush.html#flush-logs). This done, you
need to copy to the backup location all binary logs which range
from the one of the moment of the last full or incremental backup
to the last but one. These binary logs are the incremental backup;
at restore time, you apply them as explained in
[Section 7.5, “Point-in-Time (Incremental) Recovery”](point-in-time-recovery.html "7.5 Point-in-Time (Incremental) Recovery"). The next time you do a
full backup, you should also rotate the binary log using
[`FLUSH LOGS`](flush.html#flush-logs) or [**mysqldump
--flush-logs**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program"). See [Section 4.5.4, “mysqldump — A Database Backup Program”](mysqldump.html "4.5.4 mysqldump — A Database Backup Program").

### Making Backups Using Replicas

If you have performance problems with your source server while
making backups, one strategy that can help is to set up
replication and perform backups on the replica rather than on the
source. See [Section 16.3.1, “Using Replication for Backups”](replication-solutions-backups.html "16.3.1 Using Replication for Backups").

If you are backing up a replica server, you should back up its
source info and relay log info repositories (see
[Section 16.2.4, “Relay Log and Replication Metadata Repositories”](replica-logs.html "16.2.4 Relay Log and Replication Metadata Repositories")) when you back up the replica's
databases, regardless of the backup method you choose. These
information files are always needed to resume replication after
you restore the replica's data. If your replica is replicating
[`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") statements, you should
also back up any `SQL_LOAD-*` files that exist
in the directory that the replica uses for this purpose. The
replica needs these files to resume replication of any interrupted
[`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") operations. The location
of this directory is the value of the
[`slave_load_tmpdir`](replication-options-replica.html#sysvar_slave_load_tmpdir) system
variable. If the server was not started with that variable set,
the directory location is the value of the
[`tmpdir`](server-system-variables.html#sysvar_tmpdir) system variable.

### Recovering Corrupt Tables

If you have to restore `MyISAM` tables that have
become corrupt, try to recover them using
[`REPAIR TABLE`](repair-table.html "13.7.2.5 REPAIR TABLE Statement") or [**myisamchk
-r**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility") first. That should work in 99.9% of all cases. If
[**myisamchk**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility") fails, see
[Section 7.6, “MyISAM Table Maintenance and Crash Recovery”](myisam-table-maintenance.html "7.6 MyISAM Table Maintenance and Crash Recovery").

### Making Backups Using a File System Snapshot

If you are using a Veritas file system, you can make a backup like
this:

1. From a client program, execute [`FLUSH
   TABLES WITH READ LOCK`](flush.html#flush-tables-with-read-lock).

2. From another shell, execute `mount vxfs
   snapshot`.

3. From the first client, execute
   [`UNLOCK
   TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements").

4. Copy files from the snapshot.
5. Unmount the snapshot.

Similar snapshot capabilities may be available in other file
systems, such as LVM or ZFS.