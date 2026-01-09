### 25.5.13 ndb_import — Import CSV Data Into NDB

**ndb_import** imports CSV-formatted data, such as that produced by **mysqldump** `--tab`, directly into `NDB` using the NDB API. **ndb_import** requires a connection to an NDB management server (**ndb_mgmd**) to function; it does not require a connection to a MySQL Server.

#### Usage

```
ndb_import db_name file_name options
```

**ndb_import** requires two arguments. *`db_name`* is the name of the database where the table into which to import the data is found; *`file_name`* is the name of the CSV file from which to read the data; this must include the path to this file if it is not in the current directory. The name of the file must match that of the table; the file's extension, if any, is not taken into consideration. Options supported by **ndb_import** include those for specifying field separators, escapes, and line terminators, and are described later in this section.

**ndb_import** rejects any empty lines which it reads from the CSV file, except when importing a single column, in which case an empty value can be used as the column value. **ndb_import** handles this in the same manner as a `LOAD DATA` statement does.

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

* `--abort-on-error`

  <table frame="box" rules="all" summary="Properties for abort-on-error"><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr></tbody></table>

  Dump core on any fatal error; used for debugging only.

* `--ai-increment`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-increment"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  For a table with a hidden primary key, specify the autoincrement increment, like the `auto_increment_increment` system variable does in the MySQL Server.

* `--ai-offset`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-offset"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  For a table with hidden primary key, specify the autoincrement offset. Similar to the `auto_increment_offset` system variable.

* `--ai-prefetch-sz`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-prefetch-sz"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1024</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  For a table with a hidden primary key, specify the number of autoincrement values that are prefetched. Behaves like the `ndb_autoincrement_prefetch_sz` system variable does in the MySQL Server.

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Directory containing character sets.

* `--connections`=*`#`*

  <table frame="box" rules="all" summary="Properties for connections"><tbody><tr><th>Command-Line Format</th> <td><code>--connections=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Number of cluster connections to create.

* `--connect-retries`

  <table frame="box" rules="all" summary="Properties for connect-retries"><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>

  Number of times to retry connection before giving up.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>5</code></td> </tr></tbody></table>

  Number of seconds to wait between attempts to contact management server.

* `--connect-string`

  <table frame="box" rules="all" summary="Properties for connect-string"><tbody><tr><th>Command-Line Format</th> <td><code>--connect-string=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Same as `--ndb-connectstring`.

* `--continue`

  <table frame="box" rules="all" summary="Properties for continue"><tbody><tr><th>Command-Line Format</th> <td><code>--continue</code></td> </tr></tbody></table>

  When a job fails, continue to the next job.

* `--core-file`

  <table frame="box" rules="all" summary="Properties for ai-increment"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Write core file on error; used in debugging.

* `--csvopt`=*`string`*

  <table frame="box" rules="all" summary="Properties for ai-increment"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Provides a shortcut method for setting typical CSV import options. The argument to this option is a string consisting of one or more of the following parameters:

  + `c`: Fields terminated by comma
  + `d`: Use defaults, except where overridden by another parameter

  + `n`: Lines terminated by `\n`

  + `q`: Fields optionally enclosed by double quote characters (`"`)

  + `r`: Line terminated by `\r`

  The order of parameters used in the argument to this option is handled such that the rightmost parameter always takes precedence over any potentially conflicting parameters which have already been used in the same argument value. This also applies to any duplicate instances of a given parameter.

  This option is intended for use in testing under conditions in which it is difficult to transmit escapes or quotation marks.

* `--db-workers`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-increment"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Number of threads, per data node, executing database operations.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for ai-increment"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Read default options from given file only.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for ai-increment"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Read given file after global files are read.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for ai-increment"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Also read groups with concat(group, suffix).

* `--errins-type`=*`name`*

  <table frame="box" rules="all" summary="Properties for ai-increment"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Error insert type; use `list` as the *`name`* value to obtain all possible values. This option is used for testing purposes only.

* `--errins-delay`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-increment"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Error insert delay in milliseconds; random variation is added. This option is used for testing purposes only.

* `--fields-enclosed-by`=*`char`*

  <table frame="box" rules="all" summary="Properties for ai-increment"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  This works in the same way as the `FIELDS ENCLOSED BY` option does for the `LOAD DATA` statement, specifying a character to be interpreted as quoting field values. For CSV input, this is the same as `--fields-optionally-enclosed-by`.

* `--fields-escaped-by`=*`name`*

  <table frame="box" rules="all" summary="Properties for ai-increment"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Specify an escape character in the same way as the `FIELDS ESCAPED BY` option does for the SQL `LOAD DATA` statement.

* `--fields-optionally-enclosed-by`=*`char`*

  <table frame="box" rules="all" summary="Properties for ai-offset"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  This works in the same way as the `FIELDS OPTIONALLY ENCLOSED BY` option does for the `LOAD DATA` statement, specifying a character to be interpreted as optionally quoting field values. For CSV input, this is the same as `--fields-enclosed-by`.

* `--fields-terminated-by`=*`char`*

  <table frame="box" rules="all" summary="Properties for ai-offset"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  This works in the same way as the `FIELDS TERMINATED BY` option does for the `LOAD DATA` statement, specifying a character to be interpreted as the field separator.

* `--help`

  <table frame="box" rules="all" summary="Properties for ai-offset"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Display help text and exit.

* `--idlesleep`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-offset"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Number of milliseconds to sleep waiting for more work to perform.

* `--idlespin`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-offset"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Number of times to retry before sleeping.

* `--ignore-lines`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-offset"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Cause ndb_import to ignore the first *`#`* lines of the input file. This can be employed to skip a file header that does not contain any data.

* `--input-type`=*`name`*

  <table frame="box" rules="all" summary="Properties for ai-offset"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Set the type of input type. The default is `csv`; `random` is intended for testing purposes only. .

* `--input-workers`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-offset"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Set the number of threads processing input.

* `--keep-state`

  <table frame="box" rules="all" summary="Properties for ai-offset"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  By default, ndb_import removes all state files (except non-empty `*.rej` files) when it completes a job. Specify this option (nor argument is required) to force the program to retain all state files instead.

* `--lines-terminated-by`=*`name`*

  <table frame="box" rules="all" summary="Properties for ai-offset"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  This works in the same way as the `LINES TERMINATED BY` option does for the `LOAD DATA` statement, specifying a character to be interpreted as end-of-line.

* `--log-level`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-prefetch-sz"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1024</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Performs internal logging at the given level. This option is intended primarily for internal and development use.

  In debug builds of NDB only, the logging level can be set using this option to a maximum of 4.

* `--login-path`

  <table frame="box" rules="all" summary="Properties for ai-prefetch-sz"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1024</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Read given path from login file.

* `--no-login-paths`

  <table frame="box" rules="all" summary="Properties for ai-prefetch-sz"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1024</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Skips reading options from the login path file.

* `--max-rows`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-prefetch-sz"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1024</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Import only this number of input data rows; the default is 0, which imports all rows.

* `--missing-ai-column`

  <table frame="box" rules="all" summary="Properties for ai-prefetch-sz"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1024</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  This option can be employed when importing a single table, or multiple tables. When used, it indicates that the CSV file being imported does not contain any values for an `AUTO_INCREMENT` column, and that **ndb_import** should supply them; if the option is used and the `AUTO_INCREMENT` column contains any values, the import operation cannot proceed.

* `--monitor`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-prefetch-sz"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1024</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Periodically print the status of a running job if something has changed (status, rejected rows, temporary errors). Set to 0 to disable this reporting. Setting to 1 prints any change that is seen. Higher values reduce the frequency of this status reporting.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Properties for ai-prefetch-sz"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1024</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Set connection string for connecting to **ndb_mgmd**. Syntax: `[nodeid=id;][host=]hostname[:port]`. Overrides entries in `NDB_CONNECTSTRING` and `my.cnf`.

* `--ndb-mgm-tls`

  <table frame="box" rules="all" summary="Properties for ai-prefetch-sz"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1024</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Sets the level of TLS support required to connect to the management server; one of `relaxed` or `strict`. `relaxed` (the default) means that a TLS connection is attempted, but success is not required; `strict` means that TLS is required to connect.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Properties for ai-prefetch-sz"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1024</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Same as `--ndb-connectstring`.

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Properties for ai-prefetch-sz"><tbody><tr><th>Command-Line Format</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1024</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Set node ID for this node, overriding any ID set by `--ndb-connectstring`.

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Enable optimizations for selection of nodes for transactions. Enabled by default; use `--skip-ndb-optimized-node-selection` to disable.

* `--ndb-tls-search-path`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Specify a list of directories to search for a CA file. On Unix platforms, the directory names are separated by colons (`:`); on Windows systems, the semicolon character (`;`) is used as the separator. A directory reference may be relative or absolute; it may contain one or more environment variables, each denoted by a prefixed dollar sign (`$`), and expanded prior to use.

  Searching begins with the leftmost named directory and proceeds from left to right until a file is found. An empty string denotes an empty search path, which causes all searches to fail. A string consisting of a single dot (`.`) indicates that the search path limited to the current working directory.

  If no search path is supplied, the compiled-in default value is used. This value depends on the platform used: On Windows, this is `\ndb-tls`; on other platforms (including Linux), it is `$HOME/ndb-tls`. This can be overridden by compiling NDB Cluster using `-DWITH_NDB_TLS_SEARCH_PATH`.

* `--no-asynch`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Run database operations as batches, in single transactions.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Do not read default options from any option file other than login file.

* `--no-hint`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Do not use distribution key hinting to select a data node.

* `--opbatch`=*`#`*

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Set a limit on the number of operations (including blob operations), and thus the number of asynchronous transactions, per execution batch.

* `--opbytes`=*`#`*

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Set a limit on the number of bytes per execution batch. Use 0 for no limit.

* `--output-type`=*`name`*

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Set the output type. `ndb` is the default. `null` is used only for testing.

* `--output-workers`=*`#`*

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Set the number of threads processing output or relaying database operations.

* `--pagesize`=*`#`*

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Align I/O buffers to the given size.

* `--pagecnt`=*`#`*

  <table frame="box" rules="all" summary="Properties for connections"><tbody><tr><th>Command-Line Format</th> <td><code>--connections=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Set the size of I/O buffers as multiple of page size. The CSV input worker allocates buffer that is doubled in size.

* `--polltimeout`=*`#`*

  <table frame="box" rules="all" summary="Properties for connections"><tbody><tr><th>Command-Line Format</th> <td><code>--connections=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Set a timeout per poll for completed asynchronous transactions; polling continues until all polls are completed, or until an error occurs.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for connections"><tbody><tr><th>Command-Line Format</th> <td><code>--connections=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Print program argument list and exit.

* `--rejects`=*`#`*

  <table frame="box" rules="all" summary="Properties for connections"><tbody><tr><th>Command-Line Format</th> <td><code>--connections=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Limit the number of rejected rows (rows with permanent errors) in the data load. The default is 0, which means that any rejected row causes a fatal error. Any rows causing the limit to be exceeded are added to the `.rej` file.

  The limit imposed by this option is effective for the duration of the current run. A run restarted using `--resume` is considered a “new” run for this purpose.

* `--resume`

  <table frame="box" rules="all" summary="Properties for connections"><tbody><tr><th>Command-Line Format</th> <td><code>--connections=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  If a job is aborted (due to a temporary db error or when interrupted by the user), resume with any rows not yet processed.

* `--rowbatch`=*`#`*

  <table frame="box" rules="all" summary="Properties for connections"><tbody><tr><th>Command-Line Format</th> <td><code>--connections=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Set a limit on the number of rows per row queue. Use 0 for no limit.

* `--rowbytes`=*`#`*

  <table frame="box" rules="all" summary="Properties for connections"><tbody><tr><th>Command-Line Format</th> <td><code>--connections=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Set a limit on the number of bytes per row queue. Use 0 for no limit.

* `--stats`

  <table frame="box" rules="all" summary="Properties for connections"><tbody><tr><th>Command-Line Format</th> <td><code>--connections=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Save information about options related to performance and other internal statistics in files named `*.sto` and `*.stt`. These files are always kept on successful completion (even if `--keep-state` is not also specified).

* `--state-dir`=*`name`*

  <table frame="box" rules="all" summary="Properties for connections"><tbody><tr><th>Command-Line Format</th> <td><code>--connections=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Where to write the state files (`tbl_name.map`, `tbl_name.rej`, `tbl_name.res`, and `tbl_name.stt`) produced by a run of the program; the default is the current directory.

* `--table=name`

  <table frame="box" rules="all" summary="Properties for connections"><tbody><tr><th>Command-Line Format</th> <td><code>--connections=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  By default, **ndb_import** attempts to import data into a table whose name is the base name of the CSV file from which the data is being read. You can override the choice of table name by specifying it with the `--table` option (short form `-t`).

* `--tempdelay`=*`#`*

  <table frame="box" rules="all" summary="Properties for connect-retries"><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>

  Number of milliseconds to sleep between temporary errors.

* `--temperrors`=*`#`*

  <table frame="box" rules="all" summary="Properties for connect-retries"><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>

  Number of times a transaction can fail due to a temporary error, per execution batch. The default is 0, which means that any temporary error is fatal. Temporary errors do not cause any rows to be added to the `.rej` file.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for connect-retries"><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>

  Enable verbose output.

* `--usage`

  <table frame="box" rules="all" summary="Properties for connect-retries"><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>

  Display help text and exit; same as `--help`.

* `--version`

  <table frame="box" rules="all" summary="Properties for connect-retries"><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>

  Display version information and exit.

As with `LOAD DATA`, options for field and line formatting much match those used to create the CSV file, whether this was done using `SELECT INTO ... OUTFILE`, or by some other means. There is no equivalent to the `LOAD DATA` statement `STARTING WITH` option.
