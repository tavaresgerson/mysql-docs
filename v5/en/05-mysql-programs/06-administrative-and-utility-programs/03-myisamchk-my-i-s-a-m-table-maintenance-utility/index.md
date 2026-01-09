### 4.6.3 myisamchk — MyISAM Table-Maintenance Utility

4.6.3.1 myisamchk General Options

4.6.3.2 myisamchk Check Options

4.6.3.3 myisamchk Repair Options

4.6.3.4 Other myisamchk Options

4.6.3.5 Obtaining Table Information with myisamchk

4.6.3.6 myisamchk Memory Usage

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

This means that you are trying to check a table that has been updated by another program (such as the **mysqld** server) that hasn't yet closed the file or that has died without closing the file properly, which can sometimes lead to the corruption of one or more `MyISAM` tables.

If **mysqld** is running, you must force it to flush any table modifications that are still buffered in memory by using `FLUSH TABLES`. You should then ensure that no one is using the tables while you are running **myisamchk**

However, the easiest way to avoid this problem is to use `CHECK TABLE` instead of **myisamchk** to check tables. See Section 13.7.2.2, “CHECK TABLE Statement”.

**myisamchk** supports the following options, which can be specified on the command line or in the `[myisamchk]` group of an option file. For information about option files used by MySQL programs, see Section 4.2.2.2, “Using Option Files”.

**Table 4.21 myisamchk Options**

<table frame="box" rules="all" summary="Command-line options available for myisamchk."><col style="width: 35%"/><col style="width: 64%"/><thead><tr><th>Option Name</th> <th>Description</th> </tr></thead><tbody><tr><td>--analyze</td> <td>Analyze the distribution of key values</td> </tr><tr><td>--backup</td> <td>Make a backup of the .MYD file as file_name-time.BAK</td> </tr><tr><td>--block-search</td> <td>Find the record that a block at the given offset belongs to</td> </tr><tr><td>--character-sets-dir</td> <td>Directory where character sets can be found</td> </tr><tr><td>--check</td> <td>Check the table for errors</td> </tr><tr><td>--check-only-changed</td> <td>Check only tables that have changed since the last check</td> </tr><tr><td>--correct-checksum</td> <td>Correct the checksum information for the table</td> </tr><tr><td>--data-file-length</td> <td>Maximum length of the data file (when re-creating data file when it is full)</td> </tr><tr><td>--debug</td> <td>Write debugging log</td> </tr><tr><td>--decode_bits</td> <td>Decode_bits</td> </tr><tr><td>--defaults-extra-file</td> <td>Read named option file in addition to usual option files</td> </tr><tr><td>--defaults-file</td> <td>Read only named option file</td> </tr><tr><td>--defaults-group-suffix</td> <td>Option group suffix value</td> </tr><tr><td>--description</td> <td>Print some descriptive information about the table</td> </tr><tr><td>--extend-check</td> <td>Do very thorough table check or repair that tries to recover every possible row from the data file</td> </tr><tr><td>--fast</td> <td>Check only tables that haven't been closed properly</td> </tr><tr><td>--force</td> <td>Do a repair operation automatically if myisamchk finds any errors in the table</td> </tr><tr><td>--force</td> <td>Overwrite old temporary files. For use with the -r or -o option</td> </tr><tr><td>--ft_max_word_len</td> <td>Maximum word length for FULLTEXT indexes</td> </tr><tr><td>--ft_min_word_len</td> <td>Minimum word length for FULLTEXT indexes</td> </tr><tr><td>--ft_stopword_file</td> <td>Use stopwords from this file instead of built-in list</td> </tr><tr><td>--HELP</td> <td>Display help message and exit</td> </tr><tr><td>--help</td> <td>Display help message and exit</td> </tr><tr><td>--information</td> <td>Print informational statistics about the table that is checked</td> </tr><tr><td>--key_buffer_size</td> <td>Size of buffer used for index blocks for MyISAM tables</td> </tr><tr><td>--keys-used</td> <td>A bit-value that indicates which indexes to update</td> </tr><tr><td>--max-record-length</td> <td>Skip rows larger than the given length if myisamchk cannot allocate memory to hold them</td> </tr><tr><td>--medium-check</td> <td>Do a check that is faster than an --extend-check operation</td> </tr><tr><td>--myisam_block_size</td> <td>Block size to be used for MyISAM index pages</td> </tr><tr><td>--myisam_sort_buffer_size</td> <td>The buffer that is allocated when sorting the index when doing a REPAIR or when creating indexes with CREATE INDEX or ALTER TABLE</td> </tr><tr><td>--no-defaults</td> <td>Read no option files</td> </tr><tr><td>--parallel-recover</td> <td>Uses the same technique as -r and -n, but creates all the keys in parallel, using different threads (beta)</td> </tr><tr><td>--print-defaults</td> <td>Print default options</td> </tr><tr><td>--quick</td> <td>Achieve a faster repair by not modifying the data file</td> </tr><tr><td>--read_buffer_size</td> <td>Each thread that does a sequential scan allocates a buffer of this size for each table it scans</td> </tr><tr><td>--read-only</td> <td>Do not mark the table as checked</td> </tr><tr><td>--recover</td> <td>Do a repair that can fix almost any problem except unique keys that aren't unique</td> </tr><tr><td>--safe-recover</td> <td>Do a repair using an old recovery method that reads through all rows in order and updates all index trees based on the rows found</td> </tr><tr><td>--set-auto-increment</td> <td>Force AUTO_INCREMENT numbering for new records to start at the given value</td> </tr><tr><td>--set-collation</td> <td>Specify the collation to use for sorting table indexes</td> </tr><tr><td>--silent</td> <td>Silent mode</td> </tr><tr><td>--sort_buffer_size</td> <td>The buffer that is allocated when sorting the index when doing a REPAIR or when creating indexes with CREATE INDEX or ALTER TABLE</td> </tr><tr><td>--sort-index</td> <td>Sort the index tree blocks in high-low order</td> </tr><tr><td>--sort_key_blocks</td> <td>sort_key_blocks</td> </tr><tr><td>--sort-records</td> <td>Sort records according to a particular index</td> </tr><tr><td>--sort-recover</td> <td>Force myisamchk to use sorting to resolve the keys even if the temporary files would be very large</td> </tr><tr><td>--stats_method</td> <td>Specifies how MyISAM index statistics collection code should treat NULLs</td> </tr><tr><td>--tmpdir</td> <td>Directory to be used for storing temporary files</td> </tr><tr><td>--unpack</td> <td>Unpack a table that was packed with myisampack</td> </tr><tr><td>--update-state</td> <td>Store information in the .MYI file to indicate when the table was checked and whether the table crashed</td> </tr><tr><td>--verbose</td> <td>Verbose mode</td> </tr><tr><td>--version</td> <td>Display version information and exit</td> </tr><tr><td>--wait</td> <td>Wait for locked table to be unlocked, instead of terminating</td> </tr><tr><td>--write_buffer_size</td> <td>Write buffer size</td> </tr></tbody></table>
