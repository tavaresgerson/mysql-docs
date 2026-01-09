### 21.6.9 Importing Data Into MySQL Cluster

It is common when setting up a new instance of NDB Cluster to need to import data from an existing NDB Cluster, instance of MySQL, or other source. This data is most often available in one or more of the following formats:

* An SQL dump file such as produced by [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") or [**mysqlpump**](mysqlpump.html "4.5.6 mysqlpump — A Database Backup Program"). This can be imported using the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client, as shown later in this section.

* A CSV file produced by [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") or other export program. Such files can be imported into `NDB` using `LOAD DATA INFILE` in the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client, or with the [**ndb_import**](mysql-cluster-programs-ndb-import.html "21.5.14 ndb_import — Import CSV Data Into NDB") utility provided with the NDB Cluster distribution. For more information about the latter, see [Section 21.5.14, “ndb_import — Import CSV Data Into NDB”](mysql-cluster-programs-ndb-import.html "21.5.14 ndb_import — Import CSV Data Into NDB").

* A native `NDB` backup produced using [`START BACKUP`](mysql-cluster-backup-using-management-client.html "21.6.8.2 Using The NDB Cluster Management Client to Create a Backup") in the `NDB` management client. To import a native backup, you must use the [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") program that comes as part of NDB Cluster. See [Section 21.5.24, “ndb_restore — Restore an NDB Cluster Backup”](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup"), for more about using this program.

When importing data from an SQL file, it is often not necessary to enforce transactions or foreign keys, and temporarily disabling these features can speed up the import process greatly. This can be done using the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client, either from a client session, or by invoking it on the command line. Within a [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client session, you can perform the import using the following SQL statements:

```sql
SET ndb_use_transactions=0;
SET foreign_key_checks=0;

source path/to/dumpfile;

SET ndb_use_transactions=1;
SET foreign_key_checks=1;
```

When performing the import in this fashion, you *must* enable `ndb_use_transaction` and `foreign_key_checks` again following execution of the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client's `source` command. Otherwise, it is possible for later statements in same session may also be executed without enforcing transactions or foreign key constraints, and which could lead to data inconcsistency.

From the system shell, you can import the SQL file while disabling enforcement of transaction and foreign keys by using the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client with the [`--init-command`](mysql-command-options.html#option_mysql_init-command) option, like this:

```sql
$> mysql --init-command='SET ndb_use_transactions=0; SET foreign_key_checks=0' < path/to/dumpfile
```

It is also possible to load the data into an [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") table, and convert it to use the NDB storage engine afterwards using ALTER TABLE ... ENGINE NDB). You should take into account, especially for many tables, that this may require a number of such operations; in addition, if foreign keys are used, you must mind the order of the `ALTER TABLE` statements carefully, due to the fact that foreign keys do not work between tables using different MySQL storage engines.

You should be aware that the methods described previously in this section are not optimized for very large data sets or large transactions. Should an application really need big transactions or many concurrent transactions as part of normal operation, you may wish to increase the value of the [`MaxNoOfConcurrentOperations`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofconcurrentoperations) data node configuration parameter, which reserves more memory to allow a data node to take over a transaction if its transaction coordinator stops unexpectedly.

You may also wish to do this when performing bulk [`DELETE`](delete.html "13.2.2 DELETE Statement") or [`UPDATE`](update.html "13.2.11 UPDATE Statement") operations on NDB Cluster tables. If possible, try to have applications perform these operations in chunks, for example, by adding `LIMIT` to such statements.

If a data import operation does not complete successfully, for whatever reason, you should be prepared to perform any necessary cleanup including possibly one or more [`DROP TABLE`](drop-table.html "13.1.29 DROP TABLE Statement") statements, [`DROP DATABASE`](drop-database.html "13.1.22 DROP DATABASE Statement") statements, or both. Failing to do so may leave the database in an inconsistent state.
