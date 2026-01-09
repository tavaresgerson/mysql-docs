### 21.5.14 ndb\_import — Import CSV Data Into NDB

[**ndb\_import**](mysql-cluster-programs-ndb-import.html "21.5.14 ndb_import — Import CSV Data Into NDB") imports CSV-formatted data, such as that produced by [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") [`--tab`](mysqldump.html#option_mysqldump_tab), directly into `NDB` using the NDB API. [**ndb\_import**](mysql-cluster-programs-ndb-import.html "21.5.14 ndb_import — Import CSV Data Into NDB") requires a connection to an NDB management server ([**ndb\_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon")) to function; it does not require a connection to a MySQL Server.

#### Usage

```sql
ndb_import db_name file_name options
```

[**ndb\_import**](mysql-cluster-programs-ndb-import.html "21.5.14 ndb_import — Import CSV Data Into NDB") requires two arguments. *`db_name`* is the name of the database where the table into which to import the data is found; *`file_name`* is the name of the CSV file from which to read the data; this must include the path to this file if it is not in the current directory. The name of the file must match that of the table; the file's extension, if any, is not taken into consideration. Options supported by [**ndb\_import**](mysql-cluster-programs-ndb-import.html "21.5.14 ndb_import — Import CSV Data Into NDB") include those for specifying field separators, escapes, and line terminators, and are described later in this section.

[**ndb\_import**](mysql-cluster-programs-ndb-import.html "21.5.14 ndb_import — Import CSV Data Into NDB") rejects any empty lines read from the CSV file.

[**ndb\_import**](mysql-cluster-programs-ndb-import.html "21.5.14 ndb_import — Import CSV Data Into NDB") must be able to connect to an NDB Cluster management server; for this reason, there must be an unused `[api]` slot in the cluster `config.ini` file.

To duplicate an existing table that uses a different storage engine, such as [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine"), as an `NDB` table, use the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client to perform a [`SELECT INTO OUTFILE`](select-into.html "13.2.9.1 SELECT ... INTO Statement") statement to export the existing table to a CSV file, then to execute a [`CREATE TABLE LIKE`](create-table-like.html "13.1.18.3 CREATE TABLE ... LIKE Statement") statement to create a new table having the same structure as the existing table, then perform [`ALTER TABLE ... ENGINE=NDB`](alter-table.html "13.1.8 ALTER TABLE Statement") on the new table; after this, from the system shell, invoke [**ndb\_import**](mysql-cluster-programs-ndb-import.html "21.5.14 ndb_import — Import CSV Data Into NDB") to load the data into the new `NDB` table. For example, an existing `InnoDB` table named `myinnodb_table` in a database named `myinnodb` can be exported into an `NDB` table named `myndb_table` in a database named `myndb` as shown here, assuming that you are already logged in as a MySQL user with the appropriate privileges:

1. In the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client:

   ```sql
   mysql> USE myinnodb;

   mysql> SELECT * INTO OUTFILE '/tmp/myndb_table.csv'
        >  FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"' ESCAPED BY '\\'
        >  LINES TERMINATED BY '\n'
        >  FROM myinnodbtable;

   mysql> CREATE DATABASE myndb;

   mysql> USE myndb;

   mysql> CREATE TABLE myndb_table LIKE myinnodb.myinnodb_table;

   mysql> ALTER TABLE myndb_table ENGINE=NDB;

   mysql> EXIT;
   Bye
   $>
   ```

   Once the target database and table have been created, a running [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") is no longer required. You can stop it using [**mysqladmin shutdown**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") or another method before proceeding, if you wish.

2. In the system shell:

   ```sql
   # if you are not already in the MySQL bin directory:
   $> cd path-to-mysql-bin-dir

   $> ndb_import myndb /tmp/myndb_table.csv --fields-optionally-enclosed-by='"' \
       --fields-terminated-by="," --fields-escaped-by='\\'
   ```

   The output should resemble what is shown here:

   ```sql
   job-1 import myndb.myndb_table from /tmp/myndb_table.csv
   job-1 [running] import myndb.myndb_table from /tmp/myndb_table.csv
   job-1 [success] import myndb.myndb_table from /tmp/myndb_table.csv
   job-1 imported 19984 rows in 0h0m9s at 2277 rows/s
   jobs summary: defined: 1 run: 1 with success: 1 with failure: 0
   $>
   ```

Options that can be used with [**ndb\_import**](mysql-cluster-programs-ndb-import.html "21.5.14 ndb_import — Import CSV Data Into NDB") are shown in the following table. Additional descriptions follow the table.

**Table 21.33 Command-line options used with the program ndb\_import**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th scope="col">Format</th> <th scope="col">Description</th> <th scope="col">Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_abort-on-error">--abort-on-error</a> </code> </p></th> <td>Dump core on any fatal error; used for debugging</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_ai-increment">--ai-increment=#</a> </code> </p></th> <td>For table with hidden PK, specify autoincrement increment. See mysqld</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_ai-offset">--ai-offset=#</a> </code> </p></th> <td>For table with hidden PK, specify autoincrement offset. See mysqld</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_ai-prefetch-sz">--ai-prefetch-sz=#</a> </code> </p></th> <td>For table with hidden PK, specify number of autoincrement values that are prefetched. See mysqld</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_character-sets-dir">--character-sets-dir=path</a> </code> </p></th> <td>Directory containing character sets</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_connect-retries">--connect-retries=#</a> </code> </p></th> <td>Number of times to retry connection before giving up</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_connect-retry-delay">--connect-retry-delay=#</a> </code> </p></th> <td>Number of seconds to wait between attempts to contact management server</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"><a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_connect-string">--connect-string=connection_string</a></code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_connect-string">-c connection_string</a> </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_connections">--connections=#</a> </code> </p></th> <td>Number of cluster connections to create</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_continue">--continue</a> </code> </p></th> <td>When job fails, continue to next job</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_core-file">--core-file</a> </code> </p></th> <td>Write core file on error; used in debugging</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_csvopt">--csvopt=opts</a> </code> </p></th> <td>Shorthand option for setting typical CSV option values. See documentation for syntax and other information</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_db-workers">--db-workers=#</a> </code> </p></th> <td>Number of threads, per data node, executing database operations</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_defaults-extra-file">--defaults-extra-file=path</a> </code> </p></th> <td>Read given file after global files are read</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_defaults-file">--defaults-file=path</a> </code> </p></th> <td>Read default options from given file only</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_defaults-group-suffix">--defaults-group-suffix=string</a> </code> </p></th> <td>Also read groups with concat(group, suffix)</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_errins-type">--errins-type=name</a> </code> </p></th> <td>Error insert type, for testing purposes; use "list" to obtain all possible values</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_errins-delay">--errins-delay=#</a> </code> </p></th> <td>Error insert delay in milliseconds; random variation is added</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_fields-enclosed-by">--fields-enclosed-by=char</a> </code> </p></th> <td>Same as FIELDS ENCLOSED BY option for LOAD DATA statements. For CSV input this is same as using --fields-optionally-enclosed-by</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_fields-escaped-by">--fields-escaped-by=char</a> </code> </p></th> <td>Same as FIELDS ESCAPED BY option for LOAD DATA statements</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_fields-optionally-enclosed-by">--fields-optionally-enclosed-by=char</a> </code> </p></th> <td>Same as FIELDS OPTIONALLY ENCLOSED BY option for LOAD DATA statements</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_fields-terminated-by">--fields-terminated-by=char</a> </code> </p></th> <td>Same as FIELDS TERMINATED BY option for LOAD DATA statements</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"><a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_help">--help</a></code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_help">-?</a> </code> </p></th> <td>Display help text and exit</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_idlesleep">--idlesleep=#</a> </code> </p></th> <td>Number of milliseconds to sleep waiting for more to do</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_idlespin">--idlespin=#</a> </code> </p></th> <td>Number of times to retry before idlesleep</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_ignore-lines">--ignore-lines=#</a> </code> </p></th> <td>Ignore first # lines in input file. Used to skip a non-data header</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_input-type">--input-type=name</a> </code> </p></th> <td>Input type: random or csv</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_input-workers">--input-workers=#</a> </code> </p></th> <td>Number of threads processing input. Must be 2 or more if --input-type is csv</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_keep-state">--keep-state</a> </code> </p></th> <td>State files (except non-empty *.rej files) are normally removed on job completion. Using this option causes all state files to be preserved instead</td> <td><p> ADDED: NDB 7.6.4 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_lines-terminated-by">--lines-terminated-by=char</a> </code> </p></th> <td>Same as LINES TERMINATED BY option for LOAD DATA statements</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_login-path">--login-path=path</a> </code> </p></th> <td>Read given path from login file</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_max-rows">--max-rows=#</a> </code> </p></th> <td>Import only this number of input data rows; default is 0, which imports all rows</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_monitor">--monitor=#</a> </code> </p></th> <td>Periodically print status of running job if something has changed (status, rejected rows, temporary errors). Value 0 disables. Value 1 prints any change seen. Higher values reduce status printing exponentially up to some pre-defined limit</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"><a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_ndb-connectstring">--ndb-connectstring=connection_string</a></code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_ndb-connectstring">-c connection_string</a> </code> </p></th> <td>Set connect string for connecting to ndb_mgmd. Syntax: "[nodeid=id;][host=]hostname[:port]". Overrides entries in NDB_CONNECTSTRING and my.cnf</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"><a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_ndb-mgmd-host">--ndb-mgmd-host=connection_string</a></code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_ndb-mgmd-host">-c connection_string</a> </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_ndb-nodeid">--ndb-nodeid=#</a> </code> </p></th> <td>Set node ID for this node, overriding any ID set by --ndb-connectstring</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_ndb-optimized-node-selection">--ndb-optimized-node-selection</a> </code> </p></th> <td>Enable optimizations for selection of nodes for transactions. Enabled by default; use --skip-ndb-optimized-node-selection to disable</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_no-asynch">--no-asynch</a> </code> </p></th> <td>Run database operations as batches, in single transactions</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_no-defaults">--no-defaults</a> </code> </p></th> <td>Do not read default options from any option file other than login file</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_no-hint">--no-hint</a> </code> </p></th> <td>Tells transaction coordinator not to use distribution key hint when selecting data node</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_opbatch">--opbatch=#</a> </code> </p></th> <td>A db execution batch is a set of transactions and operations sent to NDB kernel. This option limits NDB operations (including blob operations) in a db execution batch. Therefore it also limits number of asynch transactions. Value 0 is not valid</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_opbytes">--opbytes=#</a> </code> </p></th> <td>Limit bytes in execution batch (default 0 = no limit)</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_output-type">--output-type=name</a> </code> </p></th> <td>Output type: ndb is default, null used for testing</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_output-workers">--output-workers=#</a> </code> </p></th> <td>Number of threads processing output or relaying database operations</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_pagesize">--pagesize=#</a> </code> </p></th> <td>Align I/O buffers to given size</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_pagecnt">--pagecnt=#</a> </code> </p></th> <td>Size of I/O buffers as multiple of page size. CSV input worker allocates double-sized buffer</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_polltimeout">--polltimeout=#</a> </code> </p></th> <td>Timeout per poll for completed asynchonous transactions; polling continues until all polls are completed, or error occurs</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_print-defaults">--print-defaults</a> </code> </p></th> <td>Print program argument list and exit</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_rejects">--rejects=#</a> </code> </p></th> <td>Limit number of rejected rows (rows with permanent error) in data load. Default is 0 which means that any rejected row causes a fatal error. The row exceeding the limit is also added to *.rej</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_resume">--resume</a> </code> </p></th> <td>If job aborted (temporary error, user interrupt), resume with rows not yet processed</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_rowbatch">--rowbatch=#</a> </code> </p></th> <td>Limit rows in row queues (default 0 = no limit); must be 1 or more if --input-type is random</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_rowbytes">--rowbytes=#</a> </code> </p></th> <td>Limit bytes in row queues (0 = no limit)</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_state-dir">--state-dir=path</a> </code> </p></th> <td>Where to write state files; currect directory is default</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_stats">--stats</a> </code> </p></th> <td>Save performance related options and internal statistics in *.sto and *.stt files. These files are kept on successful completion even if --keep-state is not used</td> <td><p> ADDED: NDB 7.6.4 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_tempdelay">--tempdelay=#</a> </code> </p></th> <td>Number of milliseconds to sleep between temporary errors</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_temperrors">--temperrors=#</a> </code> </p></th> <td>Number of times a transaction can fail due to a temporary error, per execution batch; 0 means any temporary error is fatal. Such errors do not cause any rows to be written to .rej file</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"><a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_usage">--usage</a></code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_usage">-?</a> </code> </p></th> <td>Display help text and exit; same as --help</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"><a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_verbose">--verbose[=#]</a></code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_verbose">-v [#]</a> </code> </p></th> <td>Enable verbose output</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"><a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_version">--version</a></code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_version">-V</a> </code> </p></th> <td>Display version information and exit</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody></table>

* `--abort-on-error`

  <table frame="box" rules="all" summary="Properties for abort-on-error"><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>

  Dump core on any fatal error; used for debugging only.

* `--ai-increment`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-increment"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  For a table with a hidden primary key, specify the autoincrement increment, like the [`auto_increment_increment`](replication-options-source.html#sysvar_auto_increment_increment) system variable does in the MySQL Server.

* `--ai-offset`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-offset"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  For a table with hidden primary key, specify the autoincrement offset. Similar to the [`auto_increment_offset`](replication-options-source.html#sysvar_auto_increment_offset) system variable.

* `--ai-prefetch-sz`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-prefetch-sz"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1024</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  For a table with a hidden primary key, specify the number of autoincrement values that are prefetched. Behaves like the [`ndb_autoincrement_prefetch_sz`](mysql-cluster-options-variables.html#sysvar_ndb_autoincrement_prefetch_sz) system variable does in the MySQL Server.

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>

  Directory containing character sets.

* `--connect-retries`

  <table frame="box" rules="all" summary="Properties for connect-retries"><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>

  Number of times to retry connection before giving up.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>5</code></td> </tr></tbody></table>

  Number of seconds to wait between attempts to contact management server.

* `--connections`=*`#`*

  <table frame="box" rules="all" summary="Properties for connections"><tbody><tr><th>Command-Line Format</th> <td><code>--connections=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Number of cluster connections to create.

* `--connect-string`

  <table frame="box" rules="all" summary="Properties for connect-string"><tbody><tr><th>Command-Line Format</th> <td><code>--connect-string=connection_string</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Same as [`--ndb-connectstring`](mysql-cluster-programs-ndb-import.html#option_ndb_import_ndb-connectstring).

* `--continue`

  <table frame="box" rules="all" summary="Properties for abort-on-error"><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>0

  When a job fails, continue to the next job.

* `--core-file`

  <table frame="box" rules="all" summary="Properties for abort-on-error"><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>1

  Write core file on error; used in debugging.

* `--csvopt`=*`string`*

  <table frame="box" rules="all" summary="Properties for abort-on-error"><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>2

  Provides a shortcut method for setting typical CSV import options. The argument to this option is a string consisting of one or more of the following parameters:

  + `c`: Fields terminated by comma
  + `d`: Use defaults, except where overridden by another parameter

  + `n`: Lines terminated by `\n`

  + `q`: Fields optionally enclosed by double quote characters (`"`)

  + `r`: Line terminated by `\r`

  The order of the parameters makes no difference, except that if both `n` and `r` are specified, the one occurring last is the parameter which takes effect.

  This option is intended for use in testing under conditions in which it is difficult to transmit escapes or quotation marks.

* `--db-workers`=*`#`*

  <table frame="box" rules="all" summary="Properties for abort-on-error"><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>3

  Number of threads, per data node, executing database operations.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for abort-on-error"><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>4

  Read given file after global files are read.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for abort-on-error"><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>5

  Read default options from given file only.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for abort-on-error"><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>6

  Also read groups with concat(group, suffix).

* `--errins-type`=*`name`*

  <table frame="box" rules="all" summary="Properties for abort-on-error"><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>7

  Error insert type; use `list` as the *`name`* value to obtain all possible values. This option is used for testing purposes only.

* `--errins-delay`=*`#`*

  <table frame="box" rules="all" summary="Properties for abort-on-error"><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>8

  Error insert delay in milliseconds; random variation is added. This option is used for testing purposes only.

* `--fields-enclosed-by`=*`char`*

  <table frame="box" rules="all" summary="Properties for abort-on-error"><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>9

  This works in the same way as the `FIELDS ENCLOSED BY` option does for the [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") statement, specifying a character to be interpeted as quoting field values. For CSV input, this is the same as [`--fields-optionally-enclosed-by`](mysql-cluster-programs-ndb-import.html#option_ndb_import_fields-optionally-enclosed-by).

* `--fields-escaped-by`=*`name`*

  <table frame="box" rules="all" summary="Properties for ai-increment"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>0

  Specify an escape character in the same way as the `FIELDS ESCAPED BY` option does for the SQL [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") statement.

* `--fields-optionally-enclosed-by`=*`char`*

  <table frame="box" rules="all" summary="Properties for ai-increment"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>1

  This works in the same way as the `FIELDS OPTIONALLY ENCLOSED BY` option does for the [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") statement, specifying a character to be interpeted as optionally quoting field values. For CSV input, this is the same as [`--fields-enclosed-by`](mysql-cluster-programs-ndb-import.html#option_ndb_import_fields-enclosed-by).

* `--fields-terminated-by`=*`char`*

  <table frame="box" rules="all" summary="Properties for ai-increment"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>2

  This works in the same way as the `FIELDS TERMINATED BY` option does for the [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") statement, specifying a character to be interpeted as the field separator.

* `--help`

  <table frame="box" rules="all" summary="Properties for ai-increment"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>3

  Display help text and exit.

* `--idlesleep`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-increment"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>4

  Number of milliseconds to sleep waiting for more work to perform.

* `--idlespin`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-increment"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>5

  Number of times to retry before sleeping.

* `--ignore-lines`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-increment"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>6

  Cause ndb\_import to ignore the first *`#`* lines of the input file. This can be employed to skip a file header that does not contain any data.

* `--input-type`=*`name`*

  <table frame="box" rules="all" summary="Properties for ai-increment"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>7

  Set the type of input type. The default is `csv`; `random` is intended for testing purposes only. .

* `--input-workers`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-increment"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>8

  Set the number of threads processing input.

* `--keep-state`

  <table frame="box" rules="all" summary="Properties for ai-increment"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>9

  By default, ndb\_import removes all state files (except non-empty `*.rej` files) when it completes a job. Specify this option (nor argument is required) to force the program to retain all state files instead.

* `--lines-terminated-by`=*`name`*

  <table frame="box" rules="all" summary="Properties for ai-offset"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>0

  This works in the same way as the `LINES TERMINATED BY` option does for the [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") statement, specifying a character to be interpeted as end-of-line.

* `--login-path`

  <table frame="box" rules="all" summary="Properties for ai-offset"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>1

  Read given path from login file.

* `--log-level`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-offset"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>2

  Performs internal logging at the given level. This option is intended primarily for internal and development use.

  In debug builds of NDB only, the logging level can be set using this option to a maximum of 4.

* `--max-rows`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-offset"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>3

  Import only this number of input data rows; the default is 0, which imports all rows.

* `--monitor`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-offset"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>4

  Periodically print the status of a running job if something has changed (status, rejected rows, temporary errors). Set to 0 to disable this reporting. Setting to 1 prints any change that is seen. Higher values reduce the frequency of this status reporting.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Properties for ai-offset"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>5

  Set connect string for connecting to ndb\_mgmd. Syntax: "[nodeid=id;][host=]hostname[:port]". Overrides entries in NDB\_CONNECTSTRING and my.cnf.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Properties for ai-offset"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>6

  Same as [`--ndb-connectstring`](mysql-cluster-programs-ndb-import.html#option_ndb_import_ndb-connectstring).

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Properties for ai-offset"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>7

  Set node ID for this node, overriding any ID set by [`--ndb-connectstring`](mysql-cluster-programs-ndb-import.html#option_ndb_import_ndb-connectstring).

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Properties for ai-offset"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>8

  Enable optimizations for selection of nodes for transactions. Enabled by default; use `--skip-ndb-optimized-node-selection` to disable.

* `--no-asynch`

  <table frame="box" rules="all" summary="Properties for ai-offset"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>9

  Run database operations as batches, in single transactions.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for ai-prefetch-sz"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1024</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>0

  Do not read default options from any option file other than login file.

* `--no-hint`

  <table frame="box" rules="all" summary="Properties for ai-prefetch-sz"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1024</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>1

  Do not use distribution key hinting to select a data node.

* `--opbatch`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-prefetch-sz"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1024</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>2

  Set a limit on the number of operations (including blob operations), and thus the number of asynchronous transactions, per execution batch.

* `--opbytes`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-prefetch-sz"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1024</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>3

  Set a limit on the number of bytes per execution batch. Use 0 for no limit.

* `--output-type`=*`name`*

  <table frame="box" rules="all" summary="Properties for ai-prefetch-sz"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1024</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>4

  Set the output type. `ndb` is the default. `null` is used only for testing.

* `--output-workers`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-prefetch-sz"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1024</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>5

  Set the number of threads processing output or relaying database operations.

* `--pagesize`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-prefetch-sz"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1024</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>6

  Align I/O buffers to the given size.

* `--pagecnt`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-prefetch-sz"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1024</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>7

  Set the size of I/O buffers as multiple of page size. The CSV input worker allocates buffer that is doubled in size.

* `--polltimeout`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-prefetch-sz"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1024</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>8

  Set a timeout per poll for completed asynchonous transactions; polling continues until all polls are completed, or until an error occurs.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for ai-prefetch-sz"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1024</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>9

  Print program argument list and exit.

* `--rejects`=*`#`*

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>0

  Limit the number of rejected rows (rows with permanent errors) in the data load. The default is 0, which means that any rejected row causes a fatal error. Any rows causing the limit to be exceeded are added to the `.rej` file.

  The limit imposed by this option is effective for the duration of the current run. A run restarted using [`--resume`](mysql-cluster-programs-ndb-import.html#option_ndb_import_resume) is considered a “new” run for this purpose.

* `--resume`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>1

  If a job is aborted (due to a temporary db error or when interrupted by the user), resume with any rows not yet processed.

* `--rowbatch`=*`#`*

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>2

  Set a limit on the number of rows per row queue. Use 0 for no limit.

* `--rowbytes`=*`#`*

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>3

  Set a limit on the number of bytes per row queue. Use 0 for no limit.

* `--stats`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>4

  Save information about options related to performance and other internal statistics in files named `*.sto` and `*.stt`. These files are always kept on successful completion (even if [`--keep-state`](mysql-cluster-programs-ndb-import.html#option_ndb_import_keep-state) is not also specified).

* `--state-dir`=*`name`*

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>5

  Where to write the state files (`tbl_name.map`, `tbl_name.rej`, `tbl_name.res`, and `tbl_name.stt`) produced by a run of the program; the default is the current directory.

* `--tempdelay`=*`#`*

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>6

  Number of milliseconds to sleep between temporary errors.

* `--temperrors`=*`#`*

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>7

  Number of times a transaction can fail due to a temporary error, per execution batch. The default is 0, which means that any temporary error is fatal. Temporary errors do not cause any rows to be added to the `.rej` file.

* `--usage`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>8

  Display help text and exit; same as [`--help`](mysql-cluster-programs-ndb-import.html#option_ndb_import_help).

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>9

  Enable verbose output.

  Note

  Previously, this option controlled the internal logging level for debugging messages. In NDB 7.6, use the [`--log-level`](mysql-cluster-programs-ndb-import.html#option_ndb_import_log-level) option for this purpose instead.

* `--version`

  <table frame="box" rules="all" summary="Properties for connect-retries"><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>0

  Display version information and exit.

As with [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement"), options for field and line formatting much match those used to create the CSV file, whether this was done using [`SELECT INTO ... OUTFILE`](select-into.html "13.2.9.1 SELECT ... INTO Statement"), or by some other means. There is no equivalent to the [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") statement `STARTING WITH` option.

[**ndb\_import**](mysql-cluster-programs-ndb-import.html "21.5.14 ndb_import — Import CSV Data Into NDB") was added in NDB 7.6.
