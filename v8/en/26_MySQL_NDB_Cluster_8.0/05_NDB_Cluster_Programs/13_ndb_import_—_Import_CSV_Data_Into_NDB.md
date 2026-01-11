### 25.5.13 ndb_import — Import CSV Data Into NDB

**ndb_import** imports CSV-formatted data, such as that produced by **mysqldump** `--tab`, directly into `NDB` using the NDB API. **ndb_import** requires a connection to an NDB management server (**ndb_mgmd**) to function; it does not require a connection to a MySQL Server.

#### Usage

```
ndb_import db_name file_name options
```

**ndb_import** requires two arguments. *`db_name`* is the name of the database where the table into which to import the data is found; *`file_name`* is the name of the CSV file from which to read the data; this must include the path to this file if it is not in the current directory. The name of the file must match that of the table; the file's extension, if any, is not taken into consideration. Options supported by **ndb_import** include those for specifying field separators, escapes, and line terminators, and are described later in this section.

Prior to NDB 8.0.30, **ndb_import** rejects any empty lines which it reads from the CSV file. Beginning with NDB 8.0.30, when importing a single column, an empty value that can be used as the column value, ndb_import handles it in the same manner as a `LOAD DATA` statement does.

**ndb_import** must be able to connect to an NDB Cluster management server; for this reason, there must be an unused `[api]` slot in the cluster `config.ini` file.

To duplicate an existing table that uses a different storage engine, such as `InnoDB`, as an `NDB` table, use the **mysql** client to perform a `SELECT INTO OUTFILE` statement to export the existing table to a CSV file, then to execute a `CREATE TABLE LIKE` statement to create a new table having the same structure as the existing table, then perform `ALTER TABLE ... ENGINE=NDB` on the new table; after this, from the system shell, invoke **ndb_import** to load the data into the new `NDB` table. For example, an existing `InnoDB` table named `myinnodb_table` in a database named `myinnodb` can be exported into an `NDB` table named `myndb_table` in a database named `myndb` as shown here, assuming that you are already logged in as a MySQL user with the appropriate privileges:

1. In the **mysql** client:

   ```
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

   Once the target database and table have been created, a running **mysqld** is no longer required. You can stop it using **mysqladmin shutdown** or another method before proceeding, if you wish.

2. In the system shell:

   ```
   # if you are not already in the MySQL bin directory:
   $> cd path-to-mysql-bin-dir

   $> ndb_import myndb /tmp/myndb_table.csv --fields-optionally-enclosed-by='"' \
       --fields-terminated-by="," --fields-escaped-by='\\'
   ```

   The output should resemble what is shown here:

   ```
   job-1 import myndb.myndb_table from /tmp/myndb_table.csv
   job-1 [running] import myndb.myndb_table from /tmp/myndb_table.csv
   job-1 [success] import myndb.myndb_table from /tmp/myndb_table.csv
   job-1 imported 19984 rows in 0h0m9s at 2277 rows/s
   jobs summary: defined: 1 run: 1 with success: 1 with failure: 0
   $>
   ```

All options that can be used with **ndb_import** are shown in the following table. Additional descriptions follow the table.

**Table 25.35 Command-line options used with the program ndb_import**

<table frame="box" rules="all"><thead><tr> <th scope="col">Format</th> <th scope="col">Description</th> <th scope="col">Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th><p> <code> --abort-on-error </code> </p></th> <td>Dump core on any fatal error; used for debugging</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --ai-increment=# </code> </p></th> <td>For table with hidden PK, specify autoincrement increment. See mysqld</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --ai-offset=# </code> </p></th> <td>For table with hidden PK, specify autoincrement offset. See mysqld</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --ai-prefetch-sz=# </code> </p></th> <td>For table with hidden PK, specify number of autoincrement values that are prefetched. See mysqld</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --character-sets-dir=path </code> </p></th> <td>Directory containing character sets</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --connect-retries=# </code> </p></th> <td>Number of times to retry connection before giving up</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --connect-retry-delay=# </code> </p></th> <td>Number of seconds to wait between attempts to contact management server</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--connect-string=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --connections=# </code> </p></th> <td>Number of cluster connections to create</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --continue </code> </p></th> <td>When job fails, continue to next job</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --core-file </code> </p></th> <td>Write core file on error; used in debugging</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --csvopt=opts </code> </p></th> <td>Shorthand option for setting typical CSV option values. See documentation for syntax and other information</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --db-workers=# </code> </p></th> <td>Number of threads, per data node, executing database operations</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-extra-file=path </code> </p></th> <td>Read given file after global files are read</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-file=path </code> </p></th> <td>Read default options from given file only</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-group-suffix=string </code> </p></th> <td>Also read groups with concat(group, suffix)</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --errins-type=name </code> </p></th> <td>Error insert type, for testing purposes; use "list" to obtain all possible values</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --errins-delay=# </code> </p></th> <td>Error insert delay in milliseconds; random variation is added</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --fields-enclosed-by=char </code> </p></th> <td>Same as FIELDS ENCLOSED BY option for LOAD DATA statements. For CSV input this is same as using --fields-optionally-enclosed-by</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --fields-escaped-by=char </code> </p></th> <td>Same as FIELDS ESCAPED BY option for LOAD DATA statements</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --fields-optionally-enclosed-by=char </code> </p></th> <td>Same as FIELDS OPTIONALLY ENCLOSED BY option for LOAD DATA statements</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --fields-terminated-by=char </code> </p></th> <td>Same as FIELDS TERMINATED BY option for LOAD DATA statements</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--help</code>, </p><p> <code> -? </code> </p></th> <td>Display help text and exit</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --idlesleep=# </code> </p></th> <td>Number of milliseconds to sleep waiting for more to do</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --idlespin=# </code> </p></th> <td>Number of times to retry before idlesleep</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --ignore-lines=# </code> </p></th> <td>Ignore first # lines in input file. Used to skip a non-data header</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --input-type=name </code> </p></th> <td>Input type: random or csv</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --input-workers=# </code> </p></th> <td>Number of threads processing input. Must be 2 or more if --input-type is csv</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --keep-state </code> </p></th> <td>State files (except non-empty *.rej files) are normally removed on job completion. Using this option causes all state files to be preserved instead</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --lines-terminated-by=char </code> </p></th> <td>Same as LINES TERMINATED BY option for LOAD DATA statements</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --login-path=path </code> </p></th> <td>Read given path from login file</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --max-rows=# </code> </p></th> <td>Import only this number of input data rows; default is 0, which imports all rows</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --missing-ai-column='name' </code> </p></th> <td>Indicates that auto-increment values are missing from CSV file to be imported.</td> <td><p> ADDED: NDB 8.0.30 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --monitor=# </code> </p></th> <td>Periodically print status of running job if something has changed (status, rejected rows, temporary errors). Value 0 disables. Value 1 prints any change seen. Higher values reduce status printing exponentially up to some pre-defined limit</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-connectstring=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>Set connect string for connecting to ndb_mgmd. Syntax: "[nodeid=id;][host=]hostname[:port]". Overrides entries in NDB_CONNECTSTRING and my.cnf</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-mgmd-host=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --ndb-nodeid=# </code> </p></th> <td>Set node ID for this node, overriding any ID set by --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --ndb-optimized-node-selection </code> </p></th> <td>Enable optimizations for selection of nodes for transactions. Enabled by default; use --skip-ndb-optimized-node-selection to disable</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --no-asynch </code> </p></th> <td>Run database operations as batches, in single transactions</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --no-defaults </code> </p></th> <td>Do not read default options from any option file other than login file</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --no-hint </code> </p></th> <td>Tells transaction coordinator not to use distribution key hint when selecting data node</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --opbatch=# </code> </p></th> <td>A db execution batch is a set of transactions and operations sent to NDB kernel. This option limits NDB operations (including blob operations) in a db execution batch. Therefore it also limits number of asynch transactions. Value 0 is not valid</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --opbytes=# </code> </p></th> <td>Limit bytes in execution batch (default 0 = no limit)</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --output-type=name </code> </p></th> <td>Output type: ndb is default, null used for testing</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --output-workers=# </code> </p></th> <td>Number of threads processing output or relaying database operations</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --pagesize=# </code> </p></th> <td>Align I/O buffers to given size</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --pagecnt=# </code> </p></th> <td>Size of I/O buffers as multiple of page size. CSV input worker allocates double-sized buffer</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --polltimeout=# </code> </p></th> <td>Timeout per poll for completed asynchonous transactions; polling continues until all polls are completed, or error occurs</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --print-defaults </code> </p></th> <td>Print program argument list and exit</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --rejects=# </code> </p></th> <td>Limit number of rejected rows (rows with permanent error) in data load. Default is 0 which means that any rejected row causes a fatal error. The row exceeding the limit is also added to *.rej</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --resume </code> </p></th> <td>If job aborted (temporary error, user interrupt), resume with rows not yet processed</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --rowbatch=# </code> </p></th> <td>Limit rows in row queues (default 0 = no limit); must be 1 or more if --input-type is random</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --rowbytes=# </code> </p></th> <td>Limit bytes in row queues (0 = no limit)</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --state-dir=path </code> </p></th> <td>Where to write state files; currect directory is default</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --stats </code> </p></th> <td>Save performance related options and internal statistics in *.sto and *.stt files. These files are kept on successful completion even if --keep-state is not used</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--table=name</code>, </p><p> <code> -t name </code> </p></th> <td>Name of target to import data into; default is base name of input file</td> <td><p> ADDED: NDB 8.0.28 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --tempdelay=# </code> </p></th> <td>Number of milliseconds to sleep between temporary errors</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --temperrors=# </code> </p></th> <td>Number of times a transaction can fail due to a temporary error, per execution batch; 0 means any temporary error is fatal. Such errors do not cause any rows to be written to .rej file</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--usage</code>, </p><p> <code> -? </code> </p></th> <td>Display help text and exit; same as --help</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--verbose[=#]</code>, </p><p> <code> -v [#] </code> </p></th> <td>Enable verbose output</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--version</code>, </p><p> <code> -V </code> </p></th> <td>Display version information and exit</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody></table>

* `--abort-on-error`

  <table summary="Properties for abort-on-error"><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr></tbody></table>

  Dump core on any fatal error; used for debugging only.

* `--ai-increment`=*`#`*

  <table summary="Properties for ai-increment"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  For a table with a hidden primary key, specify the autoincrement increment, like the `auto_increment_increment` system variable does in the MySQL Server.

* `--ai-offset`=*`#`*

  <table summary="Properties for ai-offset"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  For a table with hidden primary key, specify the autoincrement offset. Similar to the `auto_increment_offset` system variable.

* `--ai-prefetch-sz`=*`#`*

  <table summary="Properties for ai-prefetch-sz"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1024</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  For a table with a hidden primary key, specify the number of autoincrement values that are prefetched. Behaves like the `ndb_autoincrement_prefetch_sz` system variable does in the MySQL Server.

* `--character-sets-dir`

  <table summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Directory containing character sets.

* `--connections`=*`#`*

  <table summary="Properties for connections"><tbody><tr><th>Command-Line Format</th> <td><code>--connections=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Number of cluster connections to create.

* `--connect-retries`

  <table summary="Properties for connect-retries"><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>

  Number of times to retry connection before giving up.

* `--connect-retry-delay`

  <table summary="Properties for connect-retry-delay"><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>5</code></td> </tr></tbody></table>

  Number of seconds to wait between attempts to contact management server.

* `--connect-string`

  <table summary="Properties for connect-string"><tbody><tr><th>Command-Line Format</th> <td><code>--connect-string=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Same as `--ndb-connectstring`.

* `--continue`

  <table summary="Properties for abort-on-error"><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr></tbody></table>0

  When a job fails, continue to the next job.

* `--core-file`

  <table summary="Properties for abort-on-error"><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr></tbody></table>1

  Write core file on error; used in debugging.

* `--csvopt`=*`string`*

  <table summary="Properties for abort-on-error"><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr></tbody></table>2

  Provides a shortcut method for setting typical CSV import options. The argument to this option is a string consisting of one or more of the following parameters:

  + `c`: Fields terminated by comma
  + `d`: Use defaults, except where overridden by another parameter

  + `n`: Lines terminated by `\n`

  + `q`: Fields optionally enclosed by double quote characters (`"`)

  + `r`: Line terminated by `\r`

  In NDB 8.0.28 and later, the order of parameters used in the argument to this option is handled such that the rightmost parameter always takes precedence over any potentially conflicting parameters which have already been used in the same argument value. This also applies to any duplicate instances of a given parameter. Prior to NDB 8.0.28, the order of the parameters made no difference, other than that, when both `n` and `r` were specified, the one occurring last (rightmost) was the parameter which actually took effect.

  This option is intended for use in testing under conditions in which it is difficult to transmit escapes or quotation marks.

* `--db-workers`=*`#`*

  <table summary="Properties for abort-on-error"><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr></tbody></table>3

  Number of threads, per data node, executing database operations.

* `--defaults-file`

  <table summary="Properties for abort-on-error"><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr></tbody></table>4

  Read default options from given file only.

* `--defaults-extra-file`

  <table summary="Properties for abort-on-error"><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr></tbody></table>5

  Read given file after global files are read.

* `--defaults-group-suffix`

  <table summary="Properties for abort-on-error"><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr></tbody></table>6

  Also read groups with concat(group, suffix).

* `--errins-type`=*`name`*

  <table summary="Properties for abort-on-error"><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr></tbody></table>7

  Error insert type; use `list` as the *`name`* value to obtain all possible values. This option is used for testing purposes only.

* `--errins-delay`=*`#`*

  <table summary="Properties for abort-on-error"><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr></tbody></table>8

  Error insert delay in milliseconds; random variation is added. This option is used for testing purposes only.

* `--fields-enclosed-by`=*`char`*

  <table summary="Properties for abort-on-error"><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr></tbody></table>9

  This works in the same way as the `FIELDS ENCLOSED BY` option does for the `LOAD DATA` statement, specifying a character to be interpreted as quoting field values. For CSV input, this is the same as `--fields-optionally-enclosed-by`.

* `--fields-escaped-by`=*`name`*

  <table summary="Properties for ai-increment"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>0

  Specify an escape character in the same way as the `FIELDS ESCAPED BY` option does for the SQL `LOAD DATA` statement.

* `--fields-optionally-enclosed-by`=*`char`*

  <table summary="Properties for ai-increment"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>1

  This works in the same way as the `FIELDS OPTIONALLY ENCLOSED BY` option does for the `LOAD DATA` statement, specifying a character to be interpreted as optionally quoting field values. For CSV input, this is the same as `--fields-enclosed-by`.

* `--fields-terminated-by`=*`char`*

  <table summary="Properties for ai-increment"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>2

  This works in the same way as the `FIELDS TERMINATED BY` option does for the `LOAD DATA` statement, specifying a character to be interpreted as the field separator.

* `--help`

  <table summary="Properties for ai-increment"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>3

  Display help text and exit.

* `--idlesleep`=*`#`*

  <table summary="Properties for ai-increment"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>4

  Number of milliseconds to sleep waiting for more work to perform.

* `--idlespin`=*`#`*

  <table summary="Properties for ai-increment"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>5

  Number of times to retry before sleeping.

* `--ignore-lines`=*`#`*

  <table summary="Properties for ai-increment"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>6

  Cause ndb_import to ignore the first *`#`* lines of the input file. This can be employed to skip a file header that does not contain any data.

* `--input-type`=*`name`*

  <table summary="Properties for ai-increment"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>7

  Set the type of input type. The default is `csv`; `random` is intended for testing purposes only. .

* `--input-workers`=*`#`*

  <table summary="Properties for ai-increment"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>8

  Set the number of threads processing input.

* `--keep-state`

  <table summary="Properties for ai-increment"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>9

  By default, ndb_import removes all state files (except non-empty `*.rej` files) when it completes a job. Specify this option (nor argument is required) to force the program to retain all state files instead.

* `--lines-terminated-by`=*`name`*

  <table summary="Properties for ai-offset"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>0

  This works in the same way as the `LINES TERMINATED BY` option does for the `LOAD DATA` statement, specifying a character to be interpreted as end-of-line.

* `--log-level`=*`#`*

  <table summary="Properties for ai-offset"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>1

  Performs internal logging at the given level. This option is intended primarily for internal and development use.

  In debug builds of NDB only, the logging level can be set using this option to a maximum of 4.

* `--login-path`

  <table summary="Properties for ai-offset"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>2

  Read given path from login file.

* `--max-rows`=*`#`*

  <table summary="Properties for ai-offset"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>3

  Import only this number of input data rows; the default is 0, which imports all rows.

* `--missing-ai-column`

  <table summary="Properties for ai-offset"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>4

  This option can be employed when importing a single table, or multiple tables. When used, it indicates that the CSV file being imported does not contain any values for an `AUTO_INCREMENT` column, and that **ndb_import** should supply them; if the option is used and the `AUTO_INCREMENT` column contains any values, the import operation cannot proceed.

* `--monitor`=*`#`*

  <table summary="Properties for ai-offset"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>5

  Periodically print the status of a running job if something has changed (status, rejected rows, temporary errors). Set to 0 to disable this reporting. Setting to 1 prints any change that is seen. Higher values reduce the frequency of this status reporting.

* `--ndb-connectstring`

  <table summary="Properties for ai-offset"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>6

  Set connect string for connecting to ndb_mgmd. Syntax: "[nodeid=id;][host=]hostname[:port]". Overrides entries in NDB_CONNECTSTRING and my.cnf.

* `--ndb-mgmd-host`

  <table summary="Properties for ai-offset"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>7

  Same as `--ndb-connectstring`.

* `--ndb-nodeid`

  <table summary="Properties for ai-offset"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>8

  Set node ID for this node, overriding any ID set by `--ndb-connectstring`.

* `--ndb-optimized-node-selection`

  <table summary="Properties for ai-offset"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>9

  Enable optimizations for selection of nodes for transactions. Enabled by default; use `--skip-ndb-optimized-node-selection` to disable.

* `--no-asynch`

  <table summary="Properties for ai-prefetch-sz"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1024</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>0

  Run database operations as batches, in single transactions.

* `--no-defaults`

  <table summary="Properties for ai-prefetch-sz"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1024</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>1

  Do not read default options from any option file other than login file.

* `--no-hint`

  <table summary="Properties for ai-prefetch-sz"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1024</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>2

  Do not use distribution key hinting to select a data node.

* `--opbatch`=*`#`*

  <table summary="Properties for ai-prefetch-sz"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1024</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>3

  Set a limit on the number of operations (including blob operations), and thus the number of asynchronous transactions, per execution batch.

* `--opbytes`=*`#`*

  <table summary="Properties for ai-prefetch-sz"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1024</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>4

  Set a limit on the number of bytes per execution batch. Use 0 for no limit.

* `--output-type`=*`name`*

  <table summary="Properties for ai-prefetch-sz"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1024</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>5

  Set the output type. `ndb` is the default. `null` is used only for testing.

* `--output-workers`=*`#`*

  <table summary="Properties for ai-prefetch-sz"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1024</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>6

  Set the number of threads processing output or relaying database operations.

* `--pagesize`=*`#`*

  <table summary="Properties for ai-prefetch-sz"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1024</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>7

  Align I/O buffers to the given size.

* `--pagecnt`=*`#`*

  <table summary="Properties for ai-prefetch-sz"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1024</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>8

  Set the size of I/O buffers as multiple of page size. The CSV input worker allocates buffer that is doubled in size.

* `--polltimeout`=*`#`*

  <table summary="Properties for ai-prefetch-sz"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1024</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>9

  Set a timeout per poll for completed asynchronous transactions; polling continues until all polls are completed, or until an error occurs.

* `--print-defaults`

  <table summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>0

  Print program argument list and exit.

* `--rejects`=*`#`*

  <table summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>1

  Limit the number of rejected rows (rows with permanent errors) in the data load. The default is 0, which means that any rejected row causes a fatal error. Any rows causing the limit to be exceeded are added to the `.rej` file.

  The limit imposed by this option is effective for the duration of the current run. A run restarted using `--resume` is considered a “new” run for this purpose.

* `--resume`

  <table summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>2

  If a job is aborted (due to a temporary db error or when interrupted by the user), resume with any rows not yet processed.

* `--rowbatch`=*`#`*

  <table summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>3

  Set a limit on the number of rows per row queue. Use 0 for no limit.

* `--rowbytes`=*`#`*

  <table summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>4

  Set a limit on the number of bytes per row queue. Use 0 for no limit.

* `--stats`

  <table summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>5

  Save information about options related to performance and other internal statistics in files named `*.sto` and `*.stt`. These files are always kept on successful completion (even if `--keep-state` is not also specified).

* `--state-dir`=*`name`*

  <table summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>6

  Where to write the state files (`tbl_name.map`, `tbl_name.rej`, `tbl_name.res`, and `tbl_name.stt`) produced by a run of the program; the default is the current directory.

* `--table=name`

  <table summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>7

  By default, **ndb_import** attempts to import data into a table whose name is the base name of the CSV file from which the data is being read. Beginning with NDB 8.0.28, you can override the choice of table name by specifying it using the `--table` option (short form `-t`).

* `--tempdelay`=*`#`*

  <table summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>8

  Number of milliseconds to sleep between temporary errors.

* `--temperrors`=*`#`*

  <table summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>9

  Number of times a transaction can fail due to a temporary error, per execution batch. The default is 0, which means that any temporary error is fatal. Temporary errors do not cause any rows to be added to the `.rej` file.

* `--verbose`, `-v`

  <table summary="Properties for connections"><tbody><tr><th>Command-Line Format</th> <td><code>--connections=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>0

  Enable verbose output.

* `--usage`

  <table summary="Properties for connections"><tbody><tr><th>Command-Line Format</th> <td><code>--connections=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>1

  Display help text and exit; same as `--help`.

* `--version`

  <table summary="Properties for connections"><tbody><tr><th>Command-Line Format</th> <td><code>--connections=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>2

  Display version information and exit.

As with `LOAD DATA`, options for field and line formatting much match those used to create the CSV file, whether this was done using `SELECT INTO ... OUTFILE`, or by some other means. There is no equivalent to the `LOAD DATA` statement `STARTING WITH` option.
