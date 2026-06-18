#### 14.6.1.5 Converting Tables from MyISAM to InnoDB

If you have [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") tables that you want
to convert to [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") for better
reliability and scalability, review the following guidelines and
tips before converting.

* [Adjusting Memory Usage for MyISAM and InnoDB](converting-tables-to-innodb.html#innodb-convert-memory-usage "Adjusting Memory Usage for MyISAM and InnoDB")
* [Handling Too-Long Or Too-Short Transactions](converting-tables-to-innodb.html#innodb-convert-transactions "Handling Too-Long Or Too-Short Transactions")
* [Handling Deadlocks](converting-tables-to-innodb.html#innodb-convert-deadlock "Handling Deadlocks")
* [Storage Layout](converting-tables-to-innodb.html#innodb-convert-plan-storage "Storage Layout")
* [Converting an Existing Table](converting-tables-to-innodb.html#innodb-convert-convert "Converting an Existing Table")
* [Cloning the Structure of a Table](converting-tables-to-innodb.html#innodb-convert-clone "Cloning the Structure of a Table")
* [Transferring Data](converting-tables-to-innodb.html#innodb-convert-transfer "Transferring Data")
* [Storage Requirements](converting-tables-to-innodb.html#innodb-convert-storage-requirements "Storage Requirements")
* [Defining Primary Keys](converting-tables-to-innodb.html#innodb-convert-primary-key "Defining Primary Keys")
* [Application Performance Considerations](converting-tables-to-innodb.html#innodb-convert-application-performance "Application Performance Considerations")
* [Understanding Files Associated with InnoDB Tables](converting-tables-to-innodb.html#innodb-convert-understand-files "Understanding Files Associated with InnoDB Tables")

##### Adjusting Memory Usage for MyISAM and InnoDB

As you transition away from `MyISAM` tables,
lower the value of the
[`key_buffer_size`](server-system-variables.html#sysvar_key_buffer_size) configuration
option to free memory no longer needed for caching results.
Increase the value of the
[`innodb_buffer_pool_size`](innodb-parameters.html#sysvar_innodb_buffer_pool_size)
configuration option, which performs a similar role of allocating
cache memory for `InnoDB` tables. The
`InnoDB` [buffer
pool](glossary.html#glos_buffer_pool "buffer pool") caches both table data and index data, speeding up
lookups for queries and keeping query results in memory for reuse.
For guidance regarding buffer pool size configuration, see
[Section 8.12.4.1, “How MySQL Uses Memory”](memory-use.html "8.12.4.1 How MySQL Uses Memory").

On a busy server, run benchmarks with the query cache turned off.
The `InnoDB` buffer pool provides similar
benefits, so the query cache might be tying up memory
unnecessarily. For information about the query cache, see
[Section 8.10.3, “The MySQL Query Cache”](query-cache.html "8.10.3 The MySQL Query Cache").

##### Handling Too-Long Or Too-Short Transactions

Because `MyISAM` tables do not support
[transactions](glossary.html#glos_transaction "transaction"), you might
not have paid much attention to the
[`autocommit`](server-system-variables.html#sysvar_autocommit) configuration option
and the [`COMMIT`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") and
[`ROLLBACK`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements")
statements. These keywords are important to allow multiple
sessions to read and write `InnoDB` tables
concurrently, providing substantial scalability benefits in
write-heavy workloads.

While a transaction is open, the system keeps a snapshot of the
data as seen at the beginning of the transaction, which can cause
substantial overhead if the system inserts, updates, and deletes
millions of rows while a stray transaction keeps running. Thus,
take care to avoid transactions that run for too long:

* If you are using a [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") session for
  interactive experiments, always
  [`COMMIT`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") (to finalize the
  changes) or
  [`ROLLBACK`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") (to
  undo the changes) when finished. Close down interactive
  sessions rather than leave them open for long periods, to
  avoid keeping transactions open for long periods by accident.

* Make sure that any error handlers in your application also
  [`ROLLBACK`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements")
  incomplete changes or [`COMMIT`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements")
  completed changes.

* [`ROLLBACK`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") is
  a relatively expensive operation, because
  [`INSERT`](insert.html "13.2.5 INSERT Statement"),
  [`UPDATE`](update.html "13.2.11 UPDATE Statement"), and
  [`DELETE`](delete.html "13.2.2 DELETE Statement") operations are written
  to `InnoDB` tables prior to the
  [`COMMIT`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements"), with the expectation
  that most changes are committed successfully and rollbacks are
  rare. When experimenting with large volumes of data, avoid
  making changes to large numbers of rows and then rolling back
  those changes.

* When loading large volumes of data with a sequence of
  [`INSERT`](insert.html "13.2.5 INSERT Statement") statements, periodically
  [`COMMIT`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") the results to avoid
  having transactions that last for hours. In typical load
  operations for data warehousing, if something goes wrong, you
  truncate the table (using [`TRUNCATE
  TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement")) and start over from the beginning rather than
  doing a
  [`ROLLBACK`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements").

The preceding tips save memory and disk space that can be wasted
during too-long transactions. When transactions are shorter than
they should be, the problem is excessive I/O. With each
[`COMMIT`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements"), MySQL makes sure each
change is safely recorded to disk, which involves some I/O.

* For most operations on `InnoDB` tables, you
  should use the setting
  [`autocommit=0`](server-system-variables.html#sysvar_autocommit). From an
  efficiency perspective, this avoids unnecessary I/O when you
  issue large numbers of consecutive
  [`INSERT`](insert.html "13.2.5 INSERT Statement"),
  [`UPDATE`](update.html "13.2.11 UPDATE Statement"), or
  [`DELETE`](delete.html "13.2.2 DELETE Statement") statements. From a
  safety perspective, this allows you to issue a
  [`ROLLBACK`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements")
  statement to recover lost or garbled data if you make a
  mistake on the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") command line, or in an
  exception handler in your application.

* [`autocommit=1`](server-system-variables.html#sysvar_autocommit) is suitable for
  `InnoDB` tables when running a sequence of
  queries for generating reports or analyzing statistics. In
  this situation, there is no I/O penalty related to
  [`COMMIT`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") or
  [`ROLLBACK`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements"),
  and `InnoDB` can
  [automatically
  optimize the read-only workload](innodb-performance-ro-txn.html "8.5.3 Optimizing InnoDB Read-Only Transactions").

* If you make a series of related changes, finalize all the
  changes at once with a single
  [`COMMIT`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") at the end. For example,
  if you insert related pieces of information into several
  tables, do a single [`COMMIT`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements")
  after making all the changes. Or if you run many consecutive
  [`INSERT`](insert.html "13.2.5 INSERT Statement") statements, do a single
  [`COMMIT`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") after all the data is
  loaded; if you are doing millions of
  [`INSERT`](insert.html "13.2.5 INSERT Statement") statements, perhaps
  split up the huge transaction by issuing a
  [`COMMIT`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") every ten thousand or
  hundred thousand records, so the transaction does not grow too
  large.

* Remember that even a [`SELECT`](select.html "13.2.9 SELECT Statement")
  statement opens a transaction, so after running some report or
  debugging queries in an interactive [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client")
  session, either issue a [`COMMIT`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements")
  or close the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") session.

For related information, see
[Section 14.7.2.2, “autocommit, Commit, and Rollback”](innodb-autocommit-commit-rollback.html "14.7.2.2 autocommit, Commit, and Rollback").

##### Handling Deadlocks

You might see warning messages referring to
“deadlocks” in the MySQL error log, or the output of
[`SHOW ENGINE INNODB
STATUS`](show-engine.html "13.7.5.15 SHOW ENGINE Statement"). A [deadlock](glossary.html#glos_deadlock "deadlock")
is not a serious issue for `InnoDB` tables, and
often does not require any corrective action. When two
transactions start modifying multiple tables, accessing the tables
in a different order, they can reach a state where each
transaction is waiting for the other and neither can proceed. When
[deadlock detection](glossary.html#glos_deadlock_detection "deadlock detection")
is enabled (the default), MySQL immediately detects this condition
and cancels ([rolls back](glossary.html#glos_rollback "rollback")) the
“smaller” transaction, allowing the other to proceed.
If deadlock detection is disabled using the
[`innodb_deadlock_detect`](innodb-parameters.html#sysvar_innodb_deadlock_detect)
configuration option, `InnoDB` relies on the
[`innodb_lock_wait_timeout`](innodb-parameters.html#sysvar_innodb_lock_wait_timeout) setting
to roll back transactions in case of a deadlock.

Either way, your applications need error-handling logic to restart
a transaction that is forcibly cancelled due to a deadlock. When
you re-issue the same SQL statements as before, the original
timing issue no longer applies. Either the other transaction has
already finished and yours can proceed, or the other transaction
is still in progress and your transaction waits until it finishes.

If deadlock warnings occur constantly, you might review the
application code to reorder the SQL operations in a consistent
way, or to shorten the transactions. You can test with the
[`innodb_print_all_deadlocks`](innodb-parameters.html#sysvar_innodb_print_all_deadlocks) option
enabled to see all deadlock warnings in the MySQL error log,
rather than only the last warning in the
[`SHOW ENGINE INNODB
STATUS`](show-engine.html "13.7.5.15 SHOW ENGINE Statement") output.

For more information, see [Section 14.7.5, “Deadlocks in InnoDB”](innodb-deadlocks.html "14.7.5 Deadlocks in InnoDB").

##### Storage Layout

To get the best performance from `InnoDB` tables,
you can adjust a number of parameters related to storage layout.

When you convert `MyISAM` tables that are large,
frequently accessed, and hold vital data, investigate and consider
the [`innodb_file_per_table`](innodb-parameters.html#sysvar_innodb_file_per_table),
[`innodb_file_format`](innodb-parameters.html#sysvar_innodb_file_format), and
[`innodb_page_size`](innodb-parameters.html#sysvar_innodb_page_size) variables, and
the
[`ROW_FORMAT`
and `KEY_BLOCK_SIZE` clauses](innodb-row-format.html "14.11 InnoDB Row Formats") of the
[`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") statement.

During your initial experiments, the most important setting is
[`innodb_file_per_table`](innodb-parameters.html#sysvar_innodb_file_per_table). When this
setting is enabled, which is the default as of MySQL 5.6.6, new
`InnoDB` tables are implicitly created in
[file-per-table](glossary.html#glos_file_per_table "file-per-table")
tablespaces. In contrast with the `InnoDB` system
tablespace, file-per-table tablespaces allow disk space to be
reclaimed by the operating system when a table is truncated or
dropped. File-per-table tablespaces also support the
[Barracuda](glossary.html#glos_barracuda "Barracuda") file format and
associated features such as table compression, efficient off-page
storage for long variable-length columns, and large index
prefixes. For more information, see
[Section 14.6.3.2, “File-Per-Table Tablespaces”](innodb-file-per-table-tablespaces.html "14.6.3.2 File-Per-Table Tablespaces").

You can also store `InnoDB` tables in a shared
general tablespace. General tablespaces support the Barracuda file
format and can contain multiple tables. For more information, see
[Section 14.6.3.3, “General Tablespaces”](general-tablespaces.html "14.6.3.3 General Tablespaces").

##### Converting an Existing Table

To convert a non-`InnoDB` table to use
`InnoDB` use [`ALTER
TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement"):

```sql
ALTER TABLE table_name ENGINE=InnoDB;
```

Warning

Do *not* convert MySQL system tables in the
`mysql` database from `MyISAM`
to `InnoDB` tables. This is an unsupported
operation. If you do this, MySQL does not restart until you
restore the old system tables from a backup or regenerate them
by reinitializing the data directory (see
[Section 2.9.1, “Initializing the Data Directory”](data-directory-initialization.html "2.9.1 Initializing the Data Directory")).

##### Cloning the Structure of a Table

You might make an `InnoDB` table that is a clone
of a MyISAM table, rather than using [`ALTER
TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") to perform conversion, to test the old and new
table side-by-side before switching.

Create an empty `InnoDB` table with identical
column and index definitions. Use `SHOW CREATE TABLE
table_name\G` to see the full
[`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") statement to use.
Change the `ENGINE` clause to
`ENGINE=INNODB`.

##### Transferring Data

To transfer a large volume of data into an empty
`InnoDB` table created as shown in the previous
section, insert the rows with `INSERT INTO
innodb_table SELECT * FROM
myisam_table ORDER BY
primary_key_columns`.

You can also create the indexes for the `InnoDB`
table after inserting the data. Historically, creating new
secondary indexes was a slow operation for
`InnoDB`, but now you can create the indexes
after the data is loaded with relatively little overhead from the
index creation step.

If you have `UNIQUE` constraints on secondary
keys, you can speed up a table import by turning off the
uniqueness checks temporarily during the import operation:

```sql
SET unique_checks=0;
... import operation ...
SET unique_checks=1;
```

For big tables, this saves disk I/O because
`InnoDB` can use its
[change buffer](glossary.html#glos_change_buffer "change buffer") to write
secondary index records as a batch. Be certain that the data
contains no duplicate keys.
[`unique_checks`](server-system-variables.html#sysvar_unique_checks) permits but does
not require storage engines to ignore duplicate keys.

For better control over the insertion process, you can insert big
tables in pieces:

```sql
INSERT INTO newtable SELECT * FROM oldtable
   WHERE yourkey > something AND yourkey <= somethingelse;
```

After all records are inserted, you can rename the tables.

During the conversion of big tables, increase the size of the
`InnoDB` buffer pool to reduce disk I/O.
Typically, the recommended buffer pool size is 50 to 75 percent of
system memory. You can also increase the size of
`InnoDB` log files.

##### Storage Requirements

If you intend to make several temporary copies of your data in
`InnoDB` tables during the conversion process, it
is recommended that you create the tables in file-per-table
tablespaces so that you can reclaim the disk space when you drop
the tables. When the
[`innodb_file_per_table`](innodb-parameters.html#sysvar_innodb_file_per_table)
configuration option is enabled (the default), newly created
`InnoDB` tables are implicitly created in
file-per-table tablespaces.

Whether you convert the `MyISAM` table directly
or create a cloned `InnoDB` table, make sure that
you have sufficient disk space to hold both the old and new tables
during the process.
**`InnoDB` tables require
more disk space than `MyISAM` tables.**
If an [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") operation runs
out of space, it starts a rollback, and that can take hours if it
is disk-bound. For inserts, `InnoDB` uses the
insert buffer to merge secondary index records to indexes in
batches. That saves a lot of disk I/O. For rollback, no such
mechanism is used, and the rollback can take 30 times longer than
the insertion.

In the case of a runaway rollback, if you do not have valuable
data in your database, it may be advisable to kill the database
process rather than wait for millions of disk I/O operations to
complete. For the complete procedure, see
[Section 14.22.2, “Forcing InnoDB Recovery”](forcing-innodb-recovery.html "14.22.2 Forcing InnoDB Recovery").

##### Defining Primary Keys

The `PRIMARY KEY` clause is a critical factor
affecting the performance of MySQL queries and the space usage for
tables and indexes. The primary key uniquely identifies a row in a
table. Every row in the table should have a primary key value, and
no two rows can have the same primary key value.

These are guidelines for the primary key, followed by more
detailed explanations.

* Declare a `PRIMARY KEY` for each table.
  Typically, it is the most important column that you refer to
  in `WHERE` clauses when looking up a single
  row.

* Declare the `PRIMARY KEY` clause in the
  original [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement")
  statement, rather than adding it later through an
  [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") statement.

* Choose the column and its data type carefully. Prefer numeric
  columns over character or string ones.

* Consider using an auto-increment column if there is not
  another stable, unique, non-null, numeric column to use.

* An auto-increment column is also a good choice if there is any
  doubt whether the value of the primary key column could ever
  change. Changing the value of a primary key column is an
  expensive operation, possibly involving rearranging data
  within the table and within each secondary index.

Consider adding a [primary
key](glossary.html#glos_primary_key "primary key") to any table that does not already have one. Use the
smallest practical numeric type based on the maximum projected
size of the table. This can make each row slightly more compact,
which can yield substantial space savings for large tables. The
space savings are multiplied if the table has any
[secondary indexes](glossary.html#glos_secondary_index "secondary index"),
because the primary key value is repeated in each secondary index
entry. In addition to reducing data size on disk, a small primary
key also lets more data fit into the
[buffer pool](glossary.html#glos_buffer_pool "buffer pool"), speeding up
all kinds of operations and improving concurrency.

If the table already has a primary key on some longer column, such
as a `VARCHAR`, consider adding a new unsigned
`AUTO_INCREMENT` column and switching the primary
key to that, even if that column is not referenced in queries.
This design change can produce substantial space savings in the
secondary indexes. You can designate the former primary key
columns as `UNIQUE NOT NULL` to enforce the same
constraints as the `PRIMARY KEY` clause, that is,
to prevent duplicate or null values across all those columns.

If you spread related information across multiple tables,
typically each table uses the same column for its primary key. For
example, a personnel database might have several tables, each with
a primary key of employee number. A sales database might have some
tables with a primary key of customer number, and other tables
with a primary key of order number. Because lookups using the
primary key are very fast, you can construct efficient join
queries for such tables.

If you leave the `PRIMARY KEY` clause out
entirely, MySQL creates an invisible one for you. It is a 6-byte
value that might be longer than you need, thus wasting space.
Because it is hidden, you cannot refer to it in queries.

##### Application Performance Considerations

The reliability and scalability features of
`InnoDB` require more disk storage than
equivalent `MyISAM` tables. You might change the
column and index definitions slightly, for better space
utilization, reduced I/O and memory consumption when processing
result sets, and better query optimization plans making efficient
use of index lookups.

If you set up a numeric ID column for the primary key, use that
value to cross-reference with related values in any other tables,
particularly for [join](glossary.html#glos_join "join") queries.
For example, rather than accepting a country name as input and
doing queries searching for the same name, do one lookup to
determine the country ID, then do other queries (or a single join
query) to look up relevant information across several tables.
Rather than storing a customer or catalog item number as a string
of digits, potentially using up several bytes, convert it to a
numeric ID for storing and querying. A 4-byte unsigned
[`INT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") column can index over 4 billion
items (with the US meaning of billion: 1000 million). For the
ranges of the different integer types, see
[Section 11.1.2, “Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT,
MEDIUMINT, BIGINT”](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT").

##### Understanding Files Associated with InnoDB Tables

`InnoDB` files require more care and planning
than `MyISAM` files do.

* You must not delete the
  [ibdata files](glossary.html#glos_ibdata_file "ibdata file") that
  represent the `InnoDB`
  [system
  tablespace](glossary.html#glos_system_tablespace "system tablespace").

* Methods of moving or copying `InnoDB` tables
  to a different server are described in
  [Section 14.6.1.4, “Moving or Copying InnoDB Tables”](innodb-migration.html "14.6.1.4 Moving or Copying InnoDB Tables").