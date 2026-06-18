## 4.6 Administrative and Utility Programs

This section describes administrative programs and programs that perform miscellaneous utility operations.

### 4.6.1 innochecksum — Offline InnoDB File Checksum Utility

**innochecksum** prints checksums for `InnoDB` files. This tool reads an `InnoDB` tablespace file, calculates the checksum for each page, compares the calculated checksum to the stored checksum, and reports mismatches, which indicate damaged pages. It was originally developed to speed up verifying the integrity of tablespace files after power outages but can also be used after file copies. Because checksum mismatches cause `InnoDB` to deliberately shut down a running server, it may be preferable to use this tool rather than waiting for an in-production server to encounter the damaged pages.

**innochecksum** cannot be used on tablespace files that the server already has open. For such files, you should use `CHECK TABLE` to check tables within the tablespace. Attempting to run **innochecksum** on a tablespace that the server already has open results in an Unable to lock file error.

If checksum mismatches are found, restore the tablespace from backup or start the server and attempt to use **mysqldump** to make a backup of the tables within the tablespace.

Invoke **innochecksum** like this:

```sql
innochecksum [options] file_name
```

#### innochecksum Options

**innochecksum** supports the following options. For options that refer to page numbers, the numbers are zero-based.

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>false</code></td> </tr></tbody></table>

  Displays command line help. Example usage:

  ```sql
  innochecksum --help
  ```

* `--info`, `-I`

  <table frame="box" rules="all" summary="Properties for info"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--info</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>false</code></td> </tr></tbody></table>

  Synonym for `--help`. Displays command line help. Example usage:

  ```sql
  innochecksum --info
  ```

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for version"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--version</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>false</code></td> </tr></tbody></table>

  Displays version information. Example usage:

  ```sql
  innochecksum --version
  ```

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for verbose"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--verbose</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>false</code></td> </tr></tbody></table>

  Verbose mode; prints a progress indicator to the log file every five seconds. In order for the progress indicator to be printed, the log file must be specified using the `--log option`. To turn on `verbose` mode, run:

  ```sql
  innochecksum --verbose
  ```

  To turn off verbose mode, run:

  ```sql
  innochecksum --verbose=FALSE
  ```

  The `--verbose` option and `--log` option can be specified at the same time. For example:

  ```sql
  innochecksum --verbose --log=/var/lib/mysql/test/logtest.txt
  ```

  To locate the progress indicator information in the log file, you can perform the following search:

  ```sql
  cat ./logtest.txt | grep -i "okay"
  ```

  The progress indicator information in the log file appears similar to the following:

  ```sql
  page 1663 okay: 2.863% done
  page 8447 okay: 14.537% done
  page 13695 okay: 23.568% done
  page 18815 okay: 32.379% done
  page 23039 okay: 39.648% done
  page 28351 okay: 48.789% done
  page 33023 okay: 56.828% done
  page 37951 okay: 65.308% done
  page 44095 okay: 75.881% done
  page 49407 okay: 85.022% done
  page 54463 okay: 93.722% done
  ...
  ```

* `--count`, `-c`

  <table frame="box" rules="all" summary="Properties for count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--count</code></td> </tr><tr><th>Type</th> <td>Base name</td> </tr><tr><th>Default Value</th> <td><code>true</code></td> </tr></tbody></table>

  Print a count of the number of pages in the file and exit. Example usage:

  ```sql
  innochecksum --count ../data/test/tab1.ibd
  ```

* `--start-page=num`, `-s num`

  <table frame="box" rules="all" summary="Properties for start-page"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--start-page=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr></tbody></table>

  Start at this page number. Example usage:

  ```sql
  innochecksum --start-page=600 ../data/test/tab1.ibd
  ```

  or:

  ```sql
  innochecksum -s 600 ../data/test/tab1.ibd
  ```

* `--end-page=num`, `-e num`

  <table frame="box" rules="all" summary="Properties for end-page"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--end-page=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709551615</code></td> </tr></tbody></table>

  End at this page number. Example usage:

  ```sql
  innochecksum --end-page=700 ../data/test/tab1.ibd
  ```

  or:

  ```sql
  innochecksum --p 700 ../data/test/tab1.ibd
  ```

* `--page=num`, `-p num`

  <table frame="box" rules="all" summary="Properties for page"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--page=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr></tbody></table>

  Check only this page number. Example usage:

  ```sql
  innochecksum --page=701 ../data/test/tab1.ibd
  ```

* `--strict-check`, `-C`

  <table frame="box" rules="all" summary="Properties for strict-check"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--strict-check=algorithm</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>crc32</code></td> </tr><tr><th>Valid Values</th> <td><code>innodb</code><code>crc32</code><code>none</code></td> </tr></tbody></table>

  Specify a strict checksum algorithm. Options include `innodb`, `crc32`, and `none`.

  In this example, the `innodb` checksum algorithm is specified:

  ```sql
  innochecksum --strict-check=innodb ../data/test/tab1.ibd
  ```

  In this example, the `crc32` checksum algorithm is specified:

  ```sql
  innochecksum -C crc32 ../data/test/tab1.ibd
  ```

  The following conditions apply:

  + If you do not specify the `--strict-check` option, **innochecksum** validates against `innodb`, `crc32` and `none`.

  + If you specify the `none` option, only checksums generated by `none` are allowed.

  + If you specify the `innodb` option, only checksums generated by `innodb` are allowed.

  + If you specify the `crc32` option, only checksums generated by `crc32` are allowed.

* `--no-check`, `-n`

  <table frame="box" rules="all" summary="Properties for no-check"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--no-check</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>false</code></td> </tr></tbody></table>

  Ignore the checksum verification when rewriting a checksum. This option may only be used with the **innochecksum** `--write` option. If the `--write` option is not specified, **innochecksum** terminates.

  In this example, an `innodb` checksum is rewritten to replace an invalid checksum:

  ```sql
  innochecksum --no-check --write innodb ../data/test/tab1.ibd
  ```

* `--allow-mismatches`, `-a`

  <table frame="box" rules="all" summary="Properties for info"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--info</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>false</code></td> </tr></tbody></table>0

  The maximum number of checksum mismatches allowed before **innochecksum** terminates. The default setting is 0. If `--allow-mismatches=`*`N`*, where `N>=0`, *`N`* mismatches are permitted and **innochecksum** terminates at `N+1`. When `--allow-mismatches` is set to 0, **innochecksum** terminates on the first checksum mismatch.

  In this example, an existing `innodb` checksum is rewritten to set `--allow-mismatches` to 1.

  ```sql
  innochecksum --allow-mismatches=1 --write innodb ../data/test/tab1.ibd
  ```

  With `--allow-mismatches` set to 1, if there is a mismatch at page 600 and another at page 700 on a file with 1000 pages, the checksum is updated for pages 0-599 and 601-699. Because `--allow-mismatches` is set to 1, the checksum tolerates the first mismatch and terminates on the second mismatch, leaving page 600 and pages 700-999 unchanged.

* `--write=name`, `-w num`

  <table frame="box" rules="all" summary="Properties for info"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--info</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>false</code></td> </tr></tbody></table>1

  Rewrite a checksum. When rewriting an invalid checksum, the `--no-check` option must be used together with the `--write` option. The `--no-check` option tells **innochecksum** to ignore verification of the invalid checksum. You do not have to specify the `--no-check` option if the current checksum is valid.

  An algorithm must be specified when using the `--write` option. Possible values for the `--write` option are:

  + `innodb`: A checksum calculated in software, using the original algorithm from `InnoDB`.

  + `crc32`: A checksum calculated using the `crc32` algorithm, possibly done with a hardware assist.

  + `none`: A constant number.

  The `--write` option rewrites entire pages to disk. If the new checksum is identical to the existing checksum, the new checksum is not written to disk in order to minimize I/O.

  **innochecksum** obtains an exclusive lock when the `--write` option is used.

  In this example, a `crc32` checksum is written for `tab1.ibd`:

  ```sql
  innochecksum -w crc32 ../data/test/tab1.ibd
  ```

  In this example, a `crc32` checksum is rewritten to replace an invalid `crc32` checksum:

  ```sql
  innochecksum --no-check --write crc32 ../data/test/tab1.ibd
  ```

* `--page-type-summary`, `-S`

  <table frame="box" rules="all" summary="Properties for info"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--info</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>false</code></td> </tr></tbody></table>2

  Display a count of each page type in a tablespace. Example usage:

  ```sql
  innochecksum --page-type-summary ../data/test/tab1.ibd
  ```

  Sample output for `--page-type-summary`:

  ```sql
  File::../data/test/tab1.ibd
  ================PAGE TYPE SUMMARY==============
  #PAGE_COUNT PAGE_TYPE
  ===============================================
         2        Index page
         0        Undo log page
         1        Inode page
         0        Insert buffer free list page
         2        Freshly allocated page
         1        Insert buffer bitmap
         0        System page
         0        Transaction system page
         1        File Space Header
         0        Extent descriptor page
         0        BLOB page
         0        Compressed BLOB page
         0        Other type of page
  ===============================================
  Additional information:
  Undo page type: 0 insert, 0 update, 0 other
  Undo page state: 0 active, 0 cached, 0 to_free, 0 to_purge, 0 prepared, 0 other
  ```

* `--page-type-dump`, `-D`

  <table frame="box" rules="all" summary="Properties for info"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--info</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>false</code></td> </tr></tbody></table>3

  Dump the page type information for each page in a tablespace to `stderr` or `stdout`. Example usage:

  ```sql
  innochecksum --page-type-dump=/tmp/a.txt ../data/test/tab1.ibd
  ```

* `--log`, `-l`

  <table frame="box" rules="all" summary="Properties for info"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--info</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>false</code></td> </tr></tbody></table>4

  Log output for the **innochecksum** tool. A log file name must be provided. Log output contains checksum values for each tablespace page. For uncompressed tables, LSN values are also provided. The `--log` replaces the `--debug` option, which was available in earlier releases. Example usage:

  ```sql
  innochecksum --log=/tmp/log.txt ../data/test/tab1.ibd
  ```

  or:

  ```sql
  innochecksum -l /tmp/log.txt ../data/test/tab1.ibd
  ```

* `-` option.

  Specify the `-` option to read from standard input. If the `-` option is missing when “read from standard in” is expected, **innochecksum** prints **innochecksum** usage information indicating that the “-” option was omitted. Example usages:

  ```sql
  cat t1.ibd | innochecksum -
  ```

  In this example, **innochecksum** writes the `crc32` checksum algorithm to `a.ibd` without changing the original `t1.ibd` file.

  ```sql
  cat t1.ibd | innochecksum --write=crc32 - > a.ibd
  ```

#### Running innochecksum on Multiple User-defined Tablespace Files

The following examples demonstrate how to run **innochecksum** on multiple user-defined tablespace files (`.ibd` files).

Run **innochecksum** for all tablespace (`.ibd`) files in the “test” database:

```sql
innochecksum ./data/test/*.ibd
```

Run **innochecksum** for all tablespace files (`.ibd` files) that have a file name starting with “t”:

```sql
innochecksum ./data/test/t*.ibd
```

Run **innochecksum** for all tablespace files (`.ibd` files) in the `data` directory:

```sql
innochecksum ./data/*/*.ibd
```

Note

Running **innochecksum** on multiple user-defined tablespace files is not supported on Windows operating systems, as Windows shells such as **cmd.exe** do not support glob pattern expansion. On Windows systems, **innochecksum** must be run separately for each user-defined tablespace file. For example:

```sql
innochecksum.exe t1.ibd
innochecksum.exe t2.ibd
innochecksum.exe t3.ibd
```

#### Running innochecksum on Multiple System Tablespace Files

By default, there is only one `InnoDB` system tablespace file (`ibdata1`) but multiple files for the system tablespace can be defined using the `innodb_data_file_path` option. In the following example, three files for the system tablespace are defined using the `innodb_data_file_path` option: `ibdata1`, `ibdata2`, and `ibdata3`.

```sql
./bin/mysqld --no-defaults --innodb-data-file-path="ibdata1:10M;ibdata2:10M;ibdata3:10M:autoextend"
```

The three files (`ibdata1`, `ibdata2`, and `ibdata3`) form one logical system tablespace. To run **innochecksum** on multiple files that form one logical system tablespace, **innochecksum** requires the `-` option to read tablespace files in from standard input, which is equivalent to concatenating multiple files to create one single file. For the example provided above, the following **innochecksum** command would be used:

```sql
cat ibdata* | innochecksum -
```

Refer to the **innochecksum** options information for more information about the “-” option.

Note

Running **innochecksum** on multiple files in the same tablespace is not supported on Windows operating systems, as Windows shells such as **cmd.exe** do not support glob pattern expansion. On Windows systems, **innochecksum** must be run separately for each system tablespace file. For example:

```sql
innochecksum.exe ibdata1
innochecksum.exe ibdata2
innochecksum.exe ibdata3
```

### 4.6.2 myisam\_ftdump — Display Full-Text Index information

**myisam\_ftdump** displays information about `FULLTEXT` indexes in `MyISAM` tables. It reads the `MyISAM` index file directly, so it must be run on the server host where the table is located. Before using **myisam\_ftdump**, be sure to issue a `FLUSH TABLES` statement first if the server is running.

**myisam\_ftdump** scans and dumps the entire index, which is not particularly fast. On the other hand, the distribution of words changes infrequently, so it need not be run often.

Invoke **myisam\_ftdump** like this:

```sql
myisam_ftdump [options] tbl_name index_num
```

The *`tbl_name`* argument should be the name of a `MyISAM` table. You can also specify a table by naming its index file (the file with the `.MYI` suffix). If you do not invoke **myisam\_ftdump** in the directory where the table files are located, the table or index file name must be preceded by the path name to the table's database directory. Index numbers begin with 0.

Example: Suppose that the `test` database contains a table named `mytexttable` that has the following definition:

```sql
CREATE TABLE mytexttable
(
  id   INT NOT NULL,
  txt  TEXT NOT NULL,
  PRIMARY KEY (id),
  FULLTEXT (txt)
) ENGINE=MyISAM;
```

The index on `id` is index 0 and the `FULLTEXT` index on `txt` is index 1. If your working directory is the `test` database directory, invoke **myisam\_ftdump** as follows:

```sql
myisam_ftdump mytexttable 1
```

If the path name to the `test` database directory is `/usr/local/mysql/data/test`, you can also specify the table name argument using that path name. This is useful if you do not invoke **myisam\_ftdump** in the database directory:

```sql
myisam_ftdump /usr/local/mysql/data/test/mytexttable 1
```

You can use **myisam\_ftdump** to generate a list of index entries in order of frequency of occurrence like this on Unix-like systems:

```sql
myisam_ftdump -c mytexttable 1 | sort -r
```

On Windows, use:

```sql
myisam_ftdump -c mytexttable 1 | sort /R
```

**myisam\_ftdump** supports the following options:

* `--help`, `-h` `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Display a help message and exit.

* `--count`, `-c`

  <table frame="box" rules="all" summary="Properties for count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--count</code></td> </tr></tbody></table>

  Calculate per-word statistics (counts and global weights).

* `--dump`, `-d`

  <table frame="box" rules="all" summary="Properties for dump"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--dump</code></td> </tr></tbody></table>

  Dump the index, including data offsets and word weights.

* `--length`, `-l`

  <table frame="box" rules="all" summary="Properties for length"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--length</code></td> </tr></tbody></table>

  Report the length distribution.

* `--stats`, `-s`

  <table frame="box" rules="all" summary="Properties for stats"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--stats</code></td> </tr></tbody></table>

  Report global index statistics. This is the default operation if no other operation is specified.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for verbose"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--verbose</code></td> </tr></tbody></table>

  Verbose mode. Print more output about what the program does.

### 4.6.3 myisamchk — MyISAM Table-Maintenance Utility

The **myisamchk** utility gets information about your database tables or checks, repairs, or optimizes them. **myisamchk** works with `MyISAM` tables (tables that have `.MYD` and `.MYI` files for storing data and indexes).

You can also use the `CHECK TABLE` and `REPAIR TABLE` statements to check and repair `MyISAM` tables. See Section 13.7.2.2, “CHECK TABLE Statement”, and Section 13.7.2.5, “REPAIR TABLE Statement”.

The use of **myisamchk** with partitioned tables is not supported.

Caution

It is best to make a backup of a table before performing a table repair operation; under some circumstances the operation might cause data loss. Possible causes include but are not limited to file system errors.

Invoke **myisamchk** like this:

```sql
myisamchk [options] tbl_name ...
```

The *`options`* specify what you want **myisamchk** to do. They are described in the following sections. You can also get a list of options by invoking **myisamchk --help**.

With no options, **myisamchk** simply checks your table as the default operation. To get more information or to tell **myisamchk** to take corrective action, specify options as described in the following discussion.

*`tbl_name`* is the database table you want to check or repair. If you run **myisamchk** somewhere other than in the database directory, you must specify the path to the database directory, because **myisamchk** has no idea where the database is located. In fact, **myisamchk** does not actually care whether the files you are working on are located in a database directory. You can copy the files that correspond to a database table into some other location and perform recovery operations on them there.

You can name several tables on the **myisamchk** command line if you wish. You can also specify a table by naming its index file (the file with the `.MYI` suffix). This enables you to specify all tables in a directory by using the pattern `*.MYI`. For example, if you are in a database directory, you can check all the `MyISAM` tables in that directory like this:

```sql
myisamchk *.MYI
```

If you are not in the database directory, you can check all the tables there by specifying the path to the directory:

```sql
myisamchk /path/to/database_dir/*.MYI
```

You can even check all tables in all databases by specifying a wildcard with the path to the MySQL data directory:

```sql
myisamchk /path/to/datadir/*/*.MYI
```

The recommended way to quickly check all `MyISAM` tables is:

```sql
myisamchk --silent --fast /path/to/datadir/*/*.MYI
```

If you want to check all `MyISAM` tables and repair any that are corrupted, you can use the following command:

```sql
myisamchk --silent --force --fast --update-state \
          --key_buffer_size=64M --myisam_sort_buffer_size=64M \
          --read_buffer_size=1M --write_buffer_size=1M \
          /path/to/datadir/*/*.MYI
```

This command assumes that you have more than 64MB free. For more information about memory allocation with **myisamchk**, see Section 4.6.3.6, “myisamchk Memory Usage”.

For additional information about using **myisamchk**, see Section 7.6, “MyISAM Table Maintenance and Crash Recovery”.

Important

*You must ensure that no other program is using the tables while you are running **myisamchk***. The most effective means of doing so is to shut down the MySQL server while running **myisamchk**, or to lock all tables that **myisamchk** is being used on.

Otherwise, when you run **myisamchk**, it may display the following error message:

```sql
warning: clients are using or haven't closed the table properly
```

This means that you are trying to check a table that has been updated by another program (such as the `mysqld` server) that hasn't yet closed the file or that has died without closing the file properly, which can sometimes lead to the corruption of one or more `MyISAM` tables.

If `mysqld` is running, you must force it to flush any table modifications that are still buffered in memory by using `FLUSH TABLES`. You should then ensure that no one is using the tables while you are running **myisamchk**

However, the easiest way to avoid this problem is to use `CHECK TABLE` instead of **myisamchk** to check tables. See Section 13.7.2.2, “CHECK TABLE Statement”.

**myisamchk** supports the following options, which can be specified on the command line or in the `[myisamchk]` group of an option file. For information about option files used by MySQL programs, see Section 4.2.2.2, “Using Option Files”.

**Table 4.21 myisamchk Options**

<table frame="box" rules="all" summary="Command-line options available for myisamchk.">
  <col style="width: 35%"/>
  <col style="width: 64%"/>
  <thead>
    <tr>
      <th>Option Name</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>--analyze</code></td>
      <td>Analyze the distribution of key values</td>
    </tr>
    <tr>
      <td><code>--backup</code></td>
      <td>Make a backup of the .MYD file as file_name-time.BAK</td>
    </tr>
    <tr>
      <td><code>--block-search</code></td>
      <td>Find the record that a block at the given offset belongs to</td>
    </tr>
    <tr>
      <td><code>--character-sets-dir</code></td>
      <td>Directory where character sets can be found</td>
    </tr>
    <tr>
      <td><code>--check</code></td>
      <td>Check the table for errors</td>
    </tr>
    <tr>
      <td><code>--check-only-changed</code></td>
      <td>Check only tables that have changed since the last check</td>
    </tr>
    <tr>
      <td><code>--correct-checksum</code></td>
      <td>Correct the checksum information for the table</td>
    </tr>
    <tr>
      <td><code>--data-file-length</code></td>
      <td>Maximum length of the data file (when re-creating data file when it is full)</td>
    </tr>
    <tr>
      <td><code>--debug</code></td>
      <td>Write debugging log</td>
    </tr>
    <tr>
      <td><code>--decode_bits</code></td>
      <td>Decode_bits</td>
    </tr>
    <tr>
      <td><code>--defaults-extra-file</code></td>
      <td>Read named option file in addition to usual option files</td>
    </tr>
    <tr>
      <td><code>--defaults-file</code></td>
      <td>Read only named option file</td>
    </tr>
    <tr>
      <td><code>--defaults-group-suffix</code></td>
      <td>Option group suffix value</td>
    </tr>
    <tr>
      <td><code>--description</code></td>
      <td>Print some descriptive information about the table</td>
    </tr>
    <tr>
      <td><code>--extend-check</code></td>
      <td>Do very thorough table check or repair that tries to recover every possible row from the data file</td>
    </tr>
    <tr>
      <td><code>--fast</code></td>
      <td>Check only tables that haven't been closed properly</td>
    </tr>
    <tr>
      <td><code>--force</code></td>
      <td>Do a repair operation automatically if myisamchk finds any errors in the table</td>
    </tr>
    <tr>
      <td><code>--force</code></td>
      <td>Overwrite old temporary files. For use with the -r or -o option</td>
    </tr>
    <tr>
      <td><code>--ft_max_word_len</code></td>
      <td>Maximum word length for FULLTEXT indexes</td>
    </tr>
    <tr>
      <td><code>--ft_min_word_len</code></td>
      <td>Minimum word length for FULLTEXT indexes</td>
    </tr>
    <tr>
      <td><code>--ft_stopword_file</code></td>
      <td>Use stopwords from this file instead of built-in list</td>
    </tr>
    <tr>
      <td><code>--HELP</code></td>
      <td>Display help message and exit</td>
    </tr>
    <tr>
      <td><code>--help</code></td>
      <td>Display help message and exit</td>
    </tr>
    <tr>
      <td><code>--information</code></td>
      <td>Print informational statistics about the table that is checked</td>
    </tr>
    <tr>
      <td><code>--key_buffer_size</code></td>
      <td>Size of buffer used for index blocks for MyISAM tables</td>
    </tr>
    <tr>
      <td><code>--keys-used</code></td>
      <td>A bit-value that indicates which indexes to update</td>
    </tr>
    <tr>
      <td><code>--max-record-length</code></td>
      <td>Skip rows larger than the given length if myisamchk cannot allocate memory to hold them</td>
    </tr>
    <tr>
      <td><code>--medium-check</code></td>
      <td>Do a check that is faster than an --extend-check operation</td>
    </tr>
    <tr>
      <td><code>--myisam_block_size</code></td>
      <td>Block size to be used for MyISAM index pages</td>
    </tr>
    <tr>
      <td><code>--myisam_sort_buffer_size</code></td>
      <td>The buffer that is allocated when sorting the index when doing a REPAIR or when creating indexes with CREATE INDEX or ALTER TABLE</td>
    </tr>
    <tr>
      <td><code>--no-defaults</code></td>
      <td>Read no option files</td>
    </tr>
    <tr>
      <td><code>--parallel-recover</code></td>
      <td>Uses the same technique as -r and -n, but creates all the keys in parallel, using different threads (beta)</td>
    </tr>
    <tr>
      <td><code>--print-defaults</code></td>
      <td>Print default options</td>
    </tr>
    <tr>
      <td><code>--quick</code></td>
      <td>Achieve a faster repair by not modifying the data file</td>
    </tr>
    <tr>
      <td><code>--read_buffer_size</code></td>
      <td>Each thread that does a sequential scan allocates a buffer of this size for each table it scans</td>
    </tr>
    <tr>
      <td><code>--read-only</code></td>
      <td>Do not mark the table as checked</td>
    </tr>
    <tr>
      <td><code>--recover</code></td>
      <td>Do a repair that can fix almost any problem except unique keys that aren't unique</td>
    </tr>
    <tr>
      <td><code>--safe-recover</code></td>
      <td>Do a repair using an old recovery method that reads through all rows in order and updates all index trees based on the rows found</td>
    </tr>
    <tr>
      <td><code>--set-auto-increment</code></td>
      <td>Force AUTO_INCREMENT numbering for new records to start at the given value</td>
    </tr>
    <tr>
      <td><code>--set-collation</code></td>
      <td>Specify the collation to use for sorting table indexes</td>
    </tr>
    <tr>
      <td><code>--silent</code></td>
      <td>Silent mode</td>
    </tr>
    <tr>
      <td><code>--sort_buffer_size</code></td>
      <td>The buffer that is allocated when sorting the index when doing a REPAIR or when creating indexes with CREATE INDEX or ALTER TABLE</td>
    </tr>
    <tr>
      <td><code>--sort-index</code></td>
      <td>Sort the index tree blocks in high-low order</td>
    </tr>
    <tr>
      <td><code>--sort_key_blocks</code></td>
      <td>sort_key_blocks</td>
    </tr>
    <tr>
      <td><code>--sort-records</code></td>
      <td>Sort records according to a particular index</td>
    </tr>
    <tr>
      <td><code>--sort-recover</code></td>
      <td>Force myisamchk to use sorting to resolve the keys even if the temporary files would be very large</td>
    </tr>
    <tr>
      <td><code>--stats_method</code></td>
      <td>Specifies how MyISAM index statistics collection code should treat NULLs</td>
    </tr>
    <tr>
      <td><code>--tmpdir</code></td>
      <td>Directory to be used for storing temporary files</td>
    </tr>
    <tr>
      <td><code>--unpack</code></td>
      <td>Unpack a table that was packed with myisampack</td>
    </tr>
    <tr>
      <td><code>--update-state</code></td>
      <td>Store information in the .MYI file to indicate when the table was checked and whether the table crashed</td>
    </tr>
    <tr>
      <td><code>--verbose</code></td>
      <td>Verbose mode</td>
    </tr>
    <tr>
      <td><code>--version</code></td>
      <td>Display version information and exit</td>
    </tr>
    <tr>
      <td><code>--wait</code></td>
      <td>Wait for locked table to be unlocked, instead of terminating</td>
    </tr>
    <tr>
      <td><code>--write_buffer_size</code></td>
      <td>Write buffer size</td>
    </tr>
  </tbody>
</table>

#### 4.6.3.1 myisamchk General Options

The options described in this section can be used for any type of table maintenance operation performed by **myisamchk**. The sections following this one describe options that pertain only to specific operations, such as table checking or repairing.

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Display a help message and exit. Options are grouped by type of operation.

* `--HELP`, `-H`

  <table frame="box" rules="all" summary="Properties for HELP"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--HELP</code></td> </tr></tbody></table>

  Display a help message and exit. Options are presented in a single list.

* `--debug=debug_options`, `-# debug_options`

  <table frame="box" rules="all" summary="Properties for debug"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--debug[=debug_options]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>d:t:o,/tmp/myisamchk.trace</code></td> </tr></tbody></table>

  Write a debugging log. A typical *`debug_options`* string is `d:t:o,file_name`. The default is `d:t:o,/tmp/myisamchk.trace`.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>

  Read this option file after the global option file but (on Unix) before the user option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>

  Use only the given option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Properties for defaults-group-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-group-suffix=str</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  Read not only the usual option groups, but also groups with the usual names and a suffix of *`str`*. For example, **myisamchk** normally reads the `[myisamchk]` group. If this option is given as `--defaults-group-suffix=_other`, **myisamchk** also reads the `[myisamchk_other]` group.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for no-defaults"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--no-defaults</code></td> </tr></tbody></table>

  Do not read any option files. If program startup fails due to reading unknown options from an option file, `--no-defaults` can be used to prevent them from being read.

  The exception is that the `.mylogin.cnf` file is read in all cases, if it exists. This permits passwords to be specified in a safer way than on the command line even when `--no-defaults` is used. To create `.mylogin.cnf`, use the **mysql\_config\_editor** utility. See Section 4.6.6, “mysql\_config\_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for print-defaults"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--print-defaults</code></td> </tr></tbody></table>

  Print the program name and all options that it gets from option files.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--silent`, `-s`

  <table frame="box" rules="all" summary="Properties for silent"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--silent</code></td> </tr></tbody></table>

  Silent mode. Write output only when errors occur. You can use `-s` twice (`-ss`) to make **myisamchk** very silent.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for verbose"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--verbose</code></td> </tr></tbody></table>

  Verbose mode. Print more information about what the program does. This can be used with `-d` and `-e`. Use `-v` multiple times (`-vv`, `-vvv`) for even more output.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for HELP"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--HELP</code></td> </tr></tbody></table>0

  Display version information and exit.

* `--wait`, `-w`

  <table frame="box" rules="all" summary="Properties for HELP"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--HELP</code></td> </tr></tbody></table>1

  Instead of terminating with an error if the table is locked, wait until the table is unlocked before continuing. If you are running `mysqld` with external locking disabled, the table can be locked only by another **myisamchk** command.

You can also set the following variables by using `--var_name=value` syntax:

<table frame="box" rules="all" summary="Properties for HELP"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--HELP</code></td> </tr></tbody></table>2

The possible **myisamchk** variables and their default values can be examined with **myisamchk --help**:

`myisam_sort_buffer_size` is used when the keys are repaired by sorting keys, which is the normal case when you use `--recover`. `sort_buffer_size` is a deprecated synonym for `myisam_sort_buffer_size`.

`key_buffer_size` is used when you are checking the table with `--extend-check` or when the keys are repaired by inserting keys row by row into the table (like when doing normal inserts). Repairing through the key buffer is used in the following cases:

* You use `--safe-recover`.
* The temporary files needed to sort the keys would be more than twice as big as when creating the key file directly. This is often the case when you have large key values for `CHAR`, `VARCHAR`, or `TEXT` columns, because the sort operation needs to store the complete key values as it proceeds. If you have lots of temporary space and you can force **myisamchk** to repair by sorting, you can use the `--sort-recover` option.

Repairing through the key buffer takes much less disk space than using sorting, but is also much slower.

If you want a faster repair, set the `key_buffer_size` and `myisam_sort_buffer_size` variables to about 25% of your available memory. You can set both variables to large values, because only one of them is used at a time.

`myisam_block_size` is the size used for index blocks.

`stats_method` influences how `NULL` values are treated for index statistics collection when the `--analyze` option is given. It acts like the `myisam_stats_method` system variable. For more information, see the description of `myisam_stats_method` in Section 5.1.7, “Server System Variables”, and Section 8.3.7, “InnoDB and MyISAM Index Statistics Collection”.

`ft_min_word_len` and `ft_max_word_len` indicate the minimum and maximum word length for `FULLTEXT` indexes on `MyISAM` tables. `ft_stopword_file` names the stopword file. These need to be set under the following circumstances.

If you use **myisamchk** to perform an operation that modifies table indexes (such as repair or analyze), the `FULLTEXT` indexes are rebuilt using the default full-text parameter values for minimum and maximum word length and the stopword file unless you specify otherwise. This can result in queries failing.

The problem occurs because these parameters are known only by the server. They are not stored in `MyISAM` index files. To avoid the problem if you have modified the minimum or maximum word length or the stopword file in the server, specify the same `ft_min_word_len`, `ft_max_word_len`, and `ft_stopword_file` values to **myisamchk** that you use for `mysqld`. For example, if you have set the minimum word length to 3, you can repair a table with **myisamchk** like this:

```sql
myisamchk --recover --ft_min_word_len=3 tbl_name.MYI
```

To ensure that **myisamchk** and the server use the same values for full-text parameters, you can place each one in both the `[mysqld]` and `[myisamchk]` sections of an option file:

```sql
[mysqld]
ft_min_word_len=3

[myisamchk]
ft_min_word_len=3
```

An alternative to using **myisamchk** is to use the `REPAIR TABLE`, `ANALYZE TABLE`, `OPTIMIZE TABLE`, or `ALTER TABLE`. These statements are performed by the server, which knows the proper full-text parameter values to use.

#### 4.6.3.2 myisamchk Check Options

**myisamchk** supports the following options for table checking operations:

* `--check`, `-c`

  <table frame="box" rules="all" summary="Properties for check"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--check</code></td> </tr></tbody></table>

  Check the table for errors. This is the default operation if you specify no option that selects an operation type explicitly.

* `--check-only-changed`, `-C`

  <table frame="box" rules="all" summary="Properties for check-only-changed"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--check-only-changed</code></td> </tr></tbody></table>

  Check only tables that have changed since the last check.

* `--extend-check`, `-e`

  <table frame="box" rules="all" summary="Properties for extend-check"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--extend-check</code></td> </tr></tbody></table>

  Check the table very thoroughly. This is quite slow if the table has many indexes. This option should only be used in extreme cases. Normally, **myisamchk** or **myisamchk --medium-check** should be able to determine whether there are any errors in the table.

  If you are using `--extend-check` and have plenty of memory, setting the `key_buffer_size` variable to a large value helps the repair operation run faster.

  See also the description of this option under table repair options.

  For a description of the output format, see Section 4.6.3.5, “Obtaining Table Information with myisamchk”.

* `--fast`, `-F`

  <table frame="box" rules="all" summary="Properties for fast"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--fast</code></td> </tr></tbody></table>

  Check only tables that haven't been closed properly.

* `--force`, `-f`

  <table frame="box" rules="all" summary="Properties for force"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--force</code></td> </tr></tbody></table>

  Do a repair operation automatically if **myisamchk** finds any errors in the table. The repair type is the same as that specified with the `--recover` or `-r` option.

* `--information`, `-i`

  <table frame="box" rules="all" summary="Properties for information"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--information</code></td> </tr></tbody></table>

  Print informational statistics about the table that is checked.

* `--medium-check`, `-m`

  <table frame="box" rules="all" summary="Properties for medium-check"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--medium-check</code></td> </tr></tbody></table>

  Do a check that is faster than an `--extend-check` operation. This finds only 99.99% of all errors, which should be good enough in most cases.

* `--read-only`, `-T`

  <table frame="box" rules="all" summary="Properties for read-only"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--read-only</code></td> </tr></tbody></table>

  Do not mark the table as checked. This is useful if you use **myisamchk** to check a table that is in use by some other application that does not use locking, such as `mysqld` when run with external locking disabled.

* `--update-state`, `-U`

  <table frame="box" rules="all" summary="Properties for update-state"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--update-state</code></td> </tr></tbody></table>

  Store information in the `.MYI` file to indicate when the table was checked and whether the table crashed. This should be used to get full benefit of the `--check-only-changed` option, but you shouldn't use this option if the `mysqld` server is using the table and you are running it with external locking disabled.
  
#### 4.6.3.3 myisamchk Repair Options

**myisamchk** supports the following options for table repair operations (operations performed when an option such as `--recover` or `--safe-recover` is given):

* `--backup`, `-B`

  <table frame="box" rules="all" summary="Properties for backup"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup</code></td> </tr></tbody></table>

  Make a backup of the `.MYD` file as `file_name-time.BAK`

* `--character-sets-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  The directory where character sets are installed. See Section 10.15, “Character Set Configuration”.

* `--correct-checksum`

  <table frame="box" rules="all" summary="Properties for correct-checksum"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--correct-checksum</code></td> </tr></tbody></table>

  Correct the checksum information for the table.

* `--data-file-length=len`, `-D len`

  <table frame="box" rules="all" summary="Properties for data-file-length"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--data-file-length=len</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>

  The maximum length of the data file (when re-creating data file when it is “full”).

* `--extend-check`, `-e`

  <table frame="box" rules="all" summary="Properties for extend-check"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--extend-check</code></td> </tr></tbody></table>

  Do a repair that tries to recover every possible row from the data file. Normally, this also finds a lot of garbage rows. Do not use this option unless you are desperate.

  See also the description of this option under table checking options.

  For a description of the output format, see Section 4.6.3.5, “Obtaining Table Information with myisamchk”.

* `--force`, `-f`

  <table frame="box" rules="all" summary="Properties for force"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--force</code></td> </tr></tbody></table>

  Overwrite old intermediate files (files with names like `tbl_name.TMD`) instead of aborting.

* `--keys-used=val`, `-k val`

  <table frame="box" rules="all" summary="Properties for keys-used"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keys-used=val</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>

  For **myisamchk**, the option value is a bit value that indicates which indexes to update. Each binary bit of the option value corresponds to a table index, where the first index is bit 0. An option value of 0 disables updates to all indexes, which can be used to get faster inserts. Deactivated indexes can be reactivated by using **myisamchk -r**.

* `--max-record-length=len`

  <table frame="box" rules="all" summary="Properties for max-record-length"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--max-record-length=len</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>

  Skip rows larger than the given length if **myisamchk** cannot allocate memory to hold them.

* `--parallel-recover`, `-p`

  <table frame="box" rules="all" summary="Properties for parallel-recover"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--parallel-recover</code></td> </tr></tbody></table>

  Note

  This option is deprecated in MySQL 5.7.38 and removed in MySQL 5.7.39.

  Use the same technique as `-r` and `-n`, but create all the keys in parallel, using different threads. *This is beta-quality code. Use at your own risk!*

* `--quick`, `-q`

  <table frame="box" rules="all" summary="Properties for quick"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--quick</code></td> </tr></tbody></table>

  Achieve a faster repair by modifying only the index file, not the data file. You can specify this option twice to force **myisamchk** to modify the original data file in case of duplicate keys.

* `--recover`, `-r`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>0

  Do a repair that can fix almost any problem except unique keys that are not unique (which is an extremely unlikely error with `MyISAM` tables). If you want to recover a table, this is the option to try first. You should try `--safe-recover` only if **myisamchk** reports that the table cannot be recovered using `--recover`. (In the unlikely case that `--recover` fails, the data file remains intact.)

  If you have lots of memory, you should increase the value of `myisam_sort_buffer_size`.

* `--safe-recover`, `-o`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>1

  Do a repair using an old recovery method that reads through all rows in order and updates all index trees based on the rows found. This is an order of magnitude slower than `--recover`, but can handle a couple of very unlikely cases that `--recover` cannot. This recovery method also uses much less disk space than `--recover`. Normally, you should repair first using `--recover`, and then with `--safe-recover` only if `--recover` fails.

  If you have lots of memory, you should increase the value of `key_buffer_size`.

* `--set-collation=name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>2

  Specify the collation to use for sorting table indexes. The character set name is implied by the first part of the collation name.

* `--sort-recover`, `-n`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>3

  Force **myisamchk** to use sorting to resolve the keys even if the temporary files would be very large.

* `--tmpdir=dir_name`, `-t dir_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>4

  The path of the directory to be used for storing temporary files. If this is not set, **myisamchk** uses the value of the `TMPDIR` environment variable. `--tmpdir` can be set to a list of directory paths that are used successively in round-robin fashion for creating temporary files. The separator character between directory names is the colon (`:`) on Unix and the semicolon (`;`) on Windows.

* `--unpack`, `-u`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>5

  Unpack a table that was packed with **myisampack**.

#### 4.6.3.4 Other myisamchk Options

**myisamchk** supports the following options for actions other than table checks and repairs:

* `--analyze`, `-a`

  <table frame="box" rules="all" summary="Properties for analyze"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--analyze</code></td> </tr></tbody></table>

  Analyze the distribution of key values. This improves join performance by enabling the join optimizer to better choose the order in which to join the tables and which indexes it should use. To obtain information about the key distribution, use a **myisamchk --description --verbose *`tbl_name`*** command or the `SHOW INDEX FROM tbl_name` statement.

* `--block-search=offset`, `-b offset`

  <table frame="box" rules="all" summary="Properties for block-search"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--block-search=offset</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>

  Find the record that a block at the given offset belongs to.

* `--description`, `-d`

  <table frame="box" rules="all" summary="Properties for description"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--description</code></td> </tr></tbody></table>

  Print some descriptive information about the table. Specifying the `--verbose` option once or twice produces additional information. See Section 4.6.3.5, “Obtaining Table Information with myisamchk”.

* `--set-auto-increment[=value]`, `-A[value]`

  Force `AUTO_INCREMENT` numbering for new records to start at the given value (or higher, if there are existing records with `AUTO_INCREMENT` values this large). If *`value`* is not specified, `AUTO_INCREMENT` numbers for new records begin with the largest value currently in the table, plus one.

* `--sort-index`, `-S`

  <table frame="box" rules="all" summary="Properties for sort-index"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--sort-index</code></td> </tr></tbody></table>

  Sort the index tree blocks in high-low order. This optimizes seeks and makes table scans that use indexes faster.

* `--sort-records=N`, `-R N`

  <table frame="box" rules="all" summary="Properties for sort-records"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--sort-records=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>

  Sort records according to a particular index. This makes your data much more localized and may speed up range-based `SELECT` and `ORDER BY` operations that use this index. (The first time you use this option to sort a table, it may be very slow.) To determine a table's index numbers, use `SHOW INDEX`, which displays a table's indexes in the same order that **myisamchk** sees them. Indexes are numbered beginning with 1.

  If keys are not packed (`PACK_KEYS=0`), they have the same length, so when **myisamchk** sorts and moves records, it just overwrites record offsets in the index. If keys are packed (`PACK_KEYS=1`), **myisamchk** must unpack key blocks first, then re-create indexes and pack the key blocks again. (In this case, re-creating indexes is faster than updating offsets for each index.)

#### 4.6.3.5 Obtaining Table Information with myisamchk

To obtain a description of a `MyISAM` table or statistics about it, use the commands shown here. The output from these commands is explained later in this section.

* **myisamchk -d *`tbl_name`***

  Runs **myisamchk** in “describe mode” to produce a description of your table. If you start the MySQL server with external locking disabled, **myisamchk** may report an error for a table that is updated while it runs. However, because **myisamchk** does not change the table in describe mode, there is no risk of destroying data.

* **myisamchk -dv *`tbl_name`***

  Adding `-v` runs **myisamchk** in verbose mode so that it produces more information about the table. Adding `-v` a second time produces even more information.

* **myisamchk -eis *`tbl_name`***

  Shows only the most important information from a table. This operation is slow because it must read the entire table.

* **myisamchk -eiv *`tbl_name`***

  This is like `-eis`, but tells you what is being done.

The *`tbl_name`* argument can be either the name of a `MyISAM` table or the name of its index file, as described in Section 4.6.3, “myisamchk — MyISAM Table-Maintenance Utility”. Multiple *`tbl_name`* arguments can be given.

Suppose that a table named `person` has the following structure. (The `MAX_ROWS` table option is included so that in the example output from **myisamchk** shown later, some values are smaller and fit the output format more easily.)

```sql
CREATE TABLE person
(
  id         INT NOT NULL AUTO_INCREMENT,
  last_name  VARCHAR(20) NOT NULL,
  first_name VARCHAR(20) NOT NULL,
  birth      DATE,
  death      DATE,
  PRIMARY KEY (id),
  INDEX (last_name, first_name),
  INDEX (birth)
) MAX_ROWS = 1000000 ENGINE=MYISAM;
```

Suppose also that the table has these data and index file sizes:

```sql
-rw-rw----  1 mysql  mysql  9347072 Aug 19 11:47 person.MYD
-rw-rw----  1 mysql  mysql  6066176 Aug 19 11:47 person.MYI
```

Example of **myisamchk -dvv** output:

```sql
MyISAM file:         person
Record format:       Packed
Character set:       latin1_swedish_ci (8)
File-version:        1
Creation time:       2009-08-19 16:47:41
Recover time:        2009-08-19 16:47:56
Status:              checked,analyzed,optimized keys
Auto increment key:              1  Last value:                306688
Data records:               306688  Deleted blocks:                 0
Datafile parts:             306688  Deleted data:                   0
Datafile pointer (bytes):        4  Keyfile pointer (bytes):        3
Datafile length:           9347072  Keyfile length:           6066176
Max datafile length:    4294967294  Max keyfile length:   17179868159
Recordlength:                   54

table description:
Key Start Len Index   Type                 Rec/key         Root  Blocksize
1   2     4   unique  long                       1        99328       1024
2   6     20  multip. varchar prefix           512      3563520       1024
    27    20          varchar                  512
3   48    3   multip. uint24 NULL           306688      6065152       1024

Field Start Length Nullpos Nullbit Type
1     1     1
2     2     4                      no zeros
3     6     21                     varchar
4     27    21                     varchar
5     48    3      1       1       no zeros
6     51    3      1       2       no zeros
```

Explanations for the types of information **myisamchk** produces are given here. “Keyfile” refers to the index file. “Record” and “row” are synonymous, as are “field” and “column.”

The initial part of the table description contains these values:

* `MyISAM file`

  Name of the `MyISAM` (index) file.

* `Record format`

  The format used to store table rows. The preceding examples use `Fixed length`. Other possible values are `Compressed` and `Packed`. (`Packed` corresponds to what `SHOW TABLE STATUS` reports as `Dynamic`.)

* `Chararacter set`

  The table default character set.

* `File-version`

  Version of `MyISAM` format. Always 1.

* `Creation time`

  When the data file was created.

* `Recover time`

  When the index/data file was last reconstructed.

* `Status`

  Table status flags. Possible values are `crashed`, `open`, `changed`, `analyzed`, `optimized keys`, and `sorted index pages`.

* `Auto increment key`, `Last value`

  The key number associated the table's `AUTO_INCREMENT` column, and the most recently generated value for this column. These fields do not appear if there is no such column.

* `Data records`

  The number of rows in the table.

* `Deleted blocks`

  How many deleted blocks still have reserved space. You can optimize your table to minimize this space. See Section 7.6.4, “MyISAM Table Optimization”.

* `Datafile parts`

  For dynamic-row format, this indicates how many data blocks there are. For an optimized table without fragmented rows, this is the same as `Data records`.

* `Deleted data`

  How many bytes of unreclaimed deleted data there are. You can optimize your table to minimize this space. See Section 7.6.4, “MyISAM Table Optimization”.

* `Datafile pointer`

  The size of the data file pointer, in bytes. It is usually 2, 3, 4, or 5 bytes. Most tables manage with 2 bytes, but this cannot be controlled from MySQL yet. For fixed tables, this is a row address. For dynamic tables, this is a byte address.

* `Keyfile pointer`

  The size of the index file pointer, in bytes. It is usually 1, 2, or 3 bytes. Most tables manage with 2 bytes, but this is calculated automatically by MySQL. It is always a block address.

* `Max datafile length`

  How long the table data file can become, in bytes.

* `Max keyfile length`

  How long the table index file can become, in bytes.

* `Recordlength`

  How much space each row takes, in bytes.

The `table description` part of the output includes a list of all keys in the table. For each key, **myisamchk** displays some low-level information:

* `Key`

  This key's number. This value is shown only for the first column of the key. If this value is missing, the line corresponds to the second or later column of a multiple-column key. For the table shown in the example, there are two `table description` lines for the second index. This indicates that it is a multiple-part index with two parts.

* `Start`

  Where in the row this portion of the index starts.

* `Len`

  How long this portion of the index is. For packed numbers, this should always be the full length of the column. For strings, it may be shorter than the full length of the indexed column, because you can index a prefix of a string column. The total length of a multiple-part key is the sum of the `Len` values for all key parts.

* `Index`

  Whether a key value can exist multiple times in the index. Possible values are `unique` or `multip.` (multiple).

* `Type`

  What data type this portion of the index has. This is a `MyISAM` data type with the possible values `packed`, `stripped`, or `empty`.

* `Root`

  Address of the root index block.

* `Blocksize`

  The size of each index block. By default this is 1024, but the value may be changed at compile time when MySQL is built from source.

* `Rec/key`

  This is a statistical value used by the optimizer. It tells how many rows there are per value for this index. A unique index always has a value of 1. This may be updated after a table is loaded (or greatly changed) with **myisamchk -a**. If this is not updated at all, a default value of 30 is given.

The last part of the output provides information about each column:

* `Field`

  The column number.

* `Start`

  The byte position of the column within table rows.

* `Length`

  The length of the column in bytes.

* `Nullpos`, `Nullbit`

  For columns that can be `NULL`, `MyISAM` stores `NULL` values as a flag in a byte. Depending on how many nullable columns there are, there can be one or more bytes used for this purpose. The `Nullpos` and `Nullbit` values, if nonempty, indicate which byte and bit contains that flag indicating whether the column is `NULL`.

  The position and number of bytes used to store `NULL` flags is shown in the line for field

  1. This is why there are six `Field` lines for the `person` table even though it has only five columns.

* `Type`

  The data type. The value may contain any of the following descriptors:

  + `constant`

    All rows have the same value.

  + `no endspace`

    Do not store endspace.

  + `no endspace, not_always`

    Do not store endspace and do not do endspace compression for all values.

  + `no endspace, no empty`

    Do not store endspace. Do not store empty values.

  + `table-lookup`

    The column was converted to an `ENUM`.

  + `zerofill(N)`

    The most significant *`N`* bytes in the value are always 0 and are not stored.

  + `no zeros`

    Do not store zeros.

  + `always zero`

    Zero values are stored using one bit.

* `Huff tree`

  The number of the Huffman tree associated with the column.

* `Bits`

  The number of bits used in the Huffman tree.

The `Huff tree` and `Bits` fields are displayed if the table has been compressed with **myisampack**. See Section 4.6.5, “myisampack — Generate Compressed, Read-Only MyISAM Tables”, for an example of this information.

Example of **myisamchk -eiv** output:

```sql
Checking MyISAM file: person
Data records:  306688   Deleted blocks:       0
- check file-size
- check record delete-chain
No recordlinks
- check key delete-chain
block_size 1024:
- check index reference
- check data record references index: 1
Key:  1:  Keyblocks used:  98%  Packed:    0%  Max levels:  3
- check data record references index: 2
Key:  2:  Keyblocks used:  99%  Packed:   97%  Max levels:  3
- check data record references index: 3
Key:  3:  Keyblocks used:  98%  Packed:  -14%  Max levels:  3
Total:    Keyblocks used:  98%  Packed:   89%

- check records and index references
*** LOTS OF ROW NUMBERS DELETED ***

Records:            306688  M.recordlength:       25  Packed:            83%
Recordspace used:       97% Empty space:           2% Blocks/Record:   1.00
Record blocks:      306688  Delete blocks:         0
Record data:       7934464  Deleted data:          0
Lost space:         256512  Linkdata:        1156096

User time 43.08, System time 1.68
Maximum resident set size 0, Integral resident set size 0
Non-physical pagefaults 0, Physical pagefaults 0, Swaps 0
Blocks in 0 out 7, Messages in 0 out 0, Signals 0
Voluntary context switches 0, Involuntary context switches 0
Maximum memory usage: 1046926 bytes (1023k)
```

**myisamchk -eiv** output includes the following information:

* `Data records`

  The number of rows in the table.

* `Deleted blocks`

  How many deleted blocks still have reserved space. You can optimize your table to minimize this space. See Section 7.6.4, “MyISAM Table Optimization”.

* `Key`

  The key number.

* `Keyblocks used`

  What percentage of the keyblocks are used. When a table has just been reorganized with **myisamchk**, the values are very high (very near theoretical maximum).

* `Packed`

  MySQL tries to pack key values that have a common suffix. This can only be used for indexes on `CHAR` and `VARCHAR` columns. For long indexed strings that have similar leftmost parts, this can significantly reduce the space used. In the preceding example, the second key is 40 bytes long and a 97% reduction in space is achieved.

* `Max levels`

  How deep the B-tree for this key is. Large tables with long key values get high values.

* `Records`

  How many rows are in the table.

* `M.recordlength`

  The average row length. This is the exact row length for tables with fixed-length rows, because all rows have the same length.

* `Packed`

  MySQL strips spaces from the end of strings. The `Packed` value indicates the percentage of savings achieved by doing this.

* `Recordspace used`

  What percentage of the data file is used.

* `Empty space`

  What percentage of the data file is unused.

* `Blocks/Record`

  Average number of blocks per row (that is, how many links a fragmented row is composed of). This is always 1.0 for fixed-format tables. This value should stay as close to 1.0 as possible. If it gets too large, you can reorganize the table. See Section 7.6.4, “MyISAM Table Optimization”.

* `Recordblocks`

  How many blocks (links) are used. For fixed-format tables, this is the same as the number of rows.

* `Deleteblocks`

  How many blocks (links) are deleted.

* `Recorddata`

  How many bytes in the data file are used.

* `Deleted data`

  How many bytes in the data file are deleted (unused).

* `Lost space`

  If a row is updated to a shorter length, some space is lost. This is the sum of all such losses, in bytes.

* `Linkdata`

  When the dynamic table format is used, row fragments are linked with pointers (4 to 7 bytes each). `Linkdata` is the sum of the amount of storage used by all such pointers.

#### 4.6.3.6 myisamchk Memory Usage

Memory allocation is important when you run **myisamchk**. **myisamchk** uses no more memory than its memory-related variables are set to. If you are going to use **myisamchk** on very large tables, you should first decide how much memory you want it to use. The default is to use only about 3MB to perform repairs. By using larger values, you can get **myisamchk** to operate faster. For example, if you have more than 512MB RAM available, you could use options such as these (in addition to any other options you might specify):

```sql
myisamchk --myisam_sort_buffer_size=256M \
           --key_buffer_size=512M \
           --read_buffer_size=64M \
           --write_buffer_size=64M ...
```

Using `--myisam_sort_buffer_size=16M` is probably enough for most cases.

Be aware that **myisamchk** uses temporary files in `TMPDIR`. If `TMPDIR` points to a memory file system, out of memory errors can easily occur. If this happens, run **myisamchk** with the `--tmpdir=dir_name` option to specify a directory located on a file system that has more space.

When performing repair operations, **myisamchk** also needs a lot of disk space:

* Twice the size of the data file (the original file and a copy). This space is not needed if you do a repair with `--quick`; in this case, only the index file is re-created. *This space must be available on the same file system as the original data file*, as the copy is created in the same directory as the original.

* Space for the new index file that replaces the old one. The old index file is truncated at the start of the repair operation, so you usually ignore this space. This space must be available on the same file system as the original data file.

* When using `--recover` or `--sort-recover` (but not when using `--safe-recover`), you need space on disk for sorting. This space is allocated in the temporary directory (specified by `TMPDIR` or `--tmpdir=dir_name`). The following formula yields the amount of space required:

  ```sql
  (largest_key + row_pointer_length) * number_of_rows * 2
  ```

  You can check the length of the keys and the *`row_pointer_length`* with **myisamchk -dv *`tbl_name`*** (see Section 4.6.3.5, “Obtaining Table Information with myisamchk”). The *`row_pointer_length`* and *`number_of_rows`* values are the `Datafile pointer` and `Data records` values in the table description. To determine the *`largest_key`* value, check the `Key` lines in the table description. The `Len` column indicates the number of bytes for each key part. For a multiple-column index, the key size is the sum of the `Len` values for all key parts.

If you have a problem with disk space during repair, you can try `--safe-recover` instead of `--recover`.

### 4.6.4 myisamlog — Display MyISAM Log File Contents

**myisamlog** processes the contents of a `MyISAM` log file. To create such a file, start the server with a `--log-isam=log_file` option.

Invoke **myisamlog** like this:

```sql
myisamlog [options] [file_name [tbl_name] ...]
```

The default operation is update (`-u`). If a recovery is done (`-r`), all writes and possibly updates and deletes are done and errors are only counted. The default log file name is `myisam.log` if no *`log_file`* argument is given. If tables are named on the command line, only those tables are updated.

**myisamlog** supports the following options:

* `-?`, `-I`

  Display a help message and exit.

* `-c N`

  Execute only *`N`* commands.

* `-f N`

  Specify the maximum number of open files.

* `-F filepath/`

  Specify the file path with a trailing slash.

* `-i`

  Display extra information before exiting.

* `-o offset`

  Specify the starting offset.

* `-p N`

  Remove *`N`* components from path.

* `-r`

  Perform a recovery operation.

* `-R record_pos_file record_pos`

  Specify record position file and record position.

* `-u`

  Perform an update operation.

* `-v`

  Verbose mode. Print more output about what the program does. This option can be given multiple times to produce more and more output.

* `-w write_file`

  Specify the write file.

* `-V`

  Display version information.

### 4.6.5 myisampack — Generate Compressed, Read-Only MyISAM Tables

The **myisampack** utility compresses `MyISAM` tables. **myisampack** works by compressing each column in the table separately. Usually, **myisampack** packs the data file 40% to 70%.

When the table is used later, the server reads into memory the information needed to decompress columns. This results in much better performance when accessing individual rows, because you only have to uncompress exactly one row.

MySQL uses `mmap()` when possible to perform memory mapping on compressed tables. If `mmap()` does not work, MySQL falls back to normal read/write file operations.

Please note the following:

* If the `mysqld` server was invoked with external locking disabled, it is not a good idea to invoke **myisampack** if the table might be updated by the server during the packing process. It is safest to compress tables with the server stopped.

* After packing a table, it becomes read only. This is generally intended (such as when accessing packed tables on a CD).

* **myisampack** does not support partitioned tables.

Invoke **myisampack** like this:

```sql
myisampack [options] file_name ...
```

Each file name argument should be the name of an index (`.MYI`) file. If you are not in the database directory, you should specify the path name to the file. It is permissible to omit the `.MYI` extension.

After you compress a table with **myisampack**, use **myisamchk -rq** to rebuild its indexes. Section 4.6.3, “myisamchk — MyISAM Table-Maintenance Utility”.

**myisampack** supports the following options. It also reads option files and supports the options for processing them described at Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Display a help message and exit.

* `--backup`, `-b`

  <table frame="box" rules="all" summary="Properties for backup"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup</code></td> </tr></tbody></table>

  Make a backup of each table's data file using the name `tbl_name.OLD`.

* `--character-sets-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

  The directory where character sets are installed. See Section 10.15, “Character Set Configuration”.

* `--debug[=debug_options]`, `-# [debug_options]`

  <table frame="box" rules="all" summary="Properties for debug"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--debug[=debug_options]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>d:t:o</code></td> </tr></tbody></table>

  Write a debugging log. A typical *`debug_options`* string is `d:t:o,file_name`. The default is `d:t:o`.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--force`, `-f`

  <table frame="box" rules="all" summary="Properties for force"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--force</code></td> </tr></tbody></table>

  Produce a packed table even if it becomes larger than the original or if the intermediate file from an earlier invocation of **myisampack** exists. (**myisampack** creates an intermediate file named `tbl_name.TMD` in the database directory while it compresses the table. If you kill **myisampack**, the `.TMD` file might not be deleted.) Normally, **myisampack** exits with an error if it finds that `tbl_name.TMD` exists. With `--force`, **myisampack** packs the table anyway.

* `--join=big_tbl_name`, `-j big_tbl_name`

  <table frame="box" rules="all" summary="Properties for join"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--join=big_tbl_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  Join all tables named on the command line into a single packed table *`big_tbl_name`*. All tables that are to be combined *must* have identical structure (same column names and types, same indexes, and so forth).

  *`big_tbl_name`* must not exist prior to the join operation. All source tables named on the command line to be merged into *`big_tbl_name`* must exist. The source tables are read for the join operation but not modified.

* `--silent`, `-s`

  <table frame="box" rules="all" summary="Properties for silent"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--silent</code></td> </tr></tbody></table>

  Silent mode. Write output only when errors occur.

* `--test`, `-t`

  <table frame="box" rules="all" summary="Properties for test"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--test</code></td> </tr></tbody></table>

  Do not actually pack the table, just test packing it.

* `--tmpdir=dir_name`, `-T dir_name`

  <table frame="box" rules="all" summary="Properties for tmpdir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--tmpdir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

  Use the named directory as the location where **myisampack** creates temporary files.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for verbose"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--verbose</code></td> </tr></tbody></table>

  Verbose mode. Write information about the progress of the packing operation and its result.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for backup"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup</code></td> </tr></tbody></table>0

  Display version information and exit.

* `--wait`, `-w`

  <table frame="box" rules="all" summary="Properties for backup"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup</code></td> </tr></tbody></table>1

  Wait and retry if the table is in use. If the `mysqld` server was invoked with external locking disabled, it is not a good idea to invoke **myisampack** if the table might be updated by the server during the packing process.

The following sequence of commands illustrates a typical table compression session:

```sql
$> ls -l station.*
-rw-rw-r--   1 jones    my         994128 Apr 17 19:00 station.MYD
-rw-rw-r--   1 jones    my          53248 Apr 17 19:00 station.MYI
-rw-rw-r--   1 jones    my           5767 Apr 17 19:00 station.frm

$> myisamchk -dvv station

MyISAM file:     station
Isam-version:  2
Creation time: 1996-03-13 10:08:58
Recover time:  1997-02-02  3:06:43
Data records:              1192  Deleted blocks:              0
Datafile parts:            1192  Deleted data:                0
Datafile pointer (bytes):     2  Keyfile pointer (bytes):     2
Max datafile length:   54657023  Max keyfile length:   33554431
Recordlength:               834
Record format: Fixed length

table description:
Key Start Len Index   Type                 Root  Blocksize    Rec/key
1   2     4   unique  unsigned long        1024       1024          1
2   32    30  multip. text                10240       1024          1

Field Start Length Type
1     1     1
2     2     4
3     6     4
4     10    1
5     11    20
6     31    1
7     32    30
8     62    35
9     97    35
10    132   35
11    167   4
12    171   16
13    187   35
14    222   4
15    226   16
16    242   20
17    262   20
18    282   20
19    302   30
20    332   4
21    336   4
22    340   1
23    341   8
24    349   8
25    357   8
26    365   2
27    367   2
28    369   4
29    373   4
30    377   1
31    378   2
32    380   8
33    388   4
34    392   4
35    396   4
36    400   4
37    404   1
38    405   4
39    409   4
40    413   4
41    417   4
42    421   4
43    425   4
44    429   20
45    449   30
46    479   1
47    480   1
48    481   79
49    560   79
50    639   79
51    718   79
52    797   8
53    805   1
54    806   1
55    807   20
56    827   4
57    831   4

$> myisampack station.MYI
Compressing station.MYI: (1192 records)
- Calculating statistics

normal:     20  empty-space:   16  empty-zero:     12  empty-fill:  11
pre-space:   0  end-space:     12  table-lookups:   5  zero:         7
Original trees:  57  After join: 17
- Compressing file
87.14%
Remember to run myisamchk -rq on compressed tables

$> myisamchk -rq station
- check record delete-chain
- recovering (with sort) MyISAM-table 'station'
Data records: 1192
- Fixing index 1
- Fixing index 2

$> mysqladmin -uroot flush-tables

$> ls -l station.*
-rw-rw-r--   1 jones    my         127874 Apr 17 19:00 station.MYD
-rw-rw-r--   1 jones    my          55296 Apr 17 19:04 station.MYI
-rw-rw-r--   1 jones    my           5767 Apr 17 19:00 station.frm

$> myisamchk -dvv station

MyISAM file:     station
Isam-version:  2
Creation time: 1996-03-13 10:08:58
Recover time:  1997-04-17 19:04:26
Data records:               1192  Deleted blocks:              0
Datafile parts:             1192  Deleted data:                0
Datafile pointer (bytes):      3  Keyfile pointer (bytes):     1
Max datafile length:    16777215  Max keyfile length:     131071
Recordlength:                834
Record format: Compressed

table description:
Key Start Len Index   Type                 Root  Blocksize    Rec/key
1   2     4   unique  unsigned long       10240       1024          1
2   32    30  multip. text                54272       1024          1

Field Start Length Type                         Huff tree  Bits
1     1     1      constant                             1     0
2     2     4      zerofill(1)                          2     9
3     6     4      no zeros, zerofill(1)                2     9
4     10    1                                           3     9
5     11    20     table-lookup                         4     0
6     31    1                                           3     9
7     32    30     no endspace, not_always              5     9
8     62    35     no endspace, not_always, no empty    6     9
9     97    35     no empty                             7     9
10    132   35     no endspace, not_always, no empty    6     9
11    167   4      zerofill(1)                          2     9
12    171   16     no endspace, not_always, no empty    5     9
13    187   35     no endspace, not_always, no empty    6     9
14    222   4      zerofill(1)                          2     9
15    226   16     no endspace, not_always, no empty    5     9
16    242   20     no endspace, not_always              8     9
17    262   20     no endspace, no empty                8     9
18    282   20     no endspace, no empty                5     9
19    302   30     no endspace, no empty                6     9
20    332   4      always zero                          2     9
21    336   4      always zero                          2     9
22    340   1                                           3     9
23    341   8      table-lookup                         9     0
24    349   8      table-lookup                        10     0
25    357   8      always zero                          2     9
26    365   2                                           2     9
27    367   2      no zeros, zerofill(1)                2     9
28    369   4      no zeros, zerofill(1)                2     9
29    373   4      table-lookup                        11     0
30    377   1                                           3     9
31    378   2      no zeros, zerofill(1)                2     9
32    380   8      no zeros                             2     9
33    388   4      always zero                          2     9
34    392   4      table-lookup                        12     0
35    396   4      no zeros, zerofill(1)               13     9
36    400   4      no zeros, zerofill(1)                2     9
37    404   1                                           2     9
38    405   4      no zeros                             2     9
39    409   4      always zero                          2     9
40    413   4      no zeros                             2     9
41    417   4      always zero                          2     9
42    421   4      no zeros                             2     9
43    425   4      always zero                          2     9
44    429   20     no empty                             3     9
45    449   30     no empty                             3     9
46    479   1                                          14     4
47    480   1                                          14     4
48    481   79     no endspace, no empty               15     9
49    560   79     no empty                             2     9
50    639   79     no empty                             2     9
51    718   79     no endspace                         16     9
52    797   8      no empty                             2     9
53    805   1                                          17     1
54    806   1                                           3     9
55    807   20     no empty                             3     9
56    827   4      no zeros, zerofill(2)                2     9
57    831   4      no zeros, zerofill(1)                2     9
```

**myisampack** displays the following kinds of information:

* `normal`

  The number of columns for which no extra packing is used.

* `empty-space`

  The number of columns containing values that are only spaces. These occupy one bit.

* `empty-zero`

  The number of columns containing values that are only binary zeros. These occupy one bit.

* `empty-fill`

  The number of integer columns that do not occupy the full byte range of their type. These are changed to a smaller type. For example, a `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") column (eight bytes) can be stored as a `TINYINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") column (one byte) if all its values are in the range from `-128` to `127`.

* `pre-space`

  The number of decimal columns that are stored with leading spaces. In this case, each value contains a count for the number of leading spaces.

* `end-space`

  The number of columns that have a lot of trailing spaces. In this case, each value contains a count for the number of trailing spaces.

* `table-lookup`

  The column had only a small number of different values, which were converted to an `ENUM` before Huffman compression.

* `zero`

  The number of columns for which all values are zero.

* `Original trees`

  The initial number of Huffman trees.

* `After join`

  The number of distinct Huffman trees left after joining trees to save some header space.

After a table has been compressed, the `Field` lines displayed by **myisamchk -dvv** include additional information about each column:

* `Type`

  The data type. The value may contain any of the following descriptors:

  + `constant`

    All rows have the same value.

  + `no endspace`

    Do not store endspace.

  + `no endspace, not_always`

    Do not store endspace and do not do endspace compression for all values.

  + `no endspace, no empty`

    Do not store endspace. Do not store empty values.

  + `table-lookup`

    The column was converted to an `ENUM`.

  + `zerofill(N)`

    The most significant *`N`* bytes in the value are always 0 and are not stored.

  + `no zeros`

    Do not store zeros.

  + `always zero`

    Zero values are stored using one bit.

* `Huff tree`

  The number of the Huffman tree associated with the column.

* `Bits`

  The number of bits used in the Huffman tree.

After you run **myisampack**, use **myisamchk** to re-create any indexes. At this time, you can also sort the index blocks and create statistics needed for the MySQL optimizer to work more efficiently:

```sql
myisamchk -rq --sort-index --analyze tbl_name.MYI
```

After you have installed the packed table into the MySQL database directory, you should execute **mysqladmin flush-tables** to force `mysqld` to start using the new table.

To unpack a packed table, use the `--unpack` option to **myisamchk**.

### 4.6.6 mysql\_config\_editor — MySQL Configuration Utility

The **mysql\_config\_editor** utility enables you to store authentication credentials in an obfuscated login path file named `.mylogin.cnf`. The file location is the `%APPDATA%\MySQL` directory on Windows and the current user's home directory on non-Windows systems. The file can be read later by MySQL client programs to obtain authentication credentials for connecting to MySQL Server.

The unobfuscated format of the `.mylogin.cnf` login path file consists of option groups, similar to other option files. Each option group in `.mylogin.cnf` is called a “login path,” which is a group that permits only certain options: `host`, `user`, `password`, `port` and `socket`. Think of a login path option group as a set of options that specify which MySQL server to connect to and which account to authenticate as. Here is an unobfuscated example:

```sql
[client]
user = mydefaultname
password = mydefaultpass
host = 127.0.0.1
[mypath]
user = myothername
password = myotherpass
host = localhost
```

When you invoke a client program to connect to the server, the client uses `.mylogin.cnf` in conjunction with other option files. Its precedence is higher than other option files, but less than options specified explicitly on the client command line. For information about the order in which option files are used, see Section 4.2.2.2, “Using Option Files”.

To specify an alternate login path file name, set the `MYSQL_TEST_LOGIN_FILE` environment variable. This variable is recognized by **mysql\_config\_editor**, by standard MySQL clients (**mysql**, **mysqladmin**, and so forth), and by the **mysql-test-run.pl** testing utility.

Programs use groups in the login path file as follows:

* **mysql\_config\_editor** operates on the `client` login path by default if you specify no `--login-path=name` option to indicate explicitly which login path to use.

* Without a `--login-path` option, client programs read the same option groups from the login path file that they read from other option files. Consider this command:

  ```sql
  mysql
  ```

  By default, the **mysql** client reads the `[client]` and `[mysql]` groups from other option files, so it reads them from the login path file as well.

* With a `--login-path` option, client programs additionally read the named login path from the login path file. The option groups read from other option files remain the same. Consider this command:

  ```sql
  mysql --login-path=mypath
  ```

  The **mysql** client reads `[client]` and `[mysql]` from other option files, and `[client]`, `[mysql]`, and `[mypath]` from the login path file.

* Client programs read the login path file even when the `--no-defaults` option is used, unless `--no-login-paths` is set. This permits passwords to be specified in a safer way than on the command line even if `--no-defaults` is present.

**mysql\_config\_editor** obfuscates the `.mylogin.cnf` file so it cannot be read as cleartext, and its contents when unobfuscated by client programs are used only in memory. In this way, passwords can be stored in a file in non-cleartext format and used later without ever needing to be exposed on the command line or in an environment variable. **mysql\_config\_editor** provides a `print` command for displaying the login path file contents, but even in this case, password values are masked so as never to appear in a way that other users can see them.

The obfuscation used by **mysql\_config\_editor** prevents passwords from appearing in `.mylogin.cnf` as cleartext and provides a measure of security by preventing inadvertent password exposure. For example, if you display a regular unobfuscated `my.cnf` option file on the screen, any passwords it contains are visible for anyone to see. With `.mylogin.cnf`, that is not true, but the obfuscation used is not likely to deter a determined attacker and you should not consider it unbreakable. A user who can gain system administration privileges on your machine to access your files could unobfuscate the `.mylogin.cnf` file with some effort.

The login path file must be readable and writable to the current user, and inaccessible to other users. Otherwise, **mysql\_config\_editor** ignores it, and client programs do not use it, either.

Invoke **mysql\_config\_editor** like this:

```sql
mysql_config_editor [program_options] command [command_options]
```

If the login path file does not exist, **mysql\_config\_editor** creates it.

Command arguments are given as follows:

* *`program_options`* consists of general **mysql\_config\_editor** options.

* `command` indicates what action to perform on the `.mylogin.cnf` login path file. For example, `set` writes a login path to the file, `remove` removes a login path, and `print` displays login path contents.

* *`command_options`* indicates any additional options specific to the command, such as the login path name and the values to use in the login path.

The position of the command name within the set of program arguments is significant. For example, these command lines have the same arguments, but produce different results:

```sql
mysql_config_editor --help set
mysql_config_editor set --help
```

The first command line displays a general **mysql\_config\_editor** help message, and ignores the `set` command. The second command line displays a help message specific to the `set` command.

Suppose that you want to establish a `client` login path that defines your default connection parameters, and an additional login path named `remote` for connecting to the MySQL server the host `remote.example.com`. You want to log in as follows:

* By default, to the local server with a user name and password of `localuser` and `localpass`

* To the remote server with a user name and password of `remoteuser` and `remotepass`

To set up the login paths in the `.mylogin.cnf` file, use the following `set` commands. Enter each command on a single line, and enter the appropriate passwords when prompted:

```sql
$> mysql_config_editor set --login-path=client
         --host=localhost --user=localuser --password
Enter password: enter password "localpass" here
$> mysql_config_editor set --login-path=remote
         --host=remote.example.com --user=remoteuser --password
Enter password: enter password "remotepass" here
```

**mysql\_config\_editor** uses the `client` login path by default, so the `--login-path=client` option can be omitted from the first command without changing its effect.

To see what **mysql\_config\_editor** writes to the `.mylogin.cnf` file, use the `print` command:

```sql
$> mysql_config_editor print --all
[client]
user = localuser
password = *****
host = localhost
[remote]
user = remoteuser
password = *****
host = remote.example.com
```

The `print` command displays each login path as a set of lines beginning with a group header indicating the login path name in square brackets, followed by the option values for the login path. Password values are masked and do not appear as cleartext.

If you do not specify `--all` to display all login paths or `--login-path=name` to display a named login path, the `print` command displays the `client` login path by default, if there is one.

As shown by the preceding example, the login path file can contain multiple login paths. In this way, **mysql\_config\_editor** makes it easy to set up multiple “personalities” for connecting to different MySQL servers, or for connecting to a given server using different accounts. Any of these can be selected by name later using the `--login-path` option when you invoke a client program. For example, to connect to the remote server, use this command:

```sql
mysql --login-path=remote
```

Here, **mysql** reads the `[client]` and `[mysql]` option groups from other option files, and the `[client]`, `[mysql]`, and `[remote]` groups from the login path file.

To connect to the local server, use this command:

```sql
mysql --login-path=client
```

Because **mysql** reads the `client` and `mysql` login paths by default, the `--login-path` option does not add anything in this case. That command is equivalent to this one:

```sql
mysql
```

Options read from the login path file take precedence over options read from other option files. Options read from login path groups appearing later in the login path file take precedence over options read from groups appearing earlier in the file.

**mysql\_config\_editor** adds login paths to the login path file in the order you create them, so you should create more general login paths first and more specific paths later. If you need to move a login path within the file, you can remove it, then recreate it to add it to the end. For example, a `client` login path is more general because it is read by all client programs, whereas a `mysqldump` login path is read only by **mysqldump**. Options specified later override options specified earlier, so putting the login paths in the order `client`, `mysqldump` enables **mysqldump**-specific options to override `client` options.

When you use the `set` command with **mysql\_config\_editor** to create a login path, you need not specify all possible option values (host name, user name, password, port, socket). Only those values given are written to the path. Any missing values required later can be specified when you invoke a client path to connect to the MySQL server, either in other option files or on the command line. Any options specified on the command line override those specified in the login path file or other option files. For example, if the credentials in the `remote` login path also apply for the host `remote2.example.com`, connect to the server on that host like this:

```sql
mysql --login-path=remote --host=remote2.example.com
```

#### mysql\_config\_editor General Options

**mysql\_config\_editor** supports the following general options, which may be used preceding any command named on the command line. For descriptions of command-specific options, see mysql\_config\_editor Commands and Command-Specific Options.

**Table 4.22 mysql\_config\_editor General Options**

<table frame="box" rules="all" summary="General Command-line options available for mysql_config_editor."><col style="width: 35%"/><col style="width: 64%"/><thead><tr><th>Option Name</th> <th>Description</th> </tr></thead><tbody><tr><td>--debug</td> <td>Write debugging log</td> </tr><tr><td>--help</td> <td>Display help message and exit</td> </tr><tr><td>--verbose</td> <td>Verbose mode</td> </tr><tr><td>--version</td> <td>Display version information and exit</td> </tr></tbody></table>

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Display a general help message and exit.

  To see a command-specific help message, invoke **mysql\_config\_editor** as follows, where *`command`* is a command other than `help`:

  ```sql
  mysql_config_editor command --help
  ```

* `--debug[=debug_options]`, `-# debug_options`

  <table frame="box" rules="all" summary="Properties for debug"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--debug[=debug_options]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>d:t:o</code></td> </tr></tbody></table>

  Write a debugging log. A typical *`debug_options`* string is `d:t:o,file_name`. The default is `d:t:o,/tmp/mysql_config_editor.trace`.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for verbose"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--verbose</code></td> </tr></tbody></table>

  Verbose mode. Print more information about what the program does. This option may be helpful in diagnosing problems if an operation does not have the effect you expect.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for version"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--version</code></td> </tr></tbody></table>

  Display version information and exit.

#### mysql\_config\_editor Commands and Command-Specific Options

This section describes the permitted **mysql\_config\_editor** commands, and, for each one, the command-specific options permitted following the command name on the command line.

In addition, **mysql\_config\_editor** supports general options that can be used preceding any command. For descriptions of these options, see mysql\_config\_editor General Options.

**mysql\_config\_editor** supports these commands:

* `help`

  Display a general help message and exit. This command takes no following options.

  To see a command-specific help message, invoke **mysql\_config\_editor** as follows, where *`command`* is a command other than `help`:

  ```sql
  mysql_config_editor command --help
  ```

* `print [options]`

  Print the contents of the login path file in unobfuscated form, with the exception that passwords are displayed as `*****`.

  The default login path name is `client` if no login path is named. If both `--all` and `--login-path` are given, `--all` takes precedence.

  The `print` command permits these options following the command name:

  + `--help`, `-?`

    Display a help message for the `print` command and exit.

    To see a general help message, use **mysql\_config\_editor --help**.

  + `--all`

    Print the contents of all login paths in the login path file.

  + `--login-path=name`, `-G name`

    Print the contents of the named login path.

* `remove [options]`

  Remove a login path from the login path file, or modify a login path by removing options from it.

  This command removes from the login path only such options as are specified with the `--host`, `--password`, `--port`, `--socket`, and `--user` options. If none of those options are given, `remove` removes the entire login path. For example, this command removes only the `user` option from the `mypath` login path rather than the entire `mypath` login path:

  ```sql
  mysql_config_editor remove --login-path=mypath --user
  ```

  This command removes the entire `mypath` login path:

  ```sql
  mysql_config_editor remove --login-path=mypath
  ```

  The `remove` command permits these options following the command name:

  + `--help`, `-?`

    Display a help message for the `remove` command and exit.

    To see a general help message, use **mysql\_config\_editor --help**.

  + `--host`, `-h`

    Remove the host name from the login path.

  + `--login-path=name`, `-G name`

    The login path to remove or modify. The default login path name is `client` if this option is not given.

  + `--password`, `-p`

    Remove the password from the login path.

  + `--port`, `-P`

    Remove the TCP/IP port number from the login path.

  + `--socket`, `-S`

    Remove the Unix socket file name from the login path.

  + `--user`, `-u`

    Remove the user name from the login path.

  + `--warn`, `-w`

    Warn and prompt the user for confirmation if the command attempts to remove the default login path (`client`) and `--login-path=client` was not specified. This option is enabled by default; use `--skip-warn` to disable it.

* `reset [options]`

  Empty the contents of the login path file.

  The `reset` command permits these options following the command name:

  + `--help`, `-?`

    Display a help message for the `reset` command and exit.

    To see a general help message, use **mysql\_config\_editor --help**.

* `set [options]`

  Write a login path to the login path file.

  This command writes to the login path only such options as are specified with the `--host`, `--password`, `--port`, `--socket`, and `--user` options. If none of those options are given, **mysql\_config\_editor** writes the login path as an empty group.

  The `set` command permits these options following the command name:

  + `--help`, `-?`

    Display a help message for the `set` command and exit.

    To see a general help message, use **mysql\_config\_editor --help**.

  + `--host=host_name`, `-h host_name`

    The host name to write to the login path.

  + `--login-path=name`, `-G name`

    The login path to create. The default login path name is `client` if this option is not given.

  + `--password`, `-p`

    Prompt for a password to write to the login path. After **mysql\_config\_editor** displays the prompt, type the password and press Enter. To prevent other users from seeing the password, **mysql\_config\_editor** does not echo it.

    To specify an empty password, press Enter at the password prompt. The resulting login path written to the login path file includes a line like this:

    ```sql
    password =
    ```

  + `--port=port_num`, `-P port_num`

    The TCP/IP port number to write to the login path.

  + `--socket=file_name`, `-S file_name`

    The Unix socket file name to write to the login path.

  + `--user=user_name`, `-u user_name`

    The user name to write to the login path.

  + `--warn`, `-w`

    Warn and prompt the user for confirmation if the command attempts to overwrite an existing login path. This option is enabled by default; use `--skip-warn` to disable it.

### 4.6.7 mysqlbinlog — Utility for Processing Binary Log Files

The server's binary log consists of files containing “events” that describe modifications to database contents. The server writes these files in binary format. To display their contents in text format, use the **mysqlbinlog** utility. You can also use **mysqlbinlog** to display the contents of relay log files written by a replica server in a replication setup because relay logs have the same format as binary logs. The binary log and relay log are discussed further in Section 5.4.4, “The Binary Log”, and Section 16.2.4, “Relay Log and Replication Metadata Repositories”.

Invoke **mysqlbinlog** like this:

```sql
mysqlbinlog [options] log_file ...
```

For example, to display the contents of the binary log file named `binlog.000003`, use this command:

```sql
mysqlbinlog binlog.000003
```

The output includes events contained in `binlog.000003`. For statement-based logging, event information includes the SQL statement, the ID of the server on which it was executed, the timestamp when the statement was executed, how much time it took, and so forth. For row-based logging, the event indicates a row change rather than an SQL statement. See Section 16.2.1, “Replication Formats”, for information about logging modes.

Events are preceded by header comments that provide additional information. For example:

```sql
# at 141
#100309  9:28:36 server id 123  end_log_pos 245
  Query thread_id=3350  exec_time=11  error_code=0
```

In the first line, the number following `at` indicates the file offset, or starting position, of the event in the binary log file.

The second line starts with a date and time indicating when the statement started on the server where the event originated. For replication, this timestamp is propagated to replica servers. `server id` is the `server_id` value of the server where the event originated. `end_log_pos` indicates where the next event starts (that is, it is the end position of the current event + 1). `thread_id` indicates which thread executed the event. `exec_time` is the time spent executing the event, on a replication source server. On a replica, it is the difference of the end execution time on the replica minus the beginning execution time on the source. The difference serves as an indicator of how much replication lags behind the source. `error_code` indicates the result from executing the event. Zero means that no error occurred.

Note

When using event groups, the file offsets of events may be grouped together and the comments of events may be grouped together. Do not mistake these grouped events for blank file offsets.

The output from **mysqlbinlog** can be re-executed (for example, by using it as input to **mysql**) to redo the statements in the log. This is useful for recovery operations after an unexpected server exit. For other usage examples, see the discussion later in this section and in Section 7.5, “Point-in-Time (Incremental) Recovery” Recovery").

You can use **mysqlbinlog** to read binary log files directly and apply them to the local MySQL server. You can also read binary logs from a remote server by using the `--read-from-remote-server` option. To read remote binary logs, the connection parameter options can be given to indicate how to connect to the server. These options are `--host`, `--password`, `--port`, `--protocol`, `--socket`, and `--user`.

When running **mysqlbinlog** against a large binary log, be careful that the filesystem has enough space for the resulting files. To configure the directory that **mysqlbinlog** uses for temporary files, use the `TMPDIR` environment variable.

**mysqlbinlog** sets the value of `pseudo_slave_mode` to true before executing any SQL statements. This system variable affects the handling of XA transactions.

**mysqlbinlog** supports the following options, which can be specified on the command line or in the `[mysqlbinlog]` and `[client]` groups of an option file. For information about option files used by MySQL programs, see Section 4.2.2.2, “Using Option Files”.

**Table 4.23 mysqlbinlog Options**

<table frame="box" rules="all" summary="Command-line options available for mysqlbinlog.">
  <col style="width: 27%"/>
  <col style="width: 50%"/>
  <col style="width: 11%"/>
  <col style="width: 11%"/>
  <thead>
    <tr>
      <th>Option Name</th>
      <th>Description</th>
      <th>Introduced</th>
      <th>Deprecated</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th><code>--base64-output</code></th>
      <td>Print binary log entries using base-64 encoding</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--bind-address</code></th>
      <td>Use specified network interface to connect to MySQL Server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--binlog-row-event-max-size</code></th>
      <td>Binary log max event size</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--character-sets-dir</code></th>
      <td>Directory where character sets are installed</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--connection-server-id</code></th>
      <td>Used for testing and debugging. See text for applicable default values and other particulars</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--database</code></th>
      <td>List entries for just this database</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--debug</code></th>
      <td>Write debugging log</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--debug-check</code></th>
      <td>Print debugging information when program exits</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--debug-info</code></th>
      <td>Print debugging information, memory, and CPU statistics when program exits</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--default-auth</code></th>
      <td>Authentication plugin to use</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-extra-file</code></th>
      <td>Read named option file in addition to usual option files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-file</code></th>
      <td>Read only named option file</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-group-suffix</code></th>
      <td>Option group suffix value</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--disable-log-bin</code></th>
      <td>Disable binary logging</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--exclude-gtids</code></th>
      <td>Do not show any of the groups in the GTID set provided</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--force-if-open</code></th>
      <td>Read binary log files even if open or not closed properly</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--force-read</code></th>
      <td>If mysqlbinlog reads a binary log event that it does not recognize, it prints a warning</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--get-server-public-key</code></th>
      <td>Request RSA public key from server</td>
      <td>5.7.23</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--help</code></th>
      <td>Display help message and exit</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--hexdump</code></th>
      <td>Display a hex dump of the log in comments</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--host</code></th>
      <td>Host on which MySQL server is located</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--idempotent</code></th>
      <td>Cause the server to use idempotent mode while processing binary log updates from this session only</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--include-gtids</code></th>
      <td>Show only the groups in the GTID set provided</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--local-load</code></th>
      <td>Prepare local temporary files for LOAD DATA in the specified directory</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--login-path</code></th>
      <td>Read login path options from .mylogin.cnf</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--no-defaults</code></th>
      <td>Read no option files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--offset</code></th>
      <td>Skip the first N entries in the log</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--open-files-limit</code></th>
      <td>Specify the number of open file descriptors to reserve</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--password</code></th>
      <td>Password to use when connecting to server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--plugin-dir</code></th>
      <td>Directory where plugins are installed</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--port</code></th>
      <td>TCP/IP port number for connection</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--print-defaults</code></th>
      <td>Print default options</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--protocol</code></th>
      <td>Transport protocol to use</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--raw</code></th>
      <td>Write events in raw (binary) format to output files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--read-from-remote-master</code></th>
      <td>Read the binary log from a MySQL replication source server rather than reading a local log file</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--read-from-remote-server</code></th>
      <td>Read binary log from MySQL server rather than local log file</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--result-file</code></th>
      <td>Direct output to named file</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--rewrite-db</code></th>
      <td>Create rewrite rules for databases when playing back from logs written in row-based format. Can be used multiple times</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--secure-auth</code></th>
      <td>Do not send passwords to server in old (pre-4.1) format</td>
      <td></td>
      <td>Yes</td>
    </tr>
    <tr>
      <th><code>--server-id</code></th>
      <td>Extract only those events created by the server having the given server ID</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--server-id-bits</code></th>
      <td>Tell mysqlbinlog how to interpret server IDs in binary log when log was written by a mysqld having its server-id-bits set to less than the maximum; supported only by MySQL Cluster version of mysqlbinlog</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--server-public-key-path</code></th>
      <td>Path name to file containing RSA public key</td>
      <td>5.7.23</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--set-charset</code></th>
      <td>Add a SET NAMES charset_name statement to the output</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--shared-memory-base-name</code></th>
      <td>Shared-memory name for shared-memory connections (Windows only)</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--short-form</code></th>
      <td>Display only the statements contained in the log</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--skip-gtids</code></th>
      <td>Do not include the GTIDs from the binary log files in the output dump file</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--socket</code></th>
      <td>Unix socket file or Windows named pipe to use</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl</code></th>
      <td>Enable connection encryption</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-ca</code></th>
      <td>File that contains list of trusted SSL Certificate Authorities</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-capath</code></th>
      <td>Directory that contains trusted SSL Certificate Authority certificate files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-cert</code></th>
      <td>File that contains X.509 certificate</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-cipher</code></th>
      <td>Permissible ciphers for connection encryption</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-crl</code></th>
      <td>File that contains certificate revocation lists</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-crlpath</code></th>
      <td>Directory that contains certificate revocation-list files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-key</code></th>
      <td>File that contains X.509 key</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-mode</code></th>
      <td>Desired security state of connection to server</td>
      <td>5.7.11</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-verify-server-cert</code></th>
      <td>Verify host name against server certificate Common Name identity</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--start-datetime</code></th>
      <td>Read binary log from first event with timestamp equal to or later than datetime argument</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--start-position</code></th>
      <td>Decode binary log from first event with position equal to or greater than argument</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--stop-datetime</code></th>
      <td>Stop reading binary log at first event with timestamp equal to or greater than datetime argument</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--stop-never</code></th>
      <td>Stay connected to server after reading last binary log file</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--stop-never-slave-server-id</code></th>
      <td>Slave server ID to report when connecting to server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--stop-position</code></th>
      <td>Stop decoding binary log at first event with position equal to or greater than argument</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--tls-version</code></th>
      <td>Permissible TLS protocols for encrypted connections</td>
      <td>5.7.10</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--to-last-log</code></th>
      <td>Do not stop at the end of requested binary log from a MySQL server, but rather continue printing to end of last binary log</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--user</code></th>
      <td>MySQL user name to use when connecting to server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--verbose</code></th>
      <td>Reconstruct row events as SQL statements</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--verify-binlog-checksum</code></th>
      <td>Verify checksums in binary log</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--version</code></th>
      <td>Display version information and exit</td>
      <td></td>
      <td></td>
    </tr>
  </tbody>
</table>

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Display a help message and exit.

* `--base64-output=value`

  <table frame="box" rules="all" summary="Properties for base64-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--base64-output=value</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>AUTO</code></td> </tr><tr><th>Valid Values</th> <td><code>AUTO</code><code>NEVER</code><code>DECODE-ROWS</code></td> </tr></tbody></table>

  This option determines when events should be displayed encoded as base-64 strings using `BINLOG` statements. The option has these permissible values (not case-sensitive):

  + `AUTO` ("automatic") or `UNSPEC` ("unspecified") displays `BINLOG` statements automatically when necessary (that is, for format description events and row events). If no `--base64-output` option is given, the effect is the same as `--base64-output=AUTO`.

    Note

    Automatic `BINLOG` display is the only safe behavior if you intend to use the output of **mysqlbinlog** to re-execute binary log file contents. The other option values are intended only for debugging or testing purposes because they may produce output that does not include all events in executable form.

  + `NEVER` causes `BINLOG` statements not to be displayed. **mysqlbinlog** exits with an error if a row event is found that must be displayed using `BINLOG`.

  + `DECODE-ROWS` specifies to **mysqlbinlog** that you intend for row events to be decoded and displayed as commented SQL statements by also specifying the `--verbose` option. Like `NEVER`, `DECODE-ROWS` suppresses display of `BINLOG` statements, but unlike `NEVER`, it does not exit with an error if a row event is found.

  For examples that show the effect of `--base64-output` and `--verbose` on row event output, see Section 4.6.7.2, “mysqlbinlog Row Event Display”.

* `--bind-address=ip_address`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  On a computer having multiple network interfaces, use this option to select which interface to use for connecting to the MySQL server.

* `--binlog-row-event-max-size=N`

  <table frame="box" rules="all" summary="Properties for binlog-row-event-max-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-row-event-max-size=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>4294967040</code></td> </tr><tr><th>Minimum Value</th> <td><code>256</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709547520</code></td> </tr></tbody></table>

  Specify the maximum size of a row-based binary log event, in bytes. Rows are grouped into events smaller than this size if possible. The value should be a multiple of 256. The default is 4GB.

* `--character-sets-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

  The directory where character sets are installed. See Section 10.15, “Character Set Configuration”.

* `--connection-server-id=server_id`

  <table frame="box" rules="all" summary="Properties for connection-server-id"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connection-server-id=#]</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0 (1)</code></td> </tr><tr><th>Minimum Value</th> <td><code>0 (1)</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  This option is used to test a MySQL server for support of the `BINLOG_DUMP_NON_BLOCK` connection flag. It is not required for normal operations.

  The effective default and minimum values for this option depend on whether **mysqlbinlog** is run in blocking mode or non-blocking mode. When **mysqlbinlog** is run in blocking mode, the default (and minimum) value is 1; when run in non-blocking mode, the default (and minimum) value is 0.

* `--database=db_name`, `-d db_name`

  <table frame="box" rules="all" summary="Properties for database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--database=db_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  This option causes **mysqlbinlog** to output entries from the binary log (local log only) that occur while *`db_name`* is been selected as the default database by `USE`.

  The `--database` option for **mysqlbinlog** is similar to the `--binlog-do-db` option for `mysqld`, but can be used to specify only one database. If `--database` is given multiple times, only the last instance is used.

  The effects of this option depend on whether the statement-based or row-based logging format is in use, in the same way that the effects of `--binlog-do-db` depend on whether statement-based or row-based logging is in use.

  **Statement-based logging.** The `--database` option works as follows:

  + While *`db_name`* is the default database, statements are output whether they modify tables in *`db_name`* or a different database.

  + Unless *`db_name`* is selected as the default database, statements are not output, even if they modify tables in *`db_name`*.

  + There is an exception for `CREATE DATABASE`, `ALTER DATABASE`, and `DROP DATABASE`. The database being *created, altered, or dropped* is considered to be the default database when determining whether to output the statement.

  Suppose that the binary log was created by executing these statements using statement-based-logging:

  ```sql
  INSERT INTO test.t1 (i) VALUES(100);
  INSERT INTO db2.t2 (j)  VALUES(200);
  USE test;
  INSERT INTO test.t1 (i) VALUES(101);
  INSERT INTO t1 (i)      VALUES(102);
  INSERT INTO db2.t2 (j)  VALUES(201);
  USE db2;
  INSERT INTO test.t1 (i) VALUES(103);
  INSERT INTO db2.t2 (j)  VALUES(202);
  INSERT INTO t2 (j)      VALUES(203);
  ```

  **mysqlbinlog --database=test** does not output the first two `INSERT` statements because there is no default database. It outputs the three `INSERT` statements following `USE test`, but not the three `INSERT` statements following `USE db2`.

  **mysqlbinlog --database=db2** does not output the first two `INSERT` statements because there is no default database. It does not output the three `INSERT` statements following `USE test`, but does output the three `INSERT` statements following `USE db2`.

  **Row-based logging.** **mysqlbinlog** outputs only entries that change tables belonging to *`db_name`*. The default database has no effect on this. Suppose that the binary log just described was created using row-based logging rather than statement-based logging. **mysqlbinlog --database=test** outputs only those entries that modify `t1` in the test database, regardless of whether `USE` was issued or what the default database is.

  If a server is running with `binlog_format` set to `MIXED` and you want it to be possible to use **mysqlbinlog** with the `--database` option, you must ensure that tables that are modified are in the database selected by `USE`. (In particular, no cross-database updates should be used.)

  When used together with the `--rewrite-db` option, the `--rewrite-db` option is applied first; then the `--database` option is applied, using the rewritten database name. The order in which the options are provided makes no difference in this regard.

* `--debug[=debug_options]`, `-# [debug_options]`

  <table frame="box" rules="all" summary="Properties for debug"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--debug[=debug_options]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>d:t:o,/tmp/mysqlbinlog.trace</code></td> </tr></tbody></table>

  Write a debugging log. A typical *`debug_options`* string is `d:t:o,file_name`. The default is `d:t:o,/tmp/mysqlbinlog.trace`.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--debug-check`

  <table frame="box" rules="all" summary="Properties for debug-check"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--debug-check</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Print some debugging information when the program exits.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--debug-info`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>0

  Print debugging information and memory and CPU usage statistics when the program exits.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>1

  A hint about which client-side authentication plugin to use. See Section 6.2.13, “Pluggable Authentication”.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>2

  Read this option file after the global option file but (on Unix) before the user option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>3

  Use only the given option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  Exception: Even with `--defaults-file`, client programs read `.mylogin.cnf`.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>4

  Read not only the usual option groups, but also groups with the usual names and a suffix of *`str`*. For example, **mysqlbinlog** normally reads the `[client]` and `[mysqlbinlog]` groups. If this option is given as `--defaults-group-suffix=_other`, **mysqlbinlog** also reads the `[client_other]` and `[mysqlbinlog_other]` groups.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--disable-log-bin`, `-D`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>5

  Disable binary logging. This is useful for avoiding an endless loop if you use the `--to-last-log` option and are sending the output to the same MySQL server. This option also is useful when restoring after an unexpected exit to avoid duplication of the statements you have logged.

  This option causes **mysqlbinlog** to include a `SET sql_log_bin = 0` statement in its output to disable binary logging of the remaining output. Manipulating the session value of the `sql_log_bin` system variable is a restricted operation, so this option requires that you have privileges sufficient to set restricted session variables. See Section 5.1.8.1, “System Variable Privileges”.

* `--exclude-gtids=gtid_set`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>6

  Do not display any of the groups listed in the *`gtid_set`*.

* `--force-if-open`, `-F`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>7

  Read binary log files even if they are open or were not closed properly.

* `--force-read`, `-f`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>8

  With this option, if **mysqlbinlog** reads a binary log event that it does not recognize, it prints a warning, ignores the event, and continues. Without this option, **mysqlbinlog** stops if it reads such an event.

* `--get-server-public-key`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>9

  Request from the server the public key required for RSA key pair-based password exchange. This option applies to clients that authenticate with the `caching_sha2_password` authentication plugin. For that plugin, the server does not send the public key unless requested. This option is ignored for accounts that do not authenticate with that plugin. It is also ignored if RSA-based password exchange is not used, as is the case when the client connects to the server using a secure connection.

  If `--server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `--get-server-public-key`.

  For information about the `caching_sha2_password` plugin, see Section 6.4.1.4, “Caching SHA-2 Pluggable Authentication”.

  The `--get-server-public-key` option was added in MySQL 5.7.23.

* `--hexdump`, `-H`

  <table frame="box" rules="all" summary="Properties for base64-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--base64-output=value</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>AUTO</code></td> </tr><tr><th>Valid Values</th> <td><code>AUTO</code><code>NEVER</code><code>DECODE-ROWS</code></td> </tr></tbody></table>0

  Display a hex dump of the log in comments, as described in Section 4.6.7.1, “mysqlbinlog Hex Dump Format”. The hex output can be helpful for replication debugging.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Properties for base64-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--base64-output=value</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>AUTO</code></td> </tr><tr><th>Valid Values</th> <td><code>AUTO</code><code>NEVER</code><code>DECODE-ROWS</code></td> </tr></tbody></table>1

  Get the binary log from the MySQL server on the given host.

* `--idempotent`

  <table frame="box" rules="all" summary="Properties for base64-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--base64-output=value</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>AUTO</code></td> </tr><tr><th>Valid Values</th> <td><code>AUTO</code><code>NEVER</code><code>DECODE-ROWS</code></td> </tr></tbody></table>2

  Tell the MySQL Server to use idempotent mode while processing updates; this causes suppression of any duplicate-key or key-not-found errors that the server encounters in the current session while processing updates. This option may prove useful whenever it is desirable or necessary to replay one or more binary logs to a MySQL Server which may not contain all of the data to which the logs refer.

  The scope of effect for this option includes the current **mysqlbinlog** client and session only.

* `--include-gtids=gtid_set`

  <table frame="box" rules="all" summary="Properties for base64-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--base64-output=value</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>AUTO</code></td> </tr><tr><th>Valid Values</th> <td><code>AUTO</code><code>NEVER</code><code>DECODE-ROWS</code></td> </tr></tbody></table>3

  Display only the groups listed in the *`gtid_set`*.

* `--local-load=dir_name`, `-l dir_name`

  <table frame="box" rules="all" summary="Properties for base64-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--base64-output=value</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>AUTO</code></td> </tr><tr><th>Valid Values</th> <td><code>AUTO</code><code>NEVER</code><code>DECODE-ROWS</code></td> </tr></tbody></table>4

  For data loading operations corresponding to `LOAD DATA` statements, **mysqlbinlog** extracts the files from the binary log events, writes them as temporary files to the local file system, and writes `LOAD DATA LOCAL` statements to cause the files to be loaded. By default, **mysqlbinlog** writes these temporary files to an operating system-specific directory. The `--local-load` option can be used to explicitly specify the directory where **mysqlbinlog** should prepare local temporary files.

  Important

  These temporary files are not automatically removed by **mysqlbinlog** or any other MySQL program.

* `--login-path=name`

  <table frame="box" rules="all" summary="Properties for base64-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--base64-output=value</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>AUTO</code></td> </tr><tr><th>Valid Values</th> <td><code>AUTO</code><code>NEVER</code><code>DECODE-ROWS</code></td> </tr></tbody></table>5

  Read options from the named login path in the `.mylogin.cnf` login path file. A “login path” is an option group containing options that specify which MySQL server to connect to and which account to authenticate as. To create or modify a login path file, use the **mysql\_config\_editor** utility. See Section 4.6.6, “mysql\_config\_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for base64-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--base64-output=value</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>AUTO</code></td> </tr><tr><th>Valid Values</th> <td><code>AUTO</code><code>NEVER</code><code>DECODE-ROWS</code></td> </tr></tbody></table>6

  Do not read any option files. If program startup fails due to reading unknown options from an option file, `--no-defaults` can be used to prevent them from being read.

  The exception is that the `.mylogin.cnf` file is read in all cases, if it exists. This permits passwords to be specified in a safer way than on the command line even when `--no-defaults` is used. To create `.mylogin.cnf`, use the **mysql\_config\_editor** utility. See Section 4.6.6, “mysql\_config\_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--offset=N`, `-o N`

  <table frame="box" rules="all" summary="Properties for base64-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--base64-output=value</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>AUTO</code></td> </tr><tr><th>Valid Values</th> <td><code>AUTO</code><code>NEVER</code><code>DECODE-ROWS</code></td> </tr></tbody></table>7

  Skip the first *`N`* entries in the log.

* `--open-files-limit=N`

  <table frame="box" rules="all" summary="Properties for base64-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--base64-output=value</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>AUTO</code></td> </tr><tr><th>Valid Values</th> <td><code>AUTO</code><code>NEVER</code><code>DECODE-ROWS</code></td> </tr></tbody></table>8

  Specify the number of open file descriptors to reserve.

* `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Properties for base64-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--base64-output=value</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>AUTO</code></td> </tr><tr><th>Valid Values</th> <td><code>AUTO</code><code>NEVER</code><code>DECODE-ROWS</code></td> </tr></tbody></table>9

  The password of the MySQL account used for connecting to the server. The password value is optional. If not given, **mysqlbinlog** prompts for one. If given, there must be *no space* between `--password=` or `-p` and the password following it. If no password option is specified, the default is to send no password.

  Specifying a password on the command line should be considered insecure. To avoid giving the password on the command line, use an option file. See Section 6.1.2.1, “End-User Guidelines for Password Security”.

  To explicitly specify that there is no password and that **mysqlbinlog** should not prompt for one, use the `--skip-password` option.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>0

  The directory in which to look for plugins. Specify this option if the `--default-auth` option is used to specify an authentication plugin but **mysqlbinlog** does not find it. See Section 6.2.13, “Pluggable Authentication”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>1

  The TCP/IP port number to use for connecting to a remote server.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>2

  Print the program name and all options that it gets from option files.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>3

  The transport protocol to use for connecting to the server. It is useful when the other connection parameters normally result in use of a protocol other than the one you want. For details on the permissible values, see Section 4.2.5, “Connection Transport Protocols”.

* `--raw`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>4

  By default, **mysqlbinlog** reads binary log files and writes events in text format. The `--raw` option tells **mysqlbinlog** to write them in their original binary format. Its use requires that `--read-from-remote-server` also be used because the files are requested from a server. **mysqlbinlog** writes one output file for each file read from the server. The `--raw` option can be used to make a backup of a server's binary log. With the `--stop-never` option, the backup is “live” because **mysqlbinlog** stays connected to the server. By default, output files are written in the current directory with the same names as the original log files. Output file names can be modified using the `--result-file` option. For more information, see Section 4.6.7.3, “Using mysqlbinlog to Back Up Binary Log Files”.

* `--read-from-remote-master=type`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>5

  Read binary logs from a MySQL server with the `COM_BINLOG_DUMP` or `COM_BINLOG_DUMP_GTID` commands by setting the option value to either `BINLOG-DUMP-NON-GTIDS` or `BINLOG-DUMP-GTIDS`, respectively. If `--read-from-remote-master=BINLOG-DUMP-GTIDS` is combined with `--exclude-gtids`, transactions can be filtered out on the source, avoiding unnecessary network traffic.

  The connection parameter options are used with this option or the `--read-from-remote-server` option. These options are `--host`, `--password`, `--port`, `--protocol`, `--socket`, and `--user`. If neither of the remote options is specified, the connection parameter options are ignored.

  The `REPLICATION SLAVE` privilege is required to use this option.

* `--read-from-remote-server=file_name`, `-R`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>6

  Read the binary log from a MySQL server rather than reading a local log file. This option requires that the remote server be running. It works only for binary log files on the remote server, not relay log files, and takes only the binary log file name (including the numeric suffix) as its argument, while ignoring any path.

  The connection parameter options are used with this option or the `--read-from-remote-master` option. These options are `--host`, `--password`, `--port`, `--protocol`, `--socket`, and `--user`. If neither of the remote options is specified, the connection parameter options are ignored.

  The `REPLICATION SLAVE` privilege is required to use this option.

  This option is like `--read-from-remote-master=BINLOG-DUMP-NON-GTIDS`.

* `--result-file=name`, `-r name`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>7

  Without the `--raw` option, this option indicates the file to which **mysqlbinlog** writes text output. With `--raw`, **mysqlbinlog** writes one binary output file for each log file transferred from the server, writing them by default in the current directory using the same names as the original log file. In this case, the `--result-file` option value is treated as a prefix that modifies output file names.

* `--rewrite-db='from_name->to_name'`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>8

  When reading from a row-based or statement-based log, rewrite all occurrences of *`from_name`* to *`to_name`*. Rewriting is done on the rows, for row-based logs, as well as on the `USE` clauses, for statement-based logs. In MySQL versions prior to 5.7.8, this option was only for use when restoring tables logged using the row-based format.

  Warning

  Statements in which table names are qualified with database names are not rewritten to use the new name when using this option.

  The rewrite rule employed as a value for this option is a string having the form `'from_name->to_name'`, as shown previously, and for this reason must be enclosed by quotation marks.

  To employ multiple rewrite rules, specify the option multiple times, as shown here:

  ```sql
  mysqlbinlog --rewrite-db='dbcurrent->dbold' --rewrite-db='dbtest->dbcurrent' \
      binlog.00001 > /tmp/statements.sql
  ```

  When used together with the `--database` option, the `--rewrite-db` option is applied first; then `--database` option is applied, using the rewritten database name. The order in which the options are provided makes no difference in this regard.

  This means that, for example, if **mysqlbinlog** is started with `--rewrite-db='mydb->yourdb' --database=yourdb`, then all updates to any tables in databases `mydb` and `yourdb` are included in the output. On the other hand, if it is started with `--rewrite-db='mydb->yourdb' --database=mydb`, then **mysqlbinlog** outputs no statements at all: since all updates to `mydb` are first rewritten as updates to `yourdb` before applying the `--database` option, there remain no updates that match `--database=mydb`.

* `--secure-auth`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>9

  Do not send passwords to the server in old (pre-4.1) format. This prevents connections except for servers that use the newer password format.

  As of MySQL 5.7.5, this option is deprecated; expect it to be removed in a future MySQL release. It is always enabled and attempting to disable it (`--skip-secure-auth`, `--secure-auth=0`) produces an error. Before MySQL 5.7.5, this option is enabled by default but can be disabled.

  Note

  Passwords that use the pre-4.1 hashing method are less secure than passwords that use the native password hashing method and should be avoided. Pre-4.1 passwords are deprecated and support for them was removed in MySQL 5.7.5. For account upgrade instructions, see Section 6.4.1.3, “Migrating Away from Pre-4.1 Password Hashing and the mysql\_old\_password Plugin”.

* `--server-id=id`

  <table frame="box" rules="all" summary="Properties for binlog-row-event-max-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-row-event-max-size=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>4294967040</code></td> </tr><tr><th>Minimum Value</th> <td><code>256</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709547520</code></td> </tr></tbody></table>0

  Display only those events created by the server having the given server ID.

* `--server-id-bits=N`

  <table frame="box" rules="all" summary="Properties for binlog-row-event-max-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-row-event-max-size=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>4294967040</code></td> </tr><tr><th>Minimum Value</th> <td><code>256</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709547520</code></td> </tr></tbody></table>1

  Use only the first *`N`* bits of the `server_id` to identify the server. If the binary log was written by a `mysqld` with server-id-bits set to less than 32 and user data stored in the most significant bit, running **mysqlbinlog** with `--server-id-bits` set to 32 enables this data to be seen.

  This option is supported only by the version of **mysqlbinlog** supplied with the NDB Cluster distribution, or built with NDB Cluster support.

* `--server-public-key-path=file_name`

  <table frame="box" rules="all" summary="Properties for binlog-row-event-max-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-row-event-max-size=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>4294967040</code></td> </tr><tr><th>Minimum Value</th> <td><code>256</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709547520</code></td> </tr></tbody></table>2

  The path name to a file in PEM format containing a client-side copy of the public key required by the server for RSA key pair-based password exchange. This option applies to clients that authenticate with the `sha256_password` or `caching_sha2_password` authentication plugin. This option is ignored for accounts that do not authenticate with one of those plugins. It is also ignored if RSA-based password exchange is not used, as is the case when the client connects to the server using a secure connection.

  If `--server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `--get-server-public-key`.

  For `sha256_password`, this option applies only if MySQL was built using OpenSSL.

  For information about the `sha256_password` and `caching_sha2_password` plugins, see Section 6.4.1.5, “SHA-256 Pluggable Authentication”, and Section 6.4.1.4, “Caching SHA-2 Pluggable Authentication”.

  The `--server-public-key-path` option was added in MySQL 5.7.23.

* `--set-charset=charset_name`

  <table frame="box" rules="all" summary="Properties for binlog-row-event-max-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-row-event-max-size=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>4294967040</code></td> </tr><tr><th>Minimum Value</th> <td><code>256</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709547520</code></td> </tr></tbody></table>3

  Add a `SET NAMES charset_name` statement to the output to specify the character set to be used for processing log files.

* `--shared-memory-base-name=name`

  <table frame="box" rules="all" summary="Properties for binlog-row-event-max-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-row-event-max-size=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>4294967040</code></td> </tr><tr><th>Minimum Value</th> <td><code>256</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709547520</code></td> </tr></tbody></table>4

  On Windows, the shared-memory name to use for connections made using shared memory to a local server. The default value is `MYSQL`. The shared-memory name is case-sensitive.

  This option applies only if the server was started with the `shared_memory` system variable enabled to support shared-memory connections.

* `--short-form`, `-s`

  <table frame="box" rules="all" summary="Properties for binlog-row-event-max-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-row-event-max-size=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>4294967040</code></td> </tr><tr><th>Minimum Value</th> <td><code>256</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709547520</code></td> </tr></tbody></table>5

  Display only the statements contained in the log, without any extra information or row-based events. This is for testing only, and should not be used in production systems.

* `--skip-gtids[=(true|false)]`

  <table frame="box" rules="all" summary="Properties for binlog-row-event-max-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-row-event-max-size=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>4294967040</code></td> </tr><tr><th>Minimum Value</th> <td><code>256</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709547520</code></td> </tr></tbody></table>6

  Do not include the GTIDs from the binary log files in the output dump file. For example:

  ```sql
  mysqlbinlog --skip-gtids binlog.000001 >  /tmp/dump.sql
  mysql -u root -p -e "source /tmp/dump.sql"
  ```

  You should not normally use this option in production or in recovery, except in the specific, and rare, scenarios where the GTIDs are actively unwanted. For example, an administrator might want to duplicate selected transactions (such as table definitions) from a deployment to another, unrelated, deployment that will not replicate to or from the original. In that scenario, `--skip-gtids` can be used to enable the administrator to apply the transactions as if they were new, and ensure that the deployments remain unrelated. However, you should only use this option if the inclusion of the GTIDs causes a known issue for your use case.

* `--socket=path`, `-S path`

  <table frame="box" rules="all" summary="Properties for binlog-row-event-max-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-row-event-max-size=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>4294967040</code></td> </tr><tr><th>Minimum Value</th> <td><code>256</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709547520</code></td> </tr></tbody></table>7

  For connections to `localhost`, the Unix socket file to use, or, on Windows, the name of the named pipe to use.

  On Windows, this option applies only if the server was started with the `named_pipe` system variable enabled to support named-pipe connections. In addition, the user making the connection must be a member of the Windows group specified by the `named_pipe_full_access_group` system variable.

* `--ssl*`

  Options that begin with `--ssl` specify whether to connect to the server using encryption and indicate where to find SSL keys and certificates. See Command Options for Encrypted Connections.

* `--start-datetime=datetime`

  <table frame="box" rules="all" summary="Properties for binlog-row-event-max-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-row-event-max-size=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>4294967040</code></td> </tr><tr><th>Minimum Value</th> <td><code>256</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709547520</code></td> </tr></tbody></table>8

  Start reading the binary log at the first event having a timestamp equal to or later than the *`datetime`* argument. The *`datetime`* value is relative to the local time zone on the machine where you run **mysqlbinlog**. The value should be in a format accepted for the `DATETIME` or `TIMESTAMP` data types. For example:

  ```sql
  mysqlbinlog --start-datetime="2005-12-25 11:25:56" binlog.000003
  ```

  This option is useful for point-in-time recovery. See Section 7.5, “Point-in-Time (Incremental) Recovery” Recovery").

* `--start-position=N`, `-j N`

  <table frame="box" rules="all" summary="Properties for binlog-row-event-max-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-row-event-max-size=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>4294967040</code></td> </tr><tr><th>Minimum Value</th> <td><code>256</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709547520</code></td> </tr></tbody></table>9

  Start reading the binary log at the first event having a position equal to or greater than *`N`*. This option applies to the first log file named on the command line.

  This option is useful for point-in-time recovery. See Section 7.5, “Point-in-Time (Incremental) Recovery” Recovery").

* `--stop-datetime=datetime`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>0

  Stop reading the binary log at the first event having a timestamp equal to or later than the *`datetime`* argument. See the description of the `--start-datetime` option for information about the *`datetime`* value.

  This option is useful for point-in-time recovery. See Section 7.5, “Point-in-Time (Incremental) Recovery” Recovery").

* `--stop-never`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>1

  This option is used with `--read-from-remote-server`. It tells **mysqlbinlog** to remain connected to the server. Otherwise **mysqlbinlog** exits when the last log file has been transferred from the server. `--stop-never` implies `--to-last-log`, so only the first log file to transfer need be named on the command line.

  `--stop-never` is commonly used with `--raw` to make a live binary log backup, but also can be used without `--raw` to maintain a continuous text display of log events as the server generates them.

* `--stop-never-slave-server-id=id`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>2

  With `--stop-never`, **mysqlbinlog** reports a server ID of 65535 when it connects to the server. `--stop-never-slave-server-id` explicitly specifies the server ID to report. It can be used to avoid a conflict with the ID of a replica server or another **mysqlbinlog** process. See Section 4.6.7.4, “Specifying the mysqlbinlog Server ID”.

* `--stop-position=N`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>3

  Stop reading the binary log at the first event having a position equal to or greater than *`N`*. This option applies to the last log file named on the command line.

  This option is useful for point-in-time recovery. See Section 7.5, “Point-in-Time (Incremental) Recovery” Recovery").

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>4

  The permissible TLS protocols for encrypted connections. The value is a list of one or more comma-separated protocol names. The protocols that can be named for this option depend on the SSL library used to compile MySQL. For details, see Section 6.3.2, “Encrypted Connection TLS Protocols and Ciphers”.

  This option was added in MySQL 5.7.10.

* `--to-last-log`, `-t`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>5

  Do not stop at the end of the requested binary log from a MySQL server, but rather continue printing until the end of the last binary log. If you send the output to the same MySQL server, this may lead to an endless loop. This option requires `--read-from-remote-server`.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>6

  The user name of the MySQL account to use when connecting to a remote server.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>7

  Reconstruct row events and display them as commented SQL statements. If this option is given twice (by passing in either "-vv" or "--verbose --verbose"), the output includes comments to indicate column data types and some metadata, and row query log events if so configured.

  For examples that show the effect of `--base64-output` and `--verbose` on row event output, see Section 4.6.7.2, “mysqlbinlog Row Event Display”.

* `--verify-binlog-checksum`, `-c`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>8

  Verify checksums in binary log files.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>9

  Display version information and exit.

  In MySQL 5.7, the version number shown by **mysqlbinlog** when using this option is 3.4.

You can pipe the output of **mysqlbinlog** into the **mysql** client to execute the events contained in the binary log. This technique is used to recover from an unexpected exit when you have an old backup (see Section 7.5, “Point-in-Time (Incremental) Recovery” Recovery")). For example:

```sql
mysqlbinlog binlog.000001 | mysql -u root -p
```

Or:

```sql
mysqlbinlog binlog.[0-9]* | mysql -u root -p
```

If the statements produced by **mysqlbinlog** may contain `BLOB` values, these may cause problems when **mysql** processes them. In this case, invoke **mysql** with the `--binary-mode` option.

You can also redirect the output of **mysqlbinlog** to a text file instead, if you need to modify the statement log first (for example, to remove statements that you do not want to execute for some reason). After editing the file, execute the statements that it contains by using it as input to the **mysql** program:

```sql
mysqlbinlog binlog.000001 > tmpfile
... edit tmpfile ...
mysql -u root -p < tmpfile
```

When **mysqlbinlog** is invoked with the `--start-position` option, it displays only those events with an offset in the binary log greater than or equal to a given position (the given position must match the start of one event). It also has options to stop and start when it sees an event with a given date and time. This enables you to perform point-in-time recovery using the `--stop-datetime` option (to be able to say, for example, “roll forward my databases to how they were today at 10:30 a.m.”).

**Processing multiple files.** If you have more than one binary log to execute on the MySQL server, the safe method is to process them all using a single connection to the server. Here is an example that demonstrates what may be *unsafe*:

```sql
mysqlbinlog binlog.000001 | mysql -u root -p # DANGER!!
mysqlbinlog binlog.000002 | mysql -u root -p # DANGER!!
```

Processing binary logs this way using multiple connections to the server causes problems if the first log file contains a `CREATE TEMPORARY TABLE` statement and the second log contains a statement that uses the temporary table. When the first **mysql** process terminates, the server drops the temporary table. When the second **mysql** process attempts to use the table, the server reports “unknown table.”

To avoid problems like this, use a *single* **mysql** process to execute the contents of all binary logs that you want to process. Here is one way to do so:

```sql
mysqlbinlog binlog.000001 binlog.000002 | mysql -u root -p
```

Another approach is to write all the logs to a single file and then process the file:

```sql
mysqlbinlog binlog.000001 >  /tmp/statements.sql
mysqlbinlog binlog.000002 >> /tmp/statements.sql
mysql -u root -p -e "source /tmp/statements.sql"
```

**mysqlbinlog** can produce output that reproduces a `LOAD DATA` operation without the original data file. **mysqlbinlog** copies the data to a temporary file and writes a `LOAD DATA LOCAL` statement that refers to the file. The default location of the directory where these files are written is system-specific. To specify a directory explicitly, use the `--local-load` option.

Because **mysqlbinlog** converts `LOAD DATA` statements to `LOAD DATA LOCAL` statements (that is, it adds `LOCAL`), both the client and the server that you use to process the statements must be configured with the `LOCAL` capability enabled. See Section 6.1.6, “Security Considerations for LOAD DATA LOCAL”.

Warning

The temporary files created for `LOAD DATA LOCAL` statements are *not* automatically deleted because they are needed until you actually execute those statements. You should delete the temporary files yourself after you no longer need the statement log. The files can be found in the temporary file directory and have names like *`original_file_name-#-#`*.

#### 4.6.7.1 mysqlbinlog Hex Dump Format

The `--hexdump` option causes **mysqlbinlog** to produce a hex dump of the binary log contents:

```sql
mysqlbinlog --hexdump master-bin.000001
```

The hex output consists of comment lines beginning with `#`, so the output might look like this for the preceding command:

```sql
/*!40019 SET @@SESSION.max_insert_delayed_threads=0*/;
/*!50003 SET @OLD_COMPLETION_TYPE=@@COMPLETION_TYPE,COMPLETION_TYPE=0*/;
# at 4
#051024 17:24:13 server id 1  end_log_pos 98
# Position  Timestamp   Type   Master ID        Size      Master Pos    Flags
# 00000004 9d fc 5c 43   0f   01 00 00 00   5e 00 00 00   62 00 00 00   00 00
# 00000017 04 00 35 2e 30 2e 31 35  2d 64 65 62 75 67 2d 6c |..5.0.15.debug.l|
# 00000027 6f 67 00 00 00 00 00 00  00 00 00 00 00 00 00 00 |og..............|
# 00000037 00 00 00 00 00 00 00 00  00 00 00 00 00 00 00 00 |................|
# 00000047 00 00 00 00 9d fc 5c 43  13 38 0d 00 08 00 12 00 |.......C.8......|
# 00000057 04 04 04 04 12 00 00 4b  00 04 1a                |.......K...|
#       Start: binlog v 4, server v 5.0.15-debug-log created 051024 17:24:13
#       at startup
ROLLBACK;
```

Hex dump output currently contains the elements in the following list. This format is subject to change. For more information about binary log format, see MySQL Internals: The Binary Log.

* `Position`: The byte position within the log file.

* `Timestamp`: The event timestamp. In the example shown, `'9d fc 5c 43'` is the representation of `'051024 17:24:13'` in hexadecimal.

* `Type`: The event type code.
  
* `Master ID`: The server ID of the replication source server that created the event.

* `Size`: The size in bytes of the event.

* `Master Pos`: The position of the next event in the original source log file.

* `Flags`: Event flag values.

#### 4.6.7.2 mysqlbinlog Row Event Display

The following examples illustrate how **mysqlbinlog** displays row events that specify data modifications. These correspond to events with the `WRITE_ROWS_EVENT`, `UPDATE_ROWS_EVENT`, and `DELETE_ROWS_EVENT` type codes. The `--base64-output=DECODE-ROWS` and `--verbose` options may be used to affect row event output.

Suppose that the server is using row-based binary logging and that you execute the following sequence of statements:

```sql
CREATE TABLE t
(
  id   INT NOT NULL,
  name VARCHAR(20) NOT NULL,
  date DATE NULL
) ENGINE = InnoDB;

START TRANSACTION;
INSERT INTO t VALUES(1, 'apple', NULL);
UPDATE t SET name = 'pear', date = '2009-01-01' WHERE id = 1;
DELETE FROM t WHERE id = 1;
COMMIT;
```

By default, **mysqlbinlog** displays row events encoded as base-64 strings using `BINLOG` statements. Omitting extraneous lines, the output for the row events produced by the preceding statement sequence looks like this:

```sql
$> mysqlbinlog log_file
...
# at 218
#080828 15:03:08 server id 1  end_log_pos 258   Write_rows: table id 17 flags: STMT_END_F

BINLOG '
fAS3SBMBAAAALAAAANoAAAAAABEAAAAAAAAABHRlc3QAAXQAAwMPCgIUAAQ=
fAS3SBcBAAAAKAAAAAIBAAAQABEAAAAAAAEAA//8AQAAAAVhcHBsZQ==
'/*!*/;
...
# at 302
#080828 15:03:08 server id 1  end_log_pos 356   Update_rows: table id 17 flags: STMT_END_F

BINLOG '
fAS3SBMBAAAALAAAAC4BAAAAABEAAAAAAAAABHRlc3QAAXQAAwMPCgIUAAQ=
fAS3SBgBAAAANgAAAGQBAAAQABEAAAAAAAEAA////AEAAAAFYXBwbGX4AQAAAARwZWFyIbIP
'/*!*/;
...
# at 400
#080828 15:03:08 server id 1  end_log_pos 442   Delete_rows: table id 17 flags: STMT_END_F

BINLOG '
fAS3SBMBAAAALAAAAJABAAAAABEAAAAAAAAABHRlc3QAAXQAAwMPCgIUAAQ=
fAS3SBkBAAAAKgAAALoBAAAQABEAAAAAAAEAA//4AQAAAARwZWFyIbIP
'/*!*/;
```

To see the row events as comments in the form of “pseudo-SQL” statements, run **mysqlbinlog** with the `--verbose` or `-v` option. The output contains lines beginning with `###`:

```sql
$> mysqlbinlog -v log_file
...
# at 218
#080828 15:03:08 server id 1  end_log_pos 258   Write_rows: table id 17 flags: STMT_END_F

BINLOG '
fAS3SBMBAAAALAAAANoAAAAAABEAAAAAAAAABHRlc3QAAXQAAwMPCgIUAAQ=
fAS3SBcBAAAAKAAAAAIBAAAQABEAAAAAAAEAA//8AQAAAAVhcHBsZQ==
'/*!*/;
### INSERT INTO test.t
### SET
###   @1=1
###   @2='apple'
###   @3=NULL
...
# at 302
#080828 15:03:08 server id 1  end_log_pos 356   Update_rows: table id 17 flags: STMT_END_F

BINLOG '
fAS3SBMBAAAALAAAAC4BAAAAABEAAAAAAAAABHRlc3QAAXQAAwMPCgIUAAQ=
fAS3SBgBAAAANgAAAGQBAAAQABEAAAAAAAEAA////AEAAAAFYXBwbGX4AQAAAARwZWFyIbIP
'/*!*/;
### UPDATE test.t
### WHERE
###   @1=1
###   @2='apple'
###   @3=NULL
### SET
###   @1=1
###   @2='pear'
###   @3='2009:01:01'
...
# at 400
#080828 15:03:08 server id 1  end_log_pos 442   Delete_rows: table id 17 flags: STMT_END_F

BINLOG '
fAS3SBMBAAAALAAAAJABAAAAABEAAAAAAAAABHRlc3QAAXQAAwMPCgIUAAQ=
fAS3SBkBAAAAKgAAALoBAAAQABEAAAAAAAEAA//4AQAAAARwZWFyIbIP
'/*!*/;
### DELETE FROM test.t
### WHERE
###   @1=1
###   @2='pear'
###   @3='2009:01:01'
```

Specify `--verbose` or `-v` twice to also display data types and some metadata for each column. The output contains an additional comment following each column change:

```sql
$> mysqlbinlog -vv log_file
...
# at 218
#080828 15:03:08 server id 1  end_log_pos 258   Write_rows: table id 17 flags: STMT_END_F

BINLOG '
fAS3SBMBAAAALAAAANoAAAAAABEAAAAAAAAABHRlc3QAAXQAAwMPCgIUAAQ=
fAS3SBcBAAAAKAAAAAIBAAAQABEAAAAAAAEAA//8AQAAAAVhcHBsZQ==
'/*!*/;
### INSERT INTO test.t
### SET
###   @1=1 /* INT meta=0 nullable=0 is_null=0 */
###   @2='apple' /* VARSTRING(20) meta=20 nullable=0 is_null=0 */
###   @3=NULL /* VARSTRING(20) meta=0 nullable=1 is_null=1 */
...
# at 302
#080828 15:03:08 server id 1  end_log_pos 356   Update_rows: table id 17 flags: STMT_END_F

BINLOG '
fAS3SBMBAAAALAAAAC4BAAAAABEAAAAAAAAABHRlc3QAAXQAAwMPCgIUAAQ=
fAS3SBgBAAAANgAAAGQBAAAQABEAAAAAAAEAA////AEAAAAFYXBwbGX4AQAAAARwZWFyIbIP
'/*!*/;
### UPDATE test.t
### WHERE
###   @1=1 /* INT meta=0 nullable=0 is_null=0 */
###   @2='apple' /* VARSTRING(20) meta=20 nullable=0 is_null=0 */
###   @3=NULL /* VARSTRING(20) meta=0 nullable=1 is_null=1 */
### SET
###   @1=1 /* INT meta=0 nullable=0 is_null=0 */
###   @2='pear' /* VARSTRING(20) meta=20 nullable=0 is_null=0 */
###   @3='2009:01:01' /* DATE meta=0 nullable=1 is_null=0 */
...
# at 400
#080828 15:03:08 server id 1  end_log_pos 442   Delete_rows: table id 17 flags: STMT_END_F

BINLOG '
fAS3SBMBAAAALAAAAJABAAAAABEAAAAAAAAABHRlc3QAAXQAAwMPCgIUAAQ=
fAS3SBkBAAAAKgAAALoBAAAQABEAAAAAAAEAA//4AQAAAARwZWFyIbIP
'/*!*/;
### DELETE FROM test.t
### WHERE
###   @1=1 /* INT meta=0 nullable=0 is_null=0 */
###   @2='pear' /* VARSTRING(20) meta=20 nullable=0 is_null=0 */
###   @3='2009:01:01' /* DATE meta=0 nullable=1 is_null=0 */
```

You can tell **mysqlbinlog** to suppress the `BINLOG` statements for row events by using the `--base64-output=DECODE-ROWS` option. This is similar to `--base64-output=NEVER` but does not exit with an error if a row event is found. The combination of `--base64-output=DECODE-ROWS` and `--verbose` provides a convenient way to see row events only as SQL statements:

```sql
$> mysqlbinlog -v --base64-output=DECODE-ROWS log_file
...
# at 218
#080828 15:03:08 server id 1  end_log_pos 258   Write_rows: table id 17 flags: STMT_END_F
### INSERT INTO test.t
### SET
###   @1=1
###   @2='apple'
###   @3=NULL
...
# at 302
#080828 15:03:08 server id 1  end_log_pos 356   Update_rows: table id 17 flags: STMT_END_F
### UPDATE test.t
### WHERE
###   @1=1
###   @2='apple'
###   @3=NULL
### SET
###   @1=1
###   @2='pear'
###   @3='2009:01:01'
...
# at 400
#080828 15:03:08 server id 1  end_log_pos 442   Delete_rows: table id 17 flags: STMT_END_F
### DELETE FROM test.t
### WHERE
###   @1=1
###   @2='pear'
###   @3='2009:01:01'
```

Note

You should not suppress `BINLOG` statements if you intend to re-execute **mysqlbinlog** output.

The SQL statements produced by `--verbose` for row events are much more readable than the corresponding `BINLOG` statements. However, they do not correspond exactly to the original SQL statements that generated the events. The following limitations apply:

* The original column names are lost and replaced by `@N`, where *`N`* is a column number.

* Character set information is not available in the binary log, which affects string column display:

  + There is no distinction made between corresponding binary and nonbinary string types (`BINARY` and `CHAR`, `VARBINARY` and `VARCHAR`, `BLOB` and `TEXT`). The output uses a data type of `STRING` for fixed-length strings and `VARSTRING` for variable-length strings.

  + For multibyte character sets, the maximum number of bytes per character is not present in the binary log, so the length for string types is displayed in bytes rather than in characters. For example, `STRING(4)` is used as the data type for values from either of these column types:

    ```sql
    CHAR(4) CHARACTER SET latin1
    CHAR(2) CHARACTER SET ucs2
    ```

  + Due to the storage format for events of type `UPDATE_ROWS_EVENT`, `UPDATE` statements are displayed with the `WHERE` clause preceding the `SET` clause.

Proper interpretation of row events requires the information from the format description event at the beginning of the binary log. Because **mysqlbinlog** does not know in advance whether the rest of the log contains row events, by default it displays the format description event using a `BINLOG` statement in the initial part of the output.

If the binary log is known not to contain any events requiring a `BINLOG` statement (that is, no row events), the `--base64-output=NEVER` option can be used to prevent this header from being written.

#### 4.6.7.3 Using mysqlbinlog to Back Up Binary Log Files

By default, **mysqlbinlog** reads binary log files and displays their contents in text format. This enables you to examine events within the files more easily and to re-execute them (for example, by using the output as input to **mysql**). **mysqlbinlog** can read log files directly from the local file system, or, with the `--read-from-remote-server` option, it can connect to a server and request binary log contents from that server. **mysqlbinlog** writes text output to its standard output, or to the file named as the value of the `--result-file=file_name` option if that option is given.

* mysqlbinlog Backup Capabilities
* mysqlbinlog Backup Options
* Static and Live Backups
* Output File Naming
* Example: mysqldump + mysqlbinlog for Backup and Restore
* mysqlbinlog Backup Restrictions

##### mysqlbinlog Backup Capabilities

**mysqlbinlog** can read binary log files and write new files containing the same content—that is, in binary format rather than text format. This capability enables you to easily back up a binary log in its original format. **mysqlbinlog** can make a static backup, backing up a set of log files and stopping when the end of the last file is reached. It can also make a continuous (“live”) backup, staying connected to the server when it reaches the end of the last log file and continuing to copy new events as they are generated. In continuous-backup operation, **mysqlbinlog** runs until the connection ends (for example, when the server exits) or **mysqlbinlog** is forcibly terminated. When the connection ends, **mysqlbinlog** does not wait and retry the connection, unlike a replica server. To continue a live backup after the server has been restarted, you must also restart **mysqlbinlog**.

##### mysqlbinlog Backup Options

Binary log backup requires that you invoke **mysqlbinlog** with two options at minimum:

* The `--read-from-remote-server` (or `-R`) option tells **mysqlbinlog** to connect to a server and request its binary log. (This is similar to a replica server connecting to its replication source server.)

* The `--raw` option tells **mysqlbinlog** to write raw (binary) output, not text output.

Along with `--read-from-remote-server`, it is common to specify other options: `--host` indicates where the server is running, and you may also need to specify connection options such as `--user` and `--password`.

Several other options are useful in conjunction with `--raw`:

* `--stop-never`: Stay connected to the server after reaching the end of the last log file and continue to read new events.

* `--stop-never-slave-server-id=id`: The server ID that **mysqlbinlog** reports to the server when `--stop-never` is used. The default is 65535. This can be used to avoid a conflict with the ID of a replica server or another **mysqlbinlog** process. See Section 4.6.7.4, “Specifying the mysqlbinlog Server ID”.

* `--result-file`: A prefix for output file names, as described later.

##### Static and Live Backups

To back up a server's binary log files with **mysqlbinlog**, you must specify file names that actually exist on the server. If you do not know the names, connect to the server and use the `SHOW BINARY LOGS` statement to see the current names. Suppose that the statement produces this output:

```sql
mysql> SHOW BINARY LOGS;
+---------------+-----------+
| Log_name      | File_size |
+---------------+-----------+
| binlog.000130 |     27459 |
| binlog.000131 |     13719 |
| binlog.000132 |     43268 |
+---------------+-----------+
```

With that information, you can use **mysqlbinlog** to back up the binary log to the current directory as follows (enter each command on a single line):

* To make a static backup of `binlog.000130` through `binlog.000132`, use either of these commands:

  ```sql
  mysqlbinlog --read-from-remote-server --host=host_name --raw
    binlog.000130 binlog.000131 binlog.000132

  mysqlbinlog --read-from-remote-server --host=host_name --raw
    --to-last-log binlog.000130
  ```

  The first command specifies every file name explicitly. The second names only the first file and uses `--to-last-log` to read through the last. A difference between these commands is that if the server happens to open `binlog.000133` before **mysqlbinlog** reaches the end of `binlog.000132`, the first command does not read it, but the second command does.

* To make a live backup in which **mysqlbinlog** starts with `binlog.000130` to copy existing log files, then stays connected to copy new events as the server generates them:

  ```sql
  mysqlbinlog --read-from-remote-server --host=host_name --raw
    --stop-never binlog.000130
  ```

  With `--stop-never`, it is not necessary to specify `--to-last-log` to read to the last log file because that option is implied.

##### Output File Naming

Without `--raw`, **mysqlbinlog** produces text output and the `--result-file` option, if given, specifies the name of the single file to which all output is written. With `--raw`, **mysqlbinlog** writes one binary output file for each log file transferred from the server. By default, **mysqlbinlog** writes the files in the current directory with the same names as the original log files. To modify the output file names, use the `--result-file` option. In conjunction with `--raw`, the `--result-file` option value is treated as a prefix that modifies the output file names.

Suppose that a server currently has binary log files named `binlog.000999` and up. If you use **mysqlbinlog --raw** to back up the files, the `--result-file` option produces output file names as shown in the following table. You can write the files to a specific directory by beginning the `--result-file` value with the directory path. If the `--result-file` value consists only of a directory name, the value must end with the pathname separator character. Output files are overwritten if they exist.

<table summary="mysqlbinlog --result-file options and corresponding output file names, as described in the example in the preceding text."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th><code>--result-file</code> Option</th> <th>Output File Names</th> </tr></thead><tbody><tr> <td><code>--result-file=x</code></td> <td><code>xbinlog.000999</code> and up</td> </tr><tr> <td><code>--result-file=/tmp/</code></td> <td><code>/tmp/binlog.000999</code> and up</td> </tr><tr> <td><code>--result-file=/tmp/x</code></td> <td><code>/tmp/xbinlog.000999</code> and up</td> </tr></tbody></table>

##### Example: mysqldump + mysqlbinlog for Backup and Restore

The following example describes a simple scenario that shows how to use **mysqldump** and **mysqlbinlog** together to back up a server's data and binary log, and how to use the backup to restore the server if data loss occurs. The example assumes that the server is running on host *`host_name`* and its first binary log file is named `binlog.000999`. Enter each command on a single line.

Use **mysqlbinlog** to make a continuous backup of the binary log:

```sql
mysqlbinlog --read-from-remote-server --host=host_name --raw
  --stop-never binlog.000999
```

Use **mysqldump** to create a dump file as a snapshot of the server's data. Use `--all-databases`, `--events`, and `--routines` to back up all data, and `--master-data=2` to include the current binary log coordinates in the dump file.

```sql
mysqldump --host=host_name --all-databases --events --routines --master-data=2> dump_file
```

Execute the **mysqldump** command periodically to create newer snapshots as desired.

If data loss occurs (for example, if the server unexpectedly exits), use the most recent dump file to restore the data:

```sql
mysql --host=host_name -u root -p < dump_file
```

Then use the binary log backup to re-execute events that were written after the coordinates listed in the dump file. Suppose that the coordinates in the file look like this:

```sql
-- CHANGE MASTER TO MASTER_LOG_FILE='binlog.001002', MASTER_LOG_POS=27284;
```

If the most recent backed-up log file is named `binlog.001004`, re-execute the log events like this:

```sql
mysqlbinlog --start-position=27284 binlog.001002 binlog.001003 binlog.001004
  | mysql --host=host_name -u root -p
```

You might find it easier to copy the backup files (dump file and binary log files) to the server host to make it easier to perform the restore operation, or if MySQL does not allow remote `root` access.

##### mysqlbinlog Backup Restrictions

Binary log backups with **mysqlbinlog** are subject to these restrictions:

* **mysqlbinlog** does not automatically reconnect to the MySQL server if the connection is lost (for example, if a server restart occurs or there is a network outage).

* Prior to MySQL 5.7.19, **mysqlbinlog** does not get all events as they are committed, even if the server is configured with `sync_binlog=1`. This means that some of the most recent events may be missing. To ensure that **mysqlbinlog** sees the most recent events, flush the binary log on the server that you are backing up.

* The delay for a backup is similar to the delay for a replica server.

#### 4.6.7.4 Specifying the mysqlbinlog Server ID

When invoked with the `--read-from-remote-server` option, **mysqlbinlog** connects to a MySQL server, specifies a server ID to identify itself, and requests binary log files from the server. You can use **mysqlbinlog** to request log files from a server in several ways:

* Specify an explicitly named set of files: For each file, **mysqlbinlog** connects and issues a `Binlog dump` command. The server sends the file and disconnects. There is one connection per file.

* Specify the beginning file and `--to-last-log`: **mysqlbinlog** connects and issues a `Binlog dump` command for all files. The server sends all files and disconnects.

* Specify the beginning file and `--stop-never` (which implies `--to-last-log`): **mysqlbinlog** connects and issues a `Binlog dump` command for all files. The server sends all files, but does not disconnect after sending the last one.

With `--read-from-remote-server` only, **mysqlbinlog** connects using a server ID of 0, which tells the server to disconnect after sending the last requested log file.

With `--read-from-remote-server` and `--stop-never`, **mysqlbinlog** connects using a nonzero server ID, so the server does not disconnect after sending the last log file. The server ID is 65535 by default, but this can be changed with `--stop-never-slave-server-id`.

Thus, for the first two ways of requesting files, the server disconnects because **mysqlbinlog** specifies a server ID of 0. It does not disconnect if `--stop-never` is given because **mysqlbinlog** specifies a nonzero server ID.

### 4.6.8 mysqldumpslow — Summarize Slow Query Log Files

The MySQL slow query log contains information about queries that take a long time to execute (see Section 5.4.5, “The Slow Query Log”). **mysqldumpslow** parses MySQL slow query log files and summarizes their contents.

Normally, **mysqldumpslow** groups queries that are similar except for the particular values of number and string data values. It “abstracts” these values to `N` and `'S'` when displaying summary output. To modify value abstracting behavior, use the `-a` and `-n` options.

Invoke **mysqldumpslow** like this:

```sql
mysqldumpslow [options] [log_file ...]
```

Example output with no options given:

```sql
Reading mysql slow query log from /usr/local/mysql/data/mysqld57-slow.log
Count: 1  Time=4.32s (4s)  Lock=0.00s (0s)  Rows=0.0 (0), root[root]@localhost
 insert into t2 select * from t1

Count: 3  Time=2.53s (7s)  Lock=0.00s (0s)  Rows=0.0 (0), root[root]@localhost
 insert into t2 select * from t1 limit N

Count: 3  Time=2.13s (6s)  Lock=0.00s (0s)  Rows=0.0 (0), root[root]@localhost
 insert into t1 select * from t1
```

**mysqldumpslow** supports the following options.

**Table 4.24 mysqldumpslow Options**

<table frame="box" rules="all" summary="Command-line options available for mysqldumpslow."><col style="width: 35%"/><col style="width: 64%"/><thead><tr><th>Option Name</th> <th>Description</th> </tr></thead><tbody><tr><td>-a</td> <td>Do not abstract all numbers to N and strings to 'S'</td> </tr><tr><td>-n</td> <td>Abstract numbers with at least the specified digits</td> </tr><tr><td>--debug</td> <td>Write debugging information</td> </tr><tr><td>-g</td> <td>Only consider statements that match the pattern</td> </tr><tr><td>--help</td> <td>Display help message and exit</td> </tr><tr><td>-h</td> <td>Host name of the server in the log file name</td> </tr><tr><td>-i</td> <td>Name of the server instance</td> </tr><tr><td>-l</td> <td>Do not subtract lock time from total time</td> </tr><tr><td>-r</td> <td>Reverse the sort order</td> </tr><tr><td>-s</td> <td>How to sort output</td> </tr><tr><td>-t</td> <td>Display only first num queries</td> </tr><tr><td>--verbose</td> <td>Verbose mode</td> </tr></tbody></table>

* `--help`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Display a help message and exit.

* `-a`

  Do not abstract all numbers to `N` and strings to `'S'`.

* `--debug`, `-d`

  <table frame="box" rules="all" summary="Properties for debug"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--debug</code></td> </tr></tbody></table>

  Run in debug mode.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `-g pattern`

  <table frame="box" rules="all" summary="Properties for grep"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  Consider only queries that match the (**grep**-style) pattern.

* `-h host_name`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>*</code></td> </tr></tbody></table>

  Host name of MySQL server for `*-slow.log` file name. The value can contain a wildcard. The default is `*` (match all).

* `-i name`

  <table frame="box" rules="all" summary="Properties for instance"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  Name of server instance (if using **mysql.server** startup script).

* `-l`

  Do not subtract lock time from total time.

* `-n N`

  <table frame="box" rules="all" summary="Properties for abstract-numbers"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>

  Abstract numbers with at least *`N`* digits within names.

* `-r`

  Reverse the sort order.

* `-s sort_type`

  <table frame="box" rules="all" summary="Properties for sort"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>at</code></td> </tr></tbody></table>

  How to sort the output. The value of *`sort_type`* should be chosen from the following list:

  + `t`, `at`: Sort by query time or average query time

  + `l`, `al`: Sort by lock time or average lock time

  + `r`, `ar`: Sort by rows sent or average rows sent

  + `c`: Sort by count

  By default, **mysqldumpslow** sorts by average query time (equivalent to `-s at`).

* `-t N`

  <table frame="box" rules="all" summary="Properties for top"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>

  Display only the first *`N`* queries in the output.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for verbose"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--verbose</code></td> </tr></tbody></table>

  Verbose mode. Print more information about what the program does.

