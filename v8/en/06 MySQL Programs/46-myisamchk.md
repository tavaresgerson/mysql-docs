### 6.6.4 `myisamchk` — MyISAM Table-Maintenance Utility

The `myisamchk` utility gets information about your database tables or checks, repairs, or optimizes them. `myisamchk` works with `MyISAM` tables (tables that have `.MYD` and `.MYI` files for storing data and indexes).

You can also use the `CHECK TABLE` and `REPAIR TABLE` statements to check and repair `MyISAM` tables.

The use of `myisamchk` with partitioned tables is not supported.

Caution

It is best to make a backup of a table before performing a table repair operation; under some circumstances the operation might cause data loss. Possible causes include but are not limited to file system errors.

Invoke `myisamchk` like this:

```
myisamchk [options] tbl_name ...
```

The `options` specify what you want `myisamchk` to do. They are described in the following sections. You can also get a list of options by invoking `myisamchk --help`.

With no options, `myisamchk` simply checks your table as the default operation. To get more information or to tell `myisamchk` to take corrective action, specify options as described in the following discussion.

`tbl_name` is the database table you want to check or repair. If you run  `myisamchk` somewhere other than in the database directory, you must specify the path to the database directory, because `myisamchk` has no idea where the database is located. In fact, `myisamchk` does not actually care whether the files you are working on are located in a database directory. You can copy the files that correspond to a database table into some other location and perform recovery operations on them there.

You can name several tables on the `myisamchk` command line if you wish. You can also specify a table by naming its index file (the file with the `.MYI` suffix). This enables you to specify all tables in a directory by using the pattern `*.MYI`. For example, if you are in a database directory, you can check all the `MyISAM` tables in that directory like this:

```
myisamchk *.MYI
```

If you are not in the database directory, you can check all the tables there by specifying the path to the directory:

```
myisamchk /path/to/database_dir/*.MYI
```

You can even check all tables in all databases by specifying a wildcard with the path to the MySQL data directory:

```
myisamchk /path/to/datadir/*/*.MYI
```

The recommended way to quickly check all `MyISAM` tables is:

```
myisamchk --silent --fast /path/to/datadir/*/*.MYI
```

If you want to check all `MyISAM` tables and repair any that are corrupted, you can use the following command:

```
myisamchk --silent --force --fast --update-state \
          --key_buffer_size=64M --myisam_sort_buffer_size=64M \
          --read_buffer_size=1M --write_buffer_size=1M \
          /path/to/datadir/*/*.MYI
```

This command assumes that you have more than 64MB free. For more information about memory allocation with `myisamchk`, see Section 6.6.4.6, “`myisamchk` Memory Usage”.

For additional information about using `myisamchk`, see Section 9.6, “MyISAM Table Maintenance and Crash Recovery”.

Important

*You must ensure that no other program is using the tables while you are running `myisamchk`*. The most effective means of doing so is to shut down the MySQL server while running `myisamchk`, or to lock all tables that `myisamchk` is being used on.

Otherwise, when you run `myisamchk`, it may display the following error message:

```
warning: clients are using or haven't closed the table properly
```

This means that you are trying to check a table that has been updated by another program (such as the `mysqld` server) that hasn't yet closed the file or that has died without closing the file properly, which can sometimes lead to the corruption of one or more `MyISAM` tables.

If `mysqld` is running, you must force it to flush any table modifications that are still buffered in memory by using `FLUSH TABLES`. You should then ensure that no one is using the tables while you are running `myisamchk`

However, the easiest way to avoid this problem is to use `CHECK TABLE` instead of `myisamchk` to check tables. See Section 15.7.3.2, “CHECK TABLE Statement”.

`myisamchk` supports the following options, which can be specified on the command line or in the `[myisamchk]` group of an option file. For information about option files used by MySQL programs, see Section 6.2.2.2, “Using Option Files”.

**Table 6.17 `myisamchk` Options**

<table>
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
         <td>Make a backup of the <code>.MYD</code> file as <code>file_name-time.BAK</code></td>
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
         <td><code>Decode_bits</code></td>
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
         <td>Do a repair operation automatically if <code>myisamchk</code> finds any errors in the table</td>
      </tr>
      <tr>
         <td><code>--force</code></td>
         <td>Overwrite old temporary files. For use with the <code>-r</code> or <code>-o</code> option</td>
      </tr>
      <tr>
         <td><code>--ft_max_word_len</code></td>
         <td>Maximum word length for <code>FULLTEXT</code> indexes</td>
      </tr>
      <tr>
         <td><code>--ft_min_word_len</code></td>
         <td>Minimum word length for <code>FULLTEXT</code> indexes</td>
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
         <td>Skip rows larger than the given length if <code>myisamchk</code> cannot allocate memory to hold them</td>
      </tr>
      <tr>
         <td><code>--medium-check</code></td>
         <td>Do a check that is faster than an <code>--extend-check operation</code></td>
      </tr>
      <tr>
         <td><code>--myisam_block_size</code></td>
         <td>Block size to be used for MyISAM index pages</td>
      </tr>
      <tr>
         <td><code>--myisam_sort_buffer_size</code></td>
         <td>The buffer that is allocated when sorting the index when doing a <code>REPAIR</code> or when creating indexes with <code>CREATE INDEX</code> or <code>ALTER TABLE</code></td>
      </tr>
      <tr>
         <td><code>--no-defaults</code></td>
         <td>Read no option files</td>
      </tr>
      <tr>
         <td><code>--parallel-recover</code></td>
         <td>Uses the same technique as <code>-r</code> and <code>-n</code>, but creates all the keys in parallel, using different threads (beta)</td>
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
         <td>Force <code>AUTO_INCREMENT</code> numbering for new records to start at the given value</td>
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
         <td>The buffer that is allocated when sorting the index when doing a <code>REPAIR</code> or when creating indexes with <code>CREATE INDEX</code> or <code>ALTER TABLE</code></td>
      </tr>
      <tr>
         <td><code>--sort-index</code></td>
         <td>Sort the index tree blocks in high-low order</td>
      </tr>
      <tr>
         <td><code>--sort_key_blocks</code></td>
         <td><code>sort_key_blocks</code></td>
      </tr>
      <tr>
         <td><code>--sort-records</code></td>
         <td>Sort records according to a particular index</td>
      </tr>
      <tr>
         <td><code>--sort-recover</code></td>
         <td>Force <code>myisamchk</code> to use sorting to resolve the keys even if the temporary files would be very large</td>
      </tr>
      <tr>
         <td><code>--stats_method</code></td>
         <td>Specifies how MyISAM index statistics collection code should treat <code>NULLs</code></td>
      </tr>
      <tr>
         <td><code>--tmpdir</code></td>
         <td>Directory to be used for storing temporary files</td>
      </tr>
      <tr>
         <td><code>--unpack</code></td>
         <td>Unpack a table that was packed with <code>myisampack</code></td>
      </tr>
      <tr>
         <td><code>--update-state</code></td>
         <td>Store information in the <code>.MYI</code> file to indicate when the table was checked and whether the table crashed</td>
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
