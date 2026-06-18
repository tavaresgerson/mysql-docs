### 14.19.1 InnoDB Backup

The key to safe database management is making regular backups.
Depending on your data volume, number of MySQL servers, and
database workload, you can use these backup techniques, alone or
in combination: [hot backup](glossary.html#glos_hot_backup "hot backup")
with MySQL Enterprise Backup; [cold backup](glossary.html#glos_cold_backup "cold backup") by
copying files while the MySQL server is shut down;
[logical backup](glossary.html#glos_logical_backup "logical backup") with
[**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") for smaller data volumes or to record
the structure of schema objects. Hot and cold backups are
[physical backups](glossary.html#glos_physical_backup "physical backup") that
copy actual data files, which can be used directly by the
[`mysqld`](mysqld.html "4.3.1 mysqld — The MySQL Server") server for faster restore.

Using *MySQL Enterprise Backup* is the recommended method for
backing up `InnoDB` data.

Note

`InnoDB` does not support databases that are
restored using third-party backup tools.

#### Hot Backups

The **mysqlbackup** command, part of the MySQL Enterprise Backup
component, lets you back up a running MySQL instance, including
`InnoDB` tables, with minimal disruption to
operations while producing a consistent snapshot of the database.
When **mysqlbackup** is copying
`InnoDB` tables, reads and writes to
`InnoDB` tables can continue. MySQL Enterprise Backup can also
create compressed backup files, and back up subsets of tables and
databases. In conjunction with the MySQL binary log, users can
perform point-in-time recovery. MySQL Enterprise Backup is part of the MySQL
Enterprise subscription. For more details, see
[Section 28.1, “MySQL Enterprise Backup Overview”](mysql-enterprise-backup.html "28.1 MySQL Enterprise Backup Overview").

#### Cold Backups

If you can shut down the MySQL server, you can make a physical
backup that consists of all files used by
`InnoDB` to manage its tables. Use the following
procedure:

1. Perform a [slow
   shutdown](glossary.html#glos_slow_shutdown "slow shutdown") of the MySQL server and make sure that it
   stops without errors.

2. Copy all `InnoDB` data files
   (`ibdata` files and
   `.ibd` files) into a safe place.

3. Copy all the `.frm` files for
   `InnoDB` tables to a safe place.

4. Copy all `InnoDB` log files
   (`ib_logfile` files) to a safe place.

5. Copy your `my.cnf` configuration file or
   files to a safe place.

#### Logical Backups Using mysqldump

In addition to physical backups, it is recommended that you
regularly create logical backups by dumping your tables using
[**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program"). A binary file might be corrupted
without you noticing it. Dumped tables are stored into text files
that are human-readable, so spotting table corruption becomes
easier. Also, because the format is simpler, the chance for
serious data corruption is smaller. [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program")
also has a [`--single-transaction`](mysqldump.html#option_mysqldump_single-transaction)
option for making a consistent snapshot without locking out other
clients. See [Section 7.3.1, “Establishing a Backup Policy”](backup-policy.html "7.3.1 Establishing a Backup Policy").

Replication works with [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") tables,
so you can use MySQL replication capabilities to keep a copy of
your database at database sites requiring high availability. See
[Section 14.20, “InnoDB and MySQL Replication”](innodb-and-mysql-replication.html "14.20 InnoDB and MySQL Replication").